# WordPress Theme Mapping – Ticketing-System

**Ziel:** Ticketing-Funktionalität in einem WordPress-Theme (ohne Plugin) nachbauen

---

## 1. Mapping-Übersicht

| Event-App (Quelle) | WordPress-Theme (Ziel) | Begründung |
|---------------------|-------------------------|------------|
| Express REST API | WP REST API (Custom Endpoints) | `register_rest_route()` |
| MongoDB Models | Custom DB Tables (wpdb) | Bessere Performance & Flexibilität |
| PayPal SDK (Node) | PayPal JS SDK + PHP Webhook | Frontend: PayPal JS, Backend: Webhook |
| JWT QR-Codes | JWT PHP Library | `firebase/php-jwt` |
| Resend Email | `wp_mail()` + SMTP Plugin | WP native Email-Funktion |
| Mongoose Transactions | wpdb Transactions | `$wpdb->query('START TRANSACTION')` |
| Node Services | PHP Classes | Theme `inc/` Ordner |

---

## 2. Theme-Struktur

```
wp-content/themes/eventapp-theme/
├── functions.php              # Bootstrap, Hooks, REST-API
├── style.css                  # Theme Metadata
├── inc/
│   ├── tickets/
│   │   ├── models.php         # DB Schema & ORM-ähnliche Klassen
│   │   ├── orders.php         # Order Creation & Management
│   │   ├── inventory.php      # Reservation Logic mit Transactions
│   │   ├── payments-paypal.php # PayPal Integration
│   │   ├── rest.php           # REST-Endpoints registrieren
│   │   ├── mailer.php         # Email-Templates
│   │   └── qr.php             # JWT + QR Generation
│   ├── admin/
│   │   ├── meta-boxes.php     # Event CPT Meta-Felder
│   │   └── orders-list.php    # Order-Liste im Backend
│   └── helpers.php            # Utility Functions
├── templates/
│   ├── parts/
│   │   └── ticket-box.php     # Checkout Widget
│   └── emails/
│       └── order-confirmation.php  # HTML Email Template
├── assets/
│   ├── js/
│   │   ├── checkout.js        # PayPal JS SDK Integration
│   │   └── admin-orders.js    # Admin Order-Management
│   └── css/
│       └── main.css
└── README.md
```

---

## 3. Datenbank: Custom Tables vs. CPT

### 3.1 Option A: Custom Tables (Empfohlen)

**Vorteile:**
- Performance (keine wp_postmeta JOIN-Hölle)
- Flexibilität (eigene Indizes, Constraints)
- Transactions möglich

**Nachteile:**
- Manuelles Setup (Activation Hook)
- Keine native WP UI

**Schema:**

```sql
CREATE TABLE wp_eventapp_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  buyer_user_id BIGINT UNSIGNED NULL,
  email VARCHAR(255) NOT NULL,
  vorname VARCHAR(100),
  nachname VARCHAR(100),
  event_id BIGINT UNSIGNED NOT NULL,
  summe_brutto DECIMAL(10,2) NOT NULL,
  plattform_fee DECIMAL(10,2) NOT NULL,
  waehrung VARCHAR(3) DEFAULT 'EUR',
  status ENUM('offen','pending','bezahlt','erstattet','abgebrochen') DEFAULT 'offen',
  paypal_order_id VARCHAR(255) UNIQUE,
  paypal_capture_id VARCHAR(255) UNIQUE,
  agb_akzeptiert TINYINT(1) DEFAULT 0,
  erstellt_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  bezahlt_at DATETIME,
  INDEX idx_email (email),
  INDEX idx_event_status (event_id, status),
  INDEX idx_paypal_capture (paypal_capture_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wp_eventapp_order_positions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  ticket_variant_id BIGINT UNSIGNED NOT NULL,
  menge INT NOT NULL,
  einzelpreis_brutto DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES wp_eventapp_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wp_eventapp_tickets (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id BIGINT UNSIGNED NOT NULL,
  event_id BIGINT UNSIGNED NOT NULL,
  ticket_variant_id BIGINT UNSIGNED NOT NULL,
  qr_token VARCHAR(500) UNIQUE NOT NULL,
  status ENUM('gueltig','eingelassen','erstattet','gesperrt') DEFAULT 'gueltig',
  email VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_qr (qr_token),
  INDEX idx_event_status (event_id, status),
  FOREIGN KEY (order_id) REFERENCES wp_eventapp_orders(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wp_eventapp_ticket_variants (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  event_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  preis_brutto DECIMAL(10,2) NOT NULL,
  kontingent_gesamt INT NOT NULL,
  kontingent_verkauft INT DEFAULT 0,
  status ENUM('draft','live','sold_out','hidden') DEFAULT 'live',
  INDEX idx_event (event_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wp_eventapp_reservations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ticket_variant_id BIGINT UNSIGNED NOT NULL,
  reserviert_fuer VARCHAR(255) NOT NULL,
  menge INT NOT NULL,
  expires_at DATETIME NOT NULL,
  status ENUM('aktiv','abgelaufen','gekauft') DEFAULT 'aktiv',
  INDEX idx_variant_status (ticket_variant_id, status),
  INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**Activation Hook:**

```php
// functions.php
function eventapp_install_tables() {
    global $wpdb;
    $charset = $wpdb->get_charset_collate();
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    
    $sql = "CREATE TABLE {$wpdb->prefix}eventapp_orders ...";
    dbDelta($sql);
}
register_activation_hook(__FILE__, 'eventapp_install_tables');
```

---

### 3.2 Option B: Custom Post Types (Fallback)

**Event CPT:** Bereits vorhanden  
**Order CPT:** `register_post_type('eventapp_order')`  
**Ticket CPT:** `register_post_type('eventapp_ticket')`

**Nachteile:**
- Langsame Queries (postmeta)
- Keine echten Transactions
- Schlecht für High-Volume

**Nur für:** MVP mit < 100 Orders/Monat

---

## 4. REST API Endpoints

### 4.1 Order Creation

**Datei:** `inc/tickets/rest.php`

```php
add_action('rest_api_init', function() {
    register_rest_route('eventapp/v1', '/orders/create', [
        'methods' => 'POST',
        'callback' => 'eventapp_create_order',
        'permission_callback' => '__return_true', // Guests erlaubt
    ]);
});

function eventapp_create_order(WP_REST_Request $request) {
    global $wpdb;
    
    $email = sanitize_email($request['email']);
    $event_id = absint($request['eventId']);
    $tickets = $request['tickets'];
    
    // Validation
    if (!$email || !$event_id || empty($tickets)) {
        return new WP_Error('missing_fields', 'Required fields missing', ['status' => 400]);
    }
    
    // Check availability (mit Transaction)
    $wpdb->query('START TRANSACTION');
    
    foreach ($tickets as $ticket) {
        $variant = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}eventapp_ticket_variants WHERE id = %d FOR UPDATE",
            $ticket['ticketVarianteId']
        ));
        
        if ($variant->kontingent_verkauft + $ticket['menge'] > $variant->kontingent_gesamt) {
            $wpdb->query('ROLLBACK');
            return new WP_Error('sold_out', 'Not enough tickets', ['status' => 400]);
        }
    }
    
    // Create Order
    $wpdb->insert("{$wpdb->prefix}eventapp_orders", [
        'email' => $email,
        'event_id' => $event_id,
        'summe_brutto' => $summe,
        'plattform_fee' => $summe * 0.05,
        'status' => 'offen',
    ]);
    
    $order_id = $wpdb->insert_id;
    
    $wpdb->query('COMMIT');
    
    return ['order' => ['_id' => $order_id, 'email' => $email]];
}
```

---

### 4.2 PayPal Webhook

```php
register_rest_route('eventapp/v1', '/payments/paypal/webhook', [
    'methods' => 'POST',
    'callback' => 'eventapp_paypal_webhook',
    'permission_callback' => '__return_true', // Signature-Verify in Funktion
]);

function eventapp_paypal_webhook(WP_REST_Request $request) {
    $event = $request->get_json_params();
    
    // Verify Signature (Basic)
    $sig = $request->get_header('paypal-transmission-sig');
    if (!$sig) return new WP_Error('invalid_sig', '', ['status' => 401]);
    
    if ($event['event_type'] === 'PAYMENT.CAPTURE.COMPLETED') {
        $capture_id = $event['resource']['id'];
        $paypal_order_id = $event['resource']['supplementary_data']['related_ids']['order_id'];
        
        global $wpdb;
        $wpdb->update(
            "{$wpdb->prefix}eventapp_orders",
            [
                'status' => 'bezahlt',
                'paypal_capture_id' => $capture_id,
                'bezahlt_at' => current_time('mysql')
            ],
            ['paypal_order_id' => $paypal_order_id]
        );
        
        // Generate Tickets
        require_once get_template_directory() . '/inc/tickets/qr.php';
        eventapp_generate_tickets_for_order($order_id);
    }
    
    return ['received' => true];
}
```

---

## 5. PayPal Integration

### 5.1 Frontend: PayPal JS SDK

**Datei:** `assets/js/checkout.js`

```javascript
// Load PayPal SDK
const script = document.createElement('script');
script.src = 'https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=EUR';
document.head.appendChild(script);

script.onload = () => {
    paypal.Buttons({
        createOrder: async () => {
            const response = await fetch('/wp-json/eventapp/v1/payments/paypal/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bestellungId: orderId })
            });
            const data = await response.json();
            return data.paypalOrderId;
        },
        onApprove: async (data) => {
            const response = await fetch('/wp-json/eventapp/v1/payments/paypal/capture-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paypalOrderId: data.orderID })
            });
            const result = await response.json();
            if (result.success) {
                window.location.href = '/thank-you?order=' + orderId;
            }
        }
    }).render('#paypal-button-container');
};
```

---

### 5.2 Backend: PayPal API Wrapper

**Datei:** `inc/tickets/payments-paypal.php`

```php
class EventApp_PayPal {
    private $client_id;
    private $client_secret;
    private $mode;
    
    public function __construct() {
        $this->client_id = get_option('eventapp_paypal_client_id');
        $this->client_secret = get_option('eventapp_paypal_client_secret');
        $this->mode = get_option('eventapp_paypal_mode', 'sandbox');
    }
    
    private function get_access_token() {
        $url = $this->mode === 'live' 
            ? 'https://api-m.paypal.com/v1/oauth2/token'
            : 'https://api-m.sandbox.paypal.com/v1/oauth2/token';
        
        $response = wp_remote_post($url, [
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode($this->client_id . ':' . $this->client_secret)
            ],
            'body' => ['grant_type' => 'client_credentials']
        ]);
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        return $body['access_token'];
    }
    
    public function create_order($order_id) {
        global $wpdb;
        $order = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM {$wpdb->prefix}eventapp_orders WHERE id = %d",
            $order_id
        ));
        
        $access_token = $this->get_access_token();
        $url = $this->mode === 'live' 
            ? 'https://api-m.paypal.com/v2/checkout/orders'
            : 'https://api-m.sandbox.paypal.com/v2/checkout/orders';
        
        $response = wp_remote_post($url, [
            'headers' => [
                'Authorization' => 'Bearer ' . $access_token,
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode([
                'intent' => 'CAPTURE',
                'purchase_units' => [[
                    'amount' => [
                        'currency_code' => 'EUR',
                        'value' => number_format($order->summe_brutto, 2, '.', '')
                    ]
                ]],
                'application_context' => [
                    'return_url' => home_url('/payment/success'),
                    'cancel_url' => home_url('/payment/cancel')
                ]
            ])
        ]);
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        return $body;
    }
}
```

---

## 6. QR-Code Generation

**Datei:** `inc/tickets/qr.php`

```php
// Composer: firebase/php-jwt, endroid/qr-code
use Firebase\JWT\JWT;
use Endroid\QrCode\QrCode;

function eventapp_generate_qr_token($ticket_id, $event_id, $variant_id) {
    $payload = [
        'sub' => $ticket_id,
        'evt' => $event_id,
        'typ' => $variant_id,
        'ver' => 1,
        'iat' => time(),
        'exp' => time() + (365 * 24 * 60 * 60) // 1 Jahr
    ];
    
    $secret = get_option('eventapp_jwt_secret');
    return JWT::encode($payload, $secret, 'HS256');
}

function eventapp_generate_qr_image($token) {
    $qr = new QrCode($token);
    $qr->setSize(400);
    $qr->setMargin(10);
    
    return $qr->writeString();
}

function eventapp_verify_qr_token($token) {
    try {
        $secret = get_option('eventapp_jwt_secret');
        $decoded = JWT::decode($token, new Key($secret, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        return false;
    }
}
```

---

## 7. Email-Versand

**Datei:** `inc/tickets/mailer.php`

```php
function eventapp_send_order_confirmation($order_id) {
    global $wpdb;
    
    $order = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}eventapp_orders WHERE id = %d",
        $order_id
    ));
    
    $tickets = $wpdb->get_results($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}eventapp_tickets WHERE order_id = %d",
        $order_id
    ));
    
    $to = $order->email;
    $subject = 'Deine Tickets - EventApp';
    
    ob_start();
    include get_template_directory() . '/templates/emails/order-confirmation.php';
    $message = ob_get_clean();
    
    $headers = ['Content-Type: text/html; charset=UTF-8'];
    
    // Attachments: QR-Codes als PNG
    $attachments = [];
    foreach ($tickets as $ticket) {
        $qr_png = eventapp_generate_qr_image($ticket->qr_token);
        $file = wp_upload_dir()['path'] . '/qr-' . $ticket->id . '.png';
        file_put_contents($file, $qr_png);
        $attachments[] = $file;
    }
    
    wp_mail($to, $subject, $message, $headers, $attachments);
    
    // Cleanup
    foreach ($attachments as $file) {
        @unlink($file);
    }
}
```

---

## 8. Inventory Management

**Datei:** `inc/tickets/inventory.php`

```php
function eventapp_reserve_tickets($variant_id, $menge, $session_id) {
    global $wpdb;
    
    $wpdb->query('START TRANSACTION');
    
    // Lock variant
    $variant = $wpdb->get_row($wpdb->prepare(
        "SELECT * FROM {$wpdb->prefix}eventapp_ticket_variants WHERE id = %d FOR UPDATE",
        $variant_id
    ));
    
    // Clean expired
    $wpdb->query($wpdb->prepare(
        "UPDATE {$wpdb->prefix}eventapp_reservations 
         SET status = 'abgelaufen' 
         WHERE ticket_variant_id = %d AND status = 'aktiv' AND expires_at < NOW()",
        $variant_id
    ));
    
    // Count active
    $reserved = $wpdb->get_var($wpdb->prepare(
        "SELECT COALESCE(SUM(menge), 0) 
         FROM {$wpdb->prefix}eventapp_reservations 
         WHERE ticket_variant_id = %d AND status = 'aktiv' AND expires_at >= NOW()",
        $variant_id
    ));
    
    $available = $variant->kontingent_gesamt - $variant->kontingent_verkauft - $reserved;
    
    if ($available < $menge) {
        $wpdb->query('ROLLBACK');
        return ['success' => false, 'error' => 'Not enough tickets'];
    }
    
    // Create reservation
    $wpdb->insert("{$wpdb->prefix}eventapp_reservations", [
        'ticket_variant_id' => $variant_id,
        'reserviert_fuer' => $session_id,
        'menge' => $menge,
        'expires_at' => date('Y-m-d H:i:s', time() + 600), // 10 min
        'status' => 'aktiv'
    ]);
    
    $wpdb->query('COMMIT');
    
    return ['success' => true, 'reservation_id' => $wpdb->insert_id];
}
```

---

## 9. Security Checklist

- [ ] **Nonces:** Für alle Forms (`wp_nonce_field()`)
- [ ] **Sanitize:** Alle Inputs (`sanitize_text_field()`, `sanitize_email()`)
- [ ] **Escape:** Alle Outputs (`esc_html()`, `esc_url()`)
- [ ] **Webhook Signature:** PayPal-Header verifizieren
- [ ] **Idempotency:** `paypal_capture_id` UNIQUE Constraint
- [ ] **SQL Injection:** Prepared Statements (`$wpdb->prepare()`)
- [ ] **XSS:** Kein `echo $_POST` ohne Escape
- [ ] **CSRF:** REST API Nonces oder JWT Auth
- [ ] **Logs:** Error-Logs außerhalb wp-content schreiben

---

## 10. Limitierungen

### Theme-Wechsel
**Problem:** Custom Tables bleiben, aber Theme-Code weg  
**Lösung:** Doku + Deactivation Hook für Table-Drop

### Plugin vs. Theme
**Empfehlung:** Langfristig als Plugin entwickeln  
**Warum:** Unabhängig vom Theme, Aktivierung/Deaktivierung

### Performance
**Custom Tables:** Gut für < 10k Orders  
**Darüber:** Caching (Transients, Redis), Pagination

---

## 11. Deployment-Schritte

1. **Theme aktivieren** → `eventapp_install_tables()` läuft
2. **Settings:** WP Admin → EventApp Settings → PayPal Credentials
3. **JWT Secret:** `wp option add eventapp_jwt_secret '<random-32-byte>'`
4. **SMTP:** Plugin installieren (z.B. WP Mail SMTP)
5. **Test:** Order erstellen, PayPal-Sandbox testen
6. **Webhook:** PayPal Developer Console → Webhook URL zu `/wp-json/eventapp/v1/payments/paypal/webhook`

---

**Ende WP Theme Mapping**

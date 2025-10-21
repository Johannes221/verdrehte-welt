# Ticketing-System – API Contract

**Projekt:** EventApp  
**Stand:** Januar 2025

---

## 1. Base URL & Authentication

**Base URL:** `http://localhost:3010/api/v1` (Development)  
**Production:** `https://api.eventapp.de/api/v1` (Placeholder)

### 1.1 Authentication

**Method:** Firebase ID Token (Bearer)

```http
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Optional Auth Endpoints:**
- `/orders/create` – Guests können ohne Auth kaufen
- `/payments/paypal/*` – Optional Auth

**Required Auth Endpoints:**
- `/orders/me` – Authenticated User
- `/checkin/*` – Organizer/Admin only
- `/orders/organizer/:id` – Organizer only

---

## 2. Orders API

### 2.1 POST /orders/create

**Beschreibung:** Erstellt eine neue Bestellung (ohne PayPal Order)  
**Auth:** Optional (Guests erlaubt)  
**Datei:** `src/controllers/orderController.ts:17-142`

#### Request

```http
POST /api/v1/orders/create
Content-Type: application/json
Authorization: Bearer <token> (optional)

{
  "email": "user@example.com",
  "vorname": "Max",
  "nachname": "Mustermann",
  "telefon": "+49123456789",
  "eventId": "64abc123def456789012",
  "tickets": [
    {
      "ticketVarianteId": "64def456ghi789012345",
      "menge": 2
    }
  ],
  "agbAkzeptiert": true,
  "dsgvoAkzeptiert": true,
  "widerrufsbelehrungGelesen": true
}
```

**Validation:**
- `email`, `eventId`, `tickets[]` sind required
- `tickets` muss Array mit mindestens 1 Element sein
- Alle Consent-Felder müssen `true` sein
- `ticketVarianteId` muss existieren
- Kontingent muss verfügbar sein

#### Response (201 Created)

```json
{
  "order": {
    "_id": "64jkl789mno012345678",
    "email": "user@example.com",
    "summeBrutto": 30.00,
    "plattformFee": 1.50,
    "status": "offen",
    "eventId": "64abc123def456789012"
  }
}
```

#### Error Responses

**400 Bad Request – Missing Fields**
```json
{
  "error": {
    "code": "MISSING_FIELDS",
    "message": "Email, eventId and tickets are required"
  }
}
```

**400 Bad Request – Missing Consent**
```json
{
  "error": {
    "code": "MISSING_CONSENT",
    "message": "Terms must be accepted"
  }
}
```

**404 Not Found – Event**
```json
{
  "error": {
    "code": "EVENT_NOT_FOUND",
    "message": "Event not found"
  }
}
```

**400 Bad Request – Sold Out**
```json
{
  "error": {
    "code": "TICKET_SOLD_OUT",
    "message": "Only 3 tickets available for Early Bird"
  }
}
```

**500 Internal Server Error**
```json
{
  "error": {
    "code": "SERVER_ERROR",
    "message": "Failed to create order"
  }
}
```

---

### 2.2 GET /orders/:id

**Beschreibung:** Order-Details abrufen  
**Auth:** Required  
**Datei:** `src/controllers/orderController.ts` (angenommen)

#### Request

```http
GET /api/v1/orders/64jkl789mno012345678
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "order": {
    "_id": "64jkl789mno012345678",
    "email": "user@example.com",
    "vorname": "Max",
    "nachname": "Mustermann",
    "eventId": {
      "_id": "64abc123def456789012",
      "title": "Summer Festival 2025"
    },
    "positionen": [
      {
        "ticketVarianteId": "64def456ghi789012345",
        "menge": 2,
        "einzelpreisBrutto": 15.00
      }
    ],
    "summeBrutto": 30.00,
    "plattformFee": 1.50,
    "waehrung": "EUR",
    "status": "bezahlt",
    "bezahlt_at": "2025-01-15T10:30:00Z"
  }
}
```

---

### 2.3 GET /orders/me

**Beschreibung:** Meine Bestellungen (User)  
**Auth:** Required  
**Datei:** `src/controllers/orderController.ts`

#### Request

```http
GET /api/v1/orders/me
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "orders": [
    {
      "_id": "64jkl789mno012345678",
      "eventId": "64abc123def456789012",
      "summeBrutto": 30.00,
      "status": "bezahlt",
      "erstellt_at": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

---

### 2.4 GET /orders/organizer/:organizerId

**Beschreibung:** Alle Orders für Events eines Organizers  
**Auth:** Required (Organizer/Admin)  
**Datei:** `src/controllers/orderController.ts`

#### Request

```http
GET /api/v1/orders/organizer/64abc123def456789012
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "orders": [
    {
      "_id": "64jkl789mno012345678",
      "email": "user@example.com",
      "eventId": "64def456ghi789012345",
      "summeBrutto": 30.00,
      "status": "bezahlt",
      "erstellt_at": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 42,
  "totalRevenue": 1260.00
}
```

---

## 3. PayPal Payment API

### 3.1 POST /payments/paypal/create-order

**Beschreibung:** PayPal Order für eine bestehende Bestellung erstellen  
**Auth:** Optional  
**Datei:** `src/controllers/paypalPaymentController.ts:17-56`

#### Request

```http
POST /api/v1/payments/paypal/create-order
Content-Type: application/json

{
  "bestellungId": "64jkl789mno012345678"
}
```

#### Response (200 OK)

```json
{
  "approvalUrl": "https://www.sandbox.paypal.com/checkoutnow?token=8V123456789",
  "paypalOrderId": "8V123456789ABCDEF"
}
```

#### Error Responses

**400 Bad Request – Missing Order ID**
```json
{
  "error": {
    "code": "MISSING_ORDER_ID",
    "message": "Order ID is required"
  }
}
```

**404 Not Found – Order**
```json
{
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order not found"
  }
}
```

**400 Bad Request – Already Exists**
```json
{
  "error": {
    "code": "ORDER_EXISTS",
    "message": "PayPal order already created"
  }
}
```

---

### 3.2 POST /payments/paypal/capture-order

**Beschreibung:** PayPal Payment capturen (nach User-Approval)  
**Auth:** Optional  
**Datei:** `src/controllers/paypalPaymentController.ts:62-107`

#### Request

```http
POST /api/v1/payments/paypal/capture-order
Content-Type: application/json

{
  "paypalOrderId": "8V123456789ABCDEF"
}
```

#### Response (200 OK)

```json
{
  "success": true,
  "captureId": "5TY123456CAPTURE",
  "message": "Payment successful"
}
```

**Side Effects:**
1. Order.status → `'bezahlt'`
2. Tickets werden generiert
3. Email mit QR-Codes wird versendet

#### Error Responses

**400 Bad Request – Capture Failed**
```json
{
  "error": {
    "code": "CAPTURE_FAILED",
    "message": "Payment capture failed"
  }
}
```

---

### 3.3 POST /payments/paypal/webhook

**Beschreibung:** PayPal Webhook Handler (asynchron)  
**Auth:** Public (Signature-Verifizierung via PayPal Headers)  
**Datei:** `src/controllers/paypalPaymentController.ts:157-196`

#### Request (von PayPal)

```http
POST /api/v1/payments/paypal/webhook
Content-Type: application/json
paypal-transmission-id: 12345-67890
paypal-transmission-time: 2025-01-15T10:30:00Z
paypal-cert-url: https://api.paypal.com/v1/notifications/certs/...
paypal-auth-algo: SHA256withRSA
paypal-transmission-sig: xYz123...

{
  "id": "WH-123456789",
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource_type": "capture",
  "resource": {
    "id": "5TY123456CAPTURE",
    "status": "COMPLETED",
    "amount": {
      "currency_code": "EUR",
      "value": "30.00"
    },
    "supplementary_data": {
      "related_ids": {
        "order_id": "8V123456789ABCDEF"
      }
    }
  }
}
```

**Event Types Handled:**
- `PAYMENT.CAPTURE.COMPLETED` → Order als bezahlt markieren, Tickets generieren
- `PAYMENT.CAPTURE.REFUNDED` → Order als erstattet markieren, Tickets invalidieren
- `PAYMENT.CAPTURE.DENIED` → Order als abgebrochen markieren

#### Response (200 OK)

```json
{
  "received": true
}
```

**Idempotenz:** `paypalCaptureId` ist unique – mehrfache Webhooks führen nicht zu Duplikaten

---

## 4. Check-in API

### 4.1 POST /checkin/scan

**Beschreibung:** Ticket-QR scannen und Check-in durchführen  
**Auth:** Required (Organizer/Admin)  
**Datei:** `src/controllers/checkinController.ts:12-108`

#### Request

```http
POST /api/v1/checkin/scan
Content-Type: application/json
Authorization: Bearer <token>

{
  "qrJwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "deviceId": "scanner-001",
  "modus": "tuer"
}
```

**Felder:**
- `qrJwt`: JWT-Token vom QR-Code
- `deviceId`: Scanner Device ID (z.B. Tablet, Smartphone)
- `modus`: `'tuer'` (Einlass) | `'abendkasse'` | `'manuell'`

#### Response (200 OK – Eingelassen)

```json
{
  "ergebnis": "eingelassen",
  "ticketId": "64jkl111abc222333444",
  "zeitpunkt": "2025-01-15T20:00:00Z",
  "hinweis": null,
  "varianteName": "Early Bird"
}
```

#### Response (200 OK – Bereits benutzt)

```json
{
  "ergebnis": "bereits_benutzt",
  "ticketId": "64jkl111abc222333444",
  "zeitpunkt": "2025-01-15T20:05:00Z",
  "hinweis": "Bereits eingecheckt am 15.01.2025, 20:00:00",
  "letzteScanzeit": "2025-01-15T20:00:00Z"
}
```

#### Error Responses

**400 Bad Request – Invalid JWT**
```json
{
  "ergebnis": "ungueltig",
  "hinweis": "Invalid or expired ticket"
}
```

**404 Not Found – Ticket**
```json
{
  "ergebnis": "ungueltig",
  "hinweis": "Ticket nicht gefunden"
}
```

**403 Forbidden – Gesperrt**
```json
{
  "ergebnis": "gesperrt",
  "ticketId": "64jkl111abc222333444",
  "hinweis": "Ticket gesperrt: Verdacht auf Betrug",
  "zeitpunkt": "2025-01-15T20:05:00Z"
}
```

**400 Bad Request – Erstattet**
```json
{
  "ergebnis": "erstattet",
  "ticketId": "64jkl111abc222333444",
  "hinweis": "Ticket wurde erstattet",
  "zeitpunkt": "2025-01-15T20:05:00Z"
}
```

**500 Internal Server Error**
```json
{
  "ergebnis": "fehler",
  "hinweis": "Technischer Fehler beim Scannen"
}
```

---

### 4.2 POST /checkin/block

**Beschreibung:** Ticket manuell sperren (Blacklist)  
**Auth:** Required (Organizer/Admin)  
**Datei:** `src/controllers/checkinController.ts:114-150`

#### Request

```http
POST /api/v1/checkin/block
Content-Type: application/json
Authorization: Bearer <token>

{
  "ticketId": "64jkl111abc222333444",
  "grund": "Verdacht auf Betrug"
}
```

#### Response (200 OK)

```json
{
  "status": "ok",
  "message": "Ticket gesperrt"
}
```

---

### 4.3 POST /checkin/unblock

**Beschreibung:** Ticket entsperren  
**Auth:** Required (Organizer/Admin)  
**Datei:** `src/controllers/checkinController.ts:156-183`

#### Request

```http
POST /api/v1/checkin/unblock
Content-Type: application/json
Authorization: Bearer <token>

{
  "ticketId": "64jkl111abc222333444"
}
```

#### Response (200 OK)

```json
{
  "status": "ok",
  "message": "Sperre aufgehoben"
}
```

---

### 4.4 GET /checkin/stats/:eventId

**Beschreibung:** Check-in Statistiken für Event  
**Auth:** Required (Organizer/Admin)  
**Datei:** `src/controllers/checkinController.ts:189-210`

#### Request

```http
GET /api/v1/checkin/stats/64abc123def456789012
Authorization: Bearer <token>
```

#### Response (200 OK)

```json
{
  "total": 100,
  "eingelassen": 73,
  "gueltig": 27,
  "noShow": 27,
  "einlassQuote": "73.0"
}
```

---

## 5. Fehlerkatalog (Gesamt)

| Code | HTTP | Beschreibung | Dev-Hint |
|------|------|--------------|----------|
| `MISSING_FIELDS` | 400 | Pflichtfelder fehlen | Prüfe Request-Body |
| `MISSING_CONSENT` | 400 | Consent nicht akzeptiert | AGB/DSGVO müssen true sein |
| `INVALID_TICKET` | 400 | Ticket-Daten ungültig | menge < 1 oder ticketVarianteId fehlt |
| `EVENT_NOT_FOUND` | 404 | Event existiert nicht | Prüfe eventId |
| `TICKET_VARIANT_NOT_FOUND` | 404 | TicketVariant existiert nicht | Prüfe ticketVarianteId |
| `TICKET_SOLD_OUT` | 400 | Kontingent ausverkauft | Zeige verfügbare Anzahl an |
| `MISSING_ORDER_ID` | 400 | bestellungId fehlt | Prüfe Request-Body |
| `ORDER_NOT_FOUND` | 404 | Order existiert nicht | Prüfe bestellungId |
| `ORDER_EXISTS` | 400 | PayPal Order bereits erstellt | Nutze bestehenden paypalOrderId |
| `PAYMENT_ERROR` | 500 | PayPal API Fehler | Prüfe Logs, PayPal Credentials |
| `CAPTURE_FAILED` | 400 | Payment Capture fehlgeschlagen | User muss Payment erneut approven |
| `SERVER_ERROR` | 500 | Interner Server-Fehler | Prüfe Logs, MongoDB-Connection |

---

## 6. Rate Limiting & Security

### 6.1 Rate Limits (Empfohlen, nicht implementiert)

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/orders/create` | 10 req/min | Per IP |
| `/payments/paypal/capture-order` | 5 req/min | Per bestellungId |
| `/checkin/scan` | 60 req/min | Per deviceId |

### 6.2 CSRF Protection

- **Webhook:** Keine Session-basierte Auth, nur Signature-Prüfung
- **Frontend:** CORS-Policy via `ALLOWED_ORIGINS`

### 6.3 Input Sanitization

- **Email:** `toLowerCase()`, Mongoose-Validierung
- **ObjectId:** Mongoose validiert automatisch
- **JWT:** `jsonwebtoken.verify()` mit Secret

---

## 7. Idempotenz & Retry

### 7.1 Idempotenz-Keys

**Order Creation:** Optional `idempotenzKey` Feld (Unique Index)

```http
POST /api/v1/orders/create
Content-Type: application/json

{
  "idempotenzKey": "client-generated-uuid-12345",
  "email": "user@example.com",
  ...
}
```

**PayPal Webhook:** `paypalCaptureId` ist unique – Webhook kann mehrfach eintreffen ohne Duplikate

### 7.2 Retry-Strategie

**Frontend → Backend:**
- Exponential Backoff für 5xx Fehler
- Keine Retries für 4xx Fehler

**PayPal Webhook:**
- PayPal sendet Webhook bis zu 3x bei 5xx-Response
- Backend sollte 200 zurückgeben auch bei Fehler (nach Logging)

---

## 8. Beispiel-Flows

### 8.1 Happy Path: Checkout → Email

```mermaid
sequenceDiagram
    participant Frontend
    participant OrderAPI
    participant PayPalAPI
    participant Webhook
    participant TicketGen
    participant Email
    
    Frontend->>OrderAPI: POST /orders/create
    OrderAPI-->>Frontend: {bestellungId, approvalUrl}
    Frontend->>PayPalAPI: User approves payment
    PayPalAPI->>Webhook: POST /webhook (CAPTURE.COMPLETED)
    Webhook->>OrderAPI: update(status='bezahlt')
    Webhook->>TicketGen: generateTicketsForOrder()
    TicketGen->>Email: sendOrderBestaetigung()
    Email-->>Frontend: Email erhalten (async)
```

### 8.2 Edge Case: Webhook vor Frontend-Capture

```mermaid
sequenceDiagram
    participant Frontend
    participant PayPalAPI
    participant Webhook
    participant CaptureAPI
    
    Frontend->>PayPalAPI: User approves
    PayPalAPI->>Webhook: POST /webhook (CAPTURE.COMPLETED)
    Webhook->>Webhook: update(status='bezahlt', captureId)
    Frontend->>CaptureAPI: POST /capture-order
    CaptureAPI->>CaptureAPI: find(paypalOrderId)
    CaptureAPI->>CaptureAPI: already status='bezahlt', skip capture
    CaptureAPI-->>Frontend: {success: true, captureId}
```

**Idempotenz:** `paypalCaptureId` Unique Index verhindert Duplikate

---

## 9. OpenAPI / Swagger

**Hinweis:** Projekt hat `src/config/swagger.ts` aber keine vollständige ticketing.yaml  
**Empfehlung:** OpenAPI-Spec aus diesem Dokument generieren

---

**Ende API Contract**  
Nächstes Dokument: `PAYMENTS_FLOW_PAYPAL.md`

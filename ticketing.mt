# Ticketing Domain Specification (Reusable)

**Version:** 1.0  
**Format:** Markdown Table (.mt)  
**Zweck:** Technologie-agnostische Ticketing-Domäne für Wiederverwendung

---

## 1. Entities

### Order
| Feld | Typ | Required | Beschreibung |
|------|-----|----------|--------------|
| id | UUID/ObjectId | ✅ | Eindeutige ID |
| buyerUserId | String | ❌ | User-ID (optional für Gäste) |
| email | Email | ✅ | Käufer-Email |
| vorname | String | ❌ | Vorname |
| nachname | String | ❌ | Nachname |
| eventId | UUID/ObjectId | ✅ | Event-Referenz |
| positionen | Array<OrderPosition> | ✅ | Bestellpositionen |
| summeBrutto | Decimal | ✅ | Gesamtsumme |
| plattformFee | Decimal | ✅ | Platform-Gebühr (5%) |
| waehrung | String(3) | ✅ | Währungscode (EUR, USD) |
| status | Enum | ✅ | offen, pending, bezahlt, erstattet |
| paymentProvider | String | ❌ | paypal, stripe, none |
| paymentProviderId | String | ❌ | Provider-spezifische Order-ID |
| paymentCaptureId | String | ❌ | Capture-ID (Idempotenz) |
| agbAkzeptiert | Boolean | ✅ | AGB akzeptiert |
| dsgvoAkzeptiert | Boolean | ✅ | DSGVO akzeptiert |
| erstellt_at | DateTime | ✅ | Erstellungszeitpunkt |
| bezahlt_at | DateTime | ❌ | Bezahlzeitpunkt |

### OrderPosition
| Feld | Typ | Required | Beschreibung |
|------|-----|----------|--------------|
| ticketVarianteId | UUID/ObjectId | ✅ | Ticket-Typ |
| menge | Integer | ✅ | Anzahl (min: 1) |
| einzelpreisBrutto | Decimal | ✅ | Einzelpreis |

### Ticket
| Feld | Typ | Required | Beschreibung |
|------|-----|----------|--------------|
| id | UUID/ObjectId | ✅ | Eindeutige ID |
| orderId | UUID/ObjectId | ✅ | Order-Referenz |
| eventId | UUID/ObjectId | ✅ | Event-Referenz |
| ticketVarianteId | UUID/ObjectId | ✅ | Ticket-Typ |
| qrToken | JWT | ✅ | Signierter QR-Token |
| status | Enum | ✅ | gueltig, eingelassen, erstattet, gesperrt |
| email | Email | ❌ | Email (kopiert von Order) |
| scanHistorie | Array<ScanEntry> | ✅ | Scan-Historie |

### ScanEntry
| Feld | Typ | Required | Beschreibung |
|------|-----|----------|--------------|
| zeitpunkt | DateTime | ✅ | Scan-Zeitpunkt |
| deviceId | String | ✅ | Scanner Device ID |
| modus | Enum | ✅ | tuer, abendkasse, manuell |
| userId | String | ❌ | Scanner User-ID |

### TicketVariant
| Feld | Typ | Required | Beschreibung |
|------|-----|----------|--------------|
| id | UUID/ObjectId | ✅ | Eindeutige ID |
| eventId | UUID/ObjectId | ✅ | Event-Referenz |
| name | String | ✅ | Ticket-Name (z.B. "Early Bird") |
| preisBrutto | Decimal | ✅ | Preis inkl. MwSt. |
| mwstSatz | Decimal | ✅ | MwSt.-Satz (19%, 7%) |
| kontingentGesamt | Integer | ✅ | Gesamtkontingent |
| kontingentVerkauft | Integer | ✅ | Verkaufte Tickets |
| status | Enum | ✅ | draft, live, sold_out, hidden |
| saleStart | DateTime | ❌ | Verkaufsstart |
| saleEnd | DateTime | ❌ | Verkaufsende |

### Reservation (Temporär)
| Feld | Typ | Required | Beschreibung |
|------|-----|----------|--------------|
| id | UUID/ObjectId | ✅ | Eindeutige ID |
| ticketVarianteId | UUID/ObjectId | ✅ | Ticket-Typ |
| reserviert_fuer | String | ✅ | Session/User ID |
| menge | Integer | ✅ | Anzahl |
| expires_at | DateTime | ✅ | Ablaufzeitpunkt |
| status | Enum | ✅ | aktiv, abgelaufen, gekauft |

---

## 2. State Machines

### Order Status
```mermaid
stateDiagram-v2
    [*] --> offen
    offen --> pending: payment initiated
    pending --> bezahlt: payment captured
    pending --> abgebrochen: cancelled
    bezahlt --> erstattet: refunded
    bezahlt --> [*]
    erstattet --> [*]
    abgebrochen --> [*]
```

### Ticket Status
```mermaid
stateDiagram-v2
    [*] --> gueltig
    gueltig --> eingelassen: scanned
    gueltig --> erstattet: order refunded
    gueltig --> gesperrt: blocked
    gesperrt --> gueltig: unblocked
    eingelassen --> [*]
    erstattet --> [*]
```

---

## 3. REST Contracts

### POST /orders/create
**Request:**
```json
{
  "email": "user@example.com",
  "eventId": "<uuid>",
  "tickets": [
    {"ticketVarianteId": "<uuid>", "menge": 2}
  ],
  "agbAkzeptiert": true,
  "dsgvoAkzeptiert": true
}
```

**Response (201):**
```json
{
  "order": {
    "_id": "<uuid>",
    "email": "user@example.com",
    "summeBrutto": 30.00,
    "status": "offen"
  }
}
```

**Errors:**
- 400: `MISSING_FIELDS`, `MISSING_CONSENT`, `TICKET_SOLD_OUT`
- 404: `EVENT_NOT_FOUND`
- 500: `SERVER_ERROR`

---

### POST /payments/{provider}/create-order
**Request:**
```json
{
  "orderId": "<uuid>"
}
```

**Response (200):**
```json
{
  "approvalUrl": "https://paypal.com/checkout?token=...",
  "providerOrderId": "8V123..."
}
```

---

### POST /payments/{provider}/webhook
**Request (from Provider):**
```json
{
  "event_type": "PAYMENT.CAPTURE.COMPLETED",
  "resource": {
    "id": "5TY123...",
    "related_ids": {"order_id": "8V123..."}
  }
}
```

**Response (200):**
```json
{"received": true}
```

**Side Effects:**
1. Order.status → bezahlt
2. Tickets generiert
3. Email versendet

---

### POST /checkin/scan
**Request:**
```json
{
  "qrJwt": "eyJhbGc...",
  "deviceId": "scanner-001",
  "modus": "tuer"
}
```

**Response (200):**
```json
{
  "ergebnis": "eingelassen",
  "ticketId": "<uuid>",
  "zeitpunkt": "2025-01-15T20:00:00Z"
}
```

**Errors:**
- `ungueltig`: JWT invalid
- `bereits_benutzt`: Already scanned
- `gesperrt`: Blacklisted
- `erstattet`: Refunded

---

## 4. QR-Token Spec

**Format:** JWT (HS256 or RS256)

**Payload:**
```json
{
  "sub": "<ticketId>",
  "evt": "<eventId>",
  "typ": "<ticketVarianteId>",
  "ver": 1,
  "iat": 1704067200,
  "exp": 1735603200
}
```

**Signature:** HMAC-SHA256 oder RSA

**Expiry:** 365 Tage (default)

---

## 5. Email Templates

### Order Confirmation

**Trigger:** Nach Payment Capture

**Variables:**
- `{{email}}`
- `{{bestellungId}}`
- `{{eventTitle}}`
- `{{eventDate}}`
- `{{summeBrutto}}`
- `{{waehrung}}`
- `{{tickets}}` (Array)
  - `{{ticketVarianteName}}`
  - `{{qrPublicUrl}}`

**Subject:** `Deine Tickets für {{eventTitle}}`

**Body:** HTML mit QR-Codes (embedded via Public URL oder Attachment)

---

### Event Reminder

**Trigger:** 24h vor Event

**Variables:**
- `{{email}}`
- `{{eventTitle}}`
- `{{eventDate}}`
- `{{ticketCount}}`

---

## 6. Idempotency Rules

### Order Creation
- Optional `idempotenzKey` (Client-generiert)
- Unique Constraint

### Payment Capture
- `paymentCaptureId` UNIQUE
- Status-Check: `if (status === 'bezahlt') return;`

### Webhook Processing
- Signature-Verifizierung
- `paymentCaptureId` Unique Constraint
- Retry-safe

---

## 7. Retry Strategies

### Frontend → Backend
- Exponential Backoff für 5xx
- Max 3 Retries
- Keine Retries für 4xx

### Payment Provider → Webhook
- Provider sendet bis 200 OK (max 3x)
- Backend muss idempotent sein

### Email-Versand
- Queue-basiert (Redis, SQS)
- Max 5 Retries
- Exponential Backoff

---

## 8. Error Codes

| Code | HTTP | Message |
|------|------|---------|
| `MISSING_FIELDS` | 400 | Required fields missing |
| `MISSING_CONSENT` | 400 | Terms must be accepted |
| `TICKET_SOLD_OUT` | 400 | Not enough tickets available |
| `EVENT_NOT_FOUND` | 404 | Event not found |
| `ORDER_NOT_FOUND` | 404 | Order not found |
| `PAYMENT_ERROR` | 500 | Payment processing failed |
| `SERVER_ERROR` | 500 | Internal server error |

---

## 9. Inventory Rules

### Verfügbarkeit
```
verfügbar = kontingentGesamt - kontingentVerkauft - aktivReservierungen
```

### Reservation Timeout
- Default: 10 Minuten
- Konfigurierbar per TicketVariant

### Atomic Operations
- DB Transactions erforderlich
- Read + Aggregate + Write in 1 Transaction

### Cleanup
- TTL-Index auf `reservation.expires_at`
- Oder: Cron-Job alle 5 Minuten

---

## 10. Security Requirements

### Authentication
- Order Creation: Optional (Guests erlaubt)
- Check-in: Required (Organizer/Admin)
- Payment Webhook: Signature-Verifizierung

### Authorization
- Buyer: Kann eigene Orders sehen
- Organizer: Kann Orders für eigene Events sehen
- Admin: Voller Zugriff

### Input Validation
- Email: RFC 5322
- Money: Min 0, Max 999999.99, 2 Dezimalstellen
- Status: Enum-Validierung

### QR-Token Security
- Signature-Prüfung bei jedem Scan
- Expiry beachten
- Keine PII im Token

---

**Ende Ticketing Domain Spec**  
**Verwendung:** Copy-paste in neue Projekte, Technologie-Stack anpassen

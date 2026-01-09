# 🔧 Render Environment Variables Setup

## Problem: Interne E-Mails kommen nicht an

Die internen Benachrichtigungen an `verdrehte.welt.ev@gmail.com` kommen nicht an, weil die Environment Variable in Render fehlt oder falsch ist.

## ✅ Lösung: Environment Variable in Render setzen

### Schritt 1: Zu Render gehen
1. Öffne: **https://dashboard.render.com**
2. Login mit deinem Account
3. Wähle dein Backend-Service (z.B. "verdrehte-welt-api")

### Schritt 2: Environment Variables öffnen
1. Klicke auf **"Environment"** in der linken Sidebar
2. Oder: Service auswählen → **"Environment"** Tab

### Schritt 3: Variable hinzufügen/bearbeiten

Suche nach `INTERNAL_NOTIFICATION_EMAIL`:

**Falls vorhanden:**
- Klicke auf **"Edit"**
- Setze Wert auf: `verdrehte.welt.ev@gmail.com`
- Klicke **"Save Changes"**

**Falls NICHT vorhanden:**
- Klicke **"Add Environment Variable"**
- Key: `INTERNAL_NOTIFICATION_EMAIL`
- Value: `verdrehte.welt.ev@gmail.com`
- Klicke **"Save Changes"**

### Schritt 4: Deployment abwarten
Render deployed automatisch neu (dauert 5-10 Min).

---

## Alle wichtigen Environment Variables für Render

Stelle sicher, dass diese gesetzt sind:

```bash
# Server
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://verdrehte-welt.pages.dev

# MongoDB
MONGODB_URI=<DEINE_MONGODB_URI_HIER>

# PayPal (LIVE)
PAYPAL_CLIENT_ID=<DEINE_PAYPAL_CLIENT_ID>
PAYPAL_CLIENT_SECRET=<DEIN_PAYPAL_SECRET>
PAYPAL_MODE=live

# Email - Resend
MAIL_API_KEY=<DEIN_RESEND_API_KEY>
MAIL_FROM=onboarding@resend.dev
INTERNAL_NOTIFICATION_EMAIL=verdrehte.welt.ev@gmail.com

# JWT
JWT_SECRET=<DEIN_JWT_SECRET_MIN_32_ZEICHEN>
JWT_EXPIRY=365d

# Admin
ADMIN_PASSWORD=<DEIN_ADMIN_PASSWORT>
PLATFORM_FEE_PERCENTAGE=5
```

---

## Nach dem Deployment testen

1. **Neue Bestellung** aufgeben (8 EUR Ticket)
2. **Prüfen:**
   - ✅ Kunde erhält Ticket-E-Mail
   - ✅ `verdrehte.welt.ev@gmail.com` erhält Bestellbenachrichtigung
   - ✅ `verdrehte.welt.ev@gmail.com` erhält Versandbestätigung

---

## Falls E-Mails immer noch nicht ankommen

**Mögliche Ursachen:**

1. **Resend Domain nicht verifiziert**
   - Lösung: Domain verifizieren (siehe `RESEND_DOMAIN_SETUP.md`)
   
2. **Spam-Ordner**
   - Prüfe Spam bei verdrehte.welt.ev@gmail.com
   
3. **Gmail blockiert Resend**
   - Füge `onboarding@resend.dev` zu Kontakten hinzu

---

## Render Deploy Status prüfen

Im Render Dashboard siehst du:
- 🟡 **Building** = Baut gerade
- 🟢 **Live** = Fertig deployed
- 🔴 **Failed** = Fehler beim Deploy

Warte bis **Live**, dann teste!

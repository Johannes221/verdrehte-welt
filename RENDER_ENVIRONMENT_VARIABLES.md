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
MONGODB_URI=mongodb+srv://verdrehteweltev_db_user:Dtg43DEI3AiwqT4t@cluster0.o3skdqm.mongodb.net/verdrehte-welt?retryWrites=true&w=majority

# PayPal (LIVE)
PAYPAL_CLIENT_ID=AXq-jYNsAuolmZfp4qb6lj5h2ugHN1_T59Ls5YtR6fuy-lhVANj3cTAItGuHEImGOyMwSP9vvqRsVhsl
PAYPAL_CLIENT_SECRET=ELzf_4PHt1Nf8WnHGC36jWPnW2bjTnlY-xfV67DCk84w-icUZY9CwQwTC_FJFgOVxX_xlXY_IrraWWBD
PAYPAL_MODE=live

# Email - Resend
MAIL_API_KEY=re_36U7jYVh_4v36Hb5t4g4CCuCNqDngDQWt
MAIL_FROM=onboarding@resend.dev
INTERNAL_NOTIFICATION_EMAIL=verdrehte.welt.ev@gmail.com

# JWT
JWT_SECRET=verdrehte-welt-super-secret-key-2025-change-in-production-min-32-chars
JWT_EXPIRY=365d

# Admin
ADMIN_PASSWORD=verdrehtewelt2025
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

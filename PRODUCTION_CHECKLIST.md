# 🚀 PRODUCTION DEPLOYMENT CHECKLIST

## 📋 VOR DEM DEPLOYMENT

### 1. Backend vorbereiten
- [ ] `.env.production` erstellen (siehe `.env.production.example`)
- [ ] MongoDB Atlas Account erstellen: https://www.mongodb.com/cloud/atlas
  - Cluster erstellen (Free Tier M0)
  - Database User erstellen
  - Network Access: "Allow from anywhere" (0.0.0.0/0)
  - Connection String kopieren → `MONGODB_URI`
- [ ] PayPal Live Credentials holen:
  - https://developer.paypal.com → Live App erstellen
  - Client ID + Secret → `.env.production`
  - `PAYPAL_MODE=live` setzen
- [ ] Resend Account für Emails:
  - https://resend.com → Account erstellen
  - API Key holen → `MAIL_API_KEY`
  - Domain verifizieren (optional)
- [ ] JWT Secret generieren:
  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

### 2. Frontend vorbereiten
- [ ] Alle `API_BASE_URL` auf localhost prüfen
- [ ] Liste erstellen welche URLs geändert werden müssen

---

## 🖥️ BACKEND DEPLOYMENT (Render.com)

### Schritt 1: Code zu GitHub pushen
```bash
cd /Users/johan/VerdrehteWeltWebsite

# Git initialisieren (falls noch nicht)
git init
git add .
git commit -m "Production ready - Ticketing System"

# GitHub Repo erstellen und pushen
# git remote add origin https://github.com/YOUR-USERNAME/verdrehte-welt.git
# git push -u origin main
```

### Schritt 2: Render.com Setup
1. Gehe zu: https://render.com
2. Sign up / Login
3. **New** → **Web Service**
4. **Connect GitHub** → Repository auswählen
5. **Settings:**
   - **Name:** `verdrehte-welt-api`
   - **Region:** Frankfurt (EU Central)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

6. **Environment Variables hinzufügen:**
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb+srv://...
   PAYPAL_CLIENT_ID=...
   PAYPAL_CLIENT_SECRET=...
   PAYPAL_MODE=live
   JWT_SECRET=...
   ADMIN_PASSWORD=verdrehtewelt2025
   FRONTEND_URL=https://verdrehtewelt.pages.dev
   MAIL_API_KEY=re_...
   MAIL_FROM=noreply@verdrehtewelt.de
   ```

7. **Deploy!**
8. **URL notieren:** z.B. `https://verdrehte-welt-api.onrender.com`

### Schritt 3: CORS überprüfen
Backend erlaubt automatisch CORS von allen Origins (`cors()`).
Falls Problem: `backend/src/server.js` → CORS config anpassen.

---

## 🌐 FRONTEND DEPLOYMENT (Cloudflare Pages)

### Schritt 1: API URLs aktualisieren

**Dateien anpassen:**

1. `website/js/event-detail.js`
```javascript
const API_BASE_URL = 'https://verdrehte-welt-api.onrender.com/api/v1';
```

2. `website/payment-success.html`
```javascript
const API_BASE_URL = 'https://verdrehte-welt-api.onrender.com/api/v1';
```

3. `website/admin-scanner.html`
```javascript
const API_BASE_URL = 'https://verdrehte-welt-api.onrender.com/api/v1';
```

4. `website/admin-tickets.html`
```javascript
const API_BASE_URL = 'https://verdrehte-welt-api.onrender.com/api/v1';
```

### Schritt 2: Cloudflare Pages Setup

#### Option A: Direkter Upload (Schnell)
```bash
cd /Users/johan/VerdrehteWeltWebsite
cd website
zip -r ../website-production.zip *
```

1. Gehe zu: https://dash.cloudflare.com
2. **Pages** → **Create a project**
3. **Upload assets** (Direct Upload)
4. Drag & Drop `website-production.zip`
5. **Project name:** `verdrehte-welt`
6. **Deploy!**
7. **URL notieren:** z.B. `https://verdrehte-welt.pages.dev`

#### Option B: Git Integration (Empfohlen)
1. **Pages** → **Create a project**
2. **Connect to Git** → GitHub Repo auswählen
3. **Build settings:**
   - **Framework preset:** None
   - **Build command:** (leer lassen)
   - **Build output directory:** `website`
   - **Root directory:** (leer lassen)
4. **Deploy!**

### Schritt 3: Custom Domain (Optional)
1. In Cloudflare Pages → **Custom domains**
2. **Set up a custom domain** → `verdrehtewelt.de`
3. DNS wird automatisch konfiguriert
4. Warten auf SSL (1-5 Minuten)

---

## 🔧 PAYPAL KONFIGURATION

### PayPal Return URLs updaten
1. Gehe zu: https://developer.paypal.com
2. **Dashboard** → **My Apps & Credentials**
3. **Live** App auswählen
4. **App settings** → **Return URL** hinzufügen:
   ```
   https://verdrehtewelt.pages.dev/payment-success.html
   https://verdrehtewelt.pages.dev/payment-cancel.html
   ```

### PayPal Webhooks einrichten
1. **Webhooks** → **Add Webhook**
2. **Webhook URL:** `https://verdrehte-welt-api.onrender.com/api/v1/payments/paypal/webhook`
3. **Event types:**
   - Payment capture completed
   - Payment capture refunded
4. **Save**
5. **Webhook ID** kopieren → Backend `.env`: `PAYPAL_WEBHOOK_ID`

---

## ✅ TESTING NACH DEPLOYMENT

### 1. Backend Health Check
```bash
curl https://verdrehte-welt-api.onrender.com/health
# Sollte zurückgeben: {"status":"OK","timestamp":"..."}
```

### 2. MongoDB Verbindung prüfen
- Render.com Logs checken: "✅ MongoDB connected"

### 3. Frontend testen
1. Öffne: `https://verdrehte-welt.pages.dev`
2. Navigiere zu Event
3. Wähle Ticket aus
4. Fülle Formular aus
5. **WICHTIG:** Nutze PayPal Sandbox zuerst!

### 4. PayPal Sandbox Test
- Sandbox Buyer Account nutzen
- Zahlung durchführen
- Prüfen ob Ticket-Email kommt
- Prüfen ob Ticket in MongoDB gespeichert

### 5. Admin Tools testen
1. `https://verdrehte-welt.pages.dev/admin-tickets.html`
2. Login mit `verdrehtewelt2025`
3. Prüfe ob Tickets angezeigt werden
4. QR-Code anzeigen

### 6. Scanner testen (Handy)
1. `https://verdrehte-welt.pages.dev/admin-scanner.html`
2. Login mit Passwort
3. Kamera-Zugriff erlauben
4. QR-Code aus Email scannen
5. Check-In durchführen

---

## 🔴 LIVE SCHALTEN

**NUR wenn alles funktioniert:**

### 1. PayPal auf LIVE umstellen
Backend `.env` auf Render:
```
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=<live-client-id>
PAYPAL_CLIENT_SECRET=<live-secret>
```

### 2. Resend Domain verifizieren
Für professionelle Emails von `@verdrehtewelt.de`:
1. Resend Dashboard → Domains
2. Domain hinzufügen
3. DNS Records in Cloudflare eintragen
4. Warten auf Verifizierung

### 3. Admin Passwort ändern (Empfohlen)
```
ADMIN_PASSWORD=<neues-sicheres-passwort>
```

---

## 📊 MONITORING

### Render.com
- Logs live anschauen
- Metrics: CPU, RAM, Requests
- Auto-deploy bei Git push

### Cloudflare Pages
- Analytics: Page Views, Unique Visitors
- Real-time Logs
- Build History

### MongoDB Atlas
- Database Size
- Connections
- Query Performance

---

## 🆘 TROUBLESHOOTING

### Problem: "Failed to fetch"
- **Lösung:** API_BASE_URL in Frontend überprüfen
- CORS in Backend prüfen

### Problem: PayPal Fehler
- **Lösung:** Return URLs in PayPal Dashboard prüfen
- Client ID/Secret prüfen

### Problem: Keine Emails
- **Lösung:** MAIL_API_KEY prüfen
- Resend Dashboard → Logs checken

### Problem: MongoDB Connection Error
- **Lösung:** MongoDB Atlas → Network Access
- IP 0.0.0.0/0 erlauben

### Problem: Admin Login funktioniert nicht
- **Lösung:** JWT_SECRET muss gesetzt sein
- ADMIN_PASSWORD in Backend .env prüfen

---

## 🎯 FINALE CHECKLISTE

### Backend
- [ ] Deployed auf Render.com
- [ ] MongoDB Atlas verbunden
- [ ] PayPal Live Credentials eingetragen
- [ ] Resend API Key aktiv
- [ ] Health Check funktioniert
- [ ] Logs zeigen keine Errors

### Frontend
- [ ] Deployed auf Cloudflare Pages
- [ ] API URLs aktualisiert
- [ ] PayPal Return URLs korrekt
- [ ] Admin Tools erreichbar
- [ ] SSL aktiv (https://)

### PayPal
- [ ] Live App erstellt
- [ ] Webhooks konfiguriert
- [ ] Return URLs gesetzt
- [ ] Sandbox Test erfolgreich

### Testing
- [ ] Ticket-Kauf funktioniert
- [ ] Email kommt an
- [ ] Ticket in DB gespeichert
- [ ] Admin Ticket-Liste zeigt Tickets
- [ ] Scanner funktioniert auf Handy
- [ ] Check-In erfolgreich

### Optional
- [ ] Custom Domain verbunden
- [ ] Resend Domain verifiziert
- [ ] Google Analytics eingebunden
- [ ] Backup-Strategie definiert

---

## 🚀 GO LIVE!

**Bereit?**

1. ✅ Alle Tests bestanden
2. ✅ PayPal auf LIVE
3. ✅ Emails funktionieren
4. ✅ Admin Tools getestet

**→ Teile den Link: `https://verdrehtewelt.pages.dev`**

**→ Event Tickets verkaufen! 🎉**

---

## 📞 SUPPORT LINKS

- **Render.com Docs:** https://render.com/docs
- **Cloudflare Pages:** https://developers.cloudflare.com/pages
- **PayPal Integration:** https://developer.paypal.com/docs
- **MongoDB Atlas:** https://docs.atlas.mongodb.com
- **Resend Docs:** https://resend.com/docs

---

**Du bist fertig! 🎉**

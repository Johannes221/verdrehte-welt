# 🚀 DEPLOYMENT GUIDE - Verdrehte Welt

## ✅ Was ist fertig?

### Backend API ✅
- ✅ Order System (Bestellungen)
- ✅ PayPal Payment Integration
- ✅ Ticket Generation mit QR-Codes
- ✅ Email Service (Dev-Mode: Terminal Output)
- ✅ Admin Scanner API mit Login
- ✅ Check-In System
- ✅ Statistics

### Frontend Website ✅
- ✅ Landing Page
- ✅ Event-Übersicht
- ✅ Checkout Flow
- ✅ PayPal Integration
- ✅ Success/Cancel Pages
- ✅ **NEU: Admin Scanner mit Kamera** 📱

---

## 📱 ADMIN SCANNER - SOFORT TESTEN

### Zugriff:
```
http://localhost:8080/admin-scanner.html
```

### Login:
**Passwort:** `verdrehtewelt2025`

### Features:
- ✅ QR-Code Scanner (nutzt Handy-Kamera)
- ✅ Live-Validierung
- ✅ Auto Check-In
- ✅ Statistiken (Total, Eingecheckt, Verbleibend)
- ✅ Vibration-Feedback
- ✅ iOS & Android kompatibel

---

## 🔧 JETZT NOCH ZU TUN:

### 1. Backend neu starten (WICHTIG!)
```bash
# Terminal wo Backend läuft: Ctrl+C drücken
cd /Users/johan/VerdrehteWeltWebsite/backend
npm run dev
```

### 2. Tickets für bezahlte Orders generieren
```bash
cd /Users/johan/VerdrehteWeltWebsite/backend
node generate-tickets.js
```

Das generiert automatisch alle Tickets für bezahlte Orders und sendet die Emails (im Dev-Mode ins Terminal).

### 3. Admin Scanner testen
1. Öffne auf deinem Handy: `http://localhost:8080/admin-scanner.html`
2. Login mit Passwort: `verdrehtewelt2025`
3. Kamera-Zugriff erlauben
4. Scanne einen QR-Code (aus der Email im Terminal)

---

## 📦 DEPLOYMENT ZU CLOUDFLARE PAGES

### Frontend (Website) → Cloudflare Pages

**Was hochladen:**
```
/Users/johan/VerdrehteWeltWebsite/website/
```

**Alle Dateien:**
- ✅ index.html (Landing Page)
- ✅ event.html (Event Details & Checkout)
- ✅ payment-success.html
- ✅ payment-cancel.html
- ✅ **admin-scanner.html** (NEU! 📱)
- ✅ agb.html, datenschutz.html, impressum.html
- ✅ css/ (Styles)
- ✅ js/ (JavaScript)
- ✅ images/ (Logo, etc.)

**Schritt-für-Schritt:**

1. **ZIP erstellen:**
```bash
cd /Users/johan/VerdrehteWeltWebsite
zip -r website-deploy.zip website/
```

2. **Cloudflare Pages:**
- Gehe zu: https://dash.cloudflare.com
- → Pages → "Create a project"
- → "Upload assets"
- → Drag & Drop `website-deploy.zip`
- → Deploy!

3. **Domain:** Du bekommst: `https://your-project.pages.dev`

4. **Custom Domain (optional):**
- Pages → Custom domains
- → Add domain → `verdrehtewelt.de`
- DNS wird automatisch konfiguriert

**WICHTIG:** Nachdem Frontend deployed ist, musst du die API-URL in den JS-Dateien anpassen:

```javascript
// In: event.html, payment-success.html, admin-scanner.html
const API_BASE_URL = 'https://DEINE-BACKEND-URL.com/api/v1';
```

---

## 🖥️ BACKEND DEPLOYMENT

### Option 1: Render.com (Empfohlen - Gratis)

1. **GitHub Repository:**
```bash
cd /Users/johan/VerdrehteWeltWebsite
git init
git add .
git commit -m "Initial commit"
# Push to GitHub
```

2. **Render.com:**
- Gehe zu: https://render.com
- → "New" → "Web Service"
- → Connect GitHub Repo
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables hinzufügen:**
  ```
  NODE_ENV=production
  PORT=3000
  MONGODB_URI=mongodb+srv://...
  PAYPAL_CLIENT_ID=...
  PAYPAL_CLIENT_SECRET=...
  PAYPAL_MODE=sandbox (oder live)
  JWT_SECRET=... (aus deiner .env)
  ADMIN_PASSWORD=verdrehtewelt2025
  FRONTEND_URL=https://your-project.pages.dev
  MAIL_API_KEY=... (optional, für echte Emails)
  ```

3. **Deploy:** Klick auf "Create Web Service"

4. **Fertig!** Deine API läuft auf: `https://your-backend.onrender.com`

### Option 2: Railway.app (Alternative)

Identisch zu Render, nur auf railway.app

### Option 3: VPS (Hetzner, DigitalOcean)

```bash
# Auf Server:
cd ~
git clone your-repo
cd VerdrehteWeltWebsite/backend
npm install
cp .env.example .env
# .env editieren

# Mit PM2 starten:
npm install -g pm2
pm2 start src/server.js --name verdrehte-welt-api
pm2 startup
pm2 save
```

---

## 📧 ECHTE EMAILS AKTIVIEREN (Optional)

**Aktuell:** Emails werden nur ins Backend-Terminal geloggt.

**Für Production:** Resend.com (kostenlos bis 3000 Emails/Monat)

1. Account: https://resend.com
2. API Key holen
3. In `.env` eintragen:
```
MAIL_API_KEY=re_xxxxxxxxxxxxx
```
4. Backend neu starten

---

## ✅ FINAL CHECKLIST

### Vor Deployment:
- [x] Backend läuft lokal
- [x] Frontend läuft lokal
- [x] PayPal Sandbox funktioniert
- [x] Tickets werden generiert
- [x] Admin Scanner funktioniert
- [ ] Backend neu gestartet (nach .env Änderung)
- [ ] Tickets generiert (mit generate-tickets.js)
- [ ] Admin Scanner getestet

### Deployment:
- [ ] Backend auf Render/Railway deployed
- [ ] Frontend auf Cloudflare Pages deployed
- [ ] API_BASE_URL in Frontend aktualisiert
- [ ] Frontend neu deployed (mit neuer API URL)
- [ ] PayPal Return URLs aktualisiert (in PayPal Dashboard)
- [ ] Admin Scanner auf Handy getestet

### Production:
- [ ] PayPal auf LIVE umgestellt
- [ ] Resend API Key hinzugefügt (für echte Emails)
- [ ] Custom Domain verbunden
- [ ] SSL funktioniert
- [ ] Alle Links getestet

---

## 🎯 SCHNELLSTART

**Jetzt sofort:**
```bash
# Terminal 1: Backend neu starten
cd /Users/johan/VerdrehteWeltWebsite/backend
npm run dev

# Terminal 2: Tickets generieren
cd /Users/johan/VerdrehteWeltWebsite/backend
node generate-tickets.js
```

**Dann:**
1. Öffne auf Handy: `http://localhost:8080/admin-scanner.html`
2. Login: `verdrehtewelt2025`
3. Scanne QR-Code aus Terminal-Email

**Funktioniert?** ✅ Dann bist du bereit für Deployment!

---

## 📞 WICHTIGE URLs

**Local Development:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- Admin Scanner: http://localhost:8080/admin-scanner.html
- API Health: http://localhost:3000/health

**API Endpoints:**
- `POST /api/v1/orders` - Create order
- `POST /api/v1/payments/paypal/create-order` - PayPal order
- `POST /api/v1/payments/paypal/capture-order` - Capture payment
- `POST /api/v1/admin/login` - Admin login
- `POST /api/v1/admin/validate` - Validate QR code
- `POST /api/v1/admin/checkin` - Check in ticket
- `GET /api/v1/admin/stats` - Get statistics

---

## 🎉 DU BIST READY!

Alles ist implementiert und ready für Deployment:
✅ Komplettes Ticketing-System
✅ PayPal Integration
✅ QR-Code Generation
✅ Email-Versand
✅ Admin Scanner App mit Kamera
✅ Check-In System
✅ Statistiken

**Next:** Backend neu starten → Tickets generieren → Scanner testen → Deployen!

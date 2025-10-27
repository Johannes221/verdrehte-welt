# 📝 DEINE AUFGABEN FÜR GO-LIVE

**Alles ist vorbereitet! Hier ist deine Checkliste:**

---

## ✅ WAS ICH SCHON GEMACHT HABE

1. ✅ Komplettes Ticketing-System entwickelt
2. ✅ PayPal Sandbox Integration
3. ✅ QR-Code System
4. ✅ Admin Panel
5. ✅ Email-System
6. ✅ Production Templates erstellt
7. ✅ Deployment Scripts erstellt
8. ✅ Hintergrund-Video für Mobile optimiert
9. ✅ Alle Events mit Instagram-Links aktualisiert
10. ✅ Rooftop Party Mannheim Event hinzugefügt

---

## 🎯 WAS DU JETZT MACHEN MUSST

### 1️⃣ PayPal Live App erstellen (5 Minuten)

**Gehe zu:** https://developer.paypal.com

1. Login mit deinem PayPal Business Account
2. Dashboard → **My Apps & Credentials**
3. Wechsel zu **"Live"** (Toggle oben rechts)
4. **Create App**
5. App Name: `Verdrehte Welt Ticketing`
6. Create App

**Notiere dir:**
```
PAYPAL_CLIENT_ID=AXxxx...
PAYPAL_CLIENT_SECRET=ELxxx...
```

---

### 2️⃣ MongoDB Atlas Setup (10 Minuten)

**Gehe zu:** https://www.mongodb.com/cloud/atlas

1. **Sign Up** (kostenlos)
2. **Create Cluster** → **FREE M0**
3. Cloud Provider: **AWS**
4. Region: **Frankfurt (eu-central-1)**
5. Cluster Name: `verdrehte-welt`
6. **Create**

**Database User erstellen:**
- Database Access → Add New Database User
- Username: `verdrehtewelt`
- Password: [Generiere sicheres Passwort - NOTIEREN!]
- Privileges: Read and write to any database

**Network Access:**
- Network Access → Add IP Address
- **Allow Access from Anywhere** (0.0.0.0/0)

**Connection String holen:**
- Database → Connect → Connect your application
- Driver: Node.js
- String kopieren und `<password>` ersetzen

**Notiere dir:**
```
MONGODB_URI=mongodb+srv://verdrehtewelt:DEIN_PASSWORT@verdrehte-welt.xxxxx.mongodb.net/verdrehte-welt?retryWrites=true&w=majority
```

---

### 3️⃣ Resend Email Setup (3 Minuten)

**Gehe zu:** https://resend.com

1. **Sign Up** (kostenlos - 100 Emails/Tag)
2. API Keys → **Create API Key**
3. Name: `Verdrehte Welt Production`
4. Permission: Full Access
5. **Kopiere den Key** (nur einmal sichtbar!)

**Notiere dir:**
```
MAIL_API_KEY=re_xxxxxxxxxxxxxxxxx
```

---

### 4️⃣ JWT Secret generieren (1 Minute)

**Terminal öffnen und ausführen:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Notiere dir:**
```
JWT_SECRET=<der-generierte-string>
```

---

### 5️⃣ Backend auf Render.com deployen (15 Minuten)

**Gehe zu:** https://render.com

1. **Sign Up** mit GitHub
2. **New** → **Web Service**
3. **Connect GitHub** → Repository auswählen

**Service Settings:**
```
Name: verdrehte-welt-backend
Region: Frankfurt (EU Central)
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

**Environment Variables:**

Klicke **Advanced** → **Add Environment Variable**

Trage ein (mit deinen echten Werten!):
```
NODE_ENV=production
PORT=3000
MONGODB_URI=<dein-mongodb-string>
PAYPAL_CLIENT_ID=<deine-live-client-id>
PAYPAL_CLIENT_SECRET=<dein-live-secret>
PAYPAL_MODE=live
JWT_SECRET=<dein-generierter-secret>
ADMIN_PASSWORD=verdrehtewelt2025
FRONTEND_URL=https://verdrehtewelt.pages.dev
MAIL_API_KEY=<dein-resend-key>
MAIL_FROM=noreply@verdrehtewelt.de
PLATFORM_FEE_PERCENTAGE=5
```

**Create Web Service** → Warte auf Deployment

**Backend URL notieren:**
```
https://verdrehte-welt-backend.onrender.com
```

**Health Check testen:**
Öffne im Browser:
```
https://verdrehte-welt-backend.onrender.com/health
```

Sollte zeigen: `{"status":"OK",...}`

---

### 6️⃣ PayPal Webhooks einrichten (5 Minuten)

**Zurück zu:** https://developer.paypal.com

1. Dashboard → My Apps & Credentials → **Live**
2. Deine App: `Verdrehte Welt Ticketing`
3. **Webhooks** → **Add Webhook**

**Webhook URL:**
```
https://verdrehte-welt-backend.onrender.com/api/v1/payments/paypal/webhook
```

**Event types:**
- ✅ Payment capture completed
- ✅ Payment capture refunded
- ✅ Payment capture denied

**Save** → **Webhook ID kopieren** (z.B. `WH-xxxxx`)

**Zurück zu Render.com:**
- Environment → Add Environment Variable
- Key: `PAYPAL_WEBHOOK_ID`
- Value: `WH-xxxxx`
- Save (Service startet neu)

---

### 7️⃣ PayPal Return URLs setzen (2 Minuten)

**PayPal Dashboard** → Live App → **App settings**

**Return URLs hinzufügen:**
```
https://verdrehtewelt.pages.dev/payment-success.html
https://verdrehtewelt.pages.dev/payment-cancel.html
```

**Save**

---

### 8️⃣ Frontend auf Cloudflare Pages deployen (10 Minuten)

**WICHTIG: Erst NACH Backend-Deployment!**

**Schritt 1: URLs umstellen**

Terminal öffnen:
```bash
cd /Users/johan/VerdrehteWeltWebsite
./switch-to-production.sh
```

Bestätige mit `yes`

**Schritt 2: Cloudflare Pages**

**Gehe zu:** https://dash.cloudflare.com

1. **Sign Up / Login**
2. **Pages** → **Create a project**
3. **Connect to Git** → GitHub
4. Repository: `verdrehte-welt` auswählen

**Build settings:**
```
Framework preset: None
Build command: (leer)
Build output directory: website
Root directory: (leer)
```

5. **Save and Deploy**
6. **URL notieren:** `https://verdrehtewelt.pages.dev`

---

### 9️⃣ TESTEN! (15 Minuten)

**Backend Test:**
```bash
curl https://verdrehte-welt-backend.onrender.com/health
```

**Frontend Test:**
1. Öffne: `https://verdrehtewelt.pages.dev`
2. Gehe zu Event: "Party in der Leitstelle"
3. Wähle Ticket (Phase 1)
4. Fülle Formular aus
5. **WICHTIG:** Nutze PayPal Sandbox Buyer Account!
6. Zahlung durchführen
7. Email sollte ankommen
8. Admin Panel checken: `https://verdrehtewelt.pages.dev/admin-tickets.html`

**Wenn Sandbox-Test erfolgreich:**
→ Weiter zu Schritt 10

---

### 🔟 PayPal auf LIVE umstellen (2 Minuten)

**NUR wenn Sandbox-Test erfolgreich!**

**Render.com** → Environment Variables:

**Ändere:**
```
PAYPAL_MODE=live
PAYPAL_CLIENT_ID=<deine-LIVE-client-id>
PAYPAL_CLIENT_SECRET=<dein-LIVE-secret>
```

**Save** → Service startet neu

**Live-Test mit echtem PayPal:**
- Teste mit kleinem Betrag (z.B. 1€ Ticket)
- Prüfe ob alles funktioniert
- Dann bist du LIVE! 🎉

---

## 📋 SCHNELL-CHECKLISTE

- [ ] PayPal Live App erstellt
- [ ] MongoDB Atlas Setup
- [ ] Resend Account erstellt
- [ ] JWT Secret generiert
- [ ] Backend auf Render.com deployed
- [ ] Health Check funktioniert
- [ ] PayPal Webhooks konfiguriert
- [ ] PayPal Return URLs gesetzt
- [ ] Frontend URLs umgestellt (`./switch-to-production.sh`)
- [ ] Frontend auf Cloudflare Pages deployed
- [ ] Sandbox-Test erfolgreich
- [ ] PayPal auf LIVE umgestellt
- [ ] Live-Test erfolgreich

---

## 🆘 HILFE

**Bei Problemen:**
1. Checke Render.com Logs
2. Checke Browser Console (F12)
3. Checke PayPal Webhooks → Recent Deliveries
4. Frag mich! Ich helfe dir bei jedem Schritt!

---

## 📁 WICHTIGE DATEIEN

- `GO_LIVE_ANLEITUNG.md` - Detaillierte Anleitung
- `backend/.env.production.TEMPLATE` - Template für Backend Config
- `switch-to-production.sh` - Script zum URL-Umstellen
- `switch-to-sandbox.sh` - Rollback zu Sandbox
- `PRODUCTION_CHECKLIST.md` - Ausführliche Checkliste

---

## 🚀 BEREIT?

**Starte mit Schritt 1 und arbeite dich durch!**

**Ich habe alles vorbereitet - du musst nur noch deployen! 💪**

---

**Viel Erfolg! 🎉**

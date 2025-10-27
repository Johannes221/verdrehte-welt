# 🚀 GO LIVE ANLEITUNG - Verdrehte Welt

**Status:** Sandbox → Production Migration  
**Datum:** 27.10.2025

---

## 📍 AKTUELLER STATUS

✅ **Fertig:**
- Backend komplett entwickelt
- Frontend komplett entwickelt  
- PayPal Sandbox funktioniert
- MongoDB lokal läuft
- Alle Features getestet

⏳ **Noch zu tun:**
- PayPal auf LIVE umstellen
- Backend deployen (Render.com)
- Frontend deployen (Cloudflare Pages)
- Production URLs konfigurieren

---

## 🎯 SCHRITT-FÜR-SCHRITT ANLEITUNG

### PHASE 1: PayPal Live App erstellen (DU)

1. **Gehe zu:** https://developer.paypal.com
2. **Login** mit deinem PayPal Business Account
3. **Dashboard** → **My Apps & Credentials**
4. **Wechsel zu "Live"** (oben rechts Toggle)
5. **Create App** klicken
6. **App Name:** `Verdrehte Welt Ticketing`
7. **App Type:** Merchant
8. **Create App**

**Notiere dir:**
```
PAYPAL_CLIENT_ID=<deine-live-client-id>
PAYPAL_CLIENT_SECRET=<dein-live-secret>
```

---

### PHASE 2: MongoDB Atlas Setup (DU)

1. **Gehe zu:** https://www.mongodb.com/cloud/atlas
2. **Sign Up** / Login (kostenlos)
3. **Create Cluster** → **FREE Shared Cluster (M0)**
4. **Cloud Provider:** AWS
5. **Region:** Frankfurt (eu-central-1)
6. **Cluster Name:** `verdrehte-welt`
7. **Create Cluster** (dauert 3-5 Minuten)

**Database User erstellen:**
1. **Database Access** → **Add New Database User**
2. **Username:** `verdrehtewelt`
3. **Password:** Generiere sicheres Passwort (NOTIEREN!)
4. **Database User Privileges:** Read and write to any database
5. **Add User**

**Network Access:**
1. **Network Access** → **Add IP Address**
2. **Allow Access from Anywhere** → `0.0.0.0/0`
3. **Confirm**

**Connection String holen:**
1. **Database** → **Connect** → **Connect your application**
2. **Driver:** Node.js
3. **Connection String kopieren:**
```
mongodb+srv://verdrehtewelt:<password>@verdrehte-welt.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
4. `<password>` durch dein Passwort ersetzen

**Notiere dir:**
```
MONGODB_URI=mongodb+srv://verdrehtewelt:DEIN_PASSWORT@verdrehte-welt.xxxxx.mongodb.net/verdrehte-welt?retryWrites=true&w=majority
```

---

### PHASE 3: Resend Email Setup (DU)

1. **Gehe zu:** https://resend.com
2. **Sign Up** (kostenlos - 100 Emails/Tag)
3. **API Keys** → **Create API Key**
4. **Name:** `Verdrehte Welt Production`
5. **Permission:** Full Access
6. **Create**
7. **API Key kopieren** (nur einmal sichtbar!)

**Notiere dir:**
```
MAIL_API_KEY=re_xxxxxxxxxxxxxxxxx
```

---

### PHASE 4: Backend .env Production erstellen (ICH MACHE)

Ich erstelle jetzt eine `.env.production` Datei mit Platzhaltern.
**DU musst dann deine echten Credentials eintragen!**

---

### PHASE 5: Backend auf Render.com deployen (DU)

1. **Gehe zu:** https://render.com
2. **Sign Up** mit GitHub
3. **New** → **Web Service**
4. **Connect GitHub Repository:**
   - Falls noch nicht verbunden: GitHub autorisieren
   - Repository: `verdrehte-welt` auswählen

5. **Service Settings:**
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

6. **Environment Variables hinzufügen:**
   
   Klicke auf **Advanced** → **Add Environment Variable**
   
   Trage ein (mit DEINEN echten Werten):
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb+srv://verdrehtewelt:DEIN_PASSWORT@...
   PAYPAL_CLIENT_ID=<deine-live-client-id>
   PAYPAL_CLIENT_SECRET=<dein-live-secret>
   PAYPAL_MODE=live
   JWT_SECRET=<generiere-mit-command-unten>
   ADMIN_PASSWORD=verdrehtewelt2025
   FRONTEND_URL=https://verdrehtewelt.pages.dev
   MAIL_API_KEY=re_xxxxxxxxx
   MAIL_FROM=noreply@verdrehtewelt.de
   PLATFORM_FEE_PERCENTAGE=5
   ```

   **JWT_SECRET generieren:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

7. **Create Web Service**

8. **Warte auf Deployment** (3-5 Minuten)

9. **Backend URL notieren:**
   ```
   https://verdrehte-welt-backend.onrender.com
   ```

10. **Health Check testen:**
    Öffne im Browser:
    ```
    https://verdrehte-welt-backend.onrender.com/health
    ```
    
    Sollte zeigen:
    ```json
    {"status":"OK","timestamp":"...","environment":"production"}
    ```

---

### PHASE 6: PayPal Webhooks einrichten (DU)

1. **Zurück zu:** https://developer.paypal.com
2. **Dashboard** → **My Apps & Credentials** → **Live**
3. **Deine App auswählen:** `Verdrehte Welt Ticketing`
4. **Webhooks** → **Add Webhook**

5. **Webhook URL:**
   ```
   https://verdrehte-welt-backend.onrender.com/api/v1/payments/paypal/webhook
   ```

6. **Event types auswählen:**
   - ✅ Payment capture completed
   - ✅ Payment capture refunded
   - ✅ Payment capture denied

7. **Save**

8. **Webhook ID kopieren** (z.B. `WH-xxxxx`)

9. **Zurück zu Render.com:**
   - **Environment** → **Add Environment Variable**
   - Key: `PAYPAL_WEBHOOK_ID`
   - Value: `WH-xxxxx`
   - **Save Changes** (Service wird neu gestartet)

---

### PHASE 7: PayPal Return URLs setzen (DU)

1. **PayPal Developer Dashboard** → **Live App**
2. **App settings** → **Return URL**
3. **Hinzufügen:**
   ```
   https://verdrehtewelt.pages.dev/payment-success.html
   https://verdrehtewelt.pages.dev/payment-cancel.html
   ```
4. **Save**

---

### PHASE 8: Frontend URLs aktualisieren (ICH MACHE)

Ich erstelle jetzt ein Script, das automatisch alle API URLs auf Production umstellt.
**Aber ich committe NICHTS - du entscheidest wann!**

---

### PHASE 9: Frontend auf Cloudflare Pages deployen (DU)

#### Option A: Direct Upload (Schneller)

1. **Gehe zu:** https://dash.cloudflare.com
2. **Sign Up / Login**
3. **Pages** → **Create a project**
4. **Upload assets**
5. **Drag & Drop den `website` Ordner** oder ZIP
6. **Project name:** `verdrehtewelt`
7. **Deploy**
8. **URL notieren:** `https://verdrehtewelt.pages.dev`

#### Option B: Git Integration (Empfohlen für Updates)

1. **Pages** → **Create a project**
2. **Connect to Git** → **GitHub**
3. **Repository auswählen:** `verdrehte-welt`
4. **Build settings:**
   ```
   Framework preset: None
   Build command: (leer)
   Build output directory: website
   Root directory: (leer)
   ```
5. **Save and Deploy**

---

### PHASE 10: Testen! (DU + ICH)

**Backend Test:**
```bash
curl https://verdrehte-welt-backend.onrender.com/health
```

**Frontend Test:**
1. Öffne: `https://verdrehtewelt.pages.dev`
2. Gehe zu Event
3. Wähle Ticket
4. **WICHTIG:** Erst mit PayPal Sandbox Buyer Account testen!
5. Zahlung durchführen
6. Email sollte ankommen
7. Admin Panel checken

**Wenn alles funktioniert:**
→ PayPal auf LIVE umstellen (siehe unten)

---

## 🔴 FINAL: PayPal LIVE aktivieren

**NUR wenn Sandbox-Test erfolgreich war!**

1. **Render.com** → Environment Variables
2. **Ändere:**
   ```
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=<deine-LIVE-client-id>
   PAYPAL_CLIENT_SECRET=<dein-LIVE-secret>
   ```
3. **Save** (Service startet neu)
4. **Teste mit ECHTEM PayPal Account** (kleiner Betrag!)

---

## 📋 CHECKLISTE

### Vor dem Deployment
- [ ] PayPal Live App erstellt
- [ ] MongoDB Atlas Cluster erstellt
- [ ] Resend Account erstellt
- [ ] Alle Credentials notiert

### Backend
- [ ] Render.com Service erstellt
- [ ] Environment Variables eingetragen
- [ ] Health Check funktioniert (`/health`)
- [ ] MongoDB verbunden (Logs checken)

### PayPal
- [ ] Webhooks konfiguriert
- [ ] Return URLs gesetzt
- [ ] Webhook ID in Backend eingetragen

### Frontend
- [ ] API URLs auf Production umgestellt
- [ ] Cloudflare Pages deployed
- [ ] Website erreichbar

### Testing
- [ ] Sandbox Test erfolgreich
- [ ] Email kommt an
- [ ] Ticket in DB gespeichert
- [ ] Admin Panel zeigt Ticket
- [ ] QR-Code funktioniert
- [ ] Scanner funktioniert

### Go Live
- [ ] PayPal auf LIVE umgestellt
- [ ] Live-Zahlung getestet
- [ ] Alles funktioniert!

---

## 🆘 WAS ICH FÜR DICH MACHE

1. ✅ `.env.production` Template mit Platzhaltern
2. ✅ Script zum Umstellen der Frontend URLs
3. ✅ Production-Ready Code (bereits fertig)
4. ✅ Diese Anleitung
5. ✅ Checkliste

## 🎯 WAS DU MACHEN MUSST

1. ⏳ PayPal Live App erstellen → Credentials notieren
2. ⏳ MongoDB Atlas Setup → Connection String notieren
3. ⏳ Resend Account → API Key notieren
4. ⏳ Backend auf Render.com deployen
5. ⏳ PayPal Webhooks + Return URLs setzen
6. ⏳ Frontend auf Cloudflare Pages deployen
7. ⏳ Testen!
8. ⏳ PayPal auf LIVE umstellen

---

## 📞 SUPPORT

**Bei Problemen:**
- Render.com Logs checken
- Browser Console checken (F12)
- PayPal Developer Dashboard → Webhooks → Recent Deliveries
- MongoDB Atlas → Metrics

**Ich helfe dir bei jedem Schritt!**

---

**Bereit? Lass uns loslegen! 🚀**

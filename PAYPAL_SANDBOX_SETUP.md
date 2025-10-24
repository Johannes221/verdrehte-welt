# 🔧 PayPal Sandbox Setup - Schritt für Schritt

## 1️⃣ PayPal Developer Account erstellen

1. Gehe zu: **https://developer.paypal.com/**
2. Klicke auf **"Log in to Dashboard"**
3. Melde dich mit deinem PayPal-Account an (oder erstelle einen)

---

## 2️⃣ Sandbox App erstellen

1. Im Dashboard: **"Apps & Credentials"** (links im Menü)
2. Stelle sicher, dass **"Sandbox"** ausgewählt ist (oben)
3. Klicke auf **"Create App"**

**App-Details:**
- **App Name:** `Verdrehte Welt Ticketing`
- **App Type:** `Merchant`

4. Klicke **"Create App"**

---

## 3️⃣ Credentials kopieren

Nach dem Erstellen siehst du:

### Client ID
```
AXm...xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
**→ Kopieren und in `.env` eintragen bei `PAYPAL_CLIENT_ID`**

### Secret (klicke auf "Show")
```
EO1...xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
**→ Kopieren und in `.env` eintragen bei `PAYPAL_CLIENT_SECRET`**

---

## 4️⃣ .env Datei aktualisieren

Öffne: `backend/.env`

Ersetze diese Zeilen:
```bash
PAYPAL_CLIENT_ID=your-sandbox-client-id
PAYPAL_CLIENT_SECRET=your-sandbox-secret
```

Mit deinen echten Werten:
```bash
PAYPAL_CLIENT_ID=AXm...deine-client-id
PAYPAL_CLIENT_SECRET=EO1...dein-secret
```

**Speichern!**

---

## 5️⃣ Sandbox Test Accounts

PayPal erstellt automatisch Test-Accounts:

### Business Account (dein Account)
- Empfängt Zahlungen
- Wird automatisch erstellt

### Personal Account (Test-Käufer)
1. Gehe zu: **"Sandbox" → "Accounts"**
2. Du siehst Test-Accounts (z.B. `sb-xxxxx@personal.example.com`)
3. Klicke auf einen Personal Account
4. **Email & Password** werden angezeigt

**Diese Daten brauchst du zum Testen der Zahlung!**

**Oder erstelle eigenen Test-Käufer:**
1. Klicke **"Create Account"**
2. **Account Type:** `Personal`
3. **Email:** Wird automatisch generiert
4. **Password:** Eigenes setzen
5. **Balance:** 5000 USD (zum Testen)

---

## 6️⃣ Webhook einrichten (Optional für jetzt)

**Für später (Live-Betrieb wichtig):**

1. Apps & Credentials → Deine App
2. Scroll runter zu **"Webhooks"**
3. Klicke **"Add Webhook"**
4. **Webhook URL:** `http://localhost:3000/api/v1/payments/paypal/webhook`
   (später: `https://api.verdrehtewelt.de/api/v1/payments/paypal/webhook`)
5. **Event types** auswählen:
   - ✅ `Checkout order approved`
   - ✅ `Payment capture completed`
   - ✅ `Payment capture refunded`
6. **Save**

**Webhook ID kopieren** und in `.env` bei `PAYPAL_WEBHOOK_ID` eintragen.

---

## 7️⃣ Backend starten

```bash
cd backend
npm run dev
```

Du solltest sehen:
```
✅ MongoDB connected
🚀 Server running on http://localhost:3000
```

---

## 8️⃣ Test durchführen

### Im Browser:
1. Öffne: **http://localhost:8080**
2. Klicke auf **"Rave in Dossenheim"**
3. Klicke **"Ticket sichern"**
4. Fülle das Formular aus:
   - Email: deine Email
   - AGB & DSGVO akzeptieren
5. Klicke **"Weiter zu PayPal"**

### Bei PayPal:
1. Du wirst zu PayPal Sandbox weitergeleitet
2. **Login mit Test-Account:**
   - Email: `sb-xxxxx@personal.example.com` (dein Personal Test Account)
   - Password: (das was du gesetzt hast)
3. Klicke **"Jetzt bezahlen"**
4. Du wirst zurück zur Website geleitet

### Backend-Logs prüfen:
```bash
# In einem anderen Terminal:
cd backend
npm run dev

# Oder Logs live ansehen:
tail -f backend/logs/app.log
```

Du solltest sehen:
```
[Order] Created: 6789...
[PayPal] Order created: 4J123...
[PayPal] Capture completed: 8AB45...
[Ticket Generation] Generated 1 tickets
[Email] Sent to user@example.com
```

---

## 9️⃣ Troubleshooting

### Problem: "Invalid client credentials"
**Lösung:** 
- Prüfe `PAYPAL_CLIENT_ID` und `PAYPAL_CLIENT_SECRET` in `.env`
- Stelle sicher, dass keine Leerzeichen am Anfang/Ende sind
- Prüfe, dass du im **Sandbox-Modus** bist

### Problem: "PayPal-Seite lädt nicht"
**Lösung:**
- Prüfe, dass Backend läuft (`http://localhost:3000/health`)
- Prüfe Browser-Console auf Fehler
- CORS sollte aktiviert sein (ist im Backend bereits konfiguriert)

### Problem: "MongoDB connection failed"
**Lösung:**
- Prüfe `MONGODB_URI` in `.env`
- Teste Verbindung: `mongosh "mongodb+srv://..."`
- IP-Whitelist in MongoDB Atlas prüfen (0.0.0.0/0 erlauben)

### Problem: "Keine Email erhalten"
**Lösung:**
- Im Development-Modus werden Emails **nur in Console** geloggt
- Prüfe Backend-Logs für `[Email] Sent to ...`
- Für echte Emails: Resend API Key hinzufügen

---

## 🔟 Fertig! ✅

Dein Setup ist komplett:
- ✅ MongoDB verbunden
- ✅ PayPal Sandbox konfiguriert
- ✅ Backend läuft
- ✅ Frontend läuft
- ✅ Test-Order funktioniert

---

## 📝 Wichtige URLs

- **PayPal Developer:** https://developer.paypal.com/
- **Sandbox Dashboard:** https://developer.paypal.com/dashboard/
- **Test Accounts:** https://developer.paypal.com/dashboard/accounts
- **API Logs:** https://developer.paypal.com/dashboard/logs

---

## 🚀 Nächste Schritte

1. ✅ Test-Orders durchführen
2. ✅ QR-Codes testen (werden in Console geloggt)
3. ✅ Check-in API testen
4. ⏳ Für Live: PayPal auf "Live" umstellen
5. ⏳ Für Live: Webhook URL ändern

---

**Viel Erfolg! 🎉**

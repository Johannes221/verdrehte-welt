# 🧪 KOMPLETTER TESTPLAN - Development

## ✅ STATUS:

### Backend
- **Port:** http://localhost:3000
- **MongoDB:** ✅ Connected
- **PayPal:** ✅ Sandbox Mode
- **Email:** ✅ Resend API AKTIV (echte Emails!)

### Frontend
- **Port:** http://localhost:8080
- **Status:** ✅ Running

---

## 🎯 TEST 1: API Health Check

```bash
curl http://localhost:3000/health
```

**Erwartete Antwort:**
```json
{
  "status": "OK",
  "timestamp": "2025-10-24T...",
  "environment": "development"
}
```

---

## 🎯 TEST 2: Events laden

**Browser:** http://localhost:3000/api/v1/events

**Oder Terminal:**
```bash
curl http://localhost:3000/api/v1/events
```

**Erwartete Antwort:**
```json
{
  "events": [
    {
      "id": "rave-dossenheim-2025",
      "title": "Rave in Dossenheim",
      ...
    }
  ]
}
```

---

## 🎯 TEST 3: Frontend Website

**Öffnen:** http://localhost:8080

**Prüfen:**
- ✅ Hauptseite lädt
- ✅ Logo sichtbar
- ✅ Navigation funktioniert
- ✅ Events werden angezeigt
- ✅ Event-Bilder laden
- ✅ "Ticket sichern" Buttons sichtbar

---

## 🎯 TEST 4: Event-Detail Seite

1. **Klicke:** "Rave in Dossenheim" → "Ticket sichern"
2. **Prüfen:**
   - ✅ Event-Details werden angezeigt
   - ✅ Event-Bild lädt
   - ✅ Ticket-Optionen sichtbar
   - ✅ Preise korrekt (8,00 €)
   - ✅ "Auswählen" Button funktioniert

---

## 🎯 TEST 5: KOMPLETTER CHECKOUT-FLOW

### Schritt 1: Ticket auswählen
1. Auf Event-Seite: Klicke **"Auswählen"** bei Early Bird
2. **Prüfen:** Checkout-Formular erscheint
3. **Prüfen:** Preis wird angezeigt (8,00 €)

### Schritt 2: Formular ausfüllen
```
Email: ihre-echte-email@gmail.com  (WICHTIG: Echte Email!)
Vorname: Test
Nachname: User
✅ AGB akzeptieren
✅ Datenschutz akzeptieren
```

### Schritt 3: Zu PayPal
1. **Klicke:** "Weiter zu PayPal"
2. **Prüfen:** Button wird zu "Wird verarbeitet..."
3. **Prüfen:** Weiterleitung zu PayPal Sandbox

**Backend Terminal prüfen:**
```
[Order] Created: 67890abcdef...
[PayPal] Order created: 4J123XYZ...
```

### Schritt 4: PayPal Sandbox
1. **Login mit Test-Account:**
   - Gehe zu: https://developer.paypal.com/dashboard/accounts
   - Nutze einen Personal Account (z.B. `sb-xxxxx@personal.example.com`)
   - Oder erstelle neuen Test-Käufer
2. **Zahlung bestätigen:** "Jetzt bezahlen"
3. **Prüfen:** Weiterleitung zurück zur Website

### Schritt 5: Payment Capture
**Backend Terminal prüfen:**
```
[PayPal] Capture completed: 8AB45CD...
[PayPal] Order 67890... marked as paid
[Ticket Generation] Generated 1 tickets for Order 67890...
[Email] Sent to ihre-echte-email@gmail.com, messageId: ...
```

### Schritt 6: EMAIL PRÜFEN! 📧
1. **Öffnen Sie Ihr Email-Postfach** (die Email die Sie eingegeben haben)
2. **Suchen Sie:** Email von "noreply@verdrehtewelt.de"
3. **Betreff:** "🎉 Deine Verdrehte Welt Tickets"
4. **Prüfen:**
   - ✅ Email erhalten
   - ✅ QR-Code sichtbar
   - ✅ Ticket-Details korrekt
   - ✅ Bestellnummer vorhanden
   - ✅ Design sieht gut aus

**⚠️ Falls Email nicht ankommt:**
- Spam-Ordner prüfen
- Backend-Logs prüfen für Fehler
- Resend Dashboard prüfen: https://resend.com/emails

---

## 🎯 TEST 6: MongoDB Daten prüfen

**Terminal:**
```bash
mongosh "mongodb+srv://verdrehteweltev_db_user:Dtg43DEI3AiwqT4t@cluster0.o3skdqm.mongodb.net/verdrehte-welt"

# Im MongoDB Shell:
show collections
# Sollte zeigen: orders, tickets

# Orders anzeigen:
db.orders.find().pretty()

# Tickets anzeigen:
db.tickets.find().pretty()
```

**Prüfen:**
- ✅ Order existiert mit status: "bezahlt"
- ✅ Ticket existiert mit status: "gueltig"
- ✅ qrToken ist gesetzt
- ✅ paypalCaptureId ist gesetzt

---

## 🎯 TEST 7: QR-Code Check-in (API)

**QR-Token aus MongoDB holen:**
```bash
db.tickets.findOne({}, {qrToken: 1})
# Kopiere den qrToken
```

**Check-in simulieren:**
```bash
curl -X POST http://localhost:3000/api/v1/checkin/scan \
  -H "Content-Type: application/json" \
  -d '{
    "qrToken": "DER-JWT-TOKEN-AUS-MONGODB",
    "deviceId": "test-device",
    "modus": "tuer"
  }'
```

**Erwartete Antwort (erster Scan):**
```json
{
  "ergebnis": "eingelassen",
  "message": "Ticket erfolgreich gescannt - Einlass gewährt! ✅",
  "ticket": {
    "id": "...",
    "bezeichnung": "Early Bird",
    ...
  }
}
```

**Zweiter Scan (sollte fehlschlagen):**
```bash
# Gleicher Befehl nochmal
```

**Erwartete Antwort:**
```json
{
  "ergebnis": "bereits_benutzt",
  "message": "Ticket wurde bereits verwendet",
  ...
}
```

---

## 🎯 TEST 8: Event-Statistiken

```bash
curl http://localhost:3000/api/v1/checkin/stats/rave-dossenheim-2025
```

**Erwartete Antwort:**
```json
{
  "eventId": "rave-dossenheim-2025",
  "total": 1,
  "gueltig": 0,
  "eingelassen": 1,
  "erstattet": 0,
  "gesperrt": 0
}
```

---

## ✅ VOLLSTÄNDIGE CHECKLIST:

### Backend
- [ ] Health Check funktioniert
- [ ] Events API liefert Daten
- [ ] MongoDB verbunden
- [ ] PayPal Credentials funktionieren

### Frontend
- [ ] Website lädt (Port 8080)
- [ ] Events werden angezeigt
- [ ] Navigation funktioniert
- [ ] Bilder laden

### Checkout-Flow
- [ ] Ticket-Auswahl funktioniert
- [ ] Formular funktioniert
- [ ] PayPal Order erstellt
- [ ] Weiterleitung zu PayPal klappt
- [ ] Payment Capture erfolgreich
- [ ] Order Status = "bezahlt"
- [ ] Tickets generiert

### Email
- [ ] Email erhalten (echte Email!)
- [ ] QR-Code sichtbar
- [ ] Design OK
- [ ] Alle Infos vorhanden

### Ticketing
- [ ] QR-Token in DB
- [ ] Check-in funktioniert (erster Scan)
- [ ] Zweiter Scan wird abgelehnt
- [ ] Statistiken korrekt

---

## 🚨 HÄUFIGE PROBLEME:

### Email kommt nicht an
**Lösung:**
1. Backend-Logs prüfen für Fehler
2. Resend Dashboard: https://resend.com/emails
3. Spam-Ordner prüfen
4. Email-Adresse im Formular korrekt?

### PayPal funktioniert nicht
**Lösung:**
1. Browser Console (F12) auf Fehler prüfen
2. Backend-Logs prüfen
3. PayPal Credentials korrekt in .env?
4. PAYPAL_MODE=sandbox gesetzt?

### Ticket-Generierung schlägt fehl
**Lösung:**
1. Backend-Logs prüfen
2. MongoDB Verbindung OK?
3. JWT_SECRET gesetzt?

---

## 🎉 WENN ALLES KLAPPT:

### Dann können Sie:

1. **Production vorbereiten:**
   - PayPal auf "Live" umstellen
   - PAYPAL_MODE=live
   - Live Credentials eintragen
   - NODE_ENV=production

2. **Frontend deployen:**
   - `website/` Ordner → Cloudflare Pages
   - Domain verbinden

3. **Backend deployen:**
   - VPS oder Render.com
   - .env mit Production-Werten
   - SSL-Zertifikate

4. **Domain DNS:**
   - verdrehtewelt.de → Frontend
   - api.verdrehtewelt.de → Backend

5. **Live testen:**
   - Echte Zahlung (klein)
   - Email prüfen
   - Check-in testen

---

## 📞 Support & Logs:

**Backend Logs live:**
```bash
# Im Terminal wo Backend läuft
# Oder:
tail -f backend/logs/app.log
```

**MongoDB:**
```bash
mongosh "mongodb+srv://..."
show collections
db.orders.find().sort({erstellt_at: -1}).limit(5).pretty()
```

**PayPal Logs:**
- https://developer.paypal.com/dashboard/logs

**Resend Logs:**
- https://resend.com/emails

---

**VIEL ERFOLG BEIM TESTEN!** 🚀🎵

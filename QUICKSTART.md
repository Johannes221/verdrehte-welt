# ⚡ Quick Start Guide

Schnellstart für lokale Entwicklung.

## 1. Backend starten

```bash
cd backend
npm install
cp .env.example .env
```

**.env bearbeiten:**
```bash
# Mindestens diese Werte setzen:
MONGODB_URI=mongodb://localhost:27017/verdrehte-welt
JWT_SECRET=dein-geheimes-secret-mindestens-32-zeichen
PAYPAL_CLIENT_ID=deine-paypal-client-id
PAYPAL_CLIENT_SECRET=dein-paypal-secret
PAYPAL_MODE=sandbox
FRONTEND_URL=http://localhost:8080
```

**Server starten:**
```bash
npm run dev
```

Backend läuft auf: http://localhost:3000

## 2. Frontend starten

```bash
cd website
npx http-server -p 8080
```

Website läuft auf: http://localhost:8080

## 3. Testen

1. Öffne http://localhost:8080
2. Wähle Event "Rave in Dossenheim"
3. Klicke "Ticket sichern"
4. Fülle Formular aus
5. Wird zu PayPal weitergeleitet (Sandbox)

**PayPal Test Account:**
- Email: sb-buyer@personal.example.com
- Password: 12345678

## 4. MongoDB

**Option A: Lokal**
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Ubuntu
sudo apt-get install mongodb
sudo systemctl start mongod
```

**Option B: MongoDB Atlas**
- Kostenloser Cloud-Account: https://www.mongodb.com/cloud/atlas
- Connection String kopieren und in .env eintragen

## 5. Fertig! 🎉

- Frontend: http://localhost:8080
- Backend: http://localhost:3000
- API Health: http://localhost:3000/health
- Events: http://localhost:3000/api/v1/events

## Next Steps

- PayPal Sandbox-Account erstellen
- Test-Order durchführen
- Email-Service konfigurieren (optional)
- Deployment vorbereiten (siehe DEPLOYMENT.md)

## Troubleshooting

**Problem:** Backend startet nicht
```bash
# MongoDB läuft?
mongosh  # sollte verbinden

# Port 3000 frei?
lsof -i :3000
```

**Problem:** Frontend zeigt keine Events
```bash
# Backend erreichbar?
curl http://localhost:3000/api/v1/events

# CORS-Fehler? Prüfe Browser Console
```

**Problem:** PayPal funktioniert nicht
```bash
# Credentials richtig in .env?
echo $PAYPAL_CLIENT_ID

# Sandbox-Mode aktiv?
# PAYPAL_MODE=sandbox
```

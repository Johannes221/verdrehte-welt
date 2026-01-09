# 💰 PayPal-Empfängerkonto wechseln

## Problem
Zahlungen gehen an das alte Konto, obwohl `PAYPAL_RECEIVER_EMAIL` gesetzt ist.

## Warum?
Die `PAYPAL_CLIENT_ID` und `PAYPAL_CLIENT_SECRET` bestimmen das Empfängerkonto!
Diese Credentials sind fest mit einem PayPal-Konto verknüpft.

## ✅ Lösung: Neue PayPal App für neues Konto erstellen

### Schritt 1: In neues PayPal-Konto einloggen
1. Gehe zu: **https://developer.paypal.com**
2. Klicke **"Log in to Dashboard"**
3. **Wichtig**: Logge dich mit dem **NEUEN** Konto ein:
   - E-Mail: `info.moritz.business@gmx.de`

### Schritt 2: Sandbox Test-Accounts erstellen (optional)
Falls noch nicht vorhanden:
1. Dashboard → **"Testing Tools"** → **"Sandbox Accounts"**
2. Erstelle 2 Accounts:
   - **Business Account** (für Zahlungsempfang)
   - **Personal Account** (für Test-Käufe)
3. Notiere die Login-Daten für Tests

### Schritt 3: App erstellen
1. Dashboard → **"Apps & Credentials"**
2. Tab: **"Sandbox"** (für Tests) oder **"Live"** (für Produktion)
3. Klicke **"Create App"**
4. Name: `Verdrehte Welt Ticketing`
5. Wähle den **Business Sandbox Account** als Merchant
6. Klicke **"Create App"**

### Schritt 4: Credentials kopieren
Nach App-Erstellung siehst du:
```
Client ID:     AbO0c... (lang)
Secret:        EIC7n... (klicke "Show" zum Anzeigen)
```

**Kopiere beide Werte!**

### Schritt 5: In `.env` eintragen
Öffne `/Users/johan/VerdrehteWeltWebsite/backend/.env`:

```bash
# PayPal (Sandbox) - NEUE CREDENTIALS
PAYPAL_CLIENT_ID=DEINE_NEUE_CLIENT_ID_HIER
PAYPAL_CLIENT_SECRET=DEIN_NEUES_SECRET_HIER
PAYPAL_MODE=sandbox
```

### Schritt 6: Backend neu starten
```bash
cd /Users/johan/VerdrehteWeltWebsite/backend
# Alten Server stoppen (Ctrl+C im Terminal)
npm start
```

---

## Wichtig: Sandbox vs. Live

### Sandbox (Testmodus) ✅ Aktuell aktiv
- Keine echten Zahlungen
- Test-Accounts nutzen
- `PAYPAL_MODE=sandbox`
- API: `api-m.sandbox.paypal.com`

### Live (Produktionsmodus) 🚀 Für echte Zahlungen
- **Echte** Zahlungen
- Echte PayPal-Accounts
- `PAYPAL_MODE=live`
- API: `api-m.paypal.com`
- **Braucht verifiziertes Business-Konto**

---

## Testen

Nach dem Credentials-Wechsel:

1. **Test-Bestellung** aufgeben
2. Mit **Sandbox Personal Account** zahlen
3. Prüfen: Geld kommt auf **Sandbox Business Account**
4. Checke auf developer.paypal.com → Sandbox Accounts → Business Account → "Log in to Dashboard"

---

## Für Live/Produktion

Wenn alles funktioniert:

1. Dashboard → **"Live"** Tab
2. App erstellen (gleiche Schritte wie oben)
3. **Live Credentials** kopieren
4. In `.env` eintragen:
   ```bash
   PAYPAL_MODE=live
   PAYPAL_CLIENT_ID=LIVE_CLIENT_ID
   PAYPAL_CLIENT_SECRET=LIVE_SECRET
   ```
5. **Wichtig**: PayPal-Konto muss Business-Account sein und verifiziert

---

## Alternative: Payee im Code setzen (kompliziert)

Falls du die Zahlungen auf ein anderes Konto umleiten willst, OHNE die App zu wechseln:

⚠️ **Funktioniert nur mit PayPal Commerce Platform und speziellen Berechtigungen**

```javascript
purchase_units: [{
    payee: {
        email_address: 'info.moritz.business@gmx.de'
    },
    // ...
}]
```

**Aber**: Einfacher ist es, neue Credentials vom gewünschten Konto zu nutzen!

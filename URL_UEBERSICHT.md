# 🔗 URL ÜBERSICHT - Sandbox vs. Production

## 📍 AKTUELLER STATUS: SANDBOX

Alle Frontend-Dateien zeigen aktuell auf die **SANDBOX** URL:
```
https://verdrehte-welt.onrender.com/api/v1
```

---

## 📁 DATEIEN MIT API URLs

### 1. `website/js/event-detail.js`
**Zeile 4:**
```javascript
const API_BASE_URL = 'https://verdrehte-welt.onrender.com/api/v1';
```

**Verwendet für:**
- Ticket-Bestellung erstellen
- PayPal Order erstellen

---

### 2. `website/payment-success.html`
**Zeile 103:**
```javascript
const API_BASE_URL = 'https://verdrehte-welt.onrender.com/api/v1';
```

**Verwendet für:**
- PayPal Payment Capture nach erfolgreicher Zahlung

---

### 3. `website/admin-scanner.html`
**Zeile 345:**
```javascript
const API_BASE_URL = 'https://verdrehte-welt.onrender.com/api/v1';
```

**Verwendet für:**
- Admin Login
- Ticket Validierung
- Check-In durchführen
- Stats abrufen

---

### 4. `website/admin-tickets.html`
**Zeile 450:**
```javascript
const API_BASE_URL = 'https://verdrehte-welt.onrender.com/api/v1';
```

**Verwendet für:**
- Alle Tickets abrufen
- Stats abrufen
- Tickets filtern

---

### 5. `website/admin.html`
**Zeile 157:**
```javascript
const API_BASE_URL = 'https://verdrehte-welt.onrender.com/api/v1';
```

**Verwendet für:**
- Admin Login

---

### 6. `website/js/main.js`
**Zeile 4-6:**
```javascript
const API_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api/v1' 
    : 'https://api.verdrehtewelt.de/api/v1';
```

**Besonderheit:**
- Automatische Erkennung: localhost vs. production
- Aktuell nicht in Verwendung (nur als Fallback)

---

## 🔄 UMSTELLUNG AUF PRODUCTION

### Automatisch mit Script:

```bash
cd /Users/johan/VerdrehteWeltWebsite
./switch-to-production.sh
```

**Das Script ersetzt:**
```
VORHER: https://verdrehte-welt.onrender.com/api/v1
NACHHER: https://verdrehte-welt-backend.onrender.com/api/v1
```

**In allen 6 Dateien!**

---

### Manuell (falls Script nicht funktioniert):

**Suche & Ersetze in allen Dateien:**

**Alt (Sandbox):**
```
https://verdrehte-welt.onrender.com/api/v1
```

**Neu (Production):**
```
https://verdrehte-welt-backend.onrender.com/api/v1
```

**Oder mit deiner eigenen Backend URL:**
```
https://DEINE-BACKEND-URL.onrender.com/api/v1
```

---

## 🔙 ROLLBACK ZU SANDBOX

Falls du zurück zu Sandbox willst:

```bash
./switch-to-sandbox.sh
```

Oder manuell alle URLs zurück ändern.

---

## ⚠️ WICHTIG

**NIEMALS committen/pushen bevor Backend deployed ist!**

**Reihenfolge:**
1. ✅ Backend auf Render.com deployen
2. ✅ Backend URL notieren
3. ✅ Frontend URLs umstellen (`./switch-to-production.sh`)
4. ✅ Testen!
5. ✅ Dann committen & pushen

**Sonst zeigt deine Website auf ein nicht existierendes Backend!**

---

## 📝 BACKEND URLS

### Sandbox (aktuell):
```
https://verdrehte-welt.onrender.com/api/v1
```

### Production (nach Deployment):
```
https://verdrehte-welt-backend.onrender.com/api/v1
```

**Oder deine eigene URL nach Render.com Setup!**

---

## 🔍 ÜBERPRÜFEN

Nach dem Umstellen kannst du prüfen:

```bash
# Alle Dateien nach alter URL durchsuchen
grep -r "verdrehte-welt.onrender.com" website/

# Sollte NICHTS finden wenn erfolgreich umgestellt!
```

```bash
# Alle Dateien nach neuer URL durchsuchen
grep -r "verdrehte-welt-backend.onrender.com" website/

# Sollte 6 Dateien finden!
```

---

## ✅ CHECKLISTE

- [ ] Backend auf Render.com deployed
- [ ] Backend URL notiert
- [ ] `./switch-to-production.sh` ausgeführt
- [ ] Alle 6 Dateien zeigen auf neue URL
- [ ] Lokal getestet (optional)
- [ ] Committed & gepusht
- [ ] Cloudflare Pages deployed
- [ ] Live getestet

---

**Alles klar? Dann kann's losgehen! 🚀**

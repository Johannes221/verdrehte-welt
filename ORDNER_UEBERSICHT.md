# 📂 ORDNER-ÜBERSICHT - Was wohin hochladen?

## 🎯 Die zwei wichtigen Ordner

### 1️⃣ FRONTEND → Cloudflare Pages
```
📂 /Users/johan/VerdrehteWeltWebsite/website/
```

**Inhalt:**
```
website/
├── 📄 index.html                 # Landing Page
├── 📄 event.html                 # Event-Details & Checkout
├── 📄 payment-success.html       # Erfolgsseite nach PayPal
├── 📄 payment-cancel.html        # Abbruchseite
├── 📄 admin-scanner.html         # 📱 QR-Scanner für Einlass
├── 📄 agb.html                   # AGB
├── 📄 datenschutz.html           # Datenschutz
├── 📄 impressum.html             # Impressum
│
├── 📁 css/
│   ├── main.css                  # Haupt-Styles
│   └── event.css                 # Event-Seite Styles
│
├── 📁 js/
│   ├── main.js                   # Haupt-JavaScript
│   ├── events-data.js            # Event-Daten
│   └── event-detail.js           # Checkout-Logik
│
└── 📁 images/
    ├── logo.png                  # Logo
    └── events/                   # Event-Bilder
        └── event-1.jpg
```

**→ Alles auf Cloudflare Pages hochladen!**

---

### 2️⃣ BACKEND → Render.com (via GitHub)
```
📂 /Users/johan/VerdrehteWeltWebsite/backend/
```

**Inhalt:**
```
backend/
├── 📄 .env                       # ⚠️ Secrets (NICHT committen!)
├── 📄 .env.example               # Template für .env
├── 📄 package.json               # Dependencies
├── 📄 generate-tickets.js        # Tickets generieren
│
└── 📁 src/
    ├── 📄 server.js              # Express Server
    │
    ├── 📁 models/
    │   ├── Order.js              # Order-Schema
    │   └── Ticket.js             # Ticket-Schema
    │
    ├── 📁 routes/
    │   ├── orders.js             # Order API
    │   ├── paypalPayment.js      # PayPal API
    │   ├── checkin.js            # Check-in API
    │   ├── admin.js              # Admin API
    │   └── events.js             # Events API
    │
    └── 📁 services/
        ├── ticketGeneration.js   # QR-Code Generierung
        └── emailService.js       # Email-Versand
```

**→ Via GitHub auf Render.com deployen!**

---

## 📤 UPLOAD-METHODEN

### Frontend (Cloudflare Pages)

#### Option 1: Drag & Drop (Schnellste)
1. Öffne https://dash.cloudflare.com
2. → Workers & Pages → Upload assets
3. **Ziehe ALLE Dateien aus `website/` rein**
   - ⚠️ Die Dateien selbst, NICHT den Ordner!
   - `index.html` muss im Root sein!

#### Option 2: ZIP erstellen
```bash
cd /Users/johan/VerdrehteWeltWebsite/website
zip -r ../frontend-deploy.zip *
```
→ Dann `frontend-deploy.zip` auf Cloudflare hochladen

#### Option 3: Git-Integration
```bash
cd /Users/johan/VerdrehteWeltWebsite
git add website/
git commit -m "Add frontend"
git push
```
→ Bei Cloudflare: GitHub verbinden → Auto-Deploy

---

### Backend (Render.com)

#### Nur via GitHub möglich:
```bash
cd /Users/johan/VerdrehteWeltWebsite

# 1. Git initialisieren (falls noch nicht)
git init
git add .
git commit -m "Initial commit"

# 2. Zu GitHub pushen
git remote add origin https://github.com/DEIN-USERNAME/verdrehte-welt.git
git branch -M main
git push -u origin main

# 3. Bei Render.com: Repository verbinden
```

**Root Directory bei Render:** `backend`

---

## ⚙️ KONFIGURATION NACH UPLOAD

### 1. Backend-URL im Frontend eintragen

**Deine Backend-URL:** `https://verdrehte-welt-api.onrender.com`

**Bearbeite 3 Dateien in `website/`:**

#### a) `event.html` (Zeile ~300)
```javascript
// VORHER:
const API_BASE_URL = 'http://localhost:3000/api/v1';

// NACHHER:
const API_BASE_URL = 'https://verdrehte-welt-api.onrender.com/api/v1';
```

#### b) `payment-success.html` (Zeile ~100)
```javascript
// VORHER:
const API_BASE_URL = 'http://localhost:3000/api/v1';

// NACHHER:
const API_BASE_URL = 'https://verdrehte-welt-api.onrender.com/api/v1';
```

#### c) `admin-scanner.html` (Zeile ~290)
```javascript
// VORHER:
const API_BASE_URL = 'http://localhost:3000/api/v1';

// NACHHER:
const API_BASE_URL = 'https://verdrehte-welt-api.onrender.com/api/v1';
```

**Dann:** Frontend neu deployen!

---

### 2. Frontend-URL im Backend eintragen

**Deine Frontend-URL:** `https://verdrehte-welt.pages.dev`

**Bei Render.com:**
1. → Dein Service → **Environment**
2. → Variable `FRONTEND_URL` bearbeiten
3. **Wert:** `https://verdrehte-welt.pages.dev`
4. → **Save Changes**

→ Backend startet automatisch neu

---

## 🚫 WAS NICHT HOCHLADEN?

### Diese Dateien NICHT committen/deployen:
```
❌ backend/.env                  # Secrets (nur lokal!)
❌ backend/node_modules/         # Dependencies (automatisch installiert)
❌ website/node_modules/         # Falls vorhanden
❌ .DS_Store                     # Mac System Files
❌ *.log                         # Log-Dateien
```

**✅ Bereits in `.gitignore`!**

---

## 📋 SCHNELL-CHECKLIST

### Frontend Upload:
- [ ] Öffne Cloudflare Dashboard
- [ ] → Workers & Pages → Upload assets
- [ ] Ziehe ALLE Dateien aus `website/` Ordner rein
- [ ] → Deploy
- [ ] ✅ Erhalte URL: `https://verdrehte-welt.pages.dev`

### Backend Upload:
- [ ] GitHub Repository erstellt
- [ ] Komplettes Projekt gepusht
- [ ] Render.com Account erstellt
- [ ] → New Web Service
- [ ] GitHub Repository verbunden
- [ ] Root Directory: `backend` eingestellt
- [ ] Environment Variables hinzugefügt (siehe CLOUDFLARE_ANLEITUNG.md)
- [ ] → Create Web Service
- [ ] ✅ Erhalte URL: `https://verdrehte-welt-api.onrender.com`

### Nach Upload:
- [ ] Backend-URL in 3 Frontend-Dateien eingetragen
- [ ] Frontend neu deployed
- [ ] Frontend-URL im Backend Environment gesetzt
- [ ] Backend neu gestartet
- [ ] Health Check getestet: `https://verdrehte-welt-api.onrender.com/health`
- [ ] Checkout Flow getestet
- [ ] Admin Scanner auf Handy getestet

---

## 🎯 ORDNER-GRÖSSEN

```
website/          ~2-5 MB    (HTML, CSS, JS, Bilder)
backend/          ~500 KB    (ohne node_modules)
backend/node_modules/  ~50 MB    (wird automatisch installiert)
```

**Cloudflare Limit:** 25 MB pro Deployment (kein Problem!)  
**Render.com:** Unbegrenzt (installiert Dependencies selbst)

---

## 🔄 UPDATES SPÄTER

### Frontend aktualisieren:
```bash
# Dateien in website/ bearbeiten, dann:
cd /Users/johan/VerdrehteWeltWebsite/website
# Auf Cloudflare Pages neu hochladen
# ODER bei Git-Integration:
git add .
git commit -m "Update frontend"
git push  # → Auto-Deploy!
```

### Backend aktualisieren:
```bash
# Dateien in backend/ bearbeiten, dann:
cd /Users/johan/VerdrehteWeltWebsite
git add .
git commit -m "Update backend"
git push  # → Render.com deployed automatisch!
```

---

## 📞 DIE WICHTIGSTEN DATEIEN

### Must-Have für Deployment:

**Frontend:**
- ✅ `index.html` - MUSS im Root sein!
- ✅ `event.html` - Für Checkout
- ✅ `admin-scanner.html` - Für Check-In
- ✅ Alle `.html` Seiten
- ✅ `css/` Ordner komplett
- ✅ `js/` Ordner komplett
- ✅ `images/` Ordner komplett

**Backend:**
- ✅ `package.json` - Dependencies
- ✅ `src/server.js` - Entry Point
- ✅ `src/models/` - Alle Models
- ✅ `src/routes/` - Alle Routes
- ✅ `src/services/` - Ticket & Email Services
- ✅ `.env` Variablen (über Render Dashboard)

---

## 🎉 READY TO DEPLOY!

**Alles ist vorbereitet!**

### Deine Ordner:
1. ✅ `/Users/johan/VerdrehteWeltWebsite/website/` → Cloudflare Pages
2. ✅ `/Users/johan/VerdrehteWeltWebsite/backend/` → Render.com (via GitHub)

### Deine Anleitungen:
- 📖 `CLOUDFLARE_ANLEITUNG.md` - Komplette Deployment-Anleitung
- 📋 `ORDNER_UEBERSICHT.md` - Diese Datei (Ordner-Struktur)
- 🚀 `DEPLOYMENT_GUIDE.md` - Detaillierte Infos
- ⚡ `CLOUDFLARE_READY.md` - Schnellstart

---

**Los geht's! 🚀**

Folge der `CLOUDFLARE_ANLEITUNG.md` Schritt für Schritt!

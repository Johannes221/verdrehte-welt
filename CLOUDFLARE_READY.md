# 📦 CLOUDFLARE PAGES - FERTIG ZUM HOCHLADEN

## 🎯 Was hochladen?

**Ordner:** `/Users/johan/VerdrehteWeltWebsite/website/`

Alles in diesem Ordner kommt auf Cloudflare Pages!

---

## 📂 Enthaltene Dateien:

### HTML Seiten:
- ✅ `index.html` - Startseite mit Event-Übersicht
- ✅ `event.html` - Event-Details & Checkout
- ✅ `payment-success.html` - Erfolgs-Seite nach PayPal
- ✅ `payment-cancel.html` - Abbruch-Seite
- ✅ `agb.html` - AGB
- ✅ `datenschutz.html` - Datenschutz
- ✅ `impressum.html` - Impressum
- ✅ **`admin-scanner.html`** - QR-Scanner für Einlass 📱

### Assets:
- ✅ `css/` - Alle Styles
- ✅ `js/` - Alle Scripts
- ✅ `images/` - Logo & Bilder

---

## 🚀 UPLOAD METHODEN

### Option 1: Direct Upload (Einfachste)

1. Gehe zu: https://dash.cloudflare.com
2. → **Pages** → **Create a project**
3. → **Upload assets**
4. Wähle **GANZEN `website/` Ordner** aus
5. Drag & Drop in den Browser
6. → **Deploy**
7. ✅ Fertig!

### Option 2: ZIP Upload

```bash
cd /Users/johan/VerdrehteWeltWebsite
zip -r website-cloudflare.zip website/*
```

Dann ZIP auf Cloudflare hochladen.

### Option 3: Git (Falls du später Updates machen willst)

```bash
cd /Users/johan/VerdrehteWeltWebsite
git init
git add .
git commit -m "Initial commit"
git push origin main
```

Dann auf Cloudflare: Connect GitHub → Auto-Deploy bei jedem Push

---

## ⚙️ NACH DEM DEPLOYMENT

### 1. Backend URL eintragen

**Du bekommst:** `https://your-project.pages.dev`

**Dann musst du Backend URL in diesen Dateien ändern:**

#### In `event.html` (Zeile ~300):
```javascript
const API_BASE_URL = 'https://DEINE-BACKEND-URL.com/api/v1';
```

#### In `payment-success.html` (Zeile ~100):
```javascript
const API_BASE_URL = 'https://DEINE-BACKEND-URL.com/api/v1';
```

#### In `admin-scanner.html` (Zeile ~290):
```javascript
const API_BASE_URL = 'https://DEINE-BACKEND-URL.com/api/v1';
```

**Dann:** Website neu deployen (einfach nochmal hochladen)

### 2. Custom Domain (Optional)

1. Cloudflare Pages → **Custom domains**
2. → **Add domain**
3. Gib ein: `verdrehtewelt.de`
4. DNS wird automatisch konfiguriert
5. ✅ SSL/HTTPS automatisch

---

## 📱 ADMIN SCANNER TESTEN

Nach Deployment:
```
https://your-project.pages.dev/admin-scanner.html
```

**Login:** `verdrehtewelt2025`

**Funktioniert auf:**
- ✅ iPhone (Safari)
- ✅ Android (Chrome)
- ✅ iPad
- ✅ Desktop (Chrome, Firefox, Safari)

**Kamera-Zugriff:** Browser fragt automatisch

---

## 🔒 SICHERHEIT

### HTTPS
✅ Automatisch von Cloudflare

### Admin Scanner
- Passwort-geschützt
- JWT Token (läuft nach 24h ab)
- Kein öffentlicher Zugriff ohne Login

### API
- CORS konfiguriert
- PayPal Webhooks verifiziert (in Production)
- MongoDB mit Auth

---

## 💰 KOSTEN

**Cloudflare Pages:**
- ✅ **KOSTENLOS** (unlimited bandwidth & requests)
- ✅ Automatisches SSL
- ✅ CDN weltweit
- ✅ 500 builds/Monat gratis

**Backend (Render.com):**
- ✅ **GRATIS TIER:** 750h/Monat (reicht easy!)
- ⚠️ Geht nach 15min Inaktivität in Sleep (erste Anfrage langsam)
- 💰 $7/Monat für "Always On" (optional)

---

## ✅ DEPLOYMENT CHECKLIST

### Vor Upload:
- [x] Admin Scanner fertig
- [x] Alle HTML-Seiten funktionieren
- [x] PayPal Integration getestet
- [x] QR-Codes generiert
- [ ] Backend deployed (siehe DEPLOYMENT_GUIDE.md)

### Upload:
- [ ] `website/` Ordner auf Cloudflare hochgeladen
- [ ] Deployment erfolgreich
- [ ] URL erhalten: `https://...pages.dev`

### Nach Upload:
- [ ] Backend URL in 3 Dateien eingetragen
- [ ] Website neu deployed
- [ ] Admin Scanner getestet (auf Handy)
- [ ] Checkout Flow getestet
- [ ] Custom Domain verbunden (optional)

---

## 🆘 TROUBLESHOOTING

### "404 Not Found" auf Cloudflare
→ Stelle sicher, dass du den **INHALT** des `website/` Ordners hochlädst, nicht den Ordner selbst.
→ Die `index.html` muss im Root sein!

### Admin Scanner Kamera funktioniert nicht
→ Muss HTTPS sein (Cloudflare macht das automatisch)
→ Browser-Berechtigungen prüfen

### API Fehler im Frontend
→ Backend URL richtig eingetragen?
→ CORS konfiguriert? (sollte automatisch sein)
→ Backend läuft?

---

## 📞 SUPPORT

Bei Fragen zu:
- **Cloudflare:** https://developers.cloudflare.com/pages/
- **PayPal:** https://developer.paypal.com/docs/
- **Backend Deployment:** Siehe `DEPLOYMENT_GUIDE.md`

---

## 🎉 READY TO GO!

**Alles ist vorbereitet!** Du musst nur noch:
1. Backend neu starten
2. Tickets generieren
3. Scanner lokal testen
4. Auf Cloudflare hochladen

**That's it!** 🚀

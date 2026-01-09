# ⚙️ Cloudflare Pages Build-Konfiguration

## ❌ Problem: Build failed mit "Missing script: start"

Das passiert, weil Cloudflare Pages die falschen Build-Settings hat.

## ✅ Lösung: Korrekte Build-Settings

### Gehe zu Cloudflare Pages Dashboard:
1. https://dash.cloudflare.com
2. → Workers & Pages
3. → Dein Projekt auswählen
4. → **Settings** → **Builds & deployments**

### Setze folgende Werte:

```
Framework preset: None

Build command: (leer lassen oder: echo "Static site")

Build output directory: website

Root directory: (leer lassen)
```

### Wichtig:
- **Build command**: Leer oder `echo "Static site"` - KEIN `npm start`!
- **Build output directory**: Muss `website` sein
- Das ist eine statische Website, kein Node.js Server!

## Alternative: Direkter Upload

Wenn Git-Integration Probleme macht:

1. Cloudflare Pages → **Create application**
2. → **Pages** → **Upload assets**
3. Ziehe den **INHALT** des `website/` Ordners in das Upload-Feld
   - ⚠️ Wichtig: Die Dateien selbst, NICHT den Ordner!
   - `index.html` muss im Root sein
4. → **Deploy site**

## Verifizierung

Nach dem Deployment sollte die URL funktionieren:
- https://DEIN-PROJEKT.pages.dev

Teste:
- ✅ Startseite lädt
- ✅ Video spielt ab
- ✅ Events werden angezeigt
- ✅ Navigation funktioniert

## Backend separat!

Das **Backend** läuft auf Render.com (oder einem anderen Node.js Hosting):
- Backend-Ordner: `/backend`
- Dort gilt: `npm install` + `npm start`
- Frontend auf Cloudflare = nur statische Files!

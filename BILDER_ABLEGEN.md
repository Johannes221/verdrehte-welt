# 🖼️ WO DEINE 5 BILDER ABLEGEN?

## ✅ So geht's:

### 1. LOGO (Bild 1)
**Dein Logo/Wortmarke** → Für Header oben links

```
Speichere als:
theme/verdrehtewelt/assets/images/logo.png

Empfohlen:
- PNG mit transparentem Hintergrund
- Breite: ~200-300px
- Höhe: ~50-80px
```

### 2. EVENT-BILDER (Bilder 2, 3, 4)
**3 Event-Fotos** → Für die Event-Cards auf der Startseite

```
Speichere als:
theme/verdrehtewelt/assets/images/events/event-1.jpg
theme/verdrehtewelt/assets/images/events/event-2.jpg
theme/verdrehtewelt/assets/images/events/event-3.jpg

Empfohlen:
- Format: JPG
- Auflösung: 1920x1080px (16:9)
- Datei-Größe: < 500KB pro Bild
```

### 3. HERO-HINTERGRUNDBILD (Bild 5)
**Großes Hintergrundbild** → Für die Hero-Section (optional)

```
Speichere als:
theme/verdrehtewelt/assets/images/backgrounds/hero-bg.jpg

Empfohlen:
- Format: JPG
- Auflösung: 1920x1080px oder größer
- Datei-Größe: < 1MB
```

---

## 🚀 Nach dem Ablegen:

### Option 1: Nur Preview ansehen
```bash
# Einfach öffnen:
open preview.html

# Bilder werden automatisch geladen!
```

### Option 2: Für WordPress (Production)
```bash
# Neues ZIP bauen:
./build.sh

# Dann hochladen in WordPress:
dist/verdrehtewelt-theme.zip
```

---

## 📂 Komplette Struktur:

```
theme/verdrehtewelt/assets/images/
├── logo.png                    ← BILD 1: Logo
├── events/
│   ├── event-1.jpg            ← BILD 2: Event-Foto 1
│   ├── event-2.jpg            ← BILD 3: Event-Foto 2
│   └── event-3.jpg            ← BILD 4: Event-Foto 3
└── backgrounds/
    └── hero-bg.jpg            ← BILD 5: Hero-Hintergrund
```

---

## 💡 Tipps:

**Optimiere deine Bilder:**
- Verwende tools wie tinypng.com
- Komprimiere auf < 500KB pro Bild
- Verwende JPG für Fotos, PNG für Logo

**Benenne die Dateien GENAU so:**
- `logo.png` (nicht Logo.PNG oder logo.jpg)
- `event-1.jpg` (nicht event1.jpg oder Event-1.JPG)

---

**Bereit?** Bilder ablegen → `./build.sh` → Hochladen! 🎨

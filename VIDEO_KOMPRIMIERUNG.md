# 🎥 Video-Komprimierung für Cloudflare Pages

## Problem
`aftermovie 1.mp4` ist 39MB groß, aber Cloudflare Pages erlaubt max. 25MB pro Datei.

## Lösung 1: FFmpeg installieren & komprimieren (empfohlen)

### FFmpeg installieren (macOS):
```bash
brew install ffmpeg
```

Falls Homebrew nicht installiert ist:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Video komprimieren (gute Qualität):
```bash
cd /Users/johan/VerdrehteWeltWebsite/website/videos

# Ziel: ~20MB (unter dem Limit mit Puffer)
ffmpeg -i "aftermovie 1.mp4" \
  -vcodec libx264 \
  -crf 28 \
  -preset slow \
  -vf "scale=-2:720" \
  -acodec aac \
  -b:a 128k \
  -movflags +faststart \
  "aftermovie-compressed.mp4"
```

**Parameter erklärt:**
- `-crf 28`: Qualität (18-28 ist gut, höher = kleiner)
- `-vf "scale=-2:720"`: Auf 720p skalieren
- `-preset slow`: Bessere Kompression
- `-movflags +faststart`: Streaming-optimiert
- `-b:a 128k`: Audio-Bitrate

### Qualität testen:
```bash
# Größe prüfen
ls -lh aftermovie-compressed.mp4

# Video ansehen und Qualität checken
open aftermovie-compressed.mp4
```

Falls zu groß (über 24MB), erhöhe CRF auf 30:
```bash
ffmpeg -i "aftermovie 1.mp4" -vcodec libx264 -crf 30 -preset slow -vf "scale=-2:720" -acodec aac -b:a 128k -movflags +faststart "aftermovie-compressed.mp4"
```

### Datei ersetzen:
```bash
mv "aftermovie-compressed.mp4" "aftermovie 1.mp4"
```

---

## Lösung 2: Online-Tool nutzen (keine Installation)

### Empfohlene Tools:
1. **HandBrake** (kostenlos, GUI)
   - Download: https://handbrake.fr
   - Preset: "Web" → "Discord Nitro Large"
   - Ziel-Größe: 20MB

2. **CloudConvert** (online)
   - https://cloudconvert.com/mp4-converter
   - Format: MP4 (H.264)
   - Qualität: Medium-High
   - Max. Größe: 20MB

3. **Clipchamp** (Microsoft, kostenlos)
   - https://clipchamp.com
   - Export-Qualität: 720p
   - Bitrate manuell reduzieren

---

## Lösung 3: Video extern hosten (keine Komprimierung)

Falls du die Original-Qualität behalten willst:

### Option A: Cloudinary (kostenlos bis 25GB)
1. Account: https://cloudinary.com
2. Video hochladen
3. Embedded URL kopieren
4. In `index.html` ersetzen:
```html
<source src="https://res.cloudinary.com/DEIN-ACCOUNT/video/upload/aftermovie-1.mp4" type="video/mp4">
```

### Option B: Vimeo (kostenlos)
1. Video auf Vimeo hochladen
2. Embed-Code kopieren
3. In HTML einbinden

### Option C: YouTube (kostenlos)
- Unlisted hochladen
- Embed-Code verwenden

---

## Nach der Komprimierung

### In HTML aktualisieren (falls umbenannt):
```javascript
// Falls du es "aftermovie-compressed.mp4" nennst
<source src="videos/aftermovie-compressed.mp4" type="video/mp4">
```

### Git commit:
```bash
cd /Users/johan/VerdrehteWeltWebsite
git add website/videos/
git commit -m "feat: compress aftermovie video to under 25MB"
git push
```

---

## Qualitäts-Vergleich

| Methode | Größe | Qualität | Empfehlung |
|---------|-------|----------|------------|
| CRF 28, 720p | ~18-22MB | ⭐⭐⭐⭐ Sehr gut | ✅ Empfohlen |
| CRF 30, 720p | ~14-18MB | ⭐⭐⭐ Gut | ✅ Falls CRF 28 zu groß |
| CRF 28, 480p | ~10-14MB | ⭐⭐ OK | Nur wenn nötig |
| Extern hosten | Original | ⭐⭐⭐⭐⭐ Perfekt | ✅ Für beste Qualität |

---

## Meine Empfehlung

**Für schnellste Lösung:**
```bash
brew install ffmpeg
cd /Users/johan/VerdrehteWeltWebsite/website/videos
ffmpeg -i "aftermovie 1.mp4" -vcodec libx264 -crf 28 -preset slow -vf "scale=-2:720" -acodec aac -b:a 128k -movflags +faststart "aftermovie 1.mp4.tmp"
mv "aftermovie 1.mp4.tmp" "aftermovie 1.mp4"
ls -lh "aftermovie 1.mp4"
```

Qualität bleibt sehr gut bei 720p! 🎬

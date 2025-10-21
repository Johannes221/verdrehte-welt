# Bilder-Struktur

## 📁 Bildordner

### `/logo/`
- **logo.png** oder **logo.svg** - Hauptlogo für Header (transparent)
- Verwendung: Oben links im Header

### `/events/`
Event-Bilder für die Event-Cards:
- **event-1.jpg** - Erstes Event (z.B. Mühlbachhalle)
- **event-2.jpg** - Zweites Event (z.B. Warehouse)
- **event-3.jpg** - Drittes Event (z.B. Rooftop)
- Empfohlene Größe: 1920x1080px (16:9)

### `/backgrounds/`
Hintergrundbilder:
- **hero-bg.jpg** - Hero-Section Hintergrund
- **pattern.png** - Muster/Textur (optional)

---

## 🎨 Wie Bilder ablegen:

1. **Logo:**
   ```
   theme/verdrehtewelt/assets/images/logo.png
   ```

2. **Event-Bilder:**
   ```
   theme/verdrehtewelt/assets/images/events/event-1.jpg
   theme/verdrehtewelt/assets/images/events/event-2.jpg
   theme/verdrehtewelt/assets/images/events/event-3.jpg
   ```

3. **Hintergrund:**
   ```
   theme/verdrehtewelt/assets/images/backgrounds/hero-bg.jpg
   ```

---

## ✅ Nach dem Ablegen:

```bash
# Neues ZIP bauen:
./build.sh

# Dann in WordPress hochladen!
```

# 🏠 Lokales Development Setup

## 🚀 Schnellstart (3 Befehle)

```bash
# 1. Docker Container starten
docker-compose up -d

# 2. Warte 30 Sekunden, dann öffne:
open http://localhost:8080

# 3. WordPress installieren (einmalig):
# - Sprache: Deutsch
# - Site-Titel: Verdrehte Welt
# - Benutzername: admin
# - Passwort: (sicheres Passwort wählen)
# - Email: deine@email.de
```

**Fertig!** WordPress läuft lokal auf deinem Mac.

---

## 📍 Wichtige URLs

- **Website:** http://localhost:8080
- **Admin:** http://localhost:8080/wp-admin
- **phpMyAdmin:** http://localhost:8081 (für Datenbank)

---

## ⚙️ Theme aktivieren

```bash
# 1. Gehe zu Admin
http://localhost:8080/wp-admin

# 2. Design → Themes
# 3. "Verdrehte Welt" Theme aktivieren
```

**Das Theme ist bereits gemountet!** Alle Änderungen im `theme/` Ordner werden sofort sichtbar.

---

## 🔧 Wichtige Befehle

```bash
# Container starten
docker-compose up -d

# Container stoppen
docker-compose down

# Container neustarten
docker-compose restart

# Logs ansehen
docker-compose logs -f wordpress

# Alles löschen (inkl. Datenbank!)
docker-compose down -v
```

---

## 🎨 Development Workflow

### 1. Code ändern
```bash
# Ändere Dateien in theme/verdrehtewelt/
# z.B. style.css, functions.php, templates/

# Änderungen sind SOFORT sichtbar (kein Build nötig!)
```

### 2. Browser aktualisieren
```bash
# Einfach F5 oder Cmd+R
# Theme-Änderungen werden direkt geladen
```

### 3. Git Commit
```bash
git add .
git commit -m "Design angepasst"
git push
```

---

## 🐛 Troubleshooting

### Port 8080 bereits belegt?
```bash
# Ändere Port in docker-compose.yml:
ports:
  - "8888:80"  # Statt 8080

# Dann: http://localhost:8888
```

### Theme nicht sichtbar?
```bash
# Container neustarten
docker-compose restart wordpress

# Theme-Ordner prüfen
ls -la theme/verdrehtewelt/
```

### Datenbank zurücksetzen?
```bash
# Alles löschen und neu starten
docker-compose down -v
docker-compose up -d

# WordPress neu installieren (siehe oben)
```

### PayPal testen?
```bash
# Verwende Sandbox-Modus in den Einstellungen
# Erstelle Test-Accounts auf developer.paypal.com
```

---

## 📦 Produktions-Build erstellen

```bash
# ZIP für WordPress-Upload erstellen
./build.sh

# Datei liegt dann in: dist/verdrehtewelt-theme.zip
```

---

## 🔄 GitHub Sync

```bash
# Änderungen pushen
git add .
git commit -m "Deine Nachricht"
git push

# Vom Remote pullen
git pull
```

---

## 💡 Tipps

### Quick Reload
- **CSS-Änderungen:** Einfach Browser refreshen
- **PHP-Änderungen:** Browser refreshen (WordPress lädt automatisch neu)
- **Theme-Aktivierung:** Nur einmal nötig nach erstem Start

### Debug-Modus
WordPress Debug ist bereits aktiviert (`WORDPRESS_DEBUG: 1`).  
Fehler werden direkt im Browser angezeigt.

### Datenbank ansehen
Öffne http://localhost:8081 (phpMyAdmin)
- Server: db
- Benutzer: wordpress
- Passwort: wordpress

---

## 🎯 Typischer Workflow

```bash
# Morning: Start
docker-compose up -d
open http://localhost:8080

# Work: Code ändern
# → theme/verdrehtewelt/ Dateien bearbeiten
# → Browser refreshen
# → Testen

# Commit
git add .
git commit -m "Feature XY hinzugefügt"
git push

# Evening: Stop (optional)
docker-compose down
```

---

**Viel Spaß beim Entwickeln! 🚀**

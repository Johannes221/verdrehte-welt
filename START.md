# 🚀 ALLES FERTIG! So geht's weiter:

## ✅ Was bereits erledigt ist:

1. ✅ **GitHub-Verbindung hergestellt**
   - Repository: https://github.com/Johannes221/verdrehte-welt
   - Erster Commit gepusht
   - Alle Dateien sind online

2. ✅ **Theme fertig entwickelt**
   - Installationsdatei: `dist/verdrehtewelt-theme.zip`
   - Alle Features implementiert

3. ✅ **Docker-Setup vorbereitet**
   - `docker-compose.yml` erstellt
   - Bereit für lokales Testing

---

## 🏠 Lokales Setup (WordPress mit Docker)

### Schritt 1: Docker Desktop installieren (falls nicht vorhanden)

```bash
# Prüfe ob Docker läuft:
docker --version

# Falls nicht installiert:
# → Gehe zu: https://www.docker.com/products/docker-desktop
# → Lade "Docker Desktop for Mac" herunter
# → Installiere es
# → Starte Docker Desktop
```

### Schritt 2: WordPress lokal starten

```bash
# Im Projekt-Ordner:
cd /Users/johan/VerdrehteWeltWebsite

# Docker Container starten (dauert beim ersten Mal 1-2 Minuten):
docker-compose up -d

# Warte 30 Sekunden, dann öffne:
open http://localhost:8080
```

### Schritt 3: WordPress einrichten (nur einmal)

1. Öffne: http://localhost:8080
2. Wähle Sprache: **Deutsch**
3. Klicke **Los geht's!**
4. WordPress installieren:
   - Site-Titel: **Verdrehte Welt**
   - Benutzername: **admin**
   - Passwort: **(sicheres Passwort)**
   - Email: **deine@email.de**
   - **WordPress installieren**

### Schritt 4: Theme aktivieren

1. Login: http://localhost:8080/wp-admin
2. **Design → Themes**
3. **"Verdrehte Welt" aktivieren**

**FERTIG!** 🎉

---

## 🎯 Lokaler Development-Workflow

### Code ändern → Testen

```bash
# 1. Datei bearbeiten (z.B. in Windsurf/VS Code):
theme/verdrehtewelt/assets/css/main.css

# 2. Browser refreshen (Cmd+R oder F5)
# → Änderungen sind SOFORT sichtbar!

# 3. Zufrieden? → Git Commit:
git add .
git commit -m "Design angepasst"
git push
```

### Wichtige URLs (lokal)

- **Website:** http://localhost:8080
- **Admin:** http://localhost:8080/wp-admin
- **Datenbank:** http://localhost:8081 (phpMyAdmin)
  - User: wordpress
  - Pass: wordpress

---

## 📝 Erstes Test-Event erstellen

```
1. Login: http://localhost:8080/wp-admin

2. Events → Neues Event

3. Titel: "Verdrehte Welt @Mühlbachhalle"

4. Event-Details:
   - Datum: 25.10.2025
   - Zeit Start: 21:00
   - Zeit Ende: 05:00
   - Location: Mühlbachhalle Dossenheim
   - Adresse: Am Sportpl. 1, 69221 Dossenheim
   - Genres: Hard Techno / Melodic Techno / Dark Techno

5. Ticket-Einstellungen:
   - Early Bird: 8 € (bis 20.10.2025 23:59)
   - Regular: 10 € (bis 25.10.2025 20:00)
   - Abendkasse: 12 €

6. Beitragsbild hochladen

7. Veröffentlichen

8. Gehe zu: http://localhost:8080
```

---

## 🔧 Nützliche Befehle

```bash
# Container starten
docker-compose up -d

# Container stoppen
docker-compose down

# Logs ansehen
docker-compose logs -f

# Container neustarten
docker-compose restart

# ZIP für Production bauen
./build.sh
```

---

## 🐛 Troubleshooting

### "docker-compose: command not found"
→ Docker Desktop installieren (siehe oben)

### Port 8080 bereits belegt?
→ Ändere in `docker-compose.yml`: `ports: - "8888:80"`

### Theme nicht sichtbar?
→ `docker-compose restart wordpress`

### Datenbank zurücksetzen?
→ `docker-compose down -v` (löscht alles!)

---

## 📦 Produktions-Deployment

### Option 1: ZIP hochladen (manuell)
```bash
# 1. ZIP bauen
./build.sh

# 2. In WordPress hochladen:
Design → Themes → Theme hochladen
→ dist/verdrehtewelt-theme.zip
```

### Option 2: Per FTP/SFTP
```bash
# Theme-Ordner direkt hochladen:
theme/verdrehtewelt/ → wp-content/themes/verdrehtewelt/
```

---

## 🎨 Was du jetzt testen kannst:

- [ ] WordPress lokal starten
- [ ] Theme aktivieren
- [ ] Erstes Event erstellen
- [ ] Design anschauen
- [ ] Ticket-Kauf testen (Formular)
- [ ] PayPal konfigurieren (später)
- [ ] CSS anpassen
- [ ] Git pushen

---

## 💡 Quick Tips

### Schnelles Testen ohne Docker?
→ Nutze `dist/verdrehtewelt-theme.zip` und lade es in deine Live-/Test-WordPress-Installation hoch

### Design anpassen?
→ `theme/verdrehtewelt/assets/css/main.css` bearbeiten

### Texte ändern?
→ Templates in `theme/verdrehtewelt/*.php`

### PayPal konfigurieren?
→ Admin → Bestellungen → Einstellungen

---

## 🚀 NEXT STEPS:

1. **Docker Desktop installieren** (falls noch nicht)
2. **`docker-compose up -d`** ausführen
3. **http://localhost:8080** öffnen
4. **WordPress installieren**
5. **Theme aktivieren**
6. **Erstes Event erstellen**
7. **Testen & Feedback geben!**

---

**Bereit zum Loslegen!** 🎉

Bei Fragen: Einfach hier melden!

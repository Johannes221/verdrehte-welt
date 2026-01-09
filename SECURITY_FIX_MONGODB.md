# 🚨 DRINGEND: MongoDB Credentials rotieren

## Was ist passiert?

MongoDB hat entdeckt, dass deine Datenbank-Credentials **öffentlich auf GitHub** waren.
Diese wurden in der Datei `RENDER_ENVIRONMENT_VARIABLES.md` committed.

## ⚠️ Sofortige Maßnahmen (WICHTIG!)

### Schritt 1: MongoDB Passwort ändern (JETZT!)

1. Gehe zu: **https://cloud.mongodb.com/v2/68fb5b874ea9c74ebf7df9c5#/security/database**
2. Login mit deinem MongoDB Atlas Account
3. Finde den User: `verdrehteweltev_db_user`
4. Klicke **"Edit"** → **"Edit Password"**
5. Generiere ein **neues, sicheres Passwort** (z.B. 32 Zeichen)
6. **KOPIERE das neue Passwort sofort!**

### Schritt 2: Connection String aktualisieren

Das neue Connection String Format:
```
mongodb+srv://verdrehteweltev_db_user:<NEUES_PASSWORT>@cluster0.o3skdqm.mongodb.net/verdrehte-welt?retryWrites=true&w=majority
```

Ersetze `<NEUES_PASSWORT>` mit deinem neuen Passwort.

### Schritt 3: Render Environment Variable aktualisieren

1. Gehe zu: **https://dashboard.render.com**
2. Wähle dein Backend-Service
3. Klicke **"Environment"**
4. Finde `MONGODB_URI`
5. Klicke **"Edit"**
6. Setze den neuen Connection String ein
7. Klicke **"Save Changes"**

**⚠️ Render deployed automatisch neu - deine App bleibt ONLINE!**

### Schritt 4: Lokale .env Datei aktualisieren

Öffne: `/Users/johan/VerdrehteWeltWebsite/backend/.env`

Ändere Zeile 7:
```bash
MONGODB_URI=mongodb+srv://verdrehteweltev_db_user:<NEUES_PASSWORT>@cluster0.o3skdqm.mongodb.net/verdrehte-welt?retryWrites=true&w=majority
```

### Schritt 5: Lokalen Backend-Server neu starten

```bash
cd /Users/johan/VerdrehteWeltWebsite/backend
# Stoppe den laufenden Server (Ctrl+C)
npm start
```

---

## ✅ Nach der Rotation

### Prüfen ob alles funktioniert:

1. **Render Deploy Status:**
   - Warte bis "Live" im Render Dashboard
   - Prüfe Logs auf Fehler

2. **Website testen:**
   - Öffne: https://verdrehte-welt.com
   - Versuche eine Test-Bestellung
   - Prüfe ob Tickets ankommen

3. **Admin-Login testen:**
   - Öffne: https://verdrehte-welt.com/admin
   - Login sollte funktionieren

---

## 🔒 Zusätzliche Sicherheitsmaßnahmen (empfohlen)

### 1. IP Whitelist aktivieren

MongoDB Atlas → Network Access:
- Füge nur Render IPs hinzu
- Entferne `0.0.0.0/0` (alle IPs)

### 2. Andere Credentials auch rotieren (optional)

Falls du auf Nummer sicher gehen willst:
- PayPal Client Secret neu generieren
- JWT_SECRET ändern
- ADMIN_PASSWORD ändern
- Resend API Key neu generieren

### 3. Git History bereinigen (bereits erledigt)

Ich habe die Credentials aus der Datei entfernt und committed.
Die alten Credentials sind aber noch in der Git-History.

**Um die History komplett zu bereinigen:**
```bash
# WARNUNG: Ändert Git History - nur machen wenn du weißt was du tust!
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch RENDER_ENVIRONMENT_VARIABLES.md" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

---

## ❌ Was du NICHT tun solltest

- ❌ MongoDB User löschen (dann crasht die App!)
- ❌ Alte Credentials in Render lassen
- ❌ Secrets in öffentliche Dateien schreiben

---

## 📝 Checklist

- [ ] Neues MongoDB Passwort generiert
- [ ] MONGODB_URI in Render aktualisiert
- [ ] MONGODB_URI in lokaler .env aktualisiert
- [ ] Lokalen Backend-Server neu gestartet
- [ ] Render Deploy erfolgreich (Status: Live)
- [ ] Website funktioniert
- [ ] Test-Bestellung funktioniert
- [ ] Admin-Login funktioniert

---

## ℹ️ Warum ist das passiert?

Die Datei `RENDER_ENVIRONMENT_VARIABLES.md` wurde mit echten Credentials committed.
Auch wenn `.env` Dateien in `.gitignore` sind, war diese Markdown-Datei nicht geschützt.

**Lesson learned:** Niemals echte Credentials in Dateien committen, die in Git getrackt werden!

---

## 🆘 Probleme?

Falls nach der Rotation etwas nicht funktioniert:

1. **MongoDB Connection Error:**
   - Prüfe ob Passwort richtig kopiert (keine Leerzeichen!)
   - Prüfe ob Connection String richtig formatiert

2. **App startet nicht:**
   - Prüfe Render Logs
   - Prüfe lokale Backend-Logs

3. **Immer noch unsicher?**
   - Erstelle einen neuen MongoDB User
   - Lösche den alten User danach

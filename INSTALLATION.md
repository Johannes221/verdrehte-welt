# 🚀 VERDREHTE WELT - INSTALLATION (3 SCHRITTE)

**Alles ist vorbereitet. Du musst nur 2 Dateien hochladen!**

---

## 📦 Was du hochladen musst:

1. **`dist/verdrehtewelt-theme.zip`** (1.99 MB) - Das WordPress-Theme
2. **`verdrehte-welt-content.xml`** (18 KB) - Alle Events & Seiten

---

## ✨ SCHRITT 1: Theme hochladen (2 Minuten)

### In WordPress:
1. Gehe zu **Design → Themes**
2. Klicke auf **"Theme hochladen"** (oben)
3. Wähle die Datei `dist/verdrehtewelt-theme.zip`
4. Klicke **"Jetzt installieren"**
5. Klicke **"Aktivieren"**

**✅ Fertig!** Das Theme ist jetzt aktiv.

---

## 📥 SCHRITT 2: Events & Seiten importieren (1 Minute)

### In WordPress:
1. Gehe zu **Werkzeuge → Daten importieren**
2. Klicke bei "WordPress" auf **"Importer ausführen"**
   - Falls du das erste Mal importierst, klicke **"Jetzt installieren"**, dann **"Importer ausführen"**
3. Klicke **"Datei auswählen"**
4. Wähle die Datei `verdrehte-welt-content.xml`
5. Klicke **"Datei hochladen und importieren"**
6. Bei "Autor zuweisen": Wähle deinen Admin-Account aus
7. **WICHTIG:** Haken setzen bei **"Anhänge herunterladen und importieren"**
8. Klicke **"Absenden"**

**✅ Fertig!** Jetzt hast du:
- ✅ 2 Events (Rave in Dossenheim + Tages-Rave in der Leitstelle)
- ✅ Impressum-Seite
- ✅ Datenschutz-Seite
- ✅ AGB-Seite

---

## 🔧 SCHRITT 3: PayPal konfigurieren (1 Minute)

### In WordPress:
1. Gehe zu **Bestellungen → Einstellungen** (in der linken Sidebar)
2. Trage ein:
   - **PayPal Client ID:** `AbO0cKQTssHyVqyiUz406lZKxv6n2eM07r7I_-6dcP8ychycIbZapVQUyT68x4SDqHYIi1Uwkmz0tfDP`
   - **PayPal Secret:** `EIC7nyRnnWMMOqTKKxo7oIUGTEGzFMM30phf0nwei5bdxZRWhrCqUwKF2mZSeDcFBnCPXYvsdn8-nSrt`
   - **Modus:** Wähle **"Sandbox"** (für Tests)
3. Klicke **"Änderungen speichern"**

**✅ Fertig!** PayPal ist jetzt konfiguriert.

---

## 🎨 SCHRITT 4 (Optional): Event-Bilder hochladen

### Warum?
Die Events haben aktuell Platzhalter-Bilder. Du kannst echte Bilder hochladen.

### So geht's:
1. Gehe zu **Events → Alle Events**
2. Klicke auf **"Rave in Dossenheim"**
3. Scrolle runter zu **"Beitragsbild"** (rechte Sidebar)
4. Klicke **"Beitragsbild festlegen"**
5. Lade dein Event-Bild hoch (z.B. `pictures/verdrehte-welt.jpg`)
6. Klicke **"Beitragsbild festlegen"**
7. Klicke **"Aktualisieren"** (oben rechts)

**Empfohlene Bildgröße:** 1920x1080px (Querformat)

---

## ✅ FERTIG! Deine Website ist jetzt live!

### Was funktioniert jetzt:
- ✅ Homepage mit Event-Übersicht
- ✅ 2 Events mit allen Details
- ✅ Ticket-Verkauf über PayPal (Sandbox-Modus)
- ✅ QR-Code-Generierung
- ✅ Email-Versand (nach Kauf)
- ✅ Impressum, Datenschutz, AGB
- ✅ Responsive Design (Mobile + Desktop)

---

## 🧪 TESTEN (Sandbox-Modus)

### So testest du den Ticket-Kauf:

1. Öffne deine Website
2. Klicke auf **"Rave in Dossenheim"**
3. Klicke auf **"Early Bird" → "Auswählen"**
4. Fülle das Formular aus (beliebige Email)
5. Klicke **"Weiter zur Zahlung"**
6. **PayPal Login (Sandbox):**
   - Email: `sb-jtjtm46797165@business.example.com`
   - Passwort: `Ny>7an|<`
7. Bestätige die Zahlung

**Was passiert:**
- Du bekommst eine Email mit dem QR-Code-Ticket
- Im WordPress-Admin siehst du die Bestellung unter **Bestellungen**

---

## 🚀 LIVE SCHALTEN (Echte Zahlungen)

### Wenn alles funktioniert:

1. Gehe zu **Bestellungen → Einstellungen**
2. Ändere **Modus** von "Sandbox" auf **"Live"**
3. Trage deine **echten PayPal API-Keys** ein (von developer.paypal.com)
4. Klicke **"Änderungen speichern"**

**⚠️ Wichtig:** Im Live-Modus gehen echte Zahlungen auf dein PayPal-Konto!

---

## 📝 Was du noch machen musst:

### Rechtliche Texte anpassen
Die importierten Seiten (Impressum, Datenschutz, AGB) haben Platzhalter-Texte.

**Bitte ergänze:**
1. Gehe zu **Seiten → Alle Seiten**
2. Bearbeite **"Impressum"**:
   - Trage deinen Namen ein
   - Trage deine Adresse ein
   - Klicke **"Aktualisieren"**
3. Lass Datenschutz & AGB von einem Anwalt prüfen!

---

## 🆘 Probleme?

### Theme sieht komisch aus?
- Lösung: Cache leeren (Strg+F5 im Browser)

### Events werden nicht angezeigt?
- Lösung: Gehe zu **Einstellungen → Permalinks** → Klicke **"Änderungen speichern"** (ohne was zu ändern)

### Email-Versand funktioniert nicht?
- WordPress `wp_mail()` ist manchmal unzuverlässig
- Lösung: Plugin **"WP Mail SMTP"** installieren (kostenlos)

### PayPal-Button erscheint nicht?
- Prüfe, ob Client ID & Secret richtig eingetragen sind
- Browser-Konsole öffnen (F12) → Fehler anschauen

---

## 📸 Was in der XML-Datei drin ist:

✅ **Event 1: Rave in Dossenheim**
- Datum: 25.10.2025, 21:00 – 05:00
- Location: Im Weiher, 69121 Heidelberg
- Genres: Hard Techno / Melodic Techno / Dark Techno
- Tickets: Early Bird 8€ (bis 22.10.), Abendkasse 12€
- Kontingent: 150 Tickets

✅ **Event 2: Tages-Rave in der Leitstelle**
- Datum: 20.12.2025, 14:00 – 23:00
- Location: Leitstelle Heidelberg, Emil-Julius-Gumbel-Platz 1
- Genres: Hard Techno / Dark Techno / Melodic Techno / Schranz
- Status: "Coming Soon" (keine Tickets verfügbar)

✅ **Seiten:**
- Impressum (mit Platzhaltern)
- Datenschutz (Basis-Version)
- AGB (Basis-Version)

---

## 🎯 Zusammenfassung

**Du musst nur:**
1. ✅ `dist/verdrehtewelt-theme.zip` hochladen → **Aktivieren**
2. ✅ `verdrehte-welt-content.xml` importieren → **Alles ist drin**
3. ✅ PayPal-Keys eintragen → **Fertig!**

**Das war's!** 🎉

Deine Website ist jetzt komplett fertig und du kannst Tickets verkaufen!

---

**Bei Fragen:** info@verdrehtewelt.de

**Viel Erfolg! 🔊🎵**

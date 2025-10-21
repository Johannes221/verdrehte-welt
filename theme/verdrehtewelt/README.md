# Verdrehte Welt WordPress Theme

Techno Events WordPress Theme mit integriertem Ticketing-System.

## Features

- ✅ Responsive Design (All Black mit weißer Schrift)
- ✅ Event Custom Post Type
- ✅ Ticket-Verkauf mit 3 Typen (Early Bird, Regular, Abendkasse)
- ✅ PayPal-Integration (direkt auf dein Konto)
- ✅ QR-Code-Generierung (JWT-signiert)
- ✅ Email-Versand mit Tickets
- ✅ Admin-Interface für Ticket-Scanning
- ✅ Einfache Verwaltung

## Installation

1. **ZIP hochladen:**
   - WordPress Admin → Design → Themes → Theme hinzufügen
   - "Theme hochladen" → `verdrehtewelt.zip` auswählen
   - "Jetzt installieren" → "Aktivieren"

2. **Datenbank-Tabellen:**
   - Werden automatisch bei Theme-Aktivierung erstellt

3. **PayPal konfigurieren:**
   - WordPress Admin → Bestellungen → Einstellungen
   - PayPal Client ID & Secret eintragen
   - Modus wählen (Sandbox für Tests, Live für Production)

## PayPal Setup

### 1. PayPal Developer Account
- Gehe zu: https://developer.paypal.com
- Login mit deinem PayPal-Account

### 2. App erstellen
- My Apps & Credentials → Create App
- App-Name: "Verdrehte Welt"
- App-Typ: "Merchant"

### 3. Credentials kopieren
- **Sandbox:** Für Tests
  - Client ID kopieren
  - Secret kopieren
  - In WordPress unter "Einstellungen" eintragen
  - Modus: "Sandbox"

- **Live:** Für echte Zahlungen
  - Auf "Live" umschalten
  - Live Client ID & Secret kopieren
  - In WordPress eintragen
  - Modus: "Live"

## Verwendung

### Events erstellen

1. WordPress Admin → Events → Neues Event
2. Titel, Beschreibung, Bild hinzufügen
3. **Event-Details:**
   - Datum & Uhrzeit
   - Location & Adresse
   - Genres (z.B. "Hard Techno / Melodic Techno")

4. **Ticket-Einstellungen:**
   - **Early Bird:** Preis + Verfügbar bis (Datum/Zeit)
   - **Regular:** Preis + Verfügbar bis
   - **Abendkasse:** Nur Preis (immer verfügbar)

5. Veröffentlichen

### Tickets verwalten

- **Bestellungen:** Admin → Bestellungen
  - Übersicht aller Orders
  - Status: offen, pending, paid

- **Ticket Scanner:** Admin → Bestellungen → Ticket Scanner
  - QR-Code eingeben oder scannen
  - Ticket prüfen
  - Einchecken

## Theme anpassen

### Logo ändern
- Ersetze das Logo im Header
- Oder: Design → Customizer → Site Identity

### Farben anpassen
- `assets/css/main.css` → CSS-Variablen
- `:root { --color-bg: #000000; --color-fg: #ffffff; }`

### Navigation
- Design → Menüs
- Erstelle Menü für "Primary Menu"

## Wichtige Seiten erstellen

Erstelle folgende Seiten manuell:
- **Impressum** (Slug: `impressum`)
- **Datenschutz** (Slug: `datenschutz`)
- **AGB** (Slug: `agb`)
- **Kontakt** (Slug: `kontakt`)

## Troubleshooting

### Keine Emails werden versendet
- SMTP-Plugin installieren (z.B. "WP Mail SMTP")
- SMTP-Server konfigurieren

### PayPal-Fehler
- Prüfe: Credentials korrekt?
- Prüfe: Richtiger Modus (Sandbox vs. Live)?
- Prüfe: PayPal-App ist "Live" geschaltet?

### Tickets werden nicht generiert
- Prüfe: Order-Status ist "paid"?
- Prüfe: PHP-Error-Log in `/wp-content/debug.log`

### QR-Codes funktionieren nicht
- Prüfe: JWT Secret vorhanden? (Auto-generiert)
- Prüfe: Scanner-Page hat Admin-Rechte?

## Support

Bei Fragen oder Problemen:
- Email: info@verdrehtewelt.de
- Instagram: @verdrehtewelt

## Updates

Um das Theme zu aktualisieren:
1. Neues ZIP-File generieren
2. Altes Theme deaktivieren (NICHT löschen!)
3. Neues ZIP hochladen & aktivieren
4. Datenbank bleibt erhalten

## Technische Details

- **PHP:** 8.0+
- **WordPress:** 6.0+
- **Datenbank:** Custom Tables (MySQL)
- **PayPal:** REST API v2
- **QR:** JWT (HS256)
- **Email:** wp_mail()

## Sicherheit

- ✅ Nonces für Forms
- ✅ Sanitize/Escape für alle Inputs
- ✅ Prepared Statements für DB
- ✅ JWT-signierte QR-Codes
- ✅ PayPal Webhook-Verifikation (Basic)

## Credits

Entwickelt für Verdrehte Welt - Techno Events in Heidelberg, Mannheim und Umgebung.

---

**Version:** 1.0.0  
**Letzte Aktualisierung:** 2025

# 📧 Resend Domain-Verifizierung

## Problem
Resend erlaubt im kostenlosen Plan nur E-Mails an deine eigene registrierte E-Mail-Adresse.
Um E-Mails an andere Empfänger (z.B. `verdrehte.welt.ev@gmail.com`) zu senden, musst du eine Domain verifizieren.

## ✅ Lösung: Domain bei Resend verifizieren

### Option 1: Eigene Domain nutzen (empfohlen)

**Schritt 1: Domain bei Resend hinzufügen**
1. Gehe zu: **https://resend.com/domains**
2. Login mit deinem Account
3. Klicke **"Add Domain"**
4. Gib deine Domain ein (z.B. `verdrehtewelt.de` oder `verdrehte-welt.com`)

**Schritt 2: DNS-Einträge setzen**
Resend zeigt dir DNS-Einträge, die du bei deinem Domain-Provider (z.B. Cloudflare, Namecheap, etc.) hinzufügen musst:

```
TXT  @  "resend-verification=abc123..."
CNAME mail  resend.email
MX   @  mx.resend.email  (Priorität: 10)
```

Bei deinem Domain-Provider:
- Gehe zu DNS-Einstellungen
- Füge die Einträge genau so hinzu
- Warte 5-10 Minuten (DNS-Propagation)

**Schritt 3: Verifizierung abschließen**
- Zurück zu Resend → "Verify Domain"
- Status sollte "Verified" ✅ sein

**Schritt 4: `.env` aktualisieren**
```bash
MAIL_FROM=noreply@verdrehtewelt.de
INTERNAL_NOTIFICATION_EMAIL=verdrehte.welt.ev@gmail.com
```

---

### Option 2: Subdomain nutzen (falls keine eigene Domain)

Falls du keine eigene Domain hast:
1. Nutze eine kostenlose Subdomain (z.B. über Netlify, Vercel)
2. Oder: Kaufe eine günstige Domain (ca. 10€/Jahr bei Namecheap)

**Empfehlung**: `verdrehtewelt.de` oder `verdrehte-welt.com`

---

### Option 3: Temporär eigene E-Mail nutzen (für Tests)

**Aktuelle Lösung** (bereits gesetzt):
```bash
INTERNAL_NOTIFICATION_EMAIL=johannes.schartl@gmail.com
```

**Vorteil**: Funktioniert sofort
**Nachteil**: Interne Mails gehen an dich, nicht an verdrehte.welt.ev@gmail.com

---

## Resend Pläne

| Plan | Preis | E-Mails/Monat | An beliebige Empfänger |
|------|-------|---------------|------------------------|
| Free | 0€ | 3.000 | ❌ Nur eigene E-Mail |
| Pro | $20/Monat | 50.000 | ✅ Nach Domain-Verifizierung |

---

## Nächste Schritte

1. **Jetzt testen**: Mit `johannes.schartl@gmail.com` als interner E-Mail
2. **Domain verifizieren**: Folge Option 1 oben
3. **Produktion**: Setze `INTERNAL_NOTIFICATION_EMAIL=verdrehte.welt.ev@gmail.com`

---

## Test durchführen

```bash
cd /Users/johan/VerdrehteWeltWebsite/backend
node test-internal-email.js
```

Danach prüfe dein Gmail (johannes.schartl@gmail.com) - du solltest beide E-Mails erhalten!

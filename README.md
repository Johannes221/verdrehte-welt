# Verdrehte Welt - Techno Events Website

Standalone Website mit vollständigem PayPal-Ticketing-System für Verdrehte Welt Events in Heidelberg & Mannheim.

## Projekt-Übersicht

**Frontend:** Statische HTML/CSS/JavaScript Website  
**Backend:** Node.js Express API mit MongoDB  
**Payment:** PayPal Integration  
**Ticketing:** QR-Code basiertes System mit JWT

---

## Projekt-Struktur

```
VerdrehteWeltWebsite/
├── website/              # Frontend (für Hosting)
│   ├── index.html       # Hauptseite
│   ├── event.html       # Event-Detail & Checkout
│   ├── impressum.html   # Impressum
│   ├── datenschutz.html # Datenschutz
│   ├── agb.html         # AGB
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript
│   └── images/          # Bilder & Assets
│
└── backend/             # Backend API (separates Hosting)
    ├── src/
    │   ├── server.js    # Express Server
    │   ├── models/      # MongoDB Models
    │   ├── routes/      # API Routes
    │   └── services/    # Business Logic
    ├── package.json
    └── .env.example
```

---

## Installation & Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# .env bearbeiten und Credentials eintragen
npm run dev
```

**Erforderliche Environment Variables:**
- `MONGODB_URI` - MongoDB Connection String
- `PAYPAL_CLIENT_ID` - PayPal App Client ID
- `PAYPAL_CLIENT_SECRET` - PayPal App Secret
- `PAYPAL_MODE` - `sandbox` oder `live`
- `JWT_SECRET` - Secret für QR-Code Signierung
- `MAIL_API_KEY` - Resend API Key (optional)
- `FRONTEND_URL` - URL der Website

### Frontend

```bash
cd website
# Für lokales Testen mit Live-Server oder ähnlichem:
npx http-server -p 8080
```

Oder direkt auf einen Static-File-Hosting-Service hochladen (Cloudflare Pages, Netlify, etc.)

---

## Deployment

### Frontend (Cloudflare Pages / Netlify)

1. **Website-Ordner hochladen:**
   ```bash
   cd website
   # Alle Dateien hochladen
   ```

2. **Build Command:** Keine (statische Dateien)
3. **Publish Directory:** `/`

### Backend (VPS / Cloud)

1. **Server vorbereiten:**
   ```bash
   # MongoDB installieren oder Cloud-Dienst nutzen
   # Node.js 18+ installieren
   ```

2. **Backend deployen:**
   ```bash
   cd backend
   npm install --production
   # .env mit Production-Werten erstellen
   npm start
   ```

3. **Process Manager (PM2):**
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name verdrehte-welt-api
   pm2 save
   pm2 startup
   ```

4. **Nginx Reverse Proxy:**
   ```nginx
   server {
       listen 80;
       server_name api.verdrehtewelt.de;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Ticketing-Flow

1. **User wählt Event & Ticket** → Frontend
2. **Order erstellen** → `POST /api/v1/orders/create`
3. **PayPal Order erstellen** → `POST /api/v1/payments/paypal/create-order`
4. **User zahlt bei PayPal** → Redirect zu PayPal
5. **Payment Capture** → `POST /api/v1/payments/paypal/capture-order`
6. **Tickets generieren** → Automatisch nach Zahlung
7. **Email mit QR-Codes** → An Käufer gesendet
8. **Check-in am Event** → `POST /api/v1/checkin/scan`

---

## API Endpoints

### Orders
- `POST /api/v1/orders/create` - Bestellung erstellen
- `GET /api/v1/orders/:id` - Bestellung abrufen

### PayPal
- `POST /api/v1/payments/paypal/create-order` - PayPal Order erstellen
- `POST /api/v1/payments/paypal/capture-order` - Zahlung abschließen
- `POST /api/v1/payments/paypal/webhook` - PayPal Webhooks

### Check-in
- `POST /api/v1/checkin/scan` - Ticket scannen
- `GET /api/v1/checkin/ticket/:id` - Ticket-Status prüfen
- `GET /api/v1/checkin/stats/:eventId` - Event-Statistiken

### Events
- `GET /api/v1/events` - Alle Events
- `GET /api/v1/events/:id` - Event Details

---

## Sicherheit

- **QR-Codes:** JWT-signiert mit HS256/RS256
- **PayPal Webhooks:** Signatur-Verifizierung (Production)
- **HTTPS:** SSL-Zertifikate für Frontend & Backend
- **Environment Variables:** Niemals committen

---

## Events verwalten

Events werden aktuell in `backend/src/routes/events.js` definiert.

Um ein neues Event hinzuzufügen:

```javascript
{
    id: 'event-id',
    title: 'Event Name',
    date: '01.01.2026',
    time: '21:00 – 05:00',
    location: 'Venue Name',
    address: 'Full Address',
    genres: ['Genre1', 'Genre2'],
    image: '/images/events/event.jpg',
    tickets: [
        {
            id: 'ticket-type',
            name: 'Ticket Name',
            price: 10.00,
            available: true,
            kontingent: 100
        }
    ],
    status: 'available'
}
```

Dann auch in `website/js/events-data.js` hinzufügen.

---

## Design anpassen

Alle Styles in `website/css/main.css`:

```css
:root {
    --color-bg: #000000;      /* Hintergrund */
    --color-fg: #ffffff;      /* Text */
    --color-gray: #333333;    /* Grau */
    --font-serif: 'Libre Baskerville', serif;
    --font-sans: 'Inter', sans-serif;
}
```

---

## Email-Templates

Email-Templates in `backend/src/services/emailService.js` anpassen.

---

## Troubleshooting

**Problem:** Backend startet nicht  
**Lösung:** Prüfe MongoDB-Verbindung und .env-Variablen

**Problem:** PayPal-Zahlung schlägt fehl  
**Lösung:** Prüfe PayPal Credentials und Mode (sandbox/live)

**Problem:** Emails werden nicht gesendet  
**Lösung:** Prüfe MAIL_API_KEY oder Logs (Development: nur Console)

**Problem:** QR-Codes ungültig  
**Lösung:** Prüfe JWT_SECRET (muss identisch bleiben)

---

## Support

- Email: info@verdrehtewelt.de
- Instagram: [@verdrehte.welt.official](https://www.instagram.com/verdrehte.welt.official/)

---

## Lizenz

 2025 Verdrehte Welt. Alle Rechte vorbehalten.

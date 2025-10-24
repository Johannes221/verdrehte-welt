# 🚀 Deployment Guide - Verdrehte Welt

Vollständige Anleitung zum Deployment der Verdrehte Welt Website mit Backend-API.

---

## 📋 Voraussetzungen

- **Frontend-Hosting:** Cloudflare Pages, Netlify, Vercel oder ähnlich
- **Backend-Hosting:** VPS (z.B. Hetzner, DigitalOcean) oder Cloud-Provider
- **MongoDB:** MongoDB Atlas (Cloud) oder selbst gehostet
- **PayPal:** Business Account mit API-Zugang
- **Domain:** verdrehtewelt.de (oder deine eigene)

---

## 1️⃣ Frontend Deployment (Cloudflare Pages)

### Cloudflare Pages

1. **Bei Cloudflare Pages anmelden:** https://pages.cloudflare.com/

2. **Projekt erstellen:**
   - "Create a project" → "Upload assets"
   - Ordner auswählen: `website/`
   - Alle Dateien hochladen

3. **Domain verbinden:**
   - Custom Domain: `verdrehtewelt.de`
   - DNS Records automatisch erstellt

4. **Fertig!** Website ist live unter `https://verdrehtewelt.de`

### Alternative: Netlify

```bash
cd website
# Netlify CLI installieren
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.
```

### Alternative: Eigener Server mit Nginx

```nginx
server {
    listen 80;
    server_name verdrehtewelt.de www.verdrehtewelt.de;
    root /var/www/verdrehtewelt/website;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # SSL via Let's Encrypt
    listen 443 ssl;
    ssl_certificate /etc/letsencrypt/live/verdrehtewelt.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/verdrehtewelt.de/privkey.pem;
}
```

---

## 2️⃣ MongoDB Setup

### MongoDB Atlas (empfohlen)

1. **Account erstellen:** https://www.mongodb.com/cloud/atlas

2. **Cluster erstellen:**
   - Free Tier (M0) reicht für Start
   - Region: Europa (Frankfurt)

3. **Database User erstellen:**
   - Username: `verdrehtewelt`
   - Passwort: Sicheres Passwort generieren

4. **Network Access:**
   - IP Whitelist: `0.0.0.0/0` (alle IPs) oder Backend-Server IP

5. **Connection String kopieren:**
   ```
   mongodb+srv://verdrehtewelt:<password>@cluster0.xxxxx.mongodb.net/verdrehte-welt?retryWrites=true&w=majority
   ```

### Alternative: Selbst gehostet

```bash
# MongoDB installieren (Ubuntu)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Starten
sudo systemctl start mongod
sudo systemctl enable mongod
```

---

## 3️⃣ Backend Deployment (VPS)

### Server vorbereiten

```bash
# SSH in Server
ssh root@your-server-ip

# Node.js installieren
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git installieren
sudo apt-get install -y git

# PM2 installieren (Process Manager)
sudo npm install -g pm2
```

### Code hochladen

**Option 1: Git Clone**
```bash
cd /var/www
git clone https://github.com/your-repo/verdrehte-welt.git
cd verdrehte-welt/backend
```

**Option 2: SCP Upload**
```bash
# Vom lokalen Computer
cd VerdrehteWeltWebsite
scp -r backend root@your-server-ip:/var/www/verdrehte-welt/
```

### Environment Variables

```bash
cd /var/www/verdrehte-welt/backend
nano .env
```

Eintragen:
```bash
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://verdrehtewelt.de

MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/verdrehte-welt

PAYPAL_CLIENT_ID=AXm...
PAYPAL_CLIENT_SECRET=EO1...
PAYPAL_MODE=live
PAYPAL_WEBHOOK_ID=WH-...

JWT_SECRET=super-geheimes-secret-minimum-32-zeichen-lang
JWT_EXPIRY=365d

MAIL_API_KEY=re_...
MAIL_FROM=noreply@verdrehtewelt.de

PLATFORM_FEE_PERCENTAGE=5
```

### Backend starten

```bash
cd /var/www/verdrehte-welt/backend
npm install --production
pm2 start src/server.js --name verdrehte-welt-api
pm2 save
pm2 startup
```

### Nginx Reverse Proxy

```bash
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/api.verdrehtewelt.de
```

Config:
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/api.verdrehtewelt.de /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### SSL-Zertifikat (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.verdrehtewelt.de
```

---

## 4️⃣ PayPal Setup

### PayPal App erstellen

1. **Developer Portal:** https://developer.paypal.com/

2. **App erstellen:**
   - "My Apps & Credentials"
   - "Create App"
   - App Name: "Verdrehte Welt Ticketing"
   - App Type: "Merchant"

3. **Credentials kopieren:**
   - Client ID
   - Secret
   - In `.env` eintragen

### Webhook einrichten

1. **Webhooks:** https://developer.paypal.com/developer/applications

2. **Add Webhook:**
   - URL: `https://api.verdrehtewelt.de/api/v1/payments/paypal/webhook`
   - Events auswählen:
     - `PAYMENT.CAPTURE.COMPLETED`
     - `PAYMENT.CAPTURE.REFUNDED`

3. **Webhook ID kopieren** → `.env` (`PAYPAL_WEBHOOK_ID`)

### Live schalten

1. **Business Account verifizieren**
2. **App auf "Live" umstellen**
3. **`.env` anpassen:** `PAYPAL_MODE=live`
4. **Backend neu starten:** `pm2 restart verdrehte-welt-api`

---

## 5️⃣ Email Setup (Resend)

1. **Account:** https://resend.com/

2. **API Key erstellen:**
   - Dashboard → API Keys
   - Create API Key
   - Kopieren → `.env` (`MAIL_API_KEY`)

3. **Domain verifizieren:**
   - Add Domain: `verdrehtewelt.de`
   - DNS Records hinzufügen

4. **Test-Email senden:**
   ```bash
   curl -X POST https://api.verdrehtewelt.de/api/v1/orders/create \
     -H "Content-Type: application/json" \
     -d '{ ... }'
   ```

---

## 6️⃣ DNS Einstellungen

Bei deinem Domain-Provider (z.B. Cloudflare):

```
A     verdrehtewelt.de         → Cloudflare Pages IP
CNAME www.verdrehtewelt.de     → verdrehtewelt.de
A     api.verdrehtewelt.de     → VPS IP (z.B. 1.2.3.4)
```

---

## 7️⃣ Monitoring & Logs

### Backend Logs

```bash
# Live Logs
pm2 logs verdrehte-welt-api

# Logs anzeigen
pm2 logs --lines 100

# Fehler-Logs
pm2 logs --err
```

### MongoDB Logs

```bash
# Atlas: Dashboard → Monitoring
# Self-hosted:
sudo tail -f /var/log/mongodb/mongod.log
```

### Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 8️⃣ Backup

### MongoDB Backup

```bash
# Automatisches Backup (täglich)
crontab -e

# Eintrag:
0 3 * * * mongodump --uri="mongodb+srv://..." --out=/backups/$(date +\%Y\%m\%d)
```

### Code Backup

```bash
# Git Repository nutzen
cd /var/www/verdrehte-welt
git pull origin main
```

---

## 9️⃣ Updates deployen

### Frontend

```bash
# Neue Dateien auf Cloudflare Pages hochladen
# Oder via Git:
git push cloudflare main
```

### Backend

```bash
ssh root@your-server-ip
cd /var/www/verdrehte-welt/backend
git pull origin main
npm install
pm2 restart verdrehte-welt-api
```

---

## 🔟 Testing

### Health Check

```bash
# Backend
curl https://api.verdrehtewelt.de/health

# Response: {"status":"OK","timestamp":"..."}
```

### Test Order (Sandbox)

```bash
curl -X POST https://api.verdrehtewelt.de/api/v1/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "eventId": "rave-dossenheim-2025",
    "tickets": [{
      "ticketVarianteId": "early-bird",
      "bezeichnung": "Early Bird",
      "einzelpreisBrutto": 8.00,
      "menge": 1
    }],
    "agbAkzeptiert": true,
    "dsgvoAkzeptiert": true,
    "widerrufsbelehrungGelesen": true
  }'
```

---

## ✅ Deployment Checklist

- [ ] MongoDB Atlas eingerichtet
- [ ] PayPal App erstellt (Live-Modus)
- [ ] PayPal Webhook konfiguriert
- [ ] Backend auf VPS deployed
- [ ] Nginx Reverse Proxy konfiguriert
- [ ] SSL-Zertifikate installiert
- [ ] Frontend auf Cloudflare Pages deployed
- [ ] DNS-Einträge konfiguriert
- [ ] Email-Service (Resend) eingerichtet
- [ ] `.env` mit Production-Werten
- [ ] PM2 läuft und Auto-Start enabled
- [ ] Test-Order durchgeführt
- [ ] Test-Email erhalten
- [ ] PayPal-Zahlung getestet
- [ ] QR-Code Check-in getestet
- [ ] Monitoring eingerichtet
- [ ] Backup-Strategie definiert

---

## 📞 Support

Bei Problemen:
1. Logs prüfen: `pm2 logs`
2. Health Check: `curl https://api.verdrehtewelt.de/health`
3. MongoDB Connection testen
4. PayPal Webhook Logs prüfen

---

**Viel Erfolg beim Deployment! 🚀**

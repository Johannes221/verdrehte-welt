# Ticketing-System – Configuration & Secrets

**Projekt:** EventApp  
**Stand:** Januar 2025

---

## 1. Environment Variables

**Datei:** `.env.example`

### 1.1 Server

```bash
PORT=4000
NODE_ENV=development  # development | production
```

---

### 1.2 Database

```bash
MONGODB_URI=mongodb://localhost:27017/eventapp
DB_NAME=eventapp
```

**Production:** MongoDB Atlas Connection String

---

### 1.3 Firebase Auth

```bash
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

**Quelle:** Firebase Console → Project Settings → Service Accounts

---

### 1.4 PayPal

```bash
PAYPAL_CLIENT_ID=AXm...
PAYPAL_CLIENT_SECRET=EO1...
PAYPAL_MODE=sandbox  # sandbox | live
PAYPAL_WEBHOOK_ID=WH-123...  # Optional
PAYPAL_ENVIRONMENT=sandbox  # Alternative zu MODE
```

**Platform Credentials:** Aus PayPal Developer Dashboard

---

### 1.5 Email (Resend)

```bash
MAIL_API_KEY=re_...
MAIL_FROM=noreply@eventapp.de
```

**Resend:** https://resend.com/api-keys

---

### 1.6 Cloudinary

```bash
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abc...
```

**Für:** QR-Code Upload

---

### 1.7 JWT Secrets

```bash
JWT_SECRET=your-secret-key-change-in-production
JWT_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n"
JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n"
```

**Generieren:**
```bash
# RSA Keypair
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -outform PEM -pubout -out public.pem
```

---

### 1.8 CORS

```bash
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3002
```

**Production:** Komma-separierte Liste

---

### 1.9 Optional

```bash
# Frontend URL (für PayPal Return URL)
FRONTEND_URL=http://localhost:3000

# Redis (Caching)
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# Sentry (Error Tracking)
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=development

# Mixpanel (Analytics)
MIXPANEL_TOKEN=abc123

# Encryption
ENCRYPTION_KEY=your-32-byte-encryption-key-here

# WebSocket
ENABLE_WEBSOCKET=false
```

---

## 2. Local vs. Production

### 2.1 Development

```bash
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eventapp
PAYPAL_MODE=sandbox
MAIL_API_KEY=PLACEHOLDER_MAIL_API_KEY  # Emails nur geloggt
```

---

### 2.2 Staging

```bash
NODE_ENV=staging
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eventapp_staging
PAYPAL_MODE=sandbox
MAIL_API_KEY=re_staging_...
SENTRY_ENVIRONMENT=staging
```

---

### 2.3 Production

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/eventapp
PAYPAL_MODE=live
MAIL_API_KEY=re_prod_...
SENTRY_ENVIRONMENT=production
JWT_PRIVATE_KEY="<RSA Key>"  # HS256 → RS256
```

---

## 3. Config Loader

**Datei:** Nicht explizit vorhanden, dotenv direkt verwendet

```typescript
// Typischer Pattern
import dotenv from 'dotenv';
dotenv.config();

const config = {
  port: process.env.PORT || 3010,
  mongoUri: process.env.MONGODB_URI,
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    mode: process.env.PAYPAL_MODE || 'sandbox'
  }
};
```

---

## 4. Feature Flags

**Empfohlen (nicht implementiert):**

```bash
FEATURE_STRIPE_ENABLED=false
FEATURE_OFFLINE_CHECKIN=false
FEATURE_EMAIL_RETRY_QUEUE=false
```

---

## 5. Security Best Practices

### 5.1 Secrets Management

**Development:**
- `.env` lokal (gitignored)
- Shared via 1Password/LastPass

**Production:**
- AWS Secrets Manager
- Oder: Kubernetes Secrets
- Oder: Doppler, Vault

---

### 5.2 Rotation

**Kritisch:**
- `JWT_SECRET`: Jährlich rotieren
- `PAYPAL_CLIENT_SECRET`: Bei Breach sofort
- `FIREBASE_PRIVATE_KEY`: Nur bei Kompromittierung

---

## 6. Validation

**Startup-Check (Empfohlen):**

```typescript
function validateConfig() {
  const required = [
    'MONGODB_URI',
    'FIREBASE_PROJECT_ID',
    'PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
}
```

---

## 7. Files Reference

| Datei | Zweck |
|-------|-------|
| `.env.example` | Template mit Beispielwerten |
| `.env` | Lokal (gitignored) |
| `src/config/mongo.ts` | MongoDB Connection |
| `src/config/firebase.ts` | Firebase Admin SDK Init |

---

**Ende Config & Secrets**

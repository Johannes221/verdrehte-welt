#!/bin/bash

ENV_FILE="/Users/johan/VerdrehteWeltWebsite/backend/.env"

echo "🔧 Checking .env file..."

# Check if JWT_SECRET exists
if grep -q "^JWT_SECRET=" "$ENV_FILE" 2>/dev/null; then
    echo "✅ JWT_SECRET already exists"
else
    echo "📝 Adding JWT_SECRET..."
    # Generate random 64-char secret
    JWT_SECRET=$(openssl rand -base64 48 | tr -d '\n')
    echo "" >> "$ENV_FILE"
    echo "# JWT Secret for QR Code signing" >> "$ENV_FILE"
    echo "JWT_SECRET=$JWT_SECRET" >> "$ENV_FILE"
    echo "✅ JWT_SECRET added"
fi

# Check if ADMIN_PASSWORD exists
if grep -q "^ADMIN_PASSWORD=" "$ENV_FILE" 2>/dev/null; then
    echo "✅ ADMIN_PASSWORD already exists"
else
    echo "📝 Adding ADMIN_PASSWORD..."
    echo "" >> "$ENV_FILE"
    echo "# Admin Scanner Password" >> "$ENV_FILE"
    echo "ADMIN_PASSWORD=verdrehtewelt2025" >> "$ENV_FILE"
    echo "✅ ADMIN_PASSWORD added"
fi

echo ""
echo "✅ .env file is ready!"
echo ""
echo "🔄 NEXT: Restart backend:"
echo "   cd backend"
echo "   npm run dev"

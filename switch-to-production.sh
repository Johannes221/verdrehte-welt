#!/bin/bash

# ===================================
# PRODUCTION URL SWITCHER
# ===================================
# Dieses Script stellt alle Frontend API URLs auf Production um
# 
# WICHTIG: Führe dieses Script NUR aus, wenn:
# 1. Backend auf Render.com deployed ist
# 2. Du die Backend URL kennst
# 3. Du bereit bist für Production
#
# ACHTUNG: Dieses Script ändert Dateien!
# Mache vorher ein Backup oder committe deine Änderungen!

echo "🚀 Verdrehte Welt - Production URL Switcher"
echo "=========================================="
echo ""

# Farben für Output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Backend URL (ÄNDERE DIESE NACH DEPLOYMENT!)
PRODUCTION_API_URL="https://verdrehte-welt-backend.onrender.com/api/v1"
SANDBOX_API_URL="https://verdrehte-welt.onrender.com/api/v1"

echo -e "${YELLOW}⚠️  WARNUNG: Dieses Script ändert folgende Dateien:${NC}"
echo "   - website/js/event-detail.js"
echo "   - website/payment-success.html"
echo "   - website/admin-scanner.html"
echo "   - website/admin-tickets.html"
echo "   - website/admin.html"
echo "   - website/js/main.js"
echo ""

echo -e "${YELLOW}Aktuelle Sandbox URL:${NC} $SANDBOX_API_URL"
echo -e "${GREEN}Neue Production URL:${NC} $PRODUCTION_API_URL"
echo ""

read -p "Möchtest du fortfahren? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${RED}❌ Abgebrochen.${NC}"
    exit 1
fi

echo ""
echo "🔄 Starte URL-Umstellung..."
echo ""

# Zähler für Änderungen
changes=0

# Function zum Ersetzen
replace_url() {
    local file=$1
    if [ -f "$file" ]; then
        # Backup erstellen
        cp "$file" "$file.backup"
        
        # URL ersetzen
        sed -i '' "s|$SANDBOX_API_URL|$PRODUCTION_API_URL|g" "$file"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ $file${NC}"
            changes=$((changes + 1))
        else
            echo -e "${RED}❌ Fehler bei $file${NC}"
            # Backup wiederherstellen
            mv "$file.backup" "$file"
        fi
    else
        echo -e "${YELLOW}⚠️  Datei nicht gefunden: $file${NC}"
    fi
}

# Alle Dateien durchgehen
replace_url "website/js/event-detail.js"
replace_url "website/payment-success.html"
replace_url "website/admin-scanner.html"
replace_url "website/admin-tickets.html"
replace_url "website/admin.html"
replace_url "website/js/main.js"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Fertig! $changes Dateien aktualisiert.${NC}"
echo ""
echo "📝 Backups wurden erstellt (*.backup)"
echo "   Falls etwas schief geht, kannst du sie wiederherstellen."
echo ""
echo "🔍 Nächste Schritte:"
echo "   1. Überprüfe die Änderungen"
echo "   2. Teste lokal (optional)"
echo "   3. Committe zu Git"
echo "   4. Pushe zu GitHub"
echo "   5. Cloudflare Pages wird automatisch deployen"
echo ""
echo -e "${YELLOW}⚠️  Vergiss nicht:${NC}"
echo "   - Backend muss auf Render.com laufen"
echo "   - PayPal Webhooks müssen konfiguriert sein"
echo "   - MongoDB Atlas muss verbunden sein"
echo ""

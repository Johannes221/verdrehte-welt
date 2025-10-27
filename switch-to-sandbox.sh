#!/bin/bash

# ===================================
# SANDBOX URL SWITCHER (ROLLBACK)
# ===================================
# Dieses Script stellt alle Frontend API URLs zurück auf Sandbox
# Nützlich für lokale Entwicklung oder Rollback

echo "🔙 Verdrehte Welt - Sandbox URL Switcher (Rollback)"
echo "=========================================="
echo ""

# Farben
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

SANDBOX_API_URL="https://verdrehte-welt.onrender.com/api/v1"
PRODUCTION_API_URL="https://verdrehte-welt-backend.onrender.com/api/v1"

echo -e "${YELLOW}Zurück zu Sandbox URL:${NC} $SANDBOX_API_URL"
echo ""

read -p "Möchtest du fortfahren? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${RED}❌ Abgebrochen.${NC}"
    exit 1
fi

echo ""
echo "🔄 Starte Rollback zu Sandbox..."
echo ""

changes=0

replace_url() {
    local file=$1
    if [ -f "$file" ]; then
        cp "$file" "$file.backup"
        sed -i '' "s|$PRODUCTION_API_URL|$SANDBOX_API_URL|g" "$file"
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ $file${NC}"
            changes=$((changes + 1))
        else
            echo -e "${RED}❌ Fehler bei $file${NC}"
            mv "$file.backup" "$file"
        fi
    fi
}

replace_url "website/js/event-detail.js"
replace_url "website/payment-success.html"
replace_url "website/admin-scanner.html"
replace_url "website/admin-tickets.html"
replace_url "website/admin.html"
replace_url "website/js/main.js"

echo ""
echo "=========================================="
echo -e "${GREEN}✅ Rollback abgeschlossen! $changes Dateien aktualisiert.${NC}"
echo ""

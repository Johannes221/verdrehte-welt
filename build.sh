#!/bin/bash

# Verdrehte Welt Theme Build Script
# Erstellt ein installierbares WordPress-Theme ZIP

echo "🔨 Building Verdrehte Welt Theme..."

# Variables
THEME_DIR="theme/verdrehtewelt"
BUILD_DIR="dist"
THEME_NAME="verdrehtewelt"
ZIP_NAME="verdrehtewelt-theme.zip"

# Create dist directory
mkdir -p $BUILD_DIR

# Remove old ZIP if exists
if [ -f "$BUILD_DIR/$ZIP_NAME" ]; then
    rm "$BUILD_DIR/$ZIP_NAME"
    echo "✓ Removed old ZIP"
fi

# Create ZIP
cd theme
zip -r "../$BUILD_DIR/$ZIP_NAME" verdrehtewelt/ \
    -x "*.DS_Store" \
    -x "*node_modules/*" \
    -x "*.git*"

cd ..

echo "✅ Theme built successfully!"
echo "📦 ZIP location: $BUILD_DIR/$ZIP_NAME"
echo ""
echo "Next steps:"
echo "1. Upload to WordPress: Design → Themes → Theme hochladen"
echo "2. Configure PayPal: Bestellungen → Einstellungen"
echo "3. Create first event: Events → Neues Event"
echo ""
echo "🚀 Ready to deploy!"

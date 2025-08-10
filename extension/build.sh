#!/bin/bash

# AutoFill Extension Build Script

echo "🚀 Building AutoFill Extension..."

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found. Please run this script from the extension directory."
    exit 1
fi

# Create assets directory if it doesn't exist
mkdir -p assets

# Create placeholder icons (you should replace these with real icons)
echo "📱 Creating placeholder icons..."
convert -size 16x16 xc:blue -fill white -draw "text 4,12 'A'" assets/icon16.png 2>/dev/null || echo "⚠️  Could not create icon16.png (ImageMagick not installed)"
convert -size 32x32 xc:blue -fill white -draw "text 8,24 'A'" assets/icon32.png 2>/dev/null || echo "⚠️  Could not create icon32.png (ImageMagick not installed)"
convert -size 48x48 xc:blue -fill white -draw "text 12,36 'A'" assets/icon48.png 2>/dev/null || echo "⚠️  Could not create icon48.png (ImageMagick not installed)"
convert -size 128x128 xc:blue -fill white -draw "text 32,96 'A'" assets/icon128.png 2>/dev/null || echo "⚠️  Could not create icon128.png (ImageMagick not installed)"

# Create content.css if it doesn't exist
if [ ! -f "assets/content.css" ]; then
    echo "🎨 Creating content.css..."
    cat > assets/content.css << 'EOF'
/* Content Script Styles for AutoFill Extension */

#autofill-dropzone {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 200px;
  height: 120px;
  background: rgba(59, 130, 246, 0.9);
  border: 2px dashed white;
  border-radius: 12px;
  display: none;
  z-index: 10000;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.autofill-dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: white;
  text-align: center;
}

.autofill-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.autofill-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
}
EOF
fi

# Validate manifest.json
echo "🔍 Validating manifest.json..."
if python3 -m json.tool manifest.json > /dev/null 2>&1; then
    echo "✅ manifest.json is valid JSON"
else
    echo "❌ Error: manifest.json contains invalid JSON"
    exit 1
fi

# Check required files
echo "📋 Checking required files..."
required_files=(
    "manifest.json"
    "background/background.js"
    "content/content.js"
    "popup/popup.html"
    "popup/popup.css"
    "popup/popup.js"
    "utils/fileProcessor.js"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files present"
else
    echo "❌ Missing required files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
    exit 1
fi

# Create zip file for distribution
echo "📦 Creating distribution package..."
zip -r autofill-extension.zip . -x "*.git*" "build.sh" "*.zip" > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Extension packaged as autofill-extension.zip"
else
    echo "⚠️  Could not create zip file (zip command not available)"
fi

echo ""
echo "🎉 Build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode'"
echo "3. Click 'Load unpacked'"
echo "4. Select the extension/ directory"
echo ""
echo "🔧 For development:"
echo "- Make changes to extension files"
echo "- Click 'Reload' in chrome://extensions/"
echo "- Test on any webpage with forms"
echo ""
echo "📱 The extension will show a blue drop zone on webpages"
echo "   Drag files onto it to test auto-filling functionality"

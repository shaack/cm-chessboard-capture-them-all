#!/bin/bash
set -e

echo "=== Building Capture Them All for production ==="

# Clean dist
rm -rf dist
mkdir -p dist

# Bundle JS with rollup
echo "Bundling JS..."
npx rollup -c

# Copy game assets
echo "Copying assets..."
cp -r assets dist/assets

# Copy cm-chessboard assets (pieces SVG, chessboard CSS, markers)
mkdir -p dist/lib/cm-chessboard/assets/pieces
mkdir -p dist/lib/cm-chessboard/assets/extensions/markers
cp node_modules/cm-chessboard/assets/chessboard.css dist/lib/cm-chessboard/assets/
cp node_modules/cm-chessboard/assets/pieces/staunty.svg dist/lib/cm-chessboard/assets/pieces/
cp node_modules/cm-chessboard/assets/extensions/markers/markers.css dist/lib/cm-chessboard/assets/extensions/markers/
cp node_modules/cm-chessboard/assets/extensions/markers/markers.svg dist/lib/cm-chessboard/assets/extensions/markers/

# Copy cm-web-modules audio assets
mkdir -p dist/lib/cm-web-modules/assets
cp node_modules/cm-web-modules/assets/move.mp3 dist/lib/cm-web-modules/assets/

# Copy canvas-confetti browser bundle
mkdir -p dist/lib/canvas-confetti/dist
cp node_modules/canvas-confetti/dist/confetti.browser.js dist/lib/canvas-confetti/dist/

# Replace node_modules paths in bundled JS so assets resolve correctly on CrazyGames
sed -i '' 's|./node_modules/|./lib/|g' dist/bundle.js

# Create production index.html
cat > dist/index.html << 'HTMLEOF'
<!DOCTYPE html>
<html lang="en" data-emc-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="./assets/styles/screen.css"/>
    <title>Capture Them All</title>
    <script src="https://sdk.crazygames.com/crazygames-sdk-v2.js"></script>
</head>
<body>
<div id="app"></div>
<script src="./lib/canvas-confetti/dist/confetti.browser.js"></script>
<script type="module">
    import {App} from "./bundle.js"
    new App(document.getElementById("app"))
</script>
</body>
</html>
HTMLEOF

# Create zip for upload
echo "Creating zip..."
cd dist
zip -r ../capture-them-all.zip . -x "*.map"
cd ..

echo "=== Build complete ==="
echo "  dist/        — production files"
echo "  capture-them-all.zip — ready for upload"

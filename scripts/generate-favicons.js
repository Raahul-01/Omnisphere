const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

async function generateFavicons() {
  const sizes = [16, 32, 192];
  const inputSvg = path.join(__dirname, '../public/favicon.svg');
  
  try {
    // Read the SVG file
    const svgBuffer = await fs.readFile(inputSvg);
    
    // Generate PNGs for each size
    for (const size of sizes) {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(path.join(__dirname, `../public/favicon-${size}x${size}.png`));
    }
    
    // Generate apple-touch-icon
    await sharp(svgBuffer)
      .resize(180, 180)
      .png()
      .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
      
    // Generate safari-pinned-tab.svg (copy the original SVG)
    await fs.copyFile(
      inputSvg,
      path.join(__dirname, '../public/safari-pinned-tab.svg')
    );
    
    // Generate favicon.ico using the 32x32 PNG
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../public/favicon.ico'));
    
    console.log('Successfully generated all favicon files!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons(); 
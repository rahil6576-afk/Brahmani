const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processLogo() {
  const inputPath = path.join(__dirname, '../public/images/brahmani-logo-original.png');
  const img = sharp(inputPath);
  const metadata = await img.metadata();
  console.log(`Original dimensions: ${metadata.width}x${metadata.height}`);

  // Get raw RGBA buffer
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels;

  // 1. Transparent version (isolate white background)
  // 2. Dark mode version: dark pixels -> #F5F5F2, yellow pixels -> keep glowing yellow, white -> transparent
  const bufTransparent = Buffer.from(data);
  const bufDarkMode = Buffer.from(data);

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Check if background (near white)
    // In chatgpt_1.png background is ~250-255
    const isWhiteBg = (r > 240 && g > 240 && b > 240);
    
    // Check if yellow (R is high, G is medium-high, B is low)
    const isYellow = (r > 180 && g > 120 && b < 100);

    // Check if dark/black (R, G, B are all low < 80)
    const isDark = (r < 90 && g < 90 && b < 90);

    if (isWhiteBg) {
      // make transparent
      bufTransparent[i + 3] = 0;
      bufDarkMode[i + 3] = 0;
    } else {
      // Calculate anti-aliasing alpha against white
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      
      if (r > 200 && g > 200 && b > 200 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20) {
        // Soft edge fade out
        const factor = (255 - ((r + g + b) / 3)) / 55;
        const alpha = Math.max(0, Math.min(255, Math.round(factor * 255)));
        bufTransparent[i + 3] = alpha;
        bufDarkMode[i + 3] = alpha;
      }

      if (isDark) {
        // In dark mode, convert dark grey/black to warm white #F5F5F2
        bufDarkMode[i] = 245;     // R
        bufDarkMode[i + 1] = 245; // G
        bufDarkMode[i + 2] = 242; // B
      } else if (!isYellow && !isWhiteBg) {
        // Intermediate dark shades -> convert to bright warm grey
        const lum = (r + g + b) / 3;
        if (lum < 160) {
          bufDarkMode[i] = 230;
          bufDarkMode[i + 1] = 230;
          bufDarkMode[i + 2] = 228;
        }
      }
    }
  }

  // Save transparent logo
  await sharp(bufTransparent, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile(path.join(__dirname, '../public/images/brahmani-logo-transparent.png'));
  console.log('Saved brahmani-logo-transparent.png');

  // Save dark mode logo
  await sharp(bufDarkMode, { raw: { width, height, channels: 4 } })
    .trim()
    .png()
    .toFile(path.join(__dirname, '../public/images/brahmani-logo-dark.png'));
  console.log('Saved brahmani-logo-dark.png');

  // Also crop the B symbol mark
  // In the original image, mark is on top center:
  // Let's create trimmed dark logo and also a mark-only version
  const darkTrimmed = sharp(path.join(__dirname, '../public/images/brahmani-logo-dark.png'));
  const darkMeta = await darkTrimmed.metadata();
  
  // The mark B is roughly the top 62% of the trimmed height
  const markHeight = Math.round(darkMeta.height * 0.63);
  await sharp(path.join(__dirname, '../public/images/brahmani-logo-dark.png'))
    .extract({ left: 0, top: 0, width: darkMeta.width, height: markHeight })
    .trim()
    .png()
    .toFile(path.join(__dirname, '../public/images/brahmani-mark-dark.png'));
  console.log('Saved brahmani-mark-dark.png');

  // And the text part
  const textHeight = darkMeta.height - markHeight;
  await sharp(path.join(__dirname, '../public/images/brahmani-logo-dark.png'))
    .extract({ left: 0, top: markHeight, width: darkMeta.width, height: textHeight })
    .trim()
    .png()
    .toFile(path.join(__dirname, '../public/images/brahmani-text-dark.png'));
  console.log('Saved brahmani-text-dark.png');
}

processLogo().catch(console.error);

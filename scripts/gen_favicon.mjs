import sharp from 'sharp'
import path from 'path'

const input = 'public/static/images/logo/logo-symbol.webp'
const outputDir = 'public/static/favicons'

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
]

for (const { name, size } of sizes) {
  const outPath = path.join(outputDir, name)
  await sharp(input)
    .resize(size, size, { fit: 'contain', background: { r: 245, g: 243, b: 240, alpha: 1 } })
    .png()
    .toFile(outPath)
  console.log(`Saved: ${outPath}`)
}

console.log('\nDone!')

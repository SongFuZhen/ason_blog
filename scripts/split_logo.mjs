import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const input = process.argv[2]
const outputDir = process.argv[3] || 'public/static/images/logo'

if (!input) {
  console.error('Usage: node scripts/split_logo.mjs <input_image> [output_dir]')
  process.exit(1)
}

const img = sharp(input)
const meta = await img.metadata()
const w = meta.width
const h = meta.height
console.log(`Input: ${w}x${h}`)

fs.mkdirSync(outputDir, { recursive: true })

// Crop regions: [top%, bottom%]
const regions = [
  { name: 'logo-symbol.png', top: 0.1, bottom: 0.52 },
  { name: 'logo-text.png', top: 0.52, bottom: 0.65 },
  { name: 'logo-slogan-en.png', top: 0.65, bottom: 0.73 },
  { name: 'logo-slogan-cn.png', top: 0.73, bottom: 0.85 },
]

const pad = Math.round(h * 0.01)

for (const { name, top, bottom } of regions) {
  const t = Math.max(0, Math.round(h * top) - pad)
  const b = Math.min(h, Math.round(h * bottom) + pad)
  const outPath = path.join(outputDir, name)
  await sharp(input)
    .extract({ left: 0, top: t, width: w, height: b - t })
    .toFile(outPath)
  console.log(`Saved: ${outPath}`)
}

// Square symbol with white background
const symbolT = Math.max(0, Math.round(h * 0.1) - pad)
const symbolB = Math.min(h, Math.round(h * 0.52) + pad)
const symbolH = symbolB - symbolT
const symbolW = w
const squareSize = Math.max(symbolW, symbolH)
const yOffset = Math.round((squareSize - symbolH) / 2)

const symbolSquarePath = path.join(outputDir, 'logo-symbol.png')
await sharp(input)
  .extract({ left: 0, top: symbolT, width: symbolW, height: symbolH })
  .extend({
    top: yOffset,
    bottom: squareSize - symbolH - yOffset,
    left: 0,
    right: 0,
    background: { r: 245, g: 243, b: 240, alpha: 1 },
  })
  .toFile(symbolSquarePath)
console.log(`Saved: ${symbolSquarePath}  (${squareSize}x${squareSize})`)

// Square symbol with transparent background
const symbolBuf = await sharp(input)
  .extract({ left: 0, top: symbolT, width: symbolW, height: symbolH })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { data, info } = symbolBuf
const pixels = Buffer.from(data)
const threshold = 240
for (let i = 0; i < pixels.length; i += 4) {
  if (pixels[i] > threshold && pixels[i + 1] > threshold && pixels[i + 2] > threshold) {
    pixels[i + 3] = 0
  }
}
const transparentPath = path.join(outputDir, 'logo-symbol-transparent.png')
await sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } })
  .extend({
    top: yOffset,
    bottom: squareSize - symbolH - yOffset,
    left: 0,
    right: 0,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile(transparentPath)
console.log(`Saved: ${transparentPath}  (${squareSize}x${squareSize})`)

// Full copy
const fullPath = path.join(outputDir, 'logo-full.png')
await sharp(input).toFile(fullPath)
console.log(`Saved: ${fullPath}`)

console.log('\nDone!')

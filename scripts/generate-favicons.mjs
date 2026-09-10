import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const LOGO = join(ROOT, 'public', 'static', 'images', 'logo', 'logo-symbol.webp')
const OUT_DIR = join(ROOT, 'public', 'static', 'favicons')

mkdirSync(OUT_DIR, { recursive: true })

const logoBuffer = readFileSync(LOGO)
const pngSizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'android-chrome-96x96.png', size: 96 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'mstile-150x150.png', size: 150 },
]

const maskableSizes = [
  { name: 'maskable-192x192.png', size: 192 },
  { name: 'maskable-512x512.png', size: 512 },
]
// Android 会对 maskable 图标按安全区裁切，所以图形只占 60%，其余铺不透明背景色。
const MASKABLE_BACKGROUND = { r: 17, g: 24, b: 39, alpha: 1 } // #111827

await Promise.all(
  pngSizes.map(async ({ name, size }) => {
    await sharp(logoBuffer)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(join(OUT_DIR, name))
    console.log(`  generated ${name} (${size}x${size})`)
  })
)

await Promise.all(
  maskableSizes.map(async ({ name, size }) => {
    const inner = Math.round(size * 0.6)
    await sharp(logoBuffer)
      .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: Math.round((size - inner) / 2),
        bottom: Math.round((size - inner) / 2),
        left: Math.round((size - inner) / 2),
        right: Math.round((size - inner) / 2),
        background: MASKABLE_BACKGROUND,
      })
      .flatten({ background: MASKABLE_BACKGROUND })
      .png()
      .toFile(join(OUT_DIR, name))
    console.log(`  generated ${name} (${size}x${size}, maskable)`)
  })
)

await sharp(logoBuffer)
  .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toFile(join(OUT_DIR, 'favicon.ico'))
console.log('  generated favicon.ico')

writeFileSync(join(OUT_DIR, 'favicon.svg'), logoBuffer)

// PWA manifest：放在站点根目录（public/manifest.webmanifest），
// 不能放 /static/ 下 —— vercel.json 给 /static/* 设了 immutable 长缓存，改了 manifest 用户也拿不到。
// 字段与 data/siteMetadata.js 保持一致，改标题/描述时两边都要动。
const manifest = {
  name: 'ASoN 的博客｜独立开发者技术笔记',
  short_name: 'ASoN',
  description: 'ASoN 的个人博客：记录 AI Coding、独立开发与前端技术的实践，分享 AI 打造的产品与日常思考。',
  lang: 'zh-CN',
  dir: 'ltr',
  id: '/',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  display_override: ['standalone', 'minimal-ui', 'browser'],
  orientation: 'any',
  categories: ['blog', 'technology', 'education'],
  icons: [
    { src: '/static/favicons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/static/favicons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/static/favicons/maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: '/static/favicons/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: [
    { name: '全部文章', short_name: '文章', url: '/blog' },
    { name: '资源导航', short_name: '资源', url: '/resources' },
    { name: '关于我', short_name: '关于', url: '/about' },
  ],
  theme_color: '#111827',
  background_color: '#ffffff',
}

writeFileSync(
  join(ROOT, 'public', 'manifest.webmanifest'),
  JSON.stringify(manifest, null, 2) + '\n'
)
console.log('Done: favicons + PWA manifest regenerated for ASON Blog.')

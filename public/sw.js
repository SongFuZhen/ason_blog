/**
 * ASoN 博客 Service Worker（手写，零构建依赖，不参与 Next 打包）。
 *
 * 缓存策略：
 *  - 页面 / RSC 载荷（?_rsc=）：网络优先 → 回落缓存 → 回落 /offline
 *  - 站内静态资源（/_next/static、/static、CSS/JS/字体）：缓存优先（文件名带 hash，可长期缓存）
 *  - 图片（含 cloudflare 图床等跨域图片）：缓存优先 + 条目上限
 *  - 第三方脚本/接口（Giscus、AdSense、Umami、Cloudflare beacon）：不拦截，交给浏览器
 *
 * 改策略后请把 VERSION +1，旧缓存会在 activate 时被清掉。
 */
const VERSION = 'v2'
const PAGE_CACHE = `ason-pages-${VERSION}`
const ASSET_CACHE = `ason-assets-${VERSION}`
const IMAGE_CACHE = `ason-images-${VERSION}`
const CACHE_PREFIX = 'ason-'

const OFFLINE_URL = '/offline'
const PAGE_CACHE_MAX = 80
const IMAGE_CACHE_MAX = 80

async function putLimited(cache, request, response, max) {
  await cache.put(request, response)
  if (!max) return
  const keys = await cache.keys()
  if (keys.length > max) {
    await Promise.all(keys.slice(0, keys.length - max).map((key) => cache.delete(key)))
  }
}

async function cacheFirst(cacheName, request, max) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  // 跨域图片是 opaque 响应（status 0），也允许入库，否则文章配图离线全丢。
  if (response && (response.ok || response.type === 'opaque')) {
    await putLimited(cache, request, response.clone(), max)
  }
  return response
}

async function staleWhileRevalidate(cacheName, request) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const network = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)
  return cached || network.catch(() => Response.error())
}

async function pageNetworkFirst(request) {
  const isNavigation = request.mode === 'navigate'
  const cache = await caches.open(PAGE_CACHE)
  try {
    const response = await fetch(request)
    if (response && response.ok) {
      await putLimited(cache, request, response.clone(), PAGE_CACHE_MAX)
    }
    return response
  } catch {
    const cached = await cache.match(request, { ignoreSearch: isNavigation })
    if (cached) return cached
    if (!isNavigation) return Response.error()
    const offline = await cache.match(OFFLINE_URL)
    if (offline) return offline
    return new Response(
      '<!doctype html><meta charset="utf-8"><title>离线</title><p>当前处于离线状态，该页面尚未缓存。</p>',
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PAGE_CACHE)
      await cache.add(new Request(OFFLINE_URL, { cache: 'reload' }))
      await self.skipWaiting()
    })().catch(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keep = [PAGE_CACHE, ASSET_CACHE, IMAGE_CACHE]
      const keys = await caches.keys()
      await Promise.all(
        keys
          .filter((key) => key.startsWith(CACHE_PREFIX) && !keep.includes(key))
          .map((key) => caches.delete(key))
      )
      await self.clients.claim()
    })()
  )
})

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) {
    // 只缓存跨域图片（图床）；其余第三方请求一律放行，避免缓存广告 / 评论 / 统计响应。
    if (request.destination === 'image') {
      event.respondWith(cacheFirst(IMAGE_CACHE, request, IMAGE_CACHE_MAX))
    }
    return
  }

  if (url.pathname.startsWith('/api/')) return

  // /static/files/ 放的是下载文件（如 typora 插件包），体积大且没必要缓存
  if (url.pathname.startsWith('/static/files/')) return

  if (request.mode === 'navigate' || url.searchParams.has('_rsc')) {
    event.respondWith(pageNetworkFirst(request))
    return
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/static/') ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font'
  ) {
    event.respondWith(cacheFirst(ASSET_CACHE, request))
    return
  }

  if (request.destination === 'image') {
    event.respondWith(cacheFirst(IMAGE_CACHE, request, IMAGE_CACHE_MAX))
    return
  }

  // kbar 搜索索引：先用旧索引，后台更新，离线也能搜。
  if (url.pathname === '/search.json') {
    event.respondWith(staleWhileRevalidate(PAGE_CACHE, request))
  }
})

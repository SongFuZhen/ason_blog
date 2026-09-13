---
key: 'pwa-practice'
title: 把网站装进主屏幕：PWA 的实践之路
date: 2026-09-13
tags: [前端, PWA, Service Worker, Next.js]
categories: [AI]
authors: [default]
images: ['/static/cover/pwa-practice.jpg']
summary: 网站接入 PWA 后，手机可加到主屏幕，打开即无地址栏的 App，断网也能翻已读文章，通勤地铁里照样读。配置分两块：manifest 管外观和安装入口，Service Worker 管离线缓存与静默更新。一次配置，长期受益。
typora-root-url: ..\..\..\public
---

前阵子给 `ason.top` 接了 `PWA`，手机能「添加到主屏幕」，打开是个无地址栏的 `App`，断网也能翻看过的文章。这篇文章把配置和几个实际踩到的坑记下来，方便回看，也算一份给自己博客接 `PWA` 的参考。

## 前置：PWA 的两块拼图

传统 `APP` 这条线，开发和分发都挺让人头疼：用户不一定愿意装，装了也不一定愿意更新。

网页刚好绕开了这道坎——不用安装，打开就能用。

所以，把两边的长处拼一拼，`PWA` 就出现了。

PWA 是一组能力的组合，落到代码上是两块：

- manifest：JSON 清单，声明装到桌面后应用的名字、图标、入口页。只管观感，不碰运行时。
- Service Worker：独立后台脚本，拦截请求、控制缓存、实现离线。真正干活的运行时层。

本文基于 ason.top（Next.js 15 静态博客，Vercel 部署）的真实实现，依次讲：为什么手写 SW 不用库、manifest 的坑、缓存分层、跨域图片处理、更新和安装。

读这篇只要知道 SW 有 `install` / `activate` / `fetch` 三个生命周期事件。

## 为什么是手写 Service Worker

ason.top 是 Next.js 15 + Contentlayer2 的静态博客，构建产物走 Vercel。PWA 部分没用 `next-pwa` 或 Workbox，**手写** 了一个 `public/sw.js`：

```js
/**
 * ASoN 博客 Service Worker（手写，零构建依赖，不参与 Next 打包）。
 * ...
 */
```

零构建依赖是关键。

`sw.js` 直接放在 `public/` 下，不经过 Next 打包，部署后是一份固定脚本，更新策略自己说了算。

Workbox 能帮你生成，但博客的缓存需求很具体（跨域图床、RSC 载荷、评论/统计放行），手写更透明，出问题能直接读源码定位。

## manifest：观感层

`public/manifest.webmanifest` 决定用户「看到」的部分。`name` / `short_name`、图标、`theme_color`、`display: standalone` 是基础，几个值得记的点：

```json
{
  "display": "standalone",
  "display_override": ["standalone", "minimal-ui", "browser"],
  "id": "/",
  "start_url": "/",
  "scope": "/",
  "icons": [
    { "src": "/static/favicons/android-chrome-192x192.png", "sizes": "192x192", "purpose": "any" },
    { "src": "/static/favicons/maskable-192x192.png", "sizes": "192x192", "purpose": "maskable" }
  ],
  "shortcuts": [
    { "name": "全部文章", "short_name": "文章", "url": "/blog" },
    { "name": "资源导航", "short_name": "资源", "url": "/resources" },
    { "name": "关于我", "short_name": "关于", "url": "/about" }
  ]
}
```

- 图标必须有 `maskable` 版本。

  安卓不同 launcher 的图标安全区不一样，只给 `any` 会被裁掉边角，maskable 保证主体始终在安全区内。

- `shortcuts` 白送三个深链。

  长按应用图标弹出「全部文章 / 资源 / 关于」，不写额外代码就多了几个入口。

- `id` 设成 `/`。

  它决定「同一个应用」的判定，不写的话改了 `start_url` 会被系统当成新应用，老的安装留着、新的叠上来。

## 缓存分层

`sw.js` 把缓存分成三块，各自带 `VERSION` 后缀：

```js
const VERSION = 'v2'
const PAGE_CACHE = `ason-pages-${VERSION}`
const ASSET_CACHE = `ason-assets-${VERSION}`
const IMAGE_CACHE = `ason-images-${VERSION}`
const CACHE_PREFIX = 'ason-'
```

PAGE_CACHE 装页面和 RSC 载荷，网络优先，失败回落缓存，再失败落离线页。

文章页面必须实时，不能拿旧 HTML 糊弄。

ASSET_CACHE 装 `/_next/static`、`/static`、CSS/JS/字体，缓存优先。

文件名带 hash，内容不变 URL 就不变，可以长期缓存。

IMAGE_CACHE 装图片，缓存优先，但加了条目上限，防止图床图把设备存储堆满。

`putLimited` 负责这个上限，超过就删最旧的：

```js
async function putLimited(cache, request, response, max) {
  await cache.put(request, response)
  if (!max) return
  const keys = await cache.keys()
  if (keys.length > max) {
    await Promise.all(keys.slice(0, keys.length - max).map((key) => cache.delete(key)))
  }
}
```

## 跨域图片的 opaque 响应

博客 PWA 最容易翻车的地方。

文章配图走 Cloudflare 图床，跨域请求。

SW 里这类响应是 opaque 的，`status` 是 `0`，`response.ok` 永远是 `false`。只按 `response.ok` 判断，离线时文章配图会全丢：

```js
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
```

入库条件必须带上 `response.type === 'opaque'`。

这一条是 **实测踩** 出来的，不是看文档得出的。

## 路由分发

`fetch` 事件里按请求类型分流，核心是「该拦的拦，不该拦的放行」：

```js
self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return
  const url = new URL(request.url)

  if (url.origin !== self.location.origin) {
    // 只缓存跨域图片（图床）；其余第三方请求一律放行
    if (request.destination === 'image') {
      event.respondWith(cacheFirst(IMAGE_CACHE, request, IMAGE_CACHE_MAX))
    }
    return
  }

  if (url.pathname.startsWith('/api/')) return // 不缓存接口
  if (url.pathname.startsWith('/static/files/')) return // 大体积下载文件不缓存

  if (request.mode === 'navigate' || url.searchParams.has('_rsc')) {
    event.respondWith(pageNetworkFirst(request))
    return
  }
  // ... 静态资源、图片、search.json 的分流
})
```

三件容易漏的：

第三方请求一律放行。

Giscus 评论、AdSense、Umami、Cloudflare beacon 不能缓存，缓存了就是脏数据。所以跨域分支里只接 `destination === 'image'`。

`/api/` 不缓存。博客没接口态数据，但留着这个判断以后加功能不会误伤。

`/static/files/` 不缓存。那里放的是 Typora 插件包之类大文件，体积大且没必要离线，缓存纯浪费空间。

另外 `/search.json`（kbar 搜索索引）走 `stale-while-revalidate`，先用旧索引、后台更新，离线也能搜。

## 更新与清理

改了缓存策略，把 `VERSION` 加一，旧缓存会在 `activate` 时清掉：

```js
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
```

注册时 `skipWaiting`，新版本装好即生效，不弹「有新版本」提示。

博客没有 **长表单**、没有编辑器，用户正在读文章时被换掉页面的代价可接受。

换成工具站那种带输入框的场景就不能这么激进，得监听到 `waiting` 后弹一条 **「点此刷新」**。

`message` 监听保留了一个 `SKIP_WAITING` 入口，以后要手动触发更新还能用：

```js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting()
})
```

## 安装引导

安卓 Chrome 能监听到 `beforeinstallprompt`，存到模块级变量，弹个安装按钮即可。`InstallAppButton.tsx` 里两个细节：

```ts
let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()
```

模块级持有 prompt 事件，页面里顶栏和移动抽屉都渲染安装按钮也不会互相抢。

iOS 没有 `beforeinstallprompt`，走「分享 → 添加到主屏幕」，所以组件里判断 `isIosBrowser()` 后显示引导文案而不是按钮。

判断是否已装成 App 用两路：

```ts
function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}
function isIosBrowser() {
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
}
```

iPad 桌面版 Safari 的 UA 和 Mac 一样是 `Macintosh`，得用 `maxTouchPoints > 1` 兜底，否则 iPad 上识别不出是 iOS。

## 注册与 dev 隔离

```ts
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return
    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
  }, [])
  return null
}
```

- 只在生产注册（dev 下缓存住 HMR 资源会「改了没反应」，是 PWA 最常见的开发期坑）；

- 等 `load` 后再注册，不跟首屏关键请求抢带宽；

- 注册失败静默，不支持 SW 的环境站点照常跑。

## 离线兜底

`/offline` 页在 `install` 时预缓存，导航失败且缓存也没有时回落过去。

连离线页都没缓存，`sw.js` 里还留了一段内联兜底，保证至少给用户一句「该页面尚未缓存」而不是白屏。

## 剩下的

这套配置对博客是 **净赚**：离线可读、秒开、桌面常驻，代价只是几行缓存逻辑。

两个边界要记清楚。

- opaque 响应跨域图片必须特殊处理，否则离线配图全丢。

- skipWaiting 只适合无状态页面，带表单的场景必须换保守方案。

还没做的两件事：

- 图片走 Cloudflare 图床，部分大图没做 `wasm` / 预缓存；
- iOS 上的 Web Push 订阅会莫名失效，当前没接。

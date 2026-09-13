const { withContentlayer } = require('next-contentlayer2')

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// You might need to insert additional domains in script-src if you are using external services
// AdSense 域名：script-src 放行 pagead2.googlesyndication.com，frame-src 放行 *.googlesyndication.com / googleads.g.doubleclick.net
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is pagead2.googlesyndication.com static.cloudflareinsights.com;
  style-src 'self' 'unsafe-inline' https://giscus.app;
  img-src * blob: data:;
  media-src 'self' blob: data: *.s3.amazonaws.com;
  connect-src *;
  font-src 'self' data:;
  frame-src giscus.app music.163.com tpc.googlesyndication.com googleads.g.doubleclick.net *.googlesyndication.com;
`

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\n/g, ''),
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const output = process.env.EXPORT ? 'export' : undefined
const basePath = process.env.BASE_PATH || undefined
const unoptimized = process.env.UNOPTIMIZED ? true : undefined

// 旧（中文）URL -> 新（英文 key）URL 的 301 跳转表，由 scripts/generate-redirects.mjs 生成
const legacyRedirects = require('./lib/redirects.generated.cjs')

// 换过分类的文章：generate-redirects.mjs 只负责「中文 URL -> 英文 key」，
// 换目录导致的旧路径要在这里手写保留，否则旧链接会 404。
const movedRedirects = [
  { source: '/blog/tech/pwa-practice', destination: '/blog/AI/pwa-practice', permanent: true },
]

/**
 * @type {import('next/dist/next-server/server/config').NextConfig}
 **/
module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    output,
    basePath,
    reactStrictMode: true,
    trailingSlash: false,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    async redirects() {
      return [...legacyRedirects, ...movedRedirects]
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'picsum.photos',
        },
      ],
      unoptimized,
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: securityHeaders,
        },
        {
          // SW 必须每次都校验，否则新版本发不出去（浏览器最多 24h 才主动更新）
          source: '/sw.js',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' },
            { key: 'Service-Worker-Allowed', value: '/' },
          ],
        },
        {
          source: '/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ]
    },
    webpack: (config, { dev }) => {
      // 关闭生产构建的 webpack 文件系统缓存：Vercel 每次构建都会把 .next/cache
      // （约 330MB）打包上传并留存，命中收益远小于打包 + 上传 + 存储成本。
      // 只作用于生产构建，不影响 `npm run dev`。
      if (!dev) config.cache = false

      return config
    },
  })
}

import 'css/tailwind.css'
import 'remark-github-blockquote-alert/alert.css'

import { Suspense } from 'react'
import Script from 'next/script'
import { Analytics, AnalyticsConfig } from '@/components/analytics/Analytics'
import { SearchDialogController } from '@/components/search/SearchDialogController'
import type { SearchConfig } from '@/components/search/SearchDialog'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import ProgressBar from '@/components/ProgressBar'
import PageTransition from '@/components/PageTransition'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ASoN 的博客`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'zh_CN',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
  // 搜索引擎验证 meta（硬编码，不依赖 env；Bing/Google 要求常驻，勿移除）
  verification: {
    google: 'ENWkPav6SpNVqYhLgratSPLTQFhHYXlRSlSUbnOHn6s',
    other: {
      'msvalidate.01': 'BBA93819F2F865003D80FFBC20FD4392',
      'google-adsense-account': 'ca-pub-1857431419637010',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const basePath = process.env.BASE_PATH || ''

  return (
    <html
      lang={siteMetadata.language}
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${basePath}/static/favicons/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${basePath}/static/favicons/favicon-16x16.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${basePath}/static/favicons/apple-touch-icon.png`}
      />
      <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="preconnect" href="https://api.github.com" />
      {/* 预连接高频第三方源，缩短真实用户的连接与图片加载耗时 */}
      <link
        rel="preconnect"
        href="https://cloudflare-imgbed-91r.pages.dev"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://picsum.photos" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://giscus.app" />
      <link rel="dns-prefetch" href="https://analytics.umami.is" />
      <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      <link rel="alternate" type="application/rss+xml" href={`${basePath}/feed.xml`} />
      <body className="bg-white text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          {/* AdSense 自动广告：仅加载脚本，广告位由 Google 自动插入 */}
          <Script
            id="adsbygoogle"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${
              siteMetadata.verification.other?.['google-adsense-account'] ?? ''
            }`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
          {/* Cloudflare Web Analytics */}
          <Script
            id="cloudflare-web-analytics"
            type="module"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: '04000ba9db054013a748735fe3a8071d' })}
            strategy="afterInteractive"
          />
          <SectionContainer>
            <Suspense fallback={null}>
              <ProgressBar />
            </Suspense>
            <SearchDialogController searchConfig={siteMetadata.search as SearchConfig} />
            <Header />
            <main className="mb-auto px-6 sm:px-10 lg:px-16 xl:px-20">
              <PageTransition>{children}</PageTransition>
            </main>
            <Footer />
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}

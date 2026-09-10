import { MetadataRoute } from 'next'
import siteMetadata from '@/data/siteMetadata'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // /offline 只是 Service Worker 的兜底页，没有内容价值
      disallow: '/offline',
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  }
}

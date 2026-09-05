import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import categoryData from 'app/category-data.json'
import { tagKey } from '@/data/tags'

export const dynamic = 'force-static'

const POSTS_PER_PAGE = 5

// 纯静态页（about/contact/privacy/projects）几乎不再变动，用固定日期而非每次构建的“今天”，
// 否则搜索引擎会认为整个 sitemap 的 lastmod 都不可信。编辑这些页面时请同步更新此常量。
const SITE_STATIC_LASTMOD = '2026-08-20'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

  // 取全站最新文章时间，作为内容相关静态路由（首页/blog/tags/categories）的 lastmod。
  const lastPostDate =
    allBlogs
      .filter((post) => !post.draft)
      .map((post) => post.lastmod || post.date)
      .sort()
      .at(-1) ?? SITE_STATIC_LASTMOD

  const blogRoutes: MetadataRoute.Sitemap = allBlogs
    .filter((post) => !post.draft)
    .map((post) => ({
      url: `${siteUrl}/blog/${post.slug.split('/').map(encodeURIComponent).join('/')}`,
      lastModified: post.lastmod || post.date,
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

  const tagCounts = tagData as Record<string, number>
  const tagRoutes: MetadataRoute.Sitemap = Object.entries(tagCounts)
    // 薄内容页（标签下文章 < 3 篇）不进 sitemap，避免分散权重；权重集中到文章页与分类页。
    .filter(([, count]) => count >= 3)
    .flatMap(([tag, count]) => {
      const lastModified =
        allBlogs
          .filter((post) => post.tags && post.tags.map((t) => tagKey(t)).includes(tag))
          .map((post) => post.lastmod || post.date)
          .sort()
          .at(-1) ?? lastPostDate
      const totalPages = Math.max(1, Math.ceil(count / POSTS_PER_PAGE))
      return Array.from({ length: totalPages }, (_, i) => ({
        url: `${siteUrl}/tags/${encodeURI(tag)}${i > 0 ? `/page/${i + 1}` : ''}`,
        lastModified,
        changeFrequency: 'weekly',
        priority: i === 0 ? 0.6 : 0.4,
      }))
    })

  const categoryCounts = categoryData as Record<string, number>
  const categoryRoutes: MetadataRoute.Sitemap = Object.entries(categoryCounts)
    .filter(([, count]) => count > 0)
    .map(([category]) => ({
      url: `${siteUrl}/categories/${encodeURI(category)}`,
      lastModified:
        allBlogs
          .filter((post) => post.slug?.startsWith(`${category}/`))
          .map((post) => post.lastmod || post.date)
          .sort()
          .at(-1) ?? lastPostDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    }))

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: lastPostDate, changeFrequency: 'daily', priority: 1.0 },
    {
      url: `${siteUrl}/blog`,
      lastModified: lastPostDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: SITE_STATIC_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/tags`,
      lastModified: lastPostDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/categories`,
      lastModified: lastPostDate,
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: SITE_STATIC_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: SITE_STATIC_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: SITE_STATIC_LASTMOD,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  return [...staticRoutes, ...blogRoutes, ...tagRoutes, ...categoryRoutes]
}

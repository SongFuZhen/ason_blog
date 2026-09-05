import { MetadataRoute } from 'next'
import { allBlogs } from 'contentlayer/generated'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'
import categoryData from 'app/category-data.json'
import { tagKey } from '@/data/tags'

export const dynamic = 'force-static'

const POSTS_PER_PAGE = 5

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = siteMetadata.siteUrl

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
    .filter(([, count]) => count > 0)
    .flatMap(([tag, count]) => {
      const lastModified =
        allBlogs
          .filter((post) => post.tags && post.tags.map((t) => tagKey(t)).includes(tag))
          .map((post) => post.lastmod || post.date)
          .sort()
          .at(-1) ?? today()
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
          .at(-1) ?? today(),
      changeFrequency: 'weekly',
      priority: 0.5,
    }))

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: today(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${siteUrl}/blog`, lastModified: today(), changeFrequency: 'weekly', priority: 0.8 },
    {
      url: `${siteUrl}/projects`,
      lastModified: today(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    { url: `${siteUrl}/tags`, lastModified: today(), changeFrequency: 'weekly', priority: 0.5 },
    {
      url: `${siteUrl}/categories`,
      lastModified: today(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    { url: `${siteUrl}/about`, lastModified: today(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: today(), changeFrequency: 'monthly', priority: 0.4 },
    {
      url: `${siteUrl}/privacy`,
      lastModified: today(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  return [...staticRoutes, ...blogRoutes, ...tagRoutes, ...categoryRoutes]
}

function today() {
  return new Date().toISOString().split('T')[0]
}

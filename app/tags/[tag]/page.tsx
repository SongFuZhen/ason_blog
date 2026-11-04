import { allCoreContent, sortPosts } from '@/lib/content/core.mjs'
import siteMetadata from '@/data/siteMetadata'
import ListLayout from '@/layouts/ListLayoutWithTags'
import { allBlogs } from 'contentlayer/generated'
import { tagKey, tagName } from '@/data/tags'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'
import tagData from 'app/tag-data.json'

const POSTS_PER_PAGE = 5

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const tagCounts = tagData as Record<string, number>
  const count = tagCounts[tag] ?? 0

  return genPageMetadata({
    title: tagName(tag),
    description: `${siteMetadata.title} ${tagName(tag)} tagged content`,
    alternates: {
      canonical: './',
      types: {
        'application/rss+xml': `${siteMetadata.siteUrl}/tags/${encodeURI(tag)}/feed.xml`,
      },
    },
    // 文章数 < 3 的标签页属于薄内容，不进 sitemap 也不让搜索引擎索引。
    ...(count < 3 ? { robots: { index: false, follow: true } } : {}),
  })
}

export default async function TagPage(props: { params: Promise<{ tag: string }> }) {
  const params = await props.params
  const tag = decodeURI(params.tag)
  const filteredPosts = allCoreContent(
    sortPosts(allBlogs.filter((post) => post.tags && post.tags.map((t) => tagKey(t)).includes(tag)))
  )
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const initialDisplayPosts = filteredPosts.slice(0, POSTS_PER_PAGE)
  const pagination = {
    currentPage: 1,
    totalPages: totalPages,
  }

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      variant="tag"
      tagSlug={tagName(tag)}
    />
  )
}

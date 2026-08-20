import { allCoreContent, sortPosts } from '@/lib/content/core.mjs'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import ListLayout from '@/layouts/ListLayoutWithTags'

export const metadata = genPageMetadata({
  title: '文章',
  description:
    'ASoN 的个人博客：记录 AI Coding、独立开发与前端技术的实践，分享 AI 打造的产品与日常思考。',
})

export default async function BlogPage() {
  const posts = allCoreContent(sortPosts(allBlogs))

  return <ListLayout posts={posts} initialDisplayPosts={posts} variant="blog" />
}

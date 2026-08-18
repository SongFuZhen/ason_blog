import ListLayout from '@/layouts/ListLayoutWithTags'
import { allCoreContent, sortPosts } from '@/lib/content/core.mjs'
import { allBlogs } from 'contentlayer/generated'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import { Metadata } from 'next'

type CategoryParams = { category: string[] }

export async function generateMetadata(props: {
  params: Promise<CategoryParams>
}): Promise<Metadata> {
  const params = await props.params
  const category = decodeURI(params.category.join('/'))
  return genPageMetadata({
    title: category,
    description: `分类 ${category} 下的所有文章。`,
  })
}

export const generateStaticParams = async () => {
  const categoryCounts = categoryData as Record<string, number>
  return Object.keys(categoryCounts).map((category) => ({
    category: category.split('/'),
  }))
}

export default async function CategoryPage(props: { params: Promise<CategoryParams> }) {
  const params = await props.params
  const categorySlug = decodeURI(params.category.join('/'))
  const filteredPosts = allCoreContent(
    sortPosts(
      allBlogs.filter((post) => {
        const s = post.slug ?? ''
        const idx = s.lastIndexOf('/')
        const cat = idx >= 0 ? s.substring(0, idx) : ''
        return cat === categorySlug
      })
    )
  )

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={filteredPosts}
      variant="category"
      categorySlug={categorySlug}
    />
  )
}

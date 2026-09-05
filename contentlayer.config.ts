import { defineDocumentType, ComputedFields, makeSource } from 'contentlayer2/source-files'
import { writeFileSync, readdirSync } from 'fs'
import readingTime from 'reading-time'
import path from 'path'
import { fromHtmlIsomorphic } from 'hast-util-from-html-isomorphic'
// Remark packages
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { remarkAlert } from 'remark-github-blockquote-alert'
import { remarkCjkEmphasis } from './lib/mdx/remarkCjkEmphasis.mjs'
import {
  remarkExtractFrontmatter,
  remarkCodeTitles,
  remarkImgToJsx,
  extractTocHeadings,
} from './lib/mdx/plugins.mjs'
// Rehype packages
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeKatexNoTranslate from 'rehype-katex-notranslate'
import rehypeCitation from 'rehype-citation'
import rehypePrismPlus from 'rehype-prism-plus'
import rehypePresetMinify from 'rehype-preset-minify'
import siteMetadata from './data/siteMetadata'
import { tagKey } from './data/tags'
import { allCoreContent, sortPosts } from './lib/content/core.mjs'
import prettier from 'prettier'

const root = process.cwd()
const isProduction = process.env.NODE_ENV === 'production'

// heroicon mini link
const icon = fromHtmlIsomorphic(
  `
  <span class="content-header-link">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 linkicon">
  <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
  <path d="M11.603 7.963a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
  </svg>
  </span>
`,
  { fragment: true }
)

// 取 data/blog 下的分类目录名（已是英文 key），作为文章 URL 的分类段。
function categoryKeyOf(doc: { _raw: { flattenedPath: string } }): string {
  return doc._raw.flattenedPath.split('/').slice(1, -1).join('/')
}

const computedFields: ComputedFields = {
  readingTime: { type: 'json', resolve: (doc) => readingTime(doc.body.raw) },
  // 分类目录名（英文 key），如 products / ai
  categoryKey: {
    type: 'string',
    resolve: (doc) => categoryKeyOf(doc),
  },
  // 文章 URL 的路径段：<categoryKey>/<key>，如 products/tool-station
  slug: {
    type: 'string',
    resolve: (doc) => `${categoryKeyOf(doc)}/${doc.key}`,
  },
  // 完整内部路径：blog/<categoryKey>/<key>
  path: {
    type: 'string',
    resolve: (doc) => `blog/${categoryKeyOf(doc)}/${doc.key}`,
  },
  filePath: {
    type: 'string',
    resolve: (doc) => doc._raw.sourceFilePath,
  },
  toc: { type: 'json', resolve: (doc) => extractTocHeadings(doc.body.raw) },
}

/**
 * Count the occurrences of all tags across blog posts and write to json file
 */
async function createTagCount(allBlogs) {
  const tagCount: Record<string, number> = {}
  allBlogs.forEach((file) => {
    if (file.tags && (!isProduction || file.draft !== true)) {
      file.tags.forEach((tag) => {
        const formattedTag = tagKey(tag)
        if (formattedTag in tagCount) {
          tagCount[formattedTag] += 1
        } else {
          tagCount[formattedTag] = 1
        }
      })
    }
  })
  const formatted = await prettier.format(JSON.stringify(tagCount, null, 2), { parser: 'json' })
  writeFileSync('./app/tag-data.json', formatted)
}

/**
 * Recursively scan the `data/blog` subdirectories (one per category/folder,
 * nested folders become subcategories) and count how many posts live in each,
 * then write to json file. Unlike tags, an empty folder still shows up so the
 * category structure stays visible on the list page even before any post is
 * added to it. Category keys use `/` as the nesting separator, e.g.
 * `猫咪/狸花`.
 */
async function createCategoryCount(allBlogs) {
  const blogDir = path.join(root, 'data', 'blog')
  const categoryPaths: string[] = []
  const walk = (dir: string, prefix: string) => {
    let entries
    try {
      entries = readdirSync(dir, { withFileTypes: true })
    } catch {
      return
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const rel = prefix ? `${prefix}/${entry.name}` : entry.name
        categoryPaths.push(rel)
        walk(path.join(dir, entry.name), rel)
      }
    }
  }
  walk(blogDir, '')
  const categoryCount: Record<string, number> = {}
  categoryPaths.forEach((c) => {
    categoryCount[c] = 0
  })
  allBlogs.forEach((file) => {
    const slug = file.slug ?? ''
    const idx = slug.lastIndexOf('/')
    const cat = idx >= 0 ? slug.substring(0, idx) : ''
    if (cat && cat in categoryCount) {
      categoryCount[cat] += 1
    }
  })
  const formatted = await prettier.format(JSON.stringify(categoryCount, null, 2), {
    parser: 'json',
  })
  writeFileSync('./app/category-data.json', formatted)
}

function createSearchIndex(allBlogs) {
  if (
    siteMetadata?.search?.provider === 'kbar' &&
    siteMetadata.search.kbarConfig.searchDocumentsPath
  ) {
    writeFileSync(
      `public/${path.basename(siteMetadata.search.kbarConfig.searchDocumentsPath)}`,
      JSON.stringify(allCoreContent(sortPosts(allBlogs)))
    )
    console.log('Local search index generated...')
  }
}

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: 'blog/**/*.{md,mdx}',
  contentType: 'mdx',
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    categories: { type: 'list', of: { type: 'string' }, default: [] },
    // 英文唯一键，作为 URL 的最终段，如 tool-station
    key: { type: 'string', required: true },
    lastmod: { type: 'date' },
    draft: { type: 'boolean' },
    summary: { type: 'string' },
    images: { type: 'json' },
    authors: { type: 'list', of: { type: 'string' } },
    layout: { type: 'string' },
    bibliography: { type: 'string' },
    canonicalUrl: { type: 'string' },
  },
  computedFields: {
    ...computedFields,
    structuredData: {
      type: 'json',
      resolve: (doc) => {
        const rawBanner = doc.images ? doc.images[0] : siteMetadata.socialBanner
        const image =
          typeof rawBanner === 'string' && rawBanner.startsWith('http')
            ? rawBanner
            : `${siteMetadata.siteUrl}${rawBanner}`
        const logoUrl = siteMetadata.socialBanner.startsWith('http')
          ? siteMetadata.socialBanner
          : `${siteMetadata.siteUrl}${siteMetadata.socialBanner}`
        const url = `${siteMetadata.siteUrl}/blog/${categoryKeyOf(doc)}/${doc.key}`
        return {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: doc.title,
          datePublished: doc.date,
          dateModified: doc.lastmod || doc.date,
          description: doc.summary,
          image,
          url,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
          },
          // Contentlayer2 passes list fields to computed-field resolvers as an
          // Effect-ts `Chunk` (array-like, but no Array.prototype methods) —
          // spread it into a real array before using array methods.
          keywords: [...(doc.tags ?? [])].join(', '),
          articleSection: [...(doc.categories ?? [])],
          publisher: {
            '@type': 'Organization',
            name: siteMetadata.title,
            logo: {
              '@type': 'ImageObject',
              url: logoUrl,
            },
          },
        }
      },
    },
  },
}))

export const Authors = defineDocumentType(() => ({
  name: 'Authors',
  filePathPattern: 'authors/**/*.mdx',
  contentType: 'mdx',
  fields: {
    name: { type: 'string', required: true },
    avatar: { type: 'string' },
    occupation: { type: 'string' },
    company: { type: 'string' },
    email: { type: 'string' },
    twitter: { type: 'string' },
    bluesky: { type: 'string' },
    linkedin: { type: 'string' },
    github: { type: 'string' },
    layout: { type: 'string' },
  },
  computedFields,
}))

export default makeSource({
  contentDirPath: 'data',
  documentTypes: [Blog, Authors],
  mdx: {
    cwd: process.cwd(),
    remarkPlugins: [
      remarkExtractFrontmatter,
      remarkGfm,
      remarkCodeTitles,
      remarkMath,
      remarkImgToJsx,
      remarkAlert,
      remarkCjkEmphasis,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'prepend',
          headingProperties: {
            className: ['content-header'],
          },
          content: icon,
        },
      ],
      rehypeKatex,
      rehypeKatexNoTranslate,
      [rehypeCitation, { path: path.join(root, 'data') }],
      [rehypePrismPlus, { defaultLanguage: 'js', ignoreMissing: true }],
      rehypePresetMinify,
    ],
  },
  onSuccess: async (importData) => {
    const { allBlogs } = await importData()
    createTagCount(allBlogs)
    createCategoryCount(allBlogs)
    createSearchIndex(allBlogs)
  },
})

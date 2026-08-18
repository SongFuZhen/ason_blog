'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import type { CoreContent } from '@/lib/content/types'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import TerminalWindow from '@/components/home/TerminalWindow'
import tagData from 'app/tag-data.json'
import categoryData from 'app/category-data.json'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function termDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, ' ')} ${d.getUTCFullYear()}`
}

interface PaginationProps {
  totalPages: number
  currentPage: number
}

interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
  /** `blog` → grouped `ls -la ~/blog`; `tag` → `grep "#tag"`; `category` → `grep "分类:..."`. */
  variant?: 'blog' | 'tag' | 'category'
  /** Slug of the active tag (required when variant is `tag`). */
  tagSlug?: string
  /** Slug of the active category (required when variant is `category`). */
  categorySlug?: string
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="flex items-center justify-between border-t border-gray-200 pt-3 text-xs dark:border-gray-800">
      {prevPage ? (
        <Link
          href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
          rel="prev"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
        >
          ‹ 上一页
        </Link>
      ) : (
        <span className="text-gray-300 dark:text-gray-600">‹ 上一页</span>
      )}
      <span className="text-gray-400 dark:text-gray-500">
        page {currentPage} / {totalPages}
      </span>
      {nextPage ? (
        <Link
          href={`/${basePath}/page/${currentPage + 1}`}
          rel="next"
          className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
        >
          下一页 ›
        </Link>
      ) : (
        <span className="text-gray-300 dark:text-gray-600">下一页 ›</span>
      )}
    </div>
  )
}

function PostItem({ post, index }: { post: CoreContent<Blog>; index: number }) {
  const { path, date, title, summary } = post
  return (
    <li
      key={path}
      className="animate-item-reveal opacity-0"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <Link
        href={`/${path}`}
        className="group -mx-3 block rounded-lg px-3 py-3 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-800/40"
      >
        <div className="grid grid-cols-[auto_1fr] gap-x-3">
          <span className="shrink-0 font-mono text-gray-400 dark:text-gray-500">
            {termDate(date)}
          </span>
          <div className="min-w-0">
            <span className="text-primary-600 dark:text-primary-400 truncate text-sm font-medium underline-offset-2 group-hover:underline">
              {title}
            </span>
            {summary && (
              <p className="mt-1 line-clamp-2 text-gray-500 dark:text-gray-400">{summary}</p>
            )}
          </div>
        </div>
      </Link>
    </li>
  )
}

export default function ListLayoutWithTags({
  posts,
  initialDisplayPosts = [],
  pagination,
  variant = 'blog',
  tagSlug,
  categorySlug,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts
  const isTag = variant === 'tag'
  const isCategory = variant === 'category'
  const currentTagSlug =
    tagSlug ?? (isTag ? (pathname.split('/tags/')[1]?.split('/')[0] ?? '') : '')
  const currentCategorySlug =
    categorySlug ?? (isCategory ? (pathname.split('/categories/')[1] ?? '') : '')

  // Group blog posts by their folder/category (derived from the slug), so the
  // list page mirrors an `ls -la ~/blog` with one directory per category.
  const categoryCounts = categoryData as Record<string, number>
  const categoryKeys = Object.keys(categoryCounts)
  let runIndex = 0
  const groups = (() => {
    if (variant !== 'blog') return []
    const map = new Map<string, CoreContent<Blog>[]>()
    categoryKeys.forEach((c) => map.set(c, []))
    const uncategorized: CoreContent<Blog>[] = []
    displayPosts.forEach((post) => {
      const s = post.slug ?? ''
      const idx = s.lastIndexOf('/')
      const cat = idx >= 0 ? s.substring(0, idx) : ''
      if (cat && map.has(cat)) map.get(cat)!.push(post)
      else uncategorized.push(post)
    })
    const result = categoryKeys.map((c) => ({ name: c, posts: map.get(c)! }))
    if (uncategorized.length) result.push({ name: '未分类', posts: uncategorized })
    return result
  })()

  return (
    <article className="mx-auto min-h-screen max-w-3xl pt-16 pb-16">
      <TerminalWindow
        title={
          isTag
            ? `ls -la ~/blog | grep "#${currentTagSlug}"`
            : isCategory
              ? `ls -la ~/blog | grep "分类:${currentCategorySlug}"`
              : 'ls -la ~/blog'
        }
        shell="zsh"
        className="animate-hero-reveal"
      >
        {isTag && (
          <Link
            href="/tags"
            className="hover:text-primary-600 dark:hover:text-primary-400 inline-block text-xs text-gray-500 transition-colors dark:text-gray-400"
          >
            cd ~/tags
          </Link>
        )}
        {isCategory && (
          <Link
            href="/categories"
            className="hover:text-primary-600 dark:hover:text-primary-400 inline-block text-xs text-gray-500 transition-colors dark:text-gray-400"
          >
            cd ~/categories
          </Link>
        )}

        {/* summary line */}
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {isTag
            ? `~/tags/${currentTagSlug}/ · 共 ${posts.length} 篇`
            : isCategory
              ? `~/categories/${currentCategorySlug}/ · 共 ${posts.length} 篇`
              : `total ${posts.length} 篇`}
        </div>

        {/* file listing, grouped by category on the blog index */}
        {variant === 'blog' ? (
          <div className="space-y-4">
            {groups.map((group) => (
              <section key={group.name}>
                <Link
                  href={`/categories/${encodeURI(group.name)}`}
                  className="group flex items-baseline gap-x-2 text-xs"
                >
                  <span className="font-mono text-gray-400 dark:text-gray-500">dr-xr-xr-x</span>
                  <span className="text-primary-600 dark:text-primary-400 truncate underline underline-offset-2 transition-opacity group-hover:opacity-80">
                    {group.name}/
                  </span>
                  <span className="text-gray-400 no-underline dark:text-gray-500">
                    {group.posts.length} 篇
                  </span>
                </Link>
                <ul className="mt-1 space-y-2 divide-y divide-gray-100 text-xs dark:divide-gray-800/50">
                  {group.posts.map((post) => (
                    <PostItem key={post.path} post={post} index={runIndex++} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ) : (
          <ul className="space-y-2 divide-y divide-gray-100 text-xs dark:divide-gray-800/50">
            {displayPosts.map((post) => (
              <PostItem key={post.path} post={post} index={runIndex++} />
            ))}
          </ul>
        )}

        {/* pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )}

        {/* tag browser — separate bottom section (blog only) */}
        {!isTag && !isCategory && sortedTags.length > 0 && (
          <div className="border-t border-gray-200 pt-3 text-xs dark:border-gray-800">
            <div className="text-gray-400 dark:text-gray-500">tags {sortedTags.length}个</div>
            <div className="mt-2 flex flex-wrap">
              {sortedTags.map((t) => {
                const active = decodeURI(pathname.split('/tags/')[1] ?? '') === slug(t)
                return (
                  <Link
                    key={t}
                    href={`/tags/${slug(t)}`}
                    className={
                      active
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 mt-1 ml-1 rounded px-2 py-0.5'
                        : 'mt-1 ml-1 rounded px-2 py-0.5 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                    }
                  >
                    #{t}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </TerminalWindow>
    </article>
  )
}

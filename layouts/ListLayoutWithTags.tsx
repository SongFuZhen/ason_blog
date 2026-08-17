'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import type { CoreContent } from '@/lib/content/types'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import TerminalWindow from '@/components/home/TerminalWindow'
import tagData from 'app/tag-data.json'

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
  /** `blog` → `ls -la ~/blog`; `tag` → `ls -la ~/blog | grep "#tag"`. */
  variant?: 'blog' | 'tag'
  /** Slug of the active tag (required when variant is `tag`). */
  tagSlug?: string
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

export default function ListLayoutWithTags({
  posts,
  initialDisplayPosts = [],
  pagination,
  variant = 'blog',
  tagSlug,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts
  const isTag = variant === 'tag'
  const currentTagSlug =
    tagSlug ?? (isTag ? (pathname.split('/tags/')[1]?.split('/')[0] ?? '') : '')

  return (
    <article className="mx-auto min-h-screen max-w-3xl pt-16 pb-16">
      <TerminalWindow
        title={isTag ? `ls -la ~/blog | grep "#${currentTagSlug}"` : 'ls -la ~/blog'}
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

        {/* summary line */}
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {isTag ? `~/tags/${currentTagSlug}/ · 共 ${posts.length} 篇` : `total ${posts.length} 篇`}
        </div>

        {/* file listing */}
        <ul className="space-y-2 divide-y divide-gray-100 text-xs dark:divide-gray-800/50">
          {displayPosts.map((post, index) => {
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
                        <p className="mt-1 line-clamp-2 text-gray-500 dark:text-gray-400">
                          {summary}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>

        {/* pagination */}
        {pagination && pagination.totalPages > 1 && (
          <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
        )}

        {/* tag browser — separate bottom section (blog only) */}
        {!isTag && sortedTags.length > 0 && (
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

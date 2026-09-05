import { ReactNode } from 'react'
import type { CoreContent } from '@/lib/content/types'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'
import siteMetadata from '@/data/siteMetadata'
import { categoryName } from '@/data/categories'
import { tagKey, tagName } from '@/data/tags'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import PrintButton from '@/components/PrintButton'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { path, slug: postSlug, date, title, tags, filePath, categoryKey } = content
  const basePath = path.split('/')[0]
  const folder = postSlug.includes('/') ? postSlug.split('/').slice(0, -1).join('/') : ''
  const folderName = categoryKey ? categoryName(categoryKey) : folder
  const fileName = filePath?.replace(/^blog\//, '') ?? `${postSlug}.mdx`
  const authorNames = authorDetails.map((author) => author.name).filter(Boolean)
  const authorLabel = authorNames.length > 0 ? authorNames.join('、') : 'ason'
  const minutes = content.readingTime?.minutes

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      {/* 屏幕上用 4xl 宽度；打印时收缩回 A4 纸宽，配合打印样式输出 A4 版式 */}
      <article className="mx-auto min-h-screen max-w-4xl pt-16 pb-16 print:max-w-[210mm]">
        <TerminalWindow
          title={`~/blog/${postSlug}`}
          shell="less"
          className="animate-hero-reveal print-window"
        >
          {/* command line */}
          <div className="text-gray-400 dark:text-gray-500 print:hidden">
            <Prompt>cat {fileName}</Prompt>
          </div>

          {/* output: folder + title + metadata + tags */}
          <div className="space-y-2">
            {folder && (
              <Link
                href={`/categories/${encodeURI(folder)}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-block font-mono text-lg font-semibold transition-colors"
              >
                {folderName}/
              </Link>
            )}
            <h1 className="font-mono text-xl leading-snug font-semibold text-gray-900 sm:text-2xl dark:text-gray-100">
              {title}
            </h1>
            <div className="flex items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                {authorLabel}
                {` · `}
                {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                {minutes ? ` · 约 ${Math.ceil(minutes)} 分钟阅读` : ''}
              </span>
              <PrintButton />
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${tagKey(tag)}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    #{tagName(tag)}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="text-gray-300 dark:text-gray-700 print:hidden">────────────────</div>

          {/* body — terminal-scale mono typography */}
          <div className="prose dark:prose-invert post-prose max-w-none font-mono">{children}</div>

          {/* prev / next */}
          {(next || prev) && (
            <div className="grid gap-3 border-t border-gray-200 pt-4 text-xs sm:grid-cols-2 dark:border-gray-800 print:hidden">
              {prev && prev.path ? (
                <Link
                  href={`/${prev.path}`}
                  className="group hover:border-primary-300 dark:hover:border-primary-700 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-100/50 dark:border-gray-800 dark:hover:bg-gray-900/50"
                >
                  <span className="text-gray-400 dark:text-gray-500">← 上一篇</span>
                  <p className="group-hover:text-primary-600 dark:group-hover:text-primary-400 mt-1 text-gray-700 transition-colors dark:text-gray-300">
                    {prev.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
              {next && next.path ? (
                <Link
                  href={`/${next.path}`}
                  className="group hover:border-primary-300 dark:hover:border-primary-700 rounded-lg border border-gray-200 p-3 text-right transition-colors hover:bg-gray-100/50 dark:border-gray-800 dark:hover:bg-gray-900/50"
                >
                  <span className="text-gray-400 dark:text-gray-500">下一篇 →</span>
                  <p className="group-hover:text-primary-600 dark:group-hover:text-primary-400 mt-1 text-gray-700 transition-colors dark:text-gray-300">
                    {next.title}
                  </p>
                </Link>
              ) : (
                <span />
              )}
            </div>
          )}

          {/* comments — terminal-styled, at the very bottom */}
          {siteMetadata.comments && (
            <div
              id="comment"
              className="border-t border-gray-200 pt-6 dark:border-gray-800 print:hidden"
            >
              <div className="text-gray-400 dark:text-gray-500">
                <Prompt>cat comments</Prompt>
              </div>
              <Comments />
            </div>
          )}

          {/* back link + blinking prompt */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-xs dark:border-gray-800 print:hidden">
            <Link
              href={`/${basePath}`}
              className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-500 transition-colors dark:text-gray-400"
            >
              cd ~/{basePath}
            </Link>
            <div className="text-gray-400 dark:text-gray-500">
              <Prompt path={`~/blog/${postSlug}`} />
              <span className="animate-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-gray-800 dark:bg-gray-200" />
            </div>
          </div>
        </TerminalWindow>
      </article>
    </SectionContainer>
  )
}

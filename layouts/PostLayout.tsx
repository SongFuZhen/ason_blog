import { ReactNode } from 'react'
import type { CoreContent } from '@/lib/content/types'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import SectionContainer from '@/components/SectionContainer'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'
import { slug } from 'github-slugger'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

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
  const { path, slug: postSlug, date, title, tags } = content
  const basePath = path.split('/')[0]
  const folder = postSlug.includes('/') ? postSlug.split('/').slice(0, -1).join('/') : ''
  const authorNames = authorDetails.map((author) => author.name).filter(Boolean)
  const authorLabel = authorNames.length > 0 ? authorNames.join('、') : 'ason'
  const minutes = content.readingTime?.minutes

  return (
    <SectionContainer>
      <ScrollTopAndComment />
      <article className="mx-auto min-h-screen max-w-3xl pt-16 pb-16">
        <TerminalWindow title={`~/blog/${postSlug}`} shell="less" className="animate-hero-reveal">
          {/* command line */}
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>cat {postSlug}.mdx</Prompt>
          </div>

          {/* output: folder + title + metadata + tags */}
          <div className="space-y-2">
            {folder && (
              <Link
                href={`/categories/${encodeURI(folder)}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-block text-2xl font-bold tracking-tight transition-colors"
              >
                {folder}/
              </Link>
            )}
            <h1 className="font-heading text-3xl leading-snug font-semibold text-gray-900 sm:text-4xl dark:text-gray-100">
              {title}
            </h1>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {authorLabel}
              {` · `}
              {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
              {minutes ? ` · 约 ${Math.ceil(minutes)} 分钟阅读` : ''}
            </div>
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tags/${slug(tag)}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="text-gray-300 dark:text-gray-700">────────────────</div>

          {/* body — readable typography, not forced monospace */}
          <div className="prose dark:prose-invert post-prose max-w-none font-sans">{children}</div>

          {/* prev / next */}
          {(next || prev) && (
            <div className="grid gap-3 border-t border-gray-200 pt-4 text-xs sm:grid-cols-2 dark:border-gray-800">
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
            <div id="comment" className="border-t border-gray-200 pt-6 dark:border-gray-800">
              <div className="text-gray-400 dark:text-gray-500">
                <Prompt>cat comments</Prompt>
              </div>
              <Comments slug={postSlug} title={title} />
            </div>
          )}

          {/* back link + blinking prompt */}
          <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-xs dark:border-gray-800">
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

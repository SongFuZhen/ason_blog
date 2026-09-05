import Link from '@/components/Link'
import tagData from 'app/tag-data.json'
import { tagName } from '@/data/tags'
import { allCoreContent } from '@/lib/content/core.mjs'
import { allBlogs } from 'contentlayer/generated'
import { genPageMetadata } from 'app/seo'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'

export const metadata = genPageMetadata({
  title: '标签',
  description: '按主题浏览文章。',
})

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const totalTaggedPosts = allCoreContent(allBlogs).filter(
    (post) => post.tags && post.tags.length > 0
  ).length
  const topTags = sortedTags.slice(0, 3)

  return (
    <article className="mx-auto min-h-screen max-w-4xl pt-16 pb-16 print:max-w-[210mm]">
      <TerminalWindow title="ls -la ~/tags" shell="zsh" promptTitle className="animate-hero-reveal">
        {/* hero */}
        <div>
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>cat ~/tags/README.md</Prompt>
          </div>
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            按主题浏览文章。每个目录是一个标签，点击即可进入对应的归档。
          </p>
        </div>

        {/* command line */}
        <div className="text-gray-400 dark:text-gray-500">
          <Prompt>ls -la ~/tags</Prompt>
        </div>

        {/* summary line */}
        <div className="text-xs text-gray-400 dark:text-gray-500">
          total {sortedTags.length} tags · {totalTaggedPosts} posts
        </div>

        {/* each tag is a directory you can cd into */}
        <ul className="space-y-1 text-xs">
          {sortedTags.map((tag, idx) => (
            <li key={tag}>
              <Link
                href={`/tags/${tag}`}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-x-3"
              >
                <span className="shrink-0 text-gray-400 dark:text-gray-500">
                  dr-xr-xr-x {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-primary-600 dark:text-primary-400 truncate underline underline-offset-2 transition-opacity group-hover:opacity-80">
                  {tagName(tag)}/
                  <span className="ml-2 text-gray-400 no-underline dark:text-gray-500">
                    {tagCounts[tag]} 篇
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* hot tags */}
        {topTags.length > 0 && (
          <div className="border-t border-gray-200 pt-3 text-xs dark:border-gray-800">
            <span className="text-gray-400 dark:text-gray-500">hot: </span>
            {topTags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 ml-1 rounded px-2 py-0.5"
              >
                {tagName(tag)}/
              </Link>
            ))}
          </div>
        )}
      </TerminalWindow>
    </article>
  )
}

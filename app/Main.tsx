import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from '@/lib/content/types'
import Link from '@/components/Link'
import { LabHero } from '@/components/home/LabHero'
import { LogoBlob } from '@/components/home/LogoBlob'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'

const MAX_DISPLAY = 10

export default function Home({ posts }: { posts: CoreContent<Blog>[] }) {
  const top10 = posts.slice(0, MAX_DISPLAY)

  const categoryCounts = new Map<string, number>()
  for (const post of posts) {
    for (const category of [...(post.categories ?? [])]) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1)
    }
  }

  return (
    <div className="relative min-h-[60vh] pt-16 pb-16">
      <div className="lg:grid lg:grid-cols-[400px_1fr] lg:items-start">
        {/* Left: logo (hidden when there isn't room for the right column) */}
        <aside className="hidden lg:flex">
          <LogoBlob />
        </aside>

        {/* Right: terminal hero (whoami + now + projects + posts) */}
        <div className="min-w-0">
          <LabHero posts={posts} />

          {posts.length > MAX_DISPLAY && (
            <div className="flex justify-end pt-4 text-sm font-medium">
              <Link
                href="/blog"
                className="text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                aria-label="查看全部文章"
              >
                全部文章 &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Blog Top 10：标题 + 摘要 + 分类内链，为首页补充可收录文本 */}
      <section className="mt-10" aria-label="博客 Top 10 文章">
        <TerminalWindow title="~/blog --top10" shell="less" className="animate-hero-reveal">
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>ls -la ~/blog --top10</Prompt>
          </div>

          <ol className="mt-2 space-y-4">
            {top10.map((post, i) => (
              <li key={post.slug} className="text-sm">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="shrink-0 text-gray-400 dark:text-gray-500">
                    {String(i + 1).padStart(2, '0')}.
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline-offset-2 transition-colors hover:underline"
                  >
                    {post.title}
                  </Link>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {post.date?.slice(0, 10)}
                  </span>
                  {[...(post.categories ?? [])].map((category) => (
                    <Link
                      key={category}
                      href={`/categories/${encodeURI(category)}`}
                      className="hover:text-primary-600 dark:hover:text-primary-400 text-xs text-gray-400 transition-colors dark:text-gray-500"
                    >
                      #{category}
                    </Link>
                  ))}
                </div>
                {post.summary && (
                  <p className="mt-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
                    {post.summary}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
            <div className="text-gray-400 dark:text-gray-500">
              <Prompt>ls ~/blog/</Prompt>
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              {[...categoryCounts.entries()].map(([category, count]) => (
                <li key={category}>
                  <Link
                    href={`/categories/${encodeURI(category)}`}
                    className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-700 transition-colors dark:text-gray-300"
                  >
                    {category}/
                  </Link>
                  <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">{count} 篇</span>
                </li>
              ))}
            </ul>
          </div>
        </TerminalWindow>
      </section>
    </div>
  )
}

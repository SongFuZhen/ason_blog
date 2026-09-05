import type React from 'react'
import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from '@/lib/content/types'
import Link from '@/components/Link'
import { Prompt } from '@/components/home/TerminalWindow'
import { profile } from '@/data/profile'
import projectsData from '@/data/projectsData'

const MAX_DISPLAY = 10

export function LabHero({ posts }: { posts: CoreContent<Blog>[] }) {
  const prompt = (
    <>
      <span className="text-primary-600 dark:text-primary-400">ason@blog</span>
      <span className="text-gray-400 dark:text-gray-500"> ~ % </span>
    </>
  )

  // 产品分类下的文章，去掉与 projectsData 重复的（标题含项目名的），只补没有独立站点的产品文
  const productPosts = posts.filter(
    (post) =>
      [...(post.categories ?? [])].includes('产品') &&
      !projectsData.some((project) => post.title.includes(project.title))
  )

  const categoryCounts = new Map<string, number>()
  for (const post of posts) {
    for (const category of [...(post.categories ?? [])]) {
      categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1)
    }
  }

  return (
    <div className="min-w-0">
      {/* Terminal session */}
      <div
        className="animate-hero-reveal overflow-hidden rounded-xl border border-gray-200 bg-gray-50/60 font-mono text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
        style={{ animationDelay: '0ms' }}
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2.5 dark:border-gray-800">
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
          <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">ason@blog: ~ — zsh</span>
        </div>

        {/* Body */}
        <div className="space-y-5 px-4 py-5 leading-relaxed">
          {/* whoami */}
          <div>
            <div className="text-gray-400 dark:text-gray-500">{prompt}whoami</div>
            <h1 className="mt-1 text-gray-800 dark:text-gray-200">{profile.title}</h1>
          </div>

          {/* cat now.md */}
          <div>
            <div className="text-gray-400 dark:text-gray-500">{prompt}cat now.md</div>
            <div className="mt-1 space-y-1 text-gray-800 dark:text-gray-200">
              {profile.now
                .split('。')
                .filter(Boolean)
                .map((line) => (
                  <p key={line}>{line}。</p>
                ))}
            </div>
          </div>

          {/* ls -la ~/products */}
          {projectsData.length > 0 && (
            <div>
              <div className="text-gray-400 dark:text-gray-500">{prompt}ls -la ~/products</div>
              <div className="mt-1 space-y-1 text-gray-800 dark:text-gray-200">
                <div className="text-gray-400 dark:text-gray-500">
                  total {projectsData.length + productPosts.length}
                </div>
                <ul className="space-y-1 pt-0.5 font-mono text-xs">
                  {projectsData.map((project) => {
                    // 显示名优先用对应产品文的文章标题（如 画廊 → 灵绘画廊）
                    const linkedPost = posts.find(
                      (post) =>
                        [...(post.categories ?? [])].includes('产品') &&
                        post.title.includes(project.title)
                    )
                    return (
                      <li key={project.title}>
                        <Link
                          href={project.href ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group grid grid-cols-[auto_1fr] items-baseline gap-x-2 transition-opacity hover:opacity-80"
                        >
                          <span className="text-gray-400 dark:text-gray-500">
                            {project.perms ?? '-rw-r--r--'}
                          </span>
                          <span className="grid min-w-0 grid-cols-[auto_auto_1fr] items-baseline gap-x-2">
                            <span className="text-gray-400 dark:text-gray-500">ason</span>
                            <span className="text-gray-400 dark:text-gray-500">staff</span>
                            <span
                              className="project-name truncate"
                              style={
                                {
                                  '--proj-color': project.color,
                                  '--proj-color-dark': project.colorDark,
                                } as React.CSSProperties
                              }
                            >
                              <span className="underline underline-offset-2">
                                {linkedPost?.title ?? project.title}
                              </span>
                              <span aria-hidden className="ml-1 text-gray-400 dark:text-gray-500">
                                →
                              </span>
                            </span>
                            <span className="col-start-3 mt-0.5 text-xs leading-6 text-gray-500 dark:text-gray-400">
                              {project.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                  {productPosts.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group grid grid-cols-[auto_1fr] items-baseline gap-x-2 transition-opacity hover:opacity-80"
                      >
                        <span className="text-gray-400 dark:text-gray-500">-rw-r--r--</span>
                        <span className="grid min-w-0 grid-cols-[auto_auto_1fr] items-baseline gap-x-2">
                          <span className="text-gray-400 dark:text-gray-500">ason</span>
                          <span className="text-gray-400 dark:text-gray-500">staff</span>
                          <span className="text-primary-600 dark:text-primary-400 truncate">
                            <span className="underline underline-offset-2">{post.title}</span>
                            <span aria-hidden className="ml-1 text-gray-400 dark:text-gray-500">
                              →
                            </span>
                          </span>
                          {post.summary && (
                            <span className="col-start-3 mt-0.5 text-xs leading-6 text-gray-500 dark:text-gray-400">
                              {post.summary}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ason@blog: ~/blog --top10 -less */}
          {posts.length > 0 && (
            <div>
              <div className="text-gray-400 dark:text-gray-500">
                <span className="text-primary-600 dark:text-primary-400">ason@blog</span>
                {': ~/blog --top10 -less'}
              </div>

              <ol className="mt-2 space-y-4">
                {posts.slice(0, MAX_DISPLAY).map((post, i) => (
                  <li key={post.slug} className="grid grid-cols-[auto_1fr] gap-x-2 text-sm">
                    <span className="shrink-0 text-gray-400 dark:text-gray-500">-rw-r--r--</span>
                    <div className="min-w-0">
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
                    </div>
                  </li>
                ))}
              </ol>

              <div className="mt-6 border-t border-gray-200 pt-4 dark:border-gray-800">
                <div className="text-gray-400 dark:text-gray-500">
                  <Prompt>ls ~/categories/</Prompt>
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
                      <span className="ml-1 text-xs text-gray-400 dark:text-gray-500">
                        {count} 篇
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* blinking cursor prompt */}
          <div className="text-gray-400 dark:text-gray-500">
            {prompt}
            <span className="animate-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-gray-800 dark:bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

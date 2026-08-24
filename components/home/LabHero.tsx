import type React from 'react'
import type { Blog } from 'contentlayer/generated'
import type { CoreContent } from '@/lib/content/types'
import Link from '@/components/Link'
import { profile } from '@/data/profile'
import projectsData from '@/data/projectsData'

const MAX_DISPLAY = 5
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function shortDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, ' ')}`
}

export function LabHero({ posts }: { posts: CoreContent<Blog>[] }) {
  const prompt = (
    <>
      <span className="text-primary-600 dark:text-primary-400">ason@blog</span>
      <span className="text-gray-400 dark:text-gray-500"> ~ % </span>
    </>
  )

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
            <div className="mt-1 text-gray-800 dark:text-gray-200">{profile.title}</div>
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
                <div className="text-gray-400 dark:text-gray-500">total {projectsData.length}</div>
                <ul className="space-y-0.5 pt-0.5 font-mono text-xs">
                  {projectsData.map((project) => (
                    <li key={project.title}>
                      <Link
                        href={project.href ?? '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group grid grid-cols-[auto_auto_auto_1fr] items-baseline gap-x-2 transition-opacity hover:opacity-80"
                      >
                        <span className="text-gray-400 dark:text-gray-500">
                          {project.perms ?? '-rw-r--r--'}
                        </span>
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
                          <span className="underline underline-offset-2">{project.title}</span>
                          <span aria-hidden className="ml-1 text-gray-400 dark:text-gray-500">
                            →
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ls -la ~/blog */}
          {posts.length > 0 && (
            <div>
              <div className="text-gray-400 dark:text-gray-500">{prompt}ls -la ~/blog</div>
              <div className="mt-1 space-y-1 text-gray-800 dark:text-gray-200">
                <div className="text-gray-400 dark:text-gray-500">
                  total {Math.min(posts.length, MAX_DISPLAY)}
                </div>
                <ul className="space-y-0.5 pt-0.5 font-mono text-xs">
                  {posts.slice(0, MAX_DISPLAY).map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="group grid grid-cols-[auto_auto_auto_auto_1fr] items-baseline gap-x-2 transition-opacity hover:opacity-80"
                      >
                        <span className="text-gray-400 dark:text-gray-500">-rw-r--r--</span>
                        <span className="text-gray-400 dark:text-gray-500">ason</span>
                        <span className="text-gray-400 dark:text-gray-500">staff</span>
                        <span className="text-gray-400 dark:text-gray-500">
                          {shortDate(post.date)}
                        </span>
                        <span className="text-primary-600 dark:text-primary-400 truncate">
                          <span className="underline underline-offset-2">{post.title}</span>
                          <span aria-hidden className="ml-1 text-gray-400 dark:text-gray-500">
                            →
                          </span>
                        </span>
                      </Link>
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

import externalPosts, { type ExternalPost } from '@/data/externalPosts'
import { termDate } from '@/lib/utils'

const PLATFORM_STYLES: Record<string, string> = {
  公众号·图文: 'text-blue-700 dark:text-blue-400',
  掘金: 'text-blue-700 dark:text-blue-400',
  小红书: 'text-red-600 dark:text-red-400',
  知乎: 'text-sky-700 dark:text-sky-400',
}

function PlatformBadge({ platform }: { platform: string }) {
  const style =
    Object.entries(PLATFORM_STYLES).find(([key]) => platform.includes(key))?.[1] ??
    'text-gray-500 dark:text-gray-400'
  return <span className={`shrink-0 font-mono text-[10px] leading-4 ${style}`}>[{platform}]</span>
}

export default function ExternalPosts({ startIndex = 0 }: { startIndex?: number }) {
  if (externalPosts.length === 0) return null

  const groups: { platform: string; posts: ExternalPost[] }[] = []
  externalPosts.forEach((p) => {
    const group = groups.find((g) => g.platform === p.platform)
    if (group) group.posts.push(p)
    else groups.push({ platform: p.platform, posts: [p] })
  })

  let runIndex = startIndex

  return (
    <section className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/30">
      <div className="flex items-baseline gap-x-2">
        <span className="font-mono text-xs text-gray-400 dark:text-gray-500">lrwxrwxrwx</span>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">external/</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          {externalPosts.length} 篇 · 外链
        </span>
      </div>
      <ul className="mt-1 text-xs [&>li:last-child_a>div]:border-b-0">
        {groups.map((group) =>
          group.posts.map((post) => {
            const delay = runIndex++ * 40
            return (
              <li
                key={post.url}
                className="animate-item-reveal ml-1.5 opacity-0"
                style={{ animationDelay: `${delay}ms` }}
              >
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block py-1.5 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-800/40"
                >
                  <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-3 border-b border-dashed border-gray-200 pb-1.5 dark:border-gray-700">
                    <span className="shrink-0 font-mono whitespace-pre text-gray-400 dark:text-gray-500">
                      {post.date ? termDate(post.date) : '-- -- ----'}
                    </span>
                    <span className="flex min-w-0 items-baseline gap-x-2">
                      <PlatformBadge platform={post.platform} />
                      <span className="text-primary-600 dark:text-primary-400 truncate text-[13px] font-medium underline-offset-2 group-hover:underline">
                        {post.title}
                      </span>
                    </span>
                    <span className="group-hover:text-primary-500 shrink-0 text-[10px] text-gray-300 transition-colors dark:text-gray-600">
                      ↗
                    </span>
                  </div>
                </a>
              </li>
            )
          })
        )}
      </ul>
    </section>
  )
}

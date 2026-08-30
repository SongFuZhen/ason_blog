import Link from '@/components/Link'
import TerminalWindow from '@/components/home/TerminalWindow'
import resourcesData, { type Resource } from '@/data/resourcesData'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: '资源' })

const platformTag: Record<Resource['platform'], string> = {
  闲鱼: 'text-amber-600 dark:text-amber-400',
  小红书: 'text-red-600 dark:text-red-400',
  免费: 'text-emerald-600 dark:text-emerald-400',
}

function ResourceItem({ resource, index }: { resource: Resource; index: number }) {
  const onSale = resource.status === '在售'
  const body = (
    <div className="grid grid-cols-[auto_1fr] gap-x-3 border-b border-dashed border-gray-200 pb-1.5 dark:border-gray-700">
      <span className={`shrink-0 font-mono text-[11px] ${platformTag[resource.platform]}`}>
        [{resource.platform}]
      </span>
      <div className="min-w-0">
        <span className="flex flex-wrap items-baseline gap-x-2">
          <span
            className={`text-[13px] font-medium underline-offset-2 group-hover:underline ${
              onSale
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-400 line-through dark:text-gray-500'
            }`}
          >
            {resource.title}
          </span>
          {resource.price !== '免费' && (
            <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
              {resource.price}
            </span>
          )}
          {!onSale && (
            <span className="font-mono text-[11px] text-gray-400 dark:text-gray-500">已下架</span>
          )}
        </span>
        {resource.description && (
          <p className="mt-1 line-clamp-2 text-gray-500 dark:text-gray-400">
            {resource.description}
          </p>
        )}
      </div>
    </div>
  )
  return (
    <li
      className="animate-item-reveal ml-1.5 opacity-0"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {resource.href && onSale ? (
        <Link
          href={resource.href}
          aria-label={resource.title}
          className="group block py-1.5 transition-colors hover:bg-gray-100/60 dark:hover:bg-gray-800/40"
        >
          {body}
        </Link>
      ) : (
        <div className="group block py-1.5 opacity-70">{body}</div>
      )}
    </li>
  )
}

export default function Resources() {
  const platforms: Resource['platform'][] = ['免费', '闲鱼', '小红书']
  const groups = platforms
    .map((p) => ({ name: p, items: resourcesData.filter((r) => r.platform === p) }))
    .filter((g) => g.items.length > 0)
  let runIndex = 0

  return (
    <article className="mx-auto min-h-screen max-w-3xl pt-16 pb-16">
      <TerminalWindow title="ls -la ~/resources" shell="zsh" className="animate-hero-reveal">
        {/* summary line */}
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>total {resourcesData.length} 条</span>
          <span className="font-mono text-[11px]">
            公众号 / 闲鱼 / 小红书 App 搜索「轻前端」也可找到
          </span>
        </div>

        {/* file listing, grouped by platform */}
        <div className="space-y-5">
          {groups.map((group) => (
            <section
              key={group.name}
              className="rounded-lg border border-gray-100 bg-gray-50/50 px-3 py-2 dark:border-gray-800 dark:bg-gray-900/30"
            >
              <div className="flex items-baseline gap-x-2">
                <span className="font-mono text-xs text-gray-400 dark:text-gray-500">
                  dr-xr-xr-x
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {group.name}/
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {group.items.length} 条
                </span>
              </div>
              <ul className="mt-1 text-xs [&>li:last-child_a>div]:border-b-0">
                {group.items.map((resource) => (
                  <ResourceItem key={resource.title} resource={resource} index={runIndex++} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      </TerminalWindow>
    </article>
  )
}

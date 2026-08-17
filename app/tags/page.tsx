import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({
  title: '标签',
  description: '按主题浏览文章。',
})

const themePrinciples = [
  {
    title: '阅读优先',
    description:
      '正文、列表与标签计数都使用低饱和度的灰色，确保强调色不会与长文阅读相互争抢注意力。',
  },
  {
    title: '实验室气质',
    description:
      '矿物青色仅出现在需要被识别的地方：链接、聚焦态、进度条、标签与关键状态，像仪表盘上的一盏指示灯。',
  },
  {
    title: '暗色稳定',
    description: '暗色模式使用深青灰背景与更亮的强调色，让悬停态、链接与代码细节清晰可见且不刺眼。',
  },
]

const colorScale = [
  { label: 'Primary 500', className: 'bg-primary-500', text: '核心链接与进度' },
  { label: 'Primary 100', className: 'bg-primary-100', text: '标签背景与提示' },
  { label: 'Gray 950', className: 'bg-gray-950', text: '暗色背景基底' },
  { label: 'Gray 200', className: 'bg-gray-200', text: '分隔线与边界' },
]

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const totalTaggedPosts = sortedTags.reduce((total, tag) => total + tagCounts[tag], 0)
  const topTags = sortedTags.slice(0, 4)

  return (
    <div className="min-w-0 overflow-x-hidden py-10 sm:py-14">
      <section className="border-b border-gray-200 pb-10 dark:border-gray-800">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div className="min-w-0">
            <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">主题索引</p>
            <h1 className="mt-3 text-4xl leading-tight font-semibold tracking-normal text-gray-950 sm:text-5xl dark:text-gray-50">
              标签
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-gray-600 dark:text-gray-300">
              用标签连接相关的笔记、教程、随笔与项目复盘。
            </p>
          </div>

          <dl className="grid min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-200 text-center sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-800">
            <div className="bg-white p-5 dark:bg-gray-950">
              <dt className="text-sm text-gray-500 dark:text-gray-400">标签</dt>
              <dd className="mt-2 text-3xl font-semibold text-gray-950 dark:text-gray-50">
                {sortedTags.length}
              </dd>
            </div>
            <div className="bg-white p-5 dark:bg-gray-950">
              <dt className="text-sm text-gray-500 dark:text-gray-400">已标签文章</dt>
              <dd className="mt-2 text-3xl font-semibold text-gray-950 dark:text-gray-50">
                {totalTaggedPosts}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="min-w-0 py-10">
        <div className="flex min-w-0 flex-wrap gap-x-3 gap-y-3 sm:gap-x-5">
          {tagKeys.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">还没有标签。</p>
          )}
          {sortedTags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${slug(tag)}`}
              className="hover:bg-primary-50 hover:text-primary-700 hover:ring-primary-100 dark:hover:bg-primary-950 dark:hover:text-primary-300 dark:hover:ring-primary-800 text-primary-600 dark:text-primary-400 inline-flex max-w-full items-baseline gap-1 rounded-full bg-gray-50 px-3 py-2 text-sm font-medium uppercase ring-1 ring-gray-200 transition-colors dark:bg-gray-900 dark:ring-gray-800"
              aria-label={`查看标签为 ${tag} 的文章`}
            >
              <span className="min-w-0 break-words">{tag.split(' ').join('-')}</span>
              <span className="font-semibold text-gray-500 dark:text-gray-400">
                {`(${tagCounts[tag]})`}
              </span>
            </Link>
          ))}
        </div>

        {topTags.length > 0 && (
          <div className="mt-8 flex min-w-0 flex-wrap gap-2 border-t border-gray-200 pt-6 dark:border-gray-800">
            <span className="mr-2 text-sm text-gray-500 dark:text-gray-400">热门主题</span>
            {topTags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${slug(tag)}`}
                className="bg-primary-50 text-primary-700 ring-primary-100 hover:bg-primary-100 dark:bg-primary-950 dark:text-primary-300 dark:ring-primary-800 dark:hover:bg-primary-900 rounded-full px-3 py-1 text-sm font-medium ring-1 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-gray-200 py-10 dark:border-gray-800">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="min-w-0">
            <p className="text-primary-600 dark:text-primary-400 text-sm font-medium">矿物青</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-normal text-gray-950 dark:text-gray-50">
              主题配色理念
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
              这套配色用低饱和的矿物青取代了更暖的装饰色，让模板呈现出安静的技术实验室气质：可靠的工具、清晰的信息，以及恰到好处的颜色来标识导航与状态。
            </p>
          </div>

          <div className="min-w-0 space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {themePrinciples.map((principle) => (
                <article
                  key={principle.title}
                  className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950"
                >
                  <h3 className="text-sm font-semibold text-gray-950 dark:text-gray-50">
                    {principle.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-400">
                    {principle.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-900">
              <div className="grid gap-4 sm:grid-cols-4">
                {colorScale.map((item) => (
                  <div key={item.label}>
                    <div
                      className={`h-14 rounded-md ring-1 ring-gray-950/10 dark:ring-white/10 ${item.className}`}
                    />
                    <p className="mt-3 text-sm font-semibold text-gray-950 dark:text-gray-50">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

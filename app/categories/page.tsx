import Link from '@/components/Link'
import categoryData from 'app/category-data.json'
import { genPageMetadata } from 'app/seo'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'

export const metadata = genPageMetadata({
  title: '分类',
  description: '按分类浏览文章。',
})

export default async function Page() {
  const categoryCounts = categoryData as Record<string, number>
  const categoryKeys = Object.keys(categoryCounts).sort((a, b) =>
    a.localeCompare(b, 'zh-CN', { numeric: true })
  )
  const totalPosts = categoryKeys.reduce((total, cat) => total + categoryCounts[cat], 0)

  return (
    <article className="mx-auto min-h-screen max-w-3xl pt-16 pb-16">
      <TerminalWindow
        title="ls -la ~/categories"
        shell="zsh"
        promptTitle
        className="animate-hero-reveal"
      >
        {/* hero */}
        <div>
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>cat ~/categories/README.md</Prompt>
          </div>
          <p className="mt-1 text-gray-700 dark:text-gray-300">
            按分类浏览文章。每个目录是一个分类，对应 data/blog
            下的一个文件夹，点击即可进入对应的归档。
          </p>
        </div>

        {/* command line */}
        <div className="text-gray-400 dark:text-gray-500">
          <Prompt>ls -la ~/categories</Prompt>
        </div>

        {/* summary line */}
        <div className="text-xs text-gray-400 dark:text-gray-500">
          total {categoryKeys.length} 分类 · {totalPosts} posts
        </div>

        {/* each category is a directory you can cd into; nested categories indent */}
        <ul className="space-y-1 text-xs">
          {categoryKeys.map((cat, idx) => {
            const depth = cat.split('/').length - 1
            const label =
              depth === 0 ? `${cat}/` : `${'  '.repeat(depth)}↳ ${cat.split('/').pop()}/`
            return (
              <li key={cat} style={{ paddingLeft: `${depth * 1.25}rem` }}>
                <Link
                  href={`/categories/${encodeURI(cat)}`}
                  className="group grid grid-cols-[auto_1fr] items-baseline gap-x-3"
                >
                  <span className="shrink-0 text-gray-400 dark:text-gray-500">
                    dr-xr-xr-x {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="text-primary-600 dark:text-primary-400 truncate underline underline-offset-2 transition-opacity group-hover:opacity-80">
                    {label}
                    <span className="ml-2 text-gray-400 no-underline dark:text-gray-500">
                      {categoryCounts[cat]} 篇
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </TerminalWindow>
    </article>
  )
}

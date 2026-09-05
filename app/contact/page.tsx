import Link from '@/components/Link'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { profile } from '@/data/profile'

export const metadata = genPageMetadata({
  title: '联系',
  description: '与博客作者取得联系的方式：电子邮件、GitHub 与 RSS。',
})

export default function Page() {
  return (
    <article className="mx-auto min-h-screen max-w-4xl px-6 pt-16 pb-16 sm:px-10 print:max-w-[210mm]">
      <TerminalWindow title="~/contact" shell="less" className="animate-hero-reveal">
        <div className="text-gray-400 dark:text-gray-500">
          <Prompt>cat ~/contact.md</Prompt>
        </div>
        <h1 className="font-heading text-2xl font-semibold text-gray-900 dark:text-gray-100">
          联系
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          欢迎就文章内容、合作或任何问题与我联系。
        </p>

        <ul className="mt-4 space-y-2 text-sm">
          <li className="flex gap-3">
            <span className="w-20 shrink-0 text-gray-400 dark:text-gray-500">email</span>
            {siteMetadata.email ? (
              <Link
                href={`mailto:${siteMetadata.email}`}
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                {siteMetadata.email}
              </Link>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">
                尚未配置（可在 <code>data/siteMetadata.js</code> 设置 <code>email</code>）
              </span>
            )}
          </li>
          <li className="flex gap-3">
            <span className="w-20 shrink-0 text-gray-400 dark:text-gray-500">github</span>
            <Link
              href={siteMetadata.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              {siteMetadata.github}
            </Link>
          </li>
          <li className="flex gap-3">
            <span className="w-20 shrink-0 text-gray-400 dark:text-gray-500">rss</span>
            <Link
              href={`${siteMetadata.siteUrl}/feed.xml`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              {siteMetadata.siteUrl}/feed.xml
            </Link>
          </li>
        </ul>

        <p className="mt-4 text-gray-500 dark:text-gray-400">
          一般而言，我会在数日内回复邮件与 GitHub 上的 Issue /
          私信。如果是文章中的技术讨论，也欢迎直接在对应文章下留言（若已启用评论）。
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          本站作者：{profile.name}（{profile.title}）
        </p>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-xs dark:border-gray-800">
          <Link
            href="/"
            className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-500 transition-colors dark:text-gray-400"
          >
            cd ~/
          </Link>
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt path="~" />
            <span className="animate-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-gray-800 dark:bg-gray-200" />
          </div>
        </div>
      </TerminalWindow>
    </article>
  )
}

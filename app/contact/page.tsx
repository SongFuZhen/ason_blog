import Link from '@/components/Link'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'
import { profile } from '@/data/profile'

export const metadata = genPageMetadata({
  title: '联系',
  description: '与博客作者取得联系的方式：电子邮件、GitHub 与 RSS。',
})

export default function Page() {
  return (
    <article className="mx-auto min-h-screen max-w-3xl px-6 pt-16 pb-16 sm:px-10">
      <h1 className="font-heading text-3xl font-semibold tracking-normal text-gray-900 sm:text-4xl dark:text-gray-100">
        联系
      </h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        欢迎就文章内容、合作或任何问题与我联系。
      </p>

      <div className="prose dark:prose-invert mt-8 max-w-none text-gray-700 dark:text-gray-300">
        <ul>
          {siteMetadata.email ? (
            <li>
              <strong>电子邮件：</strong>
              <Link href={`mailto:${siteMetadata.email}`}>{siteMetadata.email}</Link>
            </li>
          ) : (
            <li>
              <strong>电子邮件：</strong>
              <span className="text-gray-500 dark:text-gray-400">
                尚未配置。可在 <code>data/siteMetadata.js</code> 中设置 <code>email</code>{' '}
                字段后显示。
              </span>
            </li>
          )}
          <li>
            <strong>GitHub：</strong>
            <Link href={siteMetadata.github} target="_blank" rel="noopener noreferrer">
              {siteMetadata.github}
            </Link>
          </li>
          <li>
            <strong>RSS：</strong>
            <Link
              href={`${siteMetadata.siteUrl}/feed.xml`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteMetadata.siteUrl}/feed.xml
            </Link>
          </li>
        </ul>

        <p>
          一般而言，我会在数日内回复邮件与 GitHub 上的 Issue / 私信。
          如果是文章中的技术讨论，也欢迎直接在对应文章下留言（若已启用评论）。
        </p>

        <p className="text-sm text-gray-500 dark:text-gray-400">
          本站作者：{profile.name}（{profile.title}）
        </p>
      </div>
    </article>
  )
}

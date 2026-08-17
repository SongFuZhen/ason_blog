import Link from '@/components/Link'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'
import { genPageMetadata } from 'app/seo'
import siteMetadata from '@/data/siteMetadata'

export const metadata = genPageMetadata({
  title: '隐私政策',
  description:
    '本站的隐私政策，说明我们如何收集、使用与保护您的数据，以及第三方广告（Google AdSense）相关 cookie 的使用与退出方式。',
})

const LAST_UPDATED = '2026-08-18'

export default function Page() {
  return (
    <article className="mx-auto min-h-screen max-w-3xl px-6 pt-16 pb-16 sm:px-10">
      <TerminalWindow title="~/privacy" shell="less" className="animate-hero-reveal">
        <div className="text-gray-400 dark:text-gray-500">
          <Prompt>cat ~/privacy.md</Prompt>
        </div>
        <h1 className="font-heading text-2xl font-semibold text-gray-900 dark:text-gray-100">
          隐私政策
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">最后更新：{LAST_UPDATED}</p>

        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
          <h2>我们是谁</h2>
          <p>
            本网站（{siteMetadata.siteUrl}）由 {siteMetadata.author}{' '}
            运营，是一个以内容为先的个人博客。
            我们重视您的隐私，本政策说明我们如何收集、使用与保护您在使用本网站时的信息。
          </p>

          <h2>我们收集的信息</h2>
          <ul>
            <li>
              <strong>匿名分析数据：</strong>
              本网站可能使用隐私友好的访问统计，记录页面浏览量、来源与大致地区等聚合数据，用于了解内容受欢迎程度，不包含可直接识别个人的信息。
            </li>
            <li>
              <strong>评论：</strong>
              若您启用并使用了评论功能，您提交的名称与内容会被存储，以便在本站展示与回复。
            </li>
            <li>
              <strong>服务器日志：</strong>
              与绝大多数网站一样，我们的托管服务可能会自动记录访问的 IP
              地址、浏览器类型、访问时间与页面路径，用于安全防护与故障排查。
            </li>
          </ul>

          <h2>Cookie 的使用</h2>
          <p>
            本网站使用少量 cookie，主要用于记住您的主题偏好（浅色 / 深色）以及维持基本站点功能。
            您可以在浏览器的设置中管理或清除 cookie；部分功能可能因禁用 cookie 而受限。
          </p>

          <h2>第三方广告（Google AdSense）</h2>
          <p>
            本网站使用 Google AdSense 展示广告。Google 及其合作伙伴会使用 cookie（包括名为 DART 的
            cookie） 根据您此前访问本网站或其他网站的情况向您投放广告。这些 cookie
            用于让广告与您更相关、 限制同一条广告的展示次数，并帮助衡量广告效果。
          </p>
          <p>您可以通过以下方式选择退出个性化广告：</p>
          <ul>
            <li>
              Google 广告设置：
              <Link
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.google.com/settings/ads
              </Link>
            </li>
            <li>
              Google 广告与内容网络隐私政策：
              <Link
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://policies.google.com/technologies/ads
              </Link>
            </li>
            <li>
              第三方广告 cookie 退出（About Ads）：
              <Link
                href="https://www.aboutads.info/choices"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.aboutads.info/choices
              </Link>
            </li>
          </ul>
          <p>
            选择退出后，您仍会看到广告，但广告的相关性与个性化程度会降低。除 Google AdSense 外，
            本网站目前不嵌入其他广告网络。
          </p>

          <h2>您的权利</h2>
          <p>
            您有权了解我们持有的关于您的数据，并在适用法律允许的范围内要求更正或删除。
            如需行使上述权利或有任何隐私相关疑问，请通过下方
            <Link href="/contact"> 联系页面 </Link>
            与我们取得联系。
          </p>

          <h2>本政策的变更</h2>
          <p>
            我们可能不时更新本隐私政策。任何重大变更都会在本页面发布，并以「最后更新」日期标注。
            继续使用本网站即表示您接受更新后的政策。
          </p>
        </div>

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

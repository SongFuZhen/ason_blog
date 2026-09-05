import Image from 'next/image'
import Link from '@/components/Link'
import Comments from '@/components/Comments'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'
import { profile } from '@/data/profile'

const skillLines = [
  { key: 'language', items: profile.skills.languages },
  { key: 'frontend', items: profile.skills.frontend },
  { key: 'content', items: profile.skills.content },
  { key: 'deploy', items: profile.skills.deployment },
]

export function AboutPage() {
  return (
    <article className="mx-auto min-h-screen max-w-3xl px-6 pt-16 pb-16 sm:px-10">
      <TerminalWindow title="~/about" shell="less" className="animate-hero-reveal">
        <div className="text-gray-400 dark:text-gray-500">
          <Prompt>cat ~/about.md</Prompt>
        </div>

        <div className="flex items-start gap-4">
          <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-900">
            <Image src={profile.avatar} alt="" fill className="object-cover" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {profile.name}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {profile.title} · {profile.location}
            </p>
          </div>
        </div>

        <p className="text-sm leading-7 text-gray-700 dark:text-gray-300">{profile.intro}</p>

        <blockquote className="border-l-2 border-gray-300 pl-3 text-xs leading-6 text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {profile.quote}
        </blockquote>

        {profile.interests.length > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {profile.interests.map((interest) => `#${interest}`).join('  ')}
          </p>
        )}

        <div>
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>cat ~/skills</Prompt>
          </div>
          <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {skillLines.map((line) => (
              <li key={line.key} className="flex gap-3">
                <span className="w-24 shrink-0 text-gray-400 dark:text-gray-500">{line.key}</span>
                <span>{line.items.join(', ')}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>ls ~/blog --guide</Prompt>
          </div>
          <ol className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {profile.siteHistory.map((item, i) => (
              <li key={item} className="flex gap-3">
                <span className="w-6 shrink-0 text-gray-400 dark:text-gray-500">{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>

        <div>
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>cat ~/site.md</Prompt>
          </div>
          <div className="mt-2 space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>{profile.site.positioning}</p>
            <p className="text-gray-400 dark:text-gray-500">这个网站写给谁：</p>
            <ul className="space-y-1">
              {profile.site.audience.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="text-primary-600 dark:text-primary-400">
                    ›
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>cat ~/contact</Prompt>
          </div>
          <div className="mt-2 flex flex-wrap items-start gap-4 text-sm text-gray-700 dark:text-gray-300">
            <figure className="w-28 text-center">
              <Image
                src={profile.contact.feishuQrcode}
                alt="飞书联系二维码，扫码添加 ASoN 的飞书好友"
                width={160}
                height={160}
                className="mx-auto h-auto w-28 rounded-sm border border-gray-200 dark:border-gray-800"
              />
              <figcaption className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                飞书 · 扫码添加
              </figcaption>
            </figure>
            <p className="flex-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
              {profile.contact.feishuNote}
            </p>
          </div>
        </div>

        <div>
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>cat ~/donate</Prompt>
          </div>
          <div className="mt-2 flex flex-wrap items-start gap-4 text-sm text-gray-700 dark:text-gray-300">
            <figure className="w-28 text-center">
              <Image
                src={profile.donate.paypalQrcode}
                alt="PayPal 收款二维码，自愿捐赠支持本站服务器开销"
                width={160}
                height={160}
                className="mx-auto h-auto w-28 rounded-sm border border-gray-200 dark:border-gray-800"
              />
              <figcaption className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                PayPal · 自愿捐赠
              </figcaption>
            </figure>
            <p className="flex-1 text-xs leading-6 text-gray-500 dark:text-gray-400">
              {profile.donate.note}
            </p>
          </div>
        </div>

        <div id="comment" className="border-t border-gray-200 pt-4 dark:border-gray-800">
          <div className="text-gray-400 dark:text-gray-500">
            <Prompt>cat comments</Prompt>
          </div>
          <Comments slug="about" title="关于" />
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-xs dark:border-gray-800">
          <Link
            href="/"
            className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-500 transition-colors dark:text-gray-400"
          >
            cd ~/
          </Link>
        </div>
      </TerminalWindow>
    </article>
  )
}

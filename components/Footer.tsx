import type React from 'react'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Link from './Link'
import Image from './Image'
import projectsData from '@/data/projectsData'
import { profile } from '@/data/profile'

const prompt = (
  <>
    <span className="text-primary-600 dark:text-primary-400">ason@blog</span>
    <span className="text-gray-400 dark:text-gray-500"> ~ % </span>
  </>
)

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 font-mono text-sm dark:border-gray-800">
      <div className="grid gap-8 px-6 py-10 sm:px-10 md:grid-cols-[2fr_1fr_1fr] md:gap-0 md:divide-x md:divide-gray-200 lg:px-16 xl:px-20 md:dark:divide-gray-800">
        {/* Left: whoami + contacts + copyright */}
        <div className="space-y-4 md:pr-8">
          <div className="text-gray-400 dark:text-gray-500">{prompt}whoami</div>
          <p className="text-gray-800 dark:text-gray-200">{profile.title}</p>
          {/* Thanks */}
          <div>
            <div className="text-gray-400 dark:text-gray-500">{prompt}cat THANKS</div>
            <p className="mt-1 text-gray-800 dark:text-gray-200">
              感谢{' '}
              <Link
                href="https://vercel.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Vercel
              </Link>{' '}
              的免费托管、
              <Link
                href="https://github.com/ruoduan-hub/next-blog-skyplume-template"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                Skyplume
              </Link>{' '}
              框架，以及{' '}
              <Link
                href="https://opencode.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
              >
                OpenCode
              </Link>
              ——这个网站就是这样搭建起来的。
            </p>
          </div>
          <div className="flex items-center gap-5">
            <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
            <SocialIcon kind="github" href={siteMetadata.github} size={5} />
            <SocialIcon kind="rss" href={`${siteMetadata.siteUrl}/feed.xml`} size={5} />
          </div>
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            <Link
              href="/about"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              关于
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              联系
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              隐私政策
            </Link>
          </div>
          <div className="pt-2 text-xs text-gray-400 dark:text-gray-500">
            <span>{`© ${new Date().getFullYear()} `}</span>
            <span>{siteMetadata.author}</span>
          </div>
        </div>

        {/* Middle: mini-program + 公众号 */}
        <div className="space-y-3 md:px-8">
          <div className="text-gray-400 dark:text-gray-500">~/scan-qrcode</div>
          <div className="flex gap-4">
            <Link
              href="/blog/产品/陇中乡音词典"
              className="block flex-1 text-center transition-colors"
            >
              <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                小程序
                <br />
                陇中乡音词典
              </div>
              <Image
                src="/static/images/longzhong-miniapp.jpg"
                alt="陇中乡音词典小程序二维码"
                width={160}
                height={160}
                className="mx-auto mt-2 h-auto w-20 rounded-sm"
              />
              <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">扫码体验</div>
            </Link>
            <div className="block flex-1 text-center">
              <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                公众号
                <br />
                轻前端
              </div>
              <Image
                src="/static/images/qrcode_for_gh_ec1c60eb836a_258.jpg"
                alt="ason产品公众号二维码"
                width={160}
                height={160}
                className="mx-auto mt-2 h-auto w-20 rounded-sm"
              />
              <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">扫码关注</div>
            </div>
            <div className="block flex-1 text-center">
              <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                闲鱼
                <br />
                轻前端ASoN
              </div>
              <Image
                src="/static/images/xianyu-qrcode.jpg"
                alt="闲鱼店铺二维码"
                width={160}
                height={160}
                className="mx-auto mt-2 h-auto w-20 rounded-sm"
              />
              <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">扫码逛逛</div>
            </div>
          </div>
        </div>

        {/* Right: products */}
        <div className="space-y-3 md:px-8">
          <div className="text-gray-400 dark:text-gray-500">~/products</div>
          <ul className="grid grid-cols-2 gap-2">
            {projectsData.map((project) => (
              <li key={project.title}>
                <Link
                  href={project.href ?? '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:border-primary-500/60 block rounded-sm border border-gray-200 px-3 py-2 transition-colors dark:border-gray-800"
                >
                  <span className="flex items-baseline justify-between gap-2">
                    <span
                      className="project-name text-sm font-medium"
                      style={
                        {
                          '--proj-color': project.color,
                          '--proj-color-dark': project.colorDark,
                        } as React.CSSProperties
                      }
                    >
                      {project.title}
                    </span>
                    <span aria-hidden className="text-gray-400 dark:text-gray-500">
                      →
                    </span>
                  </span>
                  <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
                    {project.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

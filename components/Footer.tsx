import type React from 'react'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import Link from './Link'
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
      <div className="grid gap-8 px-6 py-10 sm:px-10 md:grid-cols-[2fr_1fr] md:gap-0 md:divide-x md:divide-gray-200 lg:px-16 xl:px-20 md:dark:divide-gray-800">
        {/* Left: whoami + contacts + copyright */}
        <div className="space-y-4 md:pr-8">
          <div className="text-gray-400 dark:text-gray-500">{prompt}whoami</div>
          <p className="text-gray-800 dark:text-gray-200">{profile.title}</p>
          <div className="flex items-center gap-5">
            <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
            <SocialIcon kind="github" href={siteMetadata.github} size={5} />
            <SocialIcon kind="rss" href={`${siteMetadata.siteUrl}/feed.xml`} size={5} />
          </div>
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            <Link
              href="/privacy"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              隐私政策
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              联系
            </Link>
          </div>
          <div className="pt-2 text-xs text-gray-400 dark:text-gray-500">
            <span>{`© ${new Date().getFullYear()} `}</span>
            <span>{siteMetadata.author}</span>
          </div>
        </div>

        {/* Right: products */}
        <div className="space-y-3 md:px-8">
          <div className="text-gray-400 dark:text-gray-500">~/products</div>
          <ul className="space-y-2">
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

import Image from 'next/image'
import Link from '@/components/Link'
import { profile } from '@/data/profile'
import projectsData from '@/data/projectsData'

type LabHeroProps = {
  postCount: number
}

export function LabHero({ postCount }: LabHeroProps) {
  const prompt = (
    <>
      <span className="text-primary-600 dark:text-primary-400">ason@blog</span>
      <span className="text-gray-400 dark:text-gray-500"> ~ % </span>
    </>
  )

  return (
    <section className="relative grid items-center gap-12 pt-16 pb-16 md:grid-cols-[1fr_300px]">
      {/* Left column */}
      <div className="min-w-0">
        {/* Terminal session */}
        <div
          className="animate-hero-reveal overflow-hidden rounded-xl border border-gray-200 bg-gray-50/60 font-mono text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900/60"
          style={{ animationDelay: '0ms' }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2.5 dark:border-gray-800">
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
            <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
              ason@blog: ~ — zsh
            </span>
          </div>

          {/* Body */}
          <div className="space-y-5 px-4 py-5 leading-relaxed">
            {/* whoami */}
            <div>
              <div className="text-gray-400 dark:text-gray-500">{prompt}whoami</div>
              <div className="mt-1 text-gray-800 dark:text-gray-200">
                {profile.name} — {profile.title}
              </div>
            </div>

            {/* cat now.md */}
            <div>
              <div className="text-gray-400 dark:text-gray-500">{prompt}cat now.md</div>
              <div className="mt-1 space-y-1 text-gray-800 dark:text-gray-200">
                {profile.now
                  .split('。')
                  .filter(Boolean)
                  .map((line) => (
                    <p key={line}>{line}。</p>
                  ))}
              </div>
            </div>

            {/* ls -la ~/projects */}
            {projectsData.length > 0 && (
              <div>
                <div className="text-gray-400 dark:text-gray-500">{prompt}ls -la ~/projects</div>
                <div className="mt-1 space-y-1 text-gray-800 dark:text-gray-200">
                  <div className="text-gray-400 dark:text-gray-500">
                    total {projectsData.length}
                  </div>
                  <div className="text-gray-400 dark:text-gray-500">
                    drwxr-xr-x ason staff ~/projects
                  </div>
                  <ul className="space-y-0.5 pt-0.5">
                    {projectsData.map((project) => (
                      <li key={project.title}>
                        <Link
                          href={project.href ?? '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group hover:text-primary-600 dark:hover:text-primary-400 inline-flex items-center gap-2 transition-colors"
                        >
                          <span className="text-primary-500 dark:text-primary-400">●</span>
                          <span className="underline-offset-2 group-hover:underline">
                            {project.title}
                          </span>
                          <span aria-hidden className="text-gray-400">
                            ↗
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* blinking cursor prompt */}
            <div className="text-gray-400 dark:text-gray-500">
              {prompt}
              <span className="animate-blink ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-gray-800 dark:bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div
          className="animate-hero-reveal mt-6 flex flex-col gap-3 font-mono text-sm"
          style={{ animationDelay: '240ms' }}
        >
          {profile.email && (
            <Link
              href={`mailto:${profile.email}`}
              className="hover:border-primary-500 hover:text-primary-600 dark:hover:border-primary-400 dark:hover:text-primary-400 inline-flex w-fit items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
              Email
            </Link>
          )}
        </div>

        {/* Right: logo card (matching terminal style) */}
      </div>
      <div
        className="animate-hero-reveal relative mx-auto hidden w-[280px] md:block"
        style={{ animationDelay: '120ms' }}
      >
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/60">
          <div className="border-b border-gray-200 px-4 py-2.5 font-mono text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
            ~/ason
          </div>
          <div className="p-8">
            <Image
              src="/static/images/logo/logo-full.webp"
              alt="Ason Logo"
              width={280}
              height={280}
              className="aspect-square w-full object-contain dark:invert"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

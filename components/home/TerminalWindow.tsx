import type { ReactNode } from 'react'

/**
 * Reusable terminal window shell, mirroring the homepage `LabHero` look:
 * a zsh title bar (three dots + `ason@blog: <title> -<shell>`, or
 * `ason@blog ~ % <title> -<shell>` when `promptTitle` is set) wrapping a
 * monospace body. Used by the post page, the blog list, and the tag pages so
 * every "screen" shares one visual language.
 */

interface TerminalWindowProps {
  /** Path shown in the title bar, e.g. `~/blog/<slug>` or `~/tags`. */
  title: string
  children: ReactNode
  /** Extra classes for the window (e.g. an entrance animation). */
  className?: string
  /** Extra classes appended to the body wrapper (after the default spacing). */
  bodyClassName?: string
  /** Shell name shown after the em-dash in the title bar. */
  shell?: string
  /** Render the title bar as a prompt (`ason@blog ~ % <title>`) instead of `ason@blog: <title>`. */
  promptTitle?: boolean
}

export function Prompt({ path = '~', children }: { path?: string; children?: ReactNode }) {
  return (
    <>
      <span className="text-primary-600 dark:text-primary-400">ason@blog</span>
      <span className="text-gray-400 dark:text-gray-500">{` ${path} % `}</span>
      {children}
    </>
  )
}

export default function TerminalWindow({
  title,
  children,
  className = '',
  bodyClassName = '',
  shell = 'zsh',
  promptTitle = false,
}: TerminalWindowProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-gray-200 bg-gray-50/60 font-mono text-sm shadow-sm dark:border-gray-800 dark:bg-gray-900/60 ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-2.5 dark:border-gray-800">
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span className="h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-700" />
        <span className="ml-2 truncate text-xs text-gray-400 dark:text-gray-500">
          {promptTitle ? (
            <>
              <Prompt>{title}</Prompt> -{shell}
            </>
          ) : (
            <>
              ason@blog: {title} -{shell}
            </>
          )}
        </span>
      </div>
      <div className={`space-y-5 px-4 py-5 leading-relaxed ${bodyClassName}`}>{children}</div>
    </div>
  )
}

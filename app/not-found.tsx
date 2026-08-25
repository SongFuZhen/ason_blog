import Link from '@/components/Link'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-16">
      <TerminalWindow title="~" shell="zsh" className="animate-hero-reveal w-full">
        <div className="flex flex-col gap-4">
          <div className="space-y-4 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              <Prompt>ls ./page</Prompt>
            </div>

            <pre className="text-sm leading-relaxed break-words whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {`ls: cannot access './page': No such file or directory`}
            </pre>

            <div className="space-y-2">
              <h1 className="font-mono text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                404
              </h1>
              <p className="font-mono text-lg text-gray-600 dark:text-gray-400">页面未找到</p>
              <p className="font-mono text-sm text-gray-500 dark:text-gray-500">
                你访问的页面不存在，或已被移至其他位置。
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 pt-4 text-xs dark:border-gray-800">
            <Link
              href="/"
              className="hover:text-primary-600 dark:hover:text-primary-400 text-gray-500 transition-colors dark:text-gray-400"
            >
              cd ~/
            </Link>
          </div>
        </div>
      </TerminalWindow>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from '@/components/Link'
import TerminalWindow, { Prompt } from '@/components/home/TerminalWindow'
import ReloadButton from '@/components/pwa/ReloadButton'

// 这是 SW 的离线兜底页，不是内容页，别进搜索索引。
export const metadata: Metadata = {
  title: '离线',
  robots: { index: false, follow: false },
}

export default function Offline() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-24 pb-16">
      <TerminalWindow title="~" shell="zsh" className="animate-hero-reveal w-full">
        <div className="flex flex-col gap-4">
          <div className="space-y-4 text-center">
            <div className="text-gray-400 dark:text-gray-500">
              <Prompt>ping ason.top</Prompt>
            </div>

            <pre className="text-sm leading-relaxed break-words whitespace-pre-wrap text-gray-800 dark:text-gray-200">
              {`Request timeout for icmp_seq 0\nnetwork is unreachable`}
            </pre>

            <div className="space-y-2">
              <h1 className="font-mono text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                离线
              </h1>
              <p className="font-mono text-lg text-gray-600 dark:text-gray-400">当前没有网络连接</p>
              <p className="font-mono text-sm text-gray-500 dark:text-gray-500">
                这个页面还没被缓存。你浏览过的文章仍可离线打开。
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
            <ReloadButton />
          </div>
        </div>
      </TerminalWindow>
    </div>
  )
}

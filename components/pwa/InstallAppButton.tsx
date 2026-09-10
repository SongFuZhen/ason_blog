'use client'

import { useCallback, useEffect, useState } from 'react'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// beforeinstallprompt 只在部分浏览器触发（Chromium 系）。
// 事件在模块级持有，页面里多处渲染这个按钮也不会互相抢 prompt。
let deferredPrompt: BeforeInstallPromptEvent | null = null
const listeners = new Set<() => void>()
let initialized = false

function notify() {
  listeners.forEach((listener) => listener())
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIosBrowser() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  return /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)
}

function init() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as BeforeInstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    notify()
  })
}

function useInstallState() {
  const [state, setState] = useState({ canInstall: false, installed: false, ios: false })

  useEffect(() => {
    init()
    const sync = () =>
      setState({
        canInstall: Boolean(deferredPrompt),
        installed: isStandalone(),
        ios: isIosBrowser(),
      })
    sync()
    listeners.add(sync)
    return () => {
      listeners.delete(sync)
    }
  }, [])

  return state
}

type InstallAppButtonProps = {
  /** `header`：顶栏文字按钮；`menu`：移动抽屉里的菜单项。 */
  variant?: 'header' | 'menu'
  className?: string
}

export default function InstallAppButton({
  variant = 'header',
  className = '',
}: InstallAppButtonProps) {
  const { canInstall, installed, ios } = useInstallState()
  const [hintOpen, setHintOpen] = useState(false)

  const install = useCallback(async () => {
    if (!deferredPrompt) return
    const promptEvent = deferredPrompt
    deferredPrompt = null
    notify()
    try {
      await promptEvent.prompt()
      await promptEvent.userChoice
    } catch {
      // 用户手势丢失等情况，静默失败
    }
  }, [])

  // 已装成桌面应用，或浏览器既不支持也不给引导（桌面 Safari 之外）→ 不显示
  if (installed || (!canInstall && !ios)) return null

  const handleClick = () => {
    if (canInstall) {
      void install()
      return
    }
    setHintOpen((open) => !open)
  }

  const menuClass = `hover:text-primary-500 dark:hover:text-primary-400 py-1 text-gray-900 outline outline-0 dark:text-gray-100 ${className}`
  const headerClass = `hover:text-primary-500 dark:hover:text-primary-400 text-gray-700 transition-colors outline-none select-none dark:text-gray-300 ${className}`

  return (
    <span className="relative">
      <button
        type="button"
        onClick={handleClick}
        aria-label="安装到桌面"
        aria-expanded={canInstall ? undefined : hintOpen}
        className={variant === 'menu' ? menuClass : headerClass}
      >
        {variant === 'menu' ? (
          <>
            <span className="text-gray-300 dark:text-gray-700">/ </span>安装 App
          </>
        ) : (
          '〔 安装 〕'
        )}
      </button>
      {hintOpen && !canInstall && (
        <span className="absolute top-full right-0 z-50 mt-2 w-60 rounded-md border border-gray-200 bg-white p-3 text-left text-xs leading-relaxed text-gray-700 shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
          点底部「分享」→「添加到主屏幕」，之后就能像 App 一样离线阅读。
        </span>
      )}
    </span>
  )
}

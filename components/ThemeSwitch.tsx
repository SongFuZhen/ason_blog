'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  const toggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      aria-label="切换主题"
      onClick={toggle}
      className="hover:text-primary-500 dark:hover:text-primary-400 text-gray-700 transition-colors outline-none select-none dark:text-gray-300"
    >
      {mounted ? (resolvedTheme === 'dark' ? '〔 浅色 〕' : '〔 深色 〕') : '〔 主题 〕'}
    </button>
  )
}

export default ThemeSwitch

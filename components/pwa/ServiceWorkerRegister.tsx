'use client'

import { useEffect } from 'react'

/**
 * 注册 /sw.js。生产环境才注册，避免 dev 下缓存住 HMR 资源造成“改了没反应”。
 * SW 自身在 install 时 skipWaiting，新版本装好即生效，无需弹“有新版本”提示。
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // 注册失败（不支持 / 隐私模式）不影响站点，静默即可
      })
    }

    // 等首屏资源加载完再注册，避免和关键请求抢带宽
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
  }, [])

  return null
}

'use client'

import { useEffect, useId, useState } from 'react'
import { useTheme } from 'next-themes'

function isDarkTheme(resolvedTheme: string | undefined): boolean {
  if (resolvedTheme) return resolvedTheme === 'dark'
  if (typeof document !== 'undefined') return document.documentElement.classList.contains('dark')
  return false
}

export default function Mermaid({ chart }: { chart: string }) {
  const id = `mermaid-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState('')
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    const renderChart = async () => {
      try {
        const mermaid = (await import('mermaid')).default
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: isDarkTheme(resolvedTheme) ? 'dark' : 'neutral',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
        })
        const { svg: rendered } = await mermaid.render(id, chart)
        if (active) {
          setSvg(rendered)
          setFailed(false)
        }
      } catch {
        document.getElementById(`d${id}`)?.remove()
        if (active) setFailed(true)
      }
    }
    renderChart()
    return () => {
      active = false
    }
  }, [chart, id, resolvedTheme])

  if (failed) {
    return (
      <div className="not-prose my-6 overflow-x-auto rounded-md border border-red-500/40 p-4 text-sm">
        <p className="mb-2 font-medium text-red-500">Mermaid 图渲染失败，源码如下：</p>
        <pre className="whitespace-pre-wrap">{chart}</pre>
      </div>
    )
  }

  return (
    <figure className="not-prose my-6 flex justify-center overflow-x-auto" aria-label="Mermaid 图">
      {svg ? (
        <div
          className="max-w-full [&>svg]:h-auto [&>svg]:max-w-full"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="py-8 text-sm text-gray-500 dark:text-gray-400">渲染 Mermaid 图中…</div>
      )}
    </figure>
  )
}

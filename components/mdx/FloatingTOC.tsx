'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type TocItem = {
  value: string
  url: string
  depth: number
  children?: TocItem[]
}

const MIN_ITEMS = 3
const HEADING_OFFSET = 120

function flattenToc(items: TocItem[]): TocItem[] {
  return items.flatMap((item) => [item, ...(item.children ? flattenToc(item.children) : [])])
}

export default function FloatingTOC({ toc }: { toc: TocItem[] }) {
  const items = useMemo(
    () => flattenToc(toc).filter((item) => item.depth >= 1 && item.depth <= 3),
    [toc]
  )
  const [activeId, setActiveId] = useState(() => items[0]?.url.slice(1) ?? '')
  const frameRef = useRef(0)

  useEffect(() => {
    if (items.length < MIN_ITEMS) return

    const headings = items
      .map((item) => document.getElementById(item.url.slice(1)))
      .filter((element): element is HTMLElement => element !== null)

    if (headings.length === 0) return

    const update = () => {
      let current = headings[0]
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= HEADING_OFFSET) {
          current = heading
        } else {
          break
        }
      }
      setActiveId(current.id)
    }

    const onScroll = () => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = requestAnimationFrame(update)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frameRef.current)
    }
  }, [items])

  if (items.length < MIN_ITEMS) return null

  return (
    <nav
      aria-label="文章目录"
      className="fixed top-24 right-3 z-40 hidden max-h-[70vh] w-40 overflow-y-auto xl:block 2xl:right-10 2xl:w-56 print:hidden"
    >
      <p className="mb-2 font-mono text-[11px] text-gray-400 dark:text-gray-500">~/toc</p>
      <ul className="space-y-0.5">
        {items.map((item) => {
          const id = item.url.slice(1)
          const active = activeId === id
          return (
            <li key={item.url}>
              <a
                href={item.url}
                aria-current={active ? 'location' : undefined}
                onClick={(event) => {
                  const target = document.getElementById(id)
                  if (!target) return
                  event.preventDefault()
                  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                  target.scrollIntoView({
                    behavior: reduceMotion ? 'auto' : 'smooth',
                    block: 'start',
                  })
                  window.history.replaceState(null, '', item.url)
                  setActiveId(id)
                }}
                className={[
                  'block border-l-2 py-0.5 pr-1 font-mono text-[11px] leading-relaxed break-words transition-colors',
                  item.depth === 1 ? 'pl-2' : item.depth === 2 ? 'pl-4' : 'pl-6',
                  active
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
                ].join(' ')}
              >
                {item.value}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { formatDateShort } from '@/lib/content/format-date.mjs'
import { filterSearchDocuments } from '@/lib/search/core.mjs'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'

export type SearchConfig = {
  provider?: string
  kbarConfig?: {
    searchDocumentsPath?: string
  }
}

type SearchDocument = {
  path: string
  title: string
  summary?: string
  date?: string
  tags?: string[]
}

type SearchDialogProps = {
  isOpen: boolean
  onClose: () => void
  searchConfig?: SearchConfig
}

function getSearchUrl(searchDocumentsPath?: string) {
  if (!searchDocumentsPath) return null
  if (searchDocumentsPath.includes('://') || searchDocumentsPath.startsWith('//')) {
    return searchDocumentsPath
  }
  return new URL(searchDocumentsPath, window.location.origin).toString()
}

export function SearchDialog({ isOpen, onClose, searchConfig }: SearchDialogProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const activeRef = useRef<HTMLButtonElement>(null)
  const requestIdRef = useRef(0)
  const [query, setQuery] = useState('')
  const [documents, setDocuments] = useState<SearchDocument[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const searchDocumentsPath = searchConfig?.kbarConfig?.searchDocumentsPath

  useEffect(() => {
    if (!isOpen) return
    window.setTimeout(() => {
      inputRef.current?.focus()
      setSelectedIndex(0)
    }, 0)
  }, [isOpen])

  useEffect(() => {
    setDocuments([])
    setHasLoaded(false)
    setError(null)
  }, [searchDocumentsPath])

  useEffect(() => {
    if (!isOpen || !searchDocumentsPath || hasLoaded) return

    const controller = new AbortController()
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    const isCurrentRequest = () => requestIdRef.current === requestId

    async function loadDocuments() {
      setIsLoading(true)
      setError(null)
      try {
        const searchUrl = getSearchUrl(searchDocumentsPath)
        if (!searchUrl) return

        const response = await fetch(searchUrl, { signal: controller.signal })
        if (!response.ok) throw new Error(`Search index request failed: ${response.status}`)
        const json = await response.json()
        if (!isCurrentRequest()) return
        setDocuments(Array.isArray(json) ? json : [])
        setHasLoaded(true)
      } catch (loadError) {
        if (!controller.signal.aborted && isCurrentRequest()) {
          setError(loadError instanceof Error ? loadError.message : 'Search index failed to load')
          setHasLoaded(true)
        }
      } finally {
        if (isCurrentRequest()) setIsLoading(false)
      }
    }

    loadDocuments()
    return () => controller.abort()
  }, [hasLoaded, isOpen, searchDocumentsPath])

  const results = useMemo(() => {
    return filterSearchDocuments(documents, query)
  }, [documents, query])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query, documents])

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const closeSearch = () => {
    onClose()
    setQuery('')
  }

  const onSelect = (document: SearchDocument) => {
    closeSearch()
    router.push(`/${document.path}`)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((index) => Math.min(index + 1, results.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const document = results[selectedIndex]
      if (document) onSelect(document)
    }
  }

  const resultLabel = query.trim() ? `${results.length} 条结果` : '最近文章'
  const hasSearchConfig = Boolean(searchDocumentsPath)

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeSearch()
      }}
    >
      <DialogContent className="top-0 left-0 grid max-h-dvh w-full gap-0 overflow-hidden rounded-none border-0 bg-white p-0 font-mono text-sm shadow-none sm:top-1/2 sm:left-1/2 sm:w-[min(calc(100%-1rem),36rem)] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-xl sm:border sm:border-gray-200 sm:shadow-[0_16px_48px_rgba(15,23,42,0.16)] dark:bg-gray-950 sm:dark:border-gray-800 sm:dark:shadow-[0_16px_48px_rgba(0,0,0,0.42)] [&>button]:hidden">
        {/* Input */}
        <div className="relative flex items-center gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
          <label className="sr-only" htmlFor="site-search-input">
            搜索文章
          </label>
          <svg
            className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="min-w-0 flex-1 truncate">
            {query ? (
              <>
                <span className="text-gray-900 dark:text-gray-100">{query}</span>
                <span className="animate-blink ml-1 inline-block h-4 w-2 translate-y-0.5 bg-gray-800 dark:bg-gray-200" />
              </>
            ) : (
              <>
                <span className="animate-blink mr-1 inline-block h-4 w-2 translate-y-0.5 bg-gray-800 dark:bg-gray-200" />
                <span className="text-gray-400 dark:text-gray-500">搜索文章、标签…</span>
              </>
            )}
          </span>
          <input
            ref={inputRef}
            id="site-search-input"
            className="absolute inset-0 h-full w-full cursor-text border-0 bg-transparent text-transparent caret-transparent outline-none focus:ring-0 focus:ring-offset-0"
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            type="text"
            value={query}
          />
        </div>

        {/* Results */}
        <div
          className="h-[calc(100dvh-10rem)] overflow-y-auto p-2 sm:h-[min(50dvh,26rem)]"
          aria-live="polite"
        >
          {!hasSearchConfig && <SearchState line="搜索未配置" />}

          {hasSearchConfig && (isLoading || (!hasLoaded && !error)) && <SearchLoadingLine />}

          {hasSearchConfig && error && <SearchState line={`索引加载失败：${error}`} />}

          {hasSearchConfig && hasLoaded && !isLoading && !error && results.length === 0 && (
            <SearchState line={query.trim() ? '没有匹配结果' : '输入关键词开始搜索'} />
          )}

          {hasSearchConfig &&
            hasLoaded &&
            !isLoading &&
            !error &&
            results.map((document, index) => (
              <button
                type="button"
                key={document.path}
                ref={index === selectedIndex ? activeRef : undefined}
                className={cn(
                  'flex w-full items-baseline gap-3 px-3 py-1.5 text-left transition-colors',
                  index === selectedIndex
                    ? 'bg-primary-500/10 dark:bg-primary-400/10'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-900'
                )}
                onClick={() => onSelect(document)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="min-w-0 flex-1 truncate">
                  <span
                    className={cn(
                      'font-medium',
                      index === selectedIndex
                        ? 'text-primary-700 dark:text-primary-300'
                        : 'text-gray-800 dark:text-gray-200'
                    )}
                  >
                    {document.title}
                  </span>
                  {document.tags && document.tags.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400 dark:text-gray-500">
                      {document.tags.slice(0, 2).join(' / ')}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs text-gray-400 dark:text-gray-500">
                  {formatDateShort(document.date)}
                </span>
              </button>
            ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-100/80 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-400">
          <span>{resultLabel}</span>
          <span className="hidden sm:inline">
            [↑/↓] 选择&nbsp;&nbsp;[Enter] 打开&nbsp;&nbsp;[Esc] 关闭
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SearchLoadingLine() {
  return (
    <p className="px-3 py-4 text-gray-500 dark:text-gray-400">
      正在加载索引
      <span className="animate-blink ml-1 inline-block h-3.5 w-2 translate-y-0.5 bg-gray-400 dark:bg-gray-500" />
    </p>
  )
}

function SearchState({ line }: { line: string }) {
  return <p className="px-3 py-4 text-gray-500 dark:text-gray-400">{line}</p>
}

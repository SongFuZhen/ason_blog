'use client'

import { Check, Copy } from 'lucide-react'
import { isValidElement, useRef, useState } from 'react'
import Mermaid from '@/components/mdx/Mermaid'

function nodeToText(node: React.ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join('')
  if (isValidElement(node)) {
    return nodeToText((node.props as { children?: React.ReactNode }).children)
  }
  return ''
}

function extractMermaid(children: React.ReactNode): string | null {
  const child = Array.isArray(children) ? children[0] : children
  if (!isValidElement(child)) return null
  const className = (child.props as { className?: unknown }).className
  if (typeof className !== 'string' || !/\blanguage-mermaid\b/.test(className)) return null
  const chart = nodeToText((child.props as { children?: React.ReactNode }).children)
  return chart.trim() ? chart : null
}

function CodeBlock({ children }: { children: React.ReactNode }) {
  const textInput = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const code = textInput.current?.textContent
    if (!code) return

    await navigator.clipboard.writeText(code)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      ref={textInput}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setCopied(false)
      }}
      className="relative"
    >
      {hovered && (
        <button
          aria-label={copied ? 'Code copied' : 'Copy code'}
          className={`absolute top-2 right-2 h-8 w-8 rounded border-2 bg-gray-700 p-1 dark:bg-gray-800 ${
            copied
              ? 'border-green-400 text-green-400 focus:border-green-400 focus:outline-none'
              : 'border-gray-300 text-gray-300'
          }`}
          onClick={onCopy}
          type="button"
        >
          {copied ? <Check aria-hidden="true" size={18} /> : <Copy aria-hidden="true" size={18} />}
        </button>
      )}
      <pre>{children}</pre>
    </div>
  )
}

export default function Pre({ children }: { children: React.ReactNode }) {
  const mermaidChart = extractMermaid(children)
  if (mermaidChart) return <Mermaid chart={mermaidChart} />
  return <CodeBlock>{children}</CodeBlock>
}

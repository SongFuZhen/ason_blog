'use client'

import { useState } from 'react'
import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from 'react'
import Image from 'next/image'
import ImageLightbox from '../ImageLightbox'

type ProseImageProps = ComponentPropsWithoutRef<'img'> & {
  'data-zoom'?: string
}

function getZoomWidth(zoom?: string) {
  if (!zoom) return undefined

  const value = Number.parseFloat(zoom)
  if (!Number.isFinite(value) || value <= 0 || value >= 100) return undefined

  return `${value}%`
}

/**
 * Hybrid image renderer: uses next/image when dimensions are known, falls back to native img for legacy content.
 */
function parseStyleString(s: string): CSSProperties {
  const result: Record<string, string> = {}
  for (const part of s.split(';')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) continue
    const key = trimmed.slice(0, colonIdx).trim()
    const value = trimmed.slice(colonIdx + 1).trim()
    if (key && value) result[key] = value
  }
  return result as CSSProperties
}

export function ProseImage({
  alt = '',
  className,
  style,
  width,
  height,
  ...props
}: ProseImageProps) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const closeLightbox = () => setLightboxSrc(null)

  const resolvedStyle: CSSProperties =
    typeof style === 'string' ? parseStyleString(style) : (style ?? {})
  const widthFromZoom = getZoomWidth(props['data-zoom'])
  const imageStyle: CSSProperties = {
    ...resolvedStyle,
    width: widthFromZoom || resolvedStyle.width,
    maxWidth: '100%',
    height: 'auto',
  }

  const baseClass =
    'my-8 rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950'
  const src = typeof props.src === 'string' ? props.src : undefined
  const imageClassName = [baseClass, className, src ? 'cursor-zoom-in' : undefined]
    .filter(Boolean)
    .join(' ')

  const openLightbox = (event: ReactMouseEvent<HTMLImageElement>) => {
    if (!src) return
    // Images are often wrapped in links; don't navigate when the intent is to zoom.
    event.preventDefault()
    event.stopPropagation()
    setLightboxSrc(src)
  }

  const onKeyDown = (event: ReactKeyboardEvent<HTMLImageElement>) => {
    if (!src) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      setLightboxSrc(src)
    }
  }

  const zoomProps = src
    ? {
        onClick: openLightbox,
        onKeyDown,
        role: 'button' as const,
        tabIndex: 0,
        'aria-label': alt || '放大查看图片',
        title: '点击放大',
      }
    : {}

  return (
    <>
      {width && height ? (
        <Image
          src={props.src as string}
          alt={alt}
          width={Number(width)}
          height={Number(height)}
          loading={(props.loading as 'lazy' | 'eager' | undefined) || 'lazy'}
          className={imageClassName}
          style={imageStyle}
          {...zoomProps}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          {...props}
          alt={alt}
          width={width}
          height={height}
          loading={props.loading || 'lazy'}
          decoding={props.decoding || 'async'}
          // 图床（cloudflare-imgbed）有防盗链：来自非 ason.top 的 Referer 会 403。
          // 去掉 Referer 后浏览器直连即可正常加载，也修复从搜索引擎进入文章时的坏图。
          referrerPolicy="no-referrer"
          className={imageClassName}
          style={imageStyle}
          {...zoomProps}
        />
      )}
      {lightboxSrc && <ImageLightbox src={lightboxSrc} alt={alt} onClose={closeLightbox} />}
    </>
  )
}

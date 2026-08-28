import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import Image from 'next/image'

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

  // Use next/image when explicit dimensions are available
  if (width && height) {
    return (
      <Image
        src={props.src as string}
        alt={alt}
        width={Number(width)}
        height={Number(height)}
        loading={(props.loading as 'lazy' | 'eager' | undefined) || 'lazy'}
        className={[baseClass, className].filter(Boolean).join(' ')}
        style={imageStyle}
      />
    )
  }

  // Fallback for legacy images without known dimensions
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      width={width}
      height={height}
      loading={props.loading || 'lazy'}
      decoding={props.decoding || 'async'}
      className={[baseClass, className].filter(Boolean).join(' ')}
      style={imageStyle}
    />
  )
}

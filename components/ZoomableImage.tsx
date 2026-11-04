'use client'

import { useCallback, useState } from 'react'
import Image from './Image'
import ImageLightbox from './ImageLightbox'

interface ZoomableImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export default function ZoomableImage({ src, alt, width, height, className }: ZoomableImageProps) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        type="button"
        aria-label={`放大查看${alt}`}
        onClick={() => setOpen(true)}
        className="mx-auto mt-2 block cursor-zoom-in"
      >
        <Image src={src} alt={alt} width={width} height={height} className={className} />
      </button>
      {open && <ImageLightbox src={src} alt={alt} onClose={close} />}
    </>
  )
}

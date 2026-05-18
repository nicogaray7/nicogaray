'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface Props {
  src: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  width?: number
  height?: number
  sizes?: string
  copyrightLabel?: string
  copyrightClassName?: string
}

export function ProtectedImage({
  src,
  alt,
  fill,
  className,
  priority,
  width,
  height,
  sizes,
  copyrightLabel,
  copyrightClassName,
}: Props) {
  return (
    <div
      className={cn('relative select-none', fill ? 'absolute inset-0' : '')}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        draggable={false}
        sizes={sizes}
        className={cn(className)}
        style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}
      />
      {/* Overlay bloquant l'interaction directe */}
      <div className="absolute inset-0 z-10" aria-hidden="true" />
      {copyrightLabel && (
        <span
          className={cn(
            'absolute bottom-2 right-2 z-20 rounded-full bg-black/45 px-2.5 py-1 text-[10px] tracking-[0.14em] uppercase text-white/90 backdrop-blur-sm transition-opacity duration-300',
            copyrightClassName,
          )}
          aria-hidden="true"
        >
          {copyrightLabel}
        </span>
      )}
    </div>
  )
}

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
}

export function ProtectedImage({ src, alt, fill, className, priority, width, height }: Props) {
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
        className={cn(className)}
        style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'none' }}
      />
      {/* Overlay bloquant l'interaction directe */}
      <div className="absolute inset-0 z-10" aria-hidden="true" />
    </div>
  )
}

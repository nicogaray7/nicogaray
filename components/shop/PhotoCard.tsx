'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ProtectedImage } from './ProtectedImage'
import { cn } from '@/lib/utils'
import { photoPublicLabel } from '@/lib/photoLabel'

interface Photo {
  id:          string
  thumbKeyR2:  string
  country:     string | null
  city:        string | null
  orientation: string
  price:       number
}

export function PhotoCard({
  photo,
  locale,
}: {
  photo: Photo
  locale: string
}) {
  const t = useTranslations('shop')
  const label = photoPublicLabel(photo, locale)

  return (
    <Link
      href={`/${locale}/shop/${photo.id}`}
      className="group block relative overflow-hidden bg-ink-150 rounded-lg border border-accent-500/20"
    >
      <div
        className={cn(
          'relative w-full overflow-hidden h-full',
          photo.orientation === 'portrait' ? 'aspect-[2/3]' : 'aspect-[3/2]',
        )}
      >
        <ProtectedImage
          src={`/api/image/${photo.thumbKeyR2}`}
          alt={label}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-accent-500/30 via-accent-500/5 to-transparent z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

        {photo.country && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/95 bg-accent-500/50 backdrop-blur-sm px-2.5 py-1 rounded-full font-medium">
              {photo.country}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-20">
          <p className="text-white font-display text-sm sm:text-base leading-tight mb-2 line-clamp-1">
            {label}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-sm font-medium">
              {t('price', { price: photo.price.toFixed(2) })}
            </span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/80 border border-accent-400 px-2 py-0.5 rounded-full">
              {t('hd')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

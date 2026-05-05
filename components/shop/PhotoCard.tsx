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
      className="group block relative overflow-hidden bg-ink-100 rounded-lg"
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
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

        {photo.country && (
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
            <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/90 bg-black/30 backdrop-blur-md px-2.5 py-1 rounded-full">
              {photo.country}
            </span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
          <p className="text-white font-display text-sm sm:text-base leading-tight mb-2 line-clamp-2">
            {label}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/90 text-sm font-medium">
              {t('price', { price: photo.price.toFixed(2) })}
            </span>
            <span className="text-[10px] tracking-[0.2em] uppercase text-white/70 border border-white/40 px-2 py-0.5 rounded">
              {t('hd')}
            </span>
          </div>
        </div>

        <div className="sm:hidden absolute inset-x-0 bottom-0 p-4 z-20 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
          <p className="text-white text-xs font-medium line-clamp-2">{label}</p>
          <p className="text-white/80 text-[11px] mt-1">{t('price', { price: photo.price.toFixed(2) })}</p>
        </div>
      </div>
    </Link>
  )
}

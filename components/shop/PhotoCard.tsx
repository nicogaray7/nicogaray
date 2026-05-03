'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ProtectedImage } from './ProtectedImage'
import { cn } from '@/lib/utils'

interface Photo {
  id: string
  title: string
  titleEn: string
  thumbKeyR2: string
  country: string | null
  orientation: string
  price: number
}

export function PhotoCard({
  photo,
  locale,
}: {
  photo: Photo
  locale: string
}) {
  const t = useTranslations('shop')
  const title = locale === 'en' ? photo.titleEn : photo.title

  return (
    <Link
      href={`/${locale}/shop/${photo.id}`}
      className="photo-card group block relative overflow-hidden bg-stone-100"
    >
      <div
        className={cn(
          'relative w-full overflow-hidden',
          photo.orientation === 'portrait' ? 'aspect-[2/3]' : 'aspect-[3/2]',
        )}
      >
        <ProtectedImage
          src={`/api/image/${photo.thumbKeyR2}`}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Overlay au survol */}
        <div className="photo-overlay absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
          <p className="text-white font-serif text-lg leading-tight">{title}</p>
          {photo.country && (
            <p className="text-stone-300 text-xs tracking-widest uppercase mt-1">{photo.country}</p>
          )}
          <div className="flex items-center justify-between mt-3">
            <span className="text-white text-sm font-medium">
              {t('price', { price: photo.price.toFixed(2) })}
            </span>
            <span className="text-xs text-stone-300 border border-stone-400 px-2 py-0.5 rounded">
              {t('hd')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

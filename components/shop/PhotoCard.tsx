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
  const cropClass =
    photo.orientation === 'portrait'
      ? 'object-[50%_32%]'
      : photo.orientation === 'landscape'
        ? 'object-center'
        : 'object-center'

  return (
    <Link
      href={`/${locale}/shop/${photo.id}`}
      className="group block relative overflow-hidden bg-ink-50 rounded-xl border border-accent-500/30 shadow-md hover:shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-50"
    >
      <div className={cn('relative w-full overflow-hidden h-full aspect-[4/5]')}>
        <ProtectedImage
          src={`/api/image/${photo.thumbKeyR2}`}
          alt={label}
          fill
          className={cn('object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]', cropClass)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          copyrightLabel="© Nico Garay"
          copyrightClassName="bottom-2.5 right-2.5 text-[8px] bg-accent-500/70 backdrop-blur-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent z-10 opacity-100 transition-opacity duration-300" />

        <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 z-20">
          <p className="text-white font-display text-[18px] sm:text-[20px] leading-[1.05] mb-2 line-clamp-1 tracking-[0.02em]">
            {label}
          </p>
          <div className="flex items-center justify-between gap-3">
            <span className="text-white/92 text-sm">
              {t('price', { price: photo.price.toFixed(2) })}
            </span>
            {photo.country && (
              <span className="text-[9px] tracking-[0.18em] uppercase text-white/85">
                {photo.country}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

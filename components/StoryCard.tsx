'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { photoPublicLabel } from '@/lib/photoLabel'

interface Photo {
  id: string
  thumbKeyR2: string
  previewKeyR2: string
  country: string | null
  city: string | null
  orientation: string
  price: number
}

export function StoryCard({
  photo,
  locale,
}: {
  photo: Photo
  locale: string
}) {
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
      className="group block relative overflow-hidden rounded-lg border border-ink-300 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
    >
      <div className="relative w-full overflow-hidden aspect-[4/5] sm:aspect-video">
        <Image
          src={`/api/image/${photo.thumbKeyR2}`}
          alt={label}
          fill
          className={cn('object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]', cropClass)}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-100 transition-opacity duration-300 group-hover:from-black/90" />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 z-20">
        <p className="font-display text-white text-lg sm:text-xl leading-tight mb-2 line-clamp-2 tracking-tight">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="text-white/90 text-sm font-medium">
            ${photo.price.toFixed(2)}
          </span>
          {photo.country && (
            <span className="text-[11px] tracking-widest uppercase text-accent-500 font-bold">
              {photo.country}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

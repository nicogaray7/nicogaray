'use client'

import Link from 'next/link'
import Image from 'next/image'
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

  return (
    <Link
      href={`/${locale}/shop/${photo.id}`}
      className="group block relative overflow-hidden bg-surface-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
    >
      <div className="relative w-full overflow-hidden aspect-[3/4]">
        <Image
          src={`/api/image/${photo.thumbKeyR2}`}
          alt={label}
          fill
          className="object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:brightness-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-10">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1.5">
            {photo.country && (
              <p className="text-[10px] tracking-[0.2em] uppercase text-accent font-medium">
                {photo.country}
              </p>
            )}
            <p className="font-display text-white text-base sm:text-lg leading-tight">
              {label}
            </p>
          </div>
          <span className="text-white/80 text-sm tabular-nums shrink-0">
            {photo.price.toFixed(0)}&euro;
          </span>
        </div>
      </div>
    </Link>
  )
}

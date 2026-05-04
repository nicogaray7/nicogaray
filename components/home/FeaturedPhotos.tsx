'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { PhotoCard } from '@/components/shop/PhotoCard'

interface Photo {
  id: string
  thumbKeyR2: string
  previewKeyR2: string
  country: string | null
  city: string | null
  orientation: string
  price: number
}

export function FeaturedPhotos({
  photos,
  locale,
}: {
  photos: Photo[]
  locale: string
}) {
  const t = useTranslations('home.featured')

  return (
    <section className="py-20 sm:py-32 bg-ink-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-xl">
            <p className="text-[11px] tracking-[0.3em] uppercase text-white/50 mb-4">
              {locale === 'fr' ? 'Sélection' : 'Selection'}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-[1] text-balance">
              {t('title')}
            </h2>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="group inline-flex items-center gap-3 self-start sm:self-end text-white border-b border-white/40 hover:border-white pb-1 text-sm tracking-wider uppercase transition-colors"
          >
            {t('cta')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grille mosaïque */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={
                i === 0 ? 'col-span-2 lg:col-span-2 lg:row-span-2' : ''
              }
            >
              <PhotoCard photo={photo} locale={locale} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

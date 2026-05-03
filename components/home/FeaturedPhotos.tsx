'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PhotoCard } from '@/components/shop/PhotoCard'

interface Photo {
  id: string
  title: string
  titleEn: string
  thumbKeyR2: string
  previewKeyR2: string
  country: string | null
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
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mb-12 text-center">
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} locale={locale} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${locale}/shop`}
            className="inline-block border border-stone-800 text-stone-800 text-sm tracking-widest uppercase px-8 py-3 hover:bg-stone-800 hover:text-white transition-colors"
          >
            {t('cta')}
          </Link>
        </div>
      </div>
    </section>
  )
}

export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { FilterBar } from '@/components/shop/FilterBar'
import { PhotoCard } from '@/components/shop/PhotoCard'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'Boutique — Nico Garay' : 'Shop — Nico Garay',
  }
}

interface SearchParams {
  country?:     string
  orientation?: string
  sort?:        string
}

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SearchParams>
}) {
  const { locale } = await params
  const { country, orientation, sort } = await searchParams
  const t = await getTranslations('shop')

  const where = {
    published: true,
    ...(country     ? { country }     : {}),
    ...(orientation ? { orientation } : {}),
  }

  type SortOrder = { createdAt?: 'asc' | 'desc'; price?: 'asc' | 'desc' }
  const orderBy: SortOrder =
    sort === 'priceAsc'  ? { price: 'asc' }
    : sort === 'priceDesc' ? { price: 'desc' }
    : { createdAt: 'desc' }

  const [photos, countries] = await Promise.all([
    prisma.photo.findMany({
      where, orderBy,
      select: {
        id: true,
        thumbKeyR2: true, previewKeyR2: true,
        country: true, city: true, orientation: true, price: true,
      },
    }),
    prisma.photo.findMany({
      where: { published: true, country: { not: null } },
      select: { country: true },
      distinct: ['country'],
    }),
  ])

  const countryList = countries.map(p => p.country!).filter(Boolean).sort()

  return (
    <>
      {/* En-tête éditorial */}
      <section className="border-b border-ink-100 pt-28 sm:pt-36 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-ink-400 mb-3">
            {locale === 'fr' ? 'Galerie' : 'Gallery'}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[0.95] text-balance max-w-3xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-ink-500 text-base sm:text-lg max-w-xl text-pretty">
            {locale === 'fr'
              ? 'Photographies originales en haute résolution. Téléchargement immédiat sous licence personnelle.'
              : 'Original high-resolution photographs. Instant download under personal license.'}
          </p>
        </div>
      </section>

      {/* Filtres + grille */}
      <section className="py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <Suspense>
            <FilterBar countries={countryList} />
          </Suspense>

          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <p className="text-sm text-ink-500">
              {t('results', { count: photos.length })}
            </p>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-32 text-ink-400">
              <p className="font-display text-2xl mb-3">—</p>
              <p className="text-sm">
                {locale === 'fr' ? 'Aucune photo ne correspond à ces filtres.' : 'No photo matches these filters.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {photos.map(photo => (
                <PhotoCard key={photo.id} photo={photo} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

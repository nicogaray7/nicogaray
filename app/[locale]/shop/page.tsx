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
    title: locale === 'fr' ? 'Boutique - Nico Garay' : 'Shop - Nico Garay',
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
      {/* Header */}
      <section className="border-b border-accent-500/20 pt-24 sm:pt-32 pb-10 sm:pb-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <p className="text-[11px] tracking-[0.3em] uppercase text-accent-400 mb-4">
            {locale === 'fr' ? 'Galerie' : 'Gallery'}
          </p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[1] text-balance max-w-3xl mb-6">
            {t('title')}
          </h1>
          <p className="text-ink-700 text-base sm:text-lg leading-relaxed max-w-xl">
            {locale === 'fr'
              ? 'Photographies en edition numerique, composees pour une lecture calme et durable.'
              : 'Digital photography editions composed for a calm, lasting viewing experience.'}
          </p>
        </div>
      </section>

      {/* Filtres + grille */}
      <section className="py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <Suspense>
            <FilterBar countries={countryList} />
          </Suspense>

          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <p className="text-sm text-ink-700">
              {t('results', { count: photos.length })}
            </p>
          </div>

          {photos.length === 0 ? (
            <div className="text-center py-20 sm:py-32">
              <div className="inline-flex flex-col items-center gap-4">
                <div className="text-5xl text-ink-300">-</div>
                <div>
                  <p className="font-display text-lg text-ink-700 mb-1">
                    {locale === 'fr' ? 'Aucun résultat' : 'No results'}
                  </p>
                  <p className="text-sm text-ink-600">
                    {locale === 'fr' ? 'Aucune photo ne correspond à ces filtres.' : 'No photo matches these filters.'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {photos.map((photo, i) => (
                <div
                  key={photo.id}
                  style={{
                    animation: `fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both`,
                    animationDelay: `${i * 50}ms`,
                  }}
                >
                  <PhotoCard photo={photo} locale={locale} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

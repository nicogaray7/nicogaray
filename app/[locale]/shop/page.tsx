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
  country?: string
  orientation?: string
  sort?: string
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
    ...(country ? { country } : {}),
    ...(orientation ? { orientation } : {}),
  }

  type SortOrder = { createdAt?: 'asc' | 'desc'; price?: 'asc' | 'desc' }
  const orderBy: SortOrder =
    sort === 'priceAsc' ? { price: 'asc' }
    : sort === 'priceDesc' ? { price: 'desc' }
    : { createdAt: 'desc' }

  const [photos, countries] = await Promise.all([
    prisma.photo.findMany({
      where,
      orderBy,
      select: {
        id: true, title: true, titleEn: true,
        thumbKeyR2: true, previewKeyR2: true,
        country: true, orientation: true, price: true,
      },
    }),
    prisma.photo.findMany({
      where: { published: true, country: { not: null } },
      select: { country: true },
      distinct: ['country'],
    }),
  ])

  const countryList = countries.map((p) => p.country!).filter(Boolean).sort()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="font-serif text-4xl text-stone-800 mb-10">{t('title')}</h1>

      <Suspense>
        <FilterBar countries={countryList} />
      </Suspense>

      <p className="text-sm text-stone-400 mb-6">{t('results', { count: photos.length })}</p>

      {photos.length === 0 ? (
        <div className="text-center py-24 text-stone-400">
          <p className="text-lg">—</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {photos.map((photo) => (
            <PhotoCard key={photo.id} photo={photo} locale={locale} />
          ))}
        </div>
      )}
    </div>
  )
}

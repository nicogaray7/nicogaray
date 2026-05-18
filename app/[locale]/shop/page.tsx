export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { PhotoGrid } from '@/components/PhotoGrid'

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('shop')

  const photos = await prisma.photo.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      thumbKeyR2: true,
      previewKeyR2: true,
      country: true,
      city: true,
      orientation: true,
      price: true,
    },
  })

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-12 sm:pt-16 pb-20 sm:pb-32">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <h1 className="font-display text-4xl sm:text-6xl text-ink-900 mb-4 leading-tight">
            {locale === 'fr' ? 'Galerie' : 'Gallery'}
          </h1>
          <p className="text-lg text-ink-700 max-w-2xl">
            {locale === 'fr'
              ? 'Éditions numériques haute résolution avec licence personnelle'
              : 'High-resolution digital editions with personal license'}
          </p>
        </div>

        {/* Photo Grid */}
        {photos.length > 0 ? (
          <PhotoGrid photos={photos} locale={locale} />
        ) : (
          <div className="text-center py-20">
            <p className="text-ink-600">
              {locale === 'fr' ? 'Aucune photo disponible' : 'No photos available'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

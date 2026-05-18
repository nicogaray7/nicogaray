export const dynamic = 'force-dynamic'

import { prisma } from '@/lib/db'
import { PhotoGrid } from '@/components/PhotoGrid'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'Galerie | Nico Garay' : 'Gallery | Nico Garay',
  }
}

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const en = locale === 'en'

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
    <div className="min-h-screen pt-24 sm:pt-32 pb-20 sm:pb-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <p className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">
            Collection
          </p>
          <h1 className="font-display text-4xl sm:text-6xl text-foreground mb-4 leading-tight">
            {en ? 'Gallery' : 'Galerie'}
          </h1>
          <p className="text-foreground-dim max-w-xl">
            {en
              ? 'High-resolution digital editions with personal-use license. Each file is delivered with invisible watermark traceability.'
              : 'Editions numeriques haute resolution avec licence personnelle. Chaque fichier est livre avec tracabilite par filigrane invisible.'}
          </p>
        </div>

        {photos.length > 0 ? (
          <PhotoGrid photos={photos} locale={locale} />
        ) : (
          <div className="text-center py-24">
            <p className="text-foreground-muted">
              {en ? 'No photos available yet' : 'Aucune photo disponible'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { prisma } from '@/lib/db'
import { ProtectedImage } from '@/components/shop/ProtectedImage'
import { InlineShop } from '@/components/shop/InlineShop'
import { StoryCard } from '@/components/StoryCard'
import { photoPublicLabel } from '@/lib/photoLabel'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const photo = await prisma.photo.findUnique({
    where: { id },
    select: { country: true, city: true },
  })
  if (!photo) return {}
  const label = photoPublicLabel(photo, locale)
  return {
    title: `${label} - Nico Garay`,
  }
}

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params

  const photo = await prisma.photo.findUnique({ where: { id, published: true } })
  if (!photo) notFound()

  const relatedPhotos = await prisma.photo.findMany({
    where: { published: true, id: { not: photo.id } },
    orderBy: { createdAt: 'desc' },
    take: 4,
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

  const label = photoPublicLabel(photo, locale)

  return (
    <div className="bg-white min-h-screen">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-6">
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-accent-500 hover:text-accent-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {locale === 'fr' ? 'Retour' : 'Back'}
        </Link>
      </div>

      {/* Featured Image */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="relative h-[60vh] sm:h-[70vh] max-h-[800px] bg-ink-100 overflow-hidden rounded-lg border border-ink-200">
            <ProtectedImage
              src={`/api/image/${photo.previewKeyR2}`}
              alt={label}
              fill
              className="object-contain"
              priority
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      {/* Story + Shop */}
      <InlineShop
        photoId={photo.id}
        title={label}
        country={photo.country}
        city={photo.city}
        price={photo.price}
        description={locale === 'en' ? photo.descriptionEn : photo.description}
        takenAt={photo.takenAt}
        width={photo.width}
        height={photo.height}
        fileSize={photo.fileSize}
        orientation={photo.orientation}
        locale={locale}
      />

      {/* Related Photos */}
      {relatedPhotos.length > 0 && (
        <section className="py-16 sm:py-24 bg-ink-50 border-t border-ink-200">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <h2 className="font-display text-3xl sm:text-4xl text-ink-900 mb-8 sm:mb-12">
              {locale === 'fr' ? 'Autres Histoires' : 'More Stories'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {relatedPhotos.map((related) => (
                <StoryCard key={related.id} photo={related} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

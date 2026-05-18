export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
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
    title: `${label} | Nico Garay`,
  }
}

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const en = locale === 'en'

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
    <div className="min-h-screen pt-20 sm:pt-24">
      {/* Back */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
        <Link
          href={`/${locale}/shop`}
          className="group inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-foreground-dim hover:text-accent transition-colors duration-300"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
          {en ? 'Gallery' : 'Galerie'}
        </Link>
      </div>

      {/* Image */}
      <section className="pb-8 sm:pb-12">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="relative h-[55vh] sm:h-[70vh] max-h-[800px] bg-surface-card overflow-hidden">
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

      {/* Info + Purchase */}
      <InlineShop
        photoId={photo.id}
        title={label}
        country={photo.country}
        city={photo.city}
        price={photo.price}
        description={en ? photo.descriptionEn : photo.description}
        takenAt={photo.takenAt}
        width={photo.width}
        height={photo.height}
        fileSize={photo.fileSize}
        orientation={photo.orientation}
        locale={locale}
      />

      {/* Related */}
      {relatedPhotos.length > 0 && (
        <section className="py-16 sm:py-24 border-t border-line">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <h2 className="font-display text-2xl sm:text-3xl text-foreground mb-8 sm:mb-12">
              {en ? 'More Stories' : 'Autres Histoires'}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
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

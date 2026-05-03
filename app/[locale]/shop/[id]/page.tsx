export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { ProtectedImage } from '@/components/shop/ProtectedImage'
import { BuyButton } from '@/components/shop/BuyButton'
import { formatFileSize, formatMegapixels } from '@/lib/utils'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const photo = await prisma.photo.findUnique({
    where: { id },
    select: { title: true, titleEn: true, country: true },
  })
  if (!photo) return {}
  return {
    title: `${locale === 'en' ? photo.titleEn : photo.title} — Nico Garay`,
  }
}

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const t = await getTranslations('shop')

  const photo = await prisma.photo.findUnique({
    where: { id, published: true },
  })

  if (!photo) notFound()

  const title = locale === 'en' ? photo.titleEn : photo.title
  const description = locale === 'en' ? photo.descriptionEn : photo.description

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image protégée */}
        <div className="relative aspect-[3/2] bg-stone-100 overflow-hidden rounded">
          <ProtectedImage
            src={`/api/image/${photo.previewKeyR2}`}
            alt={title}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Infos + achat */}
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl text-stone-800 mb-2">{title}</h1>
            {description && (
              <p className="text-stone-500 leading-relaxed">{description}</p>
            )}
          </div>

          {/* Métadonnées */}
          <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {photo.country && (
              <>
                <dt className="text-stone-400 tracking-wide">{t('metadata.country')}</dt>
                <dd className="text-stone-700">{photo.country}</dd>
              </>
            )}
            {photo.city && (
              <>
                <dt className="text-stone-400 tracking-wide">{t('metadata.city')}</dt>
                <dd className="text-stone-700">{photo.city}</dd>
              </>
            )}
            {photo.takenAt && (
              <>
                <dt className="text-stone-400 tracking-wide">{t('metadata.date')}</dt>
                <dd className="text-stone-700">
                  {new Date(photo.takenAt).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR')}
                </dd>
              </>
            )}
            {photo.camera && (
              <>
                <dt className="text-stone-400 tracking-wide">{t('metadata.camera')}</dt>
                <dd className="text-stone-700">{photo.camera}</dd>
              </>
            )}
          </dl>

          {/* Taille fichier */}
          <p className="text-xs text-stone-400">
            {t('size', {
              mp: formatMegapixels(photo.width, photo.height),
              size: formatFileSize(photo.fileSize),
            })}
          </p>

          {/* Prix + achat */}
          <div className="border-t border-stone-100 pt-6">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="font-serif text-3xl text-stone-800">
                {t('price', { price: photo.price.toFixed(2) })}
              </span>
            </div>
            <p className="text-xs text-stone-400 mb-6">{t('fees')}</p>
            <BuyButton photoId={photo.id} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}

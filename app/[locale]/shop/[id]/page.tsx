export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { ArrowLeft, Calendar, Maximize2 } from 'lucide-react'
import { prisma } from '@/lib/db'
import { ProtectedImage } from '@/components/shop/ProtectedImage'
import { BuyButton } from '@/components/shop/BuyButton'
import { PhotoLocationMap } from '@/components/shop/PhotoLocationMap'
import { formatFileSize, formatMegapixels } from '@/lib/utils'
import { calculateStripeTotal } from '@/lib/fees'
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
    title: `${label} — Nico Garay`,
  }
}

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  const t = await getTranslations('shop')

  const photo = await prisma.photo.findUnique({ where: { id, published: true } })
  if (!photo) notFound()

  const description = locale === 'en' ? photo.descriptionEn : photo.description
  const stripeBreakdown = calculateStripeTotal(photo.price)
  const label = photoPublicLabel(photo, locale)

  return (
    <div className="bg-ink-50 min-h-screen">

      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-28 sm:pt-32">
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {locale === 'fr' ? 'Retour à la boutique' : 'Back to shop'}
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-5 sm:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          <div className="lg:col-span-8 lg:sticky lg:top-28">
            <div className={
              photo.orientation === 'portrait'
                ? 'relative aspect-[2/3] max-h-[80vh] mx-auto bg-ink-100 rounded-xl overflow-hidden'
                : 'relative aspect-[3/2] bg-ink-100 rounded-xl overflow-hidden'
            }>
              <ProtectedImage
                src={`/api/image/${photo.previewKeyR2}`}
                alt={label}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
              <span>© Nico Garay</span>
              <span>{formatMegapixels(photo.width, photo.height)} · {formatFileSize(photo.fileSize)}</span>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-10 sm:space-y-12">

            <div>
              <p className="font-display text-3xl sm:text-5xl text-ink-900 leading-[1.1] text-balance">
                {label}
              </p>
              {description && (
                <p className="text-base text-ink-500 leading-relaxed text-pretty mt-6">{description}</p>
              )}
            </div>

            <PhotoLocationMap
              latitude={photo.latitude}
              longitude={photo.longitude}
              country={photo.country}
              locale={locale}
            />

            <div className="flex flex-col gap-4">
              {photo.takenAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-ink-400 flex-shrink-0" />
                  <span className="text-ink-500">{new Date(photo.takenAt).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', { year: 'numeric', month: 'long' })}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Maximize2 className="w-4 h-4 text-ink-400 flex-shrink-0" />
                <span className="text-ink-500">{photo.orientation === 'portrait' ? (locale === 'fr' ? 'Portrait' : 'Portrait') : (locale === 'fr' ? 'Paysage' : 'Landscape')}</span>
              </div>
            </div>

            <div className="bg-white border border-ink-100 rounded-xl p-8 space-y-6">
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[11px] tracking-[0.2em] uppercase text-ink-400 mb-2">
                    {locale === 'fr' ? 'Téléchargement HD' : 'HD Download'}
                  </p>
                  <p className="font-display text-5xl text-ink-900 tabular-nums leading-none">
                    {photo.price.toFixed(2)}<span className="text-2xl text-ink-500 ml-2">€</span>
                  </p>
                </div>
                <span className="text-[10px] tracking-[0.15em] uppercase text-ink-500 border border-ink-200 px-3 py-1.5 rounded-full bg-ink-50">
                  {t('hd')}
                </span>
              </div>

              <details className="text-xs">
                <summary className="text-ink-600 cursor-pointer hover:text-ink-900 transition-colors select-none list-none flex items-center justify-between py-2">
                  <span className="flex items-baseline gap-2">
                    <span className="font-medium">{locale === 'fr' ? 'Total carte' : 'Card total'}</span>
                    <span className="font-display text-lg text-ink-900 tabular-nums">
                      {stripeBreakdown.total.toFixed(2)} €
                    </span>
                  </span>
                  <span className="text-ink-400 text-[9px] uppercase tracking-wider">
                    {locale === 'fr' ? 'Détails' : 'Details'}
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-ink-100 space-y-2.5 text-ink-600">
                  <div className="flex justify-between">
                    <span>{locale === 'fr' ? 'Photo HD' : 'HD photo'}</span>
                    <span className="tabular-nums text-ink-900">{stripeBreakdown.amount.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{locale === 'fr' ? 'Frais de transaction' : 'Transaction fees'}</span>
                    <span className="tabular-nums text-ink-900">+ {stripeBreakdown.fees.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-ink-100 font-medium text-ink-900 text-sm">
                    <span>{locale === 'fr' ? 'Total' : 'Total'}</span>
                    <span className="tabular-nums">{stripeBreakdown.total.toFixed(2)} €</span>
                  </div>
                  <p className="text-[9px] text-ink-500 pt-2">
                    {locale === 'fr'
                      ? `Virement IBAN: sans frais — montant exact ${photo.price.toFixed(2)} €`
                      : `IBAN transfer: no fees — exact €${photo.price.toFixed(2)}`}
                  </p>
                </div>
              </details>

              <BuyButton photoId={photo.id} locale={locale} />
            </div>

            <div className="text-xs text-ink-500 leading-relaxed space-y-2">
              <p>
                {locale === 'fr'
                  ? 'Licence personnelle. Le fichier livré contient un filigrane invisible identifiant l\'acheteur.'
                  : 'Personal license. The delivered file contains an invisible watermark identifying the buyer.'}
              </p>
              <Link
                href={`/${locale}/legal/license`}
                className="inline-block text-ink-600 hover:text-ink-900 transition-colors font-medium"
              >
                {locale === 'fr' ? 'Détails de la licence →' : 'License details →'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


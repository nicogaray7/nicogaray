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
    title: `${label} - Nico Garay`,
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
      <div className="max-w-7xl mx-auto px-5 sm:px-8 pt-24 sm:pt-32">
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-accent-400 hover:text-accent-500 transition-colors group font-medium"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          {locale === 'fr' ? 'Retour a la boutique' : 'Back to shop'}
        </Link>
      </div>

      <section className="pt-8 sm:pt-12">
        <div
          className={
            photo.orientation === 'portrait'
              ? 'relative w-full max-w-7xl mx-auto px-5 sm:px-8'
              : 'relative w-full'
          }
        >
          <div
            className={
              photo.orientation === 'portrait'
                ? 'relative aspect-[2/3] max-h-[86vh] mx-auto bg-ink-150 overflow-hidden border border-accent-500/30'
                : 'relative aspect-[16/9] bg-ink-150 overflow-hidden border border-accent-500/30'
            }
          >
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

      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 space-y-8 sm:space-y-10">
            <div className="space-y-5">
              <p className="text-[11px] tracking-[0.3em] uppercase text-accent-400">
                {locale === 'fr' ? 'Edition' : 'Edition'}
              </p>
              <h1 className="font-display text-4xl sm:text-6xl text-ink-900 leading-[1.05] text-balance">
                {label}
              </h1>
              {description && (
                <p className="text-base sm:text-lg text-ink-700 leading-[1.7]">
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs sm:text-sm text-ink-700">
              {photo.takenAt && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent-400" />
                  {new Date(photo.takenAt).toLocaleDateString(locale === 'en' ? 'en-GB' : 'fr-FR', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              )}
              <span className="inline-flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-accent-400" />
                {photo.orientation === 'portrait'
                  ? locale === 'fr'
                    ? 'Portrait'
                    : 'Portrait'
                  : locale === 'fr'
                    ? 'Paysage'
                    : 'Landscape'}
              </span>
              <span className="text-ink-600">
                {formatMegapixels(photo.width, photo.height)} · {formatFileSize(photo.fileSize)}
              </span>
            </div>

            <div className="border-t border-accent-500/20 pt-8 sm:pt-10">
              {photo.latitude != null || photo.longitude != null || photo.country ? (
                <PhotoLocationMap
                  latitude={photo.latitude}
                  longitude={photo.longitude}
                  country={photo.country}
                  locale={locale}
                />
              ) : (
                <div className="rounded-lg border border-accent-500/30 bg-ink-150 p-6">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-accent-400 mb-2">
                    {locale === 'fr' ? 'Localisation' : 'Location'}
                  </p>
                  <p className="text-sm text-ink-700">
                    {locale === 'fr'
                      ? 'Localisation indisponible pour cette edition.'
                      : 'Location unavailable for this edition.'}
                  </p>
                </div>
              )}
            </div>

            <div className="text-xs text-ink-700 leading-relaxed space-y-2 pt-2">
              <p>
                {locale === 'fr'
                  ? "Licence personnelle. Le fichier livre contient un filigrane invisible identifiant l'acheteur."
                  : 'Personal license. The delivered file contains an invisible watermark identifying the buyer.'}
              </p>
              <Link
                href={`/${locale}/legal/license`}
                className="inline-block text-accent-500 hover:text-accent-600 transition-colors font-medium"
              >
                {locale === 'fr' ? 'Details de la licence' : 'License details'}
              </Link>
            </div>
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="bg-ink-50 border border-accent-500/30 rounded-lg p-8 sm:p-10 space-y-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-accent-400 mb-2">
                    {locale === 'fr' ? 'Telechargement HD' : 'HD Download'}
                  </p>
                  <p className="font-display text-5xl sm:text-6xl text-accent-500 tabular-nums leading-none">
                    {photo.price.toFixed(2)}<span className="text-2xl text-ink-700 ml-2">EUR</span>
                  </p>
                </div>
                <span className="text-[9px] tracking-[0.15em] uppercase text-ink-700 border border-accent-500/40 px-3 py-1.5 rounded-full bg-accent-500/10">
                  {t('hd')}
                </span>
              </div>

              <details className="text-xs border-t border-accent-500/20 pt-5">
                <summary className="text-ink-700 cursor-pointer hover:text-accent-500 transition-colors select-none list-none flex items-center justify-between py-2">
                  <span className="flex items-baseline gap-2">
                    <span className="font-medium">{locale === 'fr' ? 'Total carte' : 'Card total'}</span>
                    <span className="font-display text-lg text-accent-500 tabular-nums">
                      {stripeBreakdown.total.toFixed(2)} EUR
                    </span>
                  </span>
                  <span className="text-ink-600 text-[9px] uppercase tracking-wider">
                    {locale === 'fr' ? 'Details' : 'Details'}
                  </span>
                </summary>
                <div className="mt-4 pt-4 border-t border-accent-500/20 space-y-2.5 text-ink-700">
                  <div className="flex justify-between">
                    <span>{locale === 'fr' ? 'Photo HD' : 'HD photo'}</span>
                    <span className="tabular-nums text-ink-900">{stripeBreakdown.amount.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{locale === 'fr' ? 'Frais de transaction' : 'Transaction fees'}</span>
                    <span className="tabular-nums text-ink-900">+ {stripeBreakdown.fees.toFixed(2)} EUR</span>
                  </div>
                  <div className="flex justify-between pt-2.5 border-t border-accent-500/20 font-medium text-ink-900 text-sm">
                    <span>{locale === 'fr' ? 'Total' : 'Total'}</span>
                    <span className="tabular-nums">{stripeBreakdown.total.toFixed(2)} EUR</span>
                  </div>
                  <p className="text-[9px] text-ink-700 pt-2">
                    {locale === 'fr'
                      ? `Virement IBAN: sans frais - montant exact ${photo.price.toFixed(2)} EUR`
                      : `IBAN transfer: no fees - exact ${photo.price.toFixed(2)} EUR`}
                  </p>
                </div>
              </details>

              <BuyButton photoId={photo.id} locale={locale} />
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}


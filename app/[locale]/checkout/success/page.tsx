export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { photoPublicLabel } from '@/lib/photoLabel'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { locale } = await params
  const { session_id } = await searchParams
  const t = await getTranslations('checkout.success')

  let order = null
  let photo = null

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id)
      const orderId = session.metadata?.orderId

      if (orderId) {
        order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { photo: true },
        })
        photo = order?.photo
      }
    } catch {
      // session invalide
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos-garaynico.com'
  const downloadUrl = order ? `${siteUrl}/api/download/${order.downloadToken}` : null
  const label = photo ? photoPublicLabel(photo, locale) : ''

  return (
    <section className="py-32 sm:py-40">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <svg className="w-16 h-16 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl text-ink-900 mb-6">
            {t('title')}
          </h1>

          {label && (
            <p className="text-ink-700 mb-8 text-lg sm:text-xl">
              {label}
            </p>
          )}

          <p className="text-ink-600 mb-10 text-base sm:text-lg">
            {t('message')}
          </p>

          {downloadUrl && (
            <div className="space-y-6 mb-12">
              <a
                href={downloadUrl}
                className="inline-block bg-accent-500 text-white text-sm tracking-widest uppercase px-10 py-3 hover:bg-accent-600 transition-colors font-medium"
              >
                {t('download')}
              </a>
              <p className="text-xs text-ink-600">
                {t('expiry', { max: order?.downloadMax ?? 3 })}
              </p>
            </div>
          )}

          <p className="text-xs text-ink-600 mb-10">
            {t('email')}
          </p>

          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 text-accent-500 text-sm tracking-wider uppercase hover:text-accent-600 transition-colors"
          >
            {locale === 'fr' ? 'Retour à la boutique' : 'Back to shop'}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { photoPublicLabel } from '@/lib/photoLabel'
import Link from 'next/link'
import { ArrowRight, CheckCircle } from 'lucide-react'

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
  const en = locale === 'en'

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
      // invalid session
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com'
  const downloadUrl = order ? `${siteUrl}/api/download/${order.downloadToken}` : null
  const label = photo ? photoPublicLabel(photo, locale) : ''

  return (
    <section className="min-h-screen flex items-center py-32 sm:py-40">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 w-full">
        <div className="text-center">
          <div className="mb-8 flex justify-center animate-fade-up">
            <CheckCircle className="w-14 h-14 text-accent" strokeWidth={1} />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-6 animate-fade-up delay-100">
            {t('title')}
          </h1>

          {label && (
            <p className="text-foreground-dim mb-8 text-lg animate-fade-up delay-200">
              {label}
            </p>
          )}

          <p className="text-foreground-muted mb-10 text-base animate-fade-up delay-200">
            {t('message')}
          </p>

          {downloadUrl && (
            <div className="space-y-6 mb-12 animate-fade-up delay-300">
              <a
                href={downloadUrl}
                className="inline-block bg-accent hover:bg-accent-dim text-surface text-sm tracking-widest uppercase px-10 py-3.5 transition-colors font-medium"
              >
                {t('download')}
              </a>
              <p className="text-xs text-foreground-muted">
                {t('expiry', { max: order?.downloadMax ?? 3 })}
              </p>
            </div>
          )}

          <p className="text-xs text-foreground-muted mb-10">
            {t('email')}
          </p>

          <Link
            href={`/${locale}/shop`}
            className="group inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-accent hover:text-foreground transition-colors duration-300"
          >
            {en ? 'Back to gallery' : 'Retour a la galerie'}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

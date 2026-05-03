export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import Link from 'next/link'

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
  const title = photo ? (locale === 'en' ? photo.titleEn : photo.title) : ''

  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center">
      <div className="mb-8">
        <svg className="w-16 h-16 mx-auto text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="font-serif text-4xl text-stone-800 mb-4">{t('title')}</h1>
      {title && <p className="text-stone-500 mb-8 text-lg">{title}</p>}
      <p className="text-stone-500 mb-8">{t('message')}</p>

      {downloadUrl && (
        <div className="space-y-4">
          <a
            href={downloadUrl}
            className="inline-block bg-stone-900 text-white text-sm tracking-wide px-8 py-3 rounded hover:bg-stone-700 transition-colors"
          >
            {t('download')}
          </a>
          <p className="text-xs text-stone-400">
            {t('expiry', { max: order?.downloadMax ?? 3 })}
          </p>
        </div>
      )}

      <p className="text-xs text-stone-400 mt-6">{t('email')}</p>

      <Link
        href={`/${locale}/shop`}
        className="inline-block mt-8 text-sm text-stone-400 hover:text-stone-700 underline"
      >
        ← Retour à la boutique
      </Link>
    </div>
  )
}

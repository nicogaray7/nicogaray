import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_CURRENCY } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { generateDownloadToken, getDownloadExpiry } from '@/lib/tokens'
import { calculateStripeTotal } from '@/lib/fees'
import { photoPublicLabel } from '@/lib/photoLabel'

export async function POST(req: NextRequest) {
  try {
    const { photoId, locale = 'fr' } = await req.json()

    const photo = await prisma.photo.findUnique({
      where: { id: photoId, published: true },
    })
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com'
    const label = photoPublicLabel(photo, locale)

    // Calcul du total avec frais Stripe répercutés
    const breakdown = calculateStripeTotal(photo.price)

    const order = await prisma.order.create({
      data: {
        photoId:        photo.id,
        buyerEmail:     '',
        paymentMethod:  'stripe',
        paymentStatus:  'pending',
        amount:         breakdown.amount,
        fees:           breakdown.fees,
        total:          breakdown.total,
        downloadToken:  generateDownloadToken(),
        downloadExpiry: getDownloadExpiry(48),
      },
    })

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency:    STRIPE_CURRENCY,
            unit_amount: Math.round(breakdown.amount * 100),
            product_data: {
              name:        label,
              description: photo.country
                ? `Photo HD - ${photo.country}`
                : 'Photo HD',
            },
          },
        },
        {
          quantity: 1,
          price_data: {
            currency:    STRIPE_CURRENCY,
            unit_amount: Math.round(breakdown.fees * 100),
            product_data: {
              name:        locale === 'fr' ? 'Frais de transaction' : 'Transaction fees',
              description: locale === 'fr'
                ? 'Frais Stripe (1.5% + 0.25€)'
                : 'Stripe fees (1.5% + €0.25)',
            },
          },
        },
      ],
      metadata: {
        orderId: order.id,
        photoId: photo.id,
        locale,
      },
      success_url: `${siteUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${siteUrl}/${locale}/shop/${photo.id}`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[STRIPE CHECKOUT]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

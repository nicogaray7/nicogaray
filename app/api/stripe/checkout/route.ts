import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PHOTO_PRICE_EUR, STRIPE_CURRENCY } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { generateDownloadToken, getDownloadExpiry } from '@/lib/tokens'

export async function POST(req: NextRequest) {
  const { photoId, locale = 'fr' } = await req.json()

  const photo = await prisma.photo.findUnique({
    where: { id: photoId, published: true },
  })

  if (!photo) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos-garaynico.com'
  const title = locale === 'en' ? photo.titleEn : photo.title

  const order = await prisma.order.create({
    data: {
      photoId: photo.id,
      buyerEmail: '',
      paymentMethod: 'stripe',
      paymentStatus: 'pending',
      amount: photo.price,
      fees: 0,
      total: photo.price,
      downloadToken: generateDownloadToken(),
      downloadExpiry: getDownloadExpiry(48),
    },
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: STRIPE_CURRENCY,
          unit_amount: Math.round(photo.price * 100),
          product_data: {
            name: title,
            description: photo.country ? `Photo — ${photo.country}` : 'Photo HD',
          },
        },
      },
    ],
    metadata: {
      orderId: order.id,
      photoId: photo.id,
      locale,
    },
    customer_email: undefined,
    success_url: `${siteUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${locale}/shop/${photo.id}`,
  })

  return NextResponse.json({ url: session.url })
}

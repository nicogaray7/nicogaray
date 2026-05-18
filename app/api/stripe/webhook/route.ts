import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'
import { sendDownloadEmail } from '@/lib/email'
import { photoPublicLabel } from '@/lib/photoLabel'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const { orderId, locale } = session.metadata ?? {}

    if (!orderId) return NextResponse.json({ ok: true })

    const paidAt = new Date()

    const totalCents = session.amount_total ?? 0

    await prisma.order.update({
      where: { id: orderId },
      data: {
        buyerEmail:      session.customer_email ?? '',
        buyerName:       session.customer_details?.name ?? undefined,
        stripeSessionId: session.id,
        paymentStatus:   'paid',
        paidAt,
        total:           totalCents / 100,
      },
    })

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { photo: true },
    })

    if (order && session.customer_email) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com'
      const downloadUrl = `${siteUrl}/api/download/${order.downloadToken}`
      const label = photoPublicLabel(order.photo, locale ?? 'fr')

      await sendDownloadEmail({
        to: session.customer_email,
        name: session.customer_details?.name ?? undefined,
        photoTitle: label,
        downloadUrl,
        expiry: order.downloadExpiry!,
        locale: locale ?? 'fr',
      }).catch(console.error)
    }
  }

  return NextResponse.json({ ok: true })
}

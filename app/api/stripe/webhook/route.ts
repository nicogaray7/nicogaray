import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { sendPurchaseEmail } from '@/lib/email';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const sig = headers().get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const stripe = getStripe();
  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error('[stripe] invalid signature', err);
    return NextResponse.json({ error: 'Bad signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    const locale = (session.metadata?.locale === 'en' ? 'en' : 'fr') as 'fr' | 'en';
    if (!orderId) return NextResponse.json({ received: true });

    const expiryHours = Number(process.env.DOWNLOAD_TOKEN_EXPIRY_HOURS ?? 48);
    const downloadExpiry = new Date(Date.now() + expiryHours * 3600 * 1000);

    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: 'paid',
        paidAt: new Date(),
        stripePaymentIntentId:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
        downloadExpiry,
      },
      include: { photo: true },
    });

    await sendPurchaseEmail({
      to: order.buyerEmail,
      photoTitle: order.photo.title,
      downloadToken: order.downloadToken,
      total: order.total,
      currency: order.currency,
      locale,
    }).catch((err) => console.error('[email] send failed', err));
  } else if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentStatus: 'failed' },
      });
    }
  }

  return NextResponse.json({ received: true });
}

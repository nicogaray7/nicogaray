'use server';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { getStripe, buyerFees } from '@/lib/stripe';

/** Extrait le client_id GA4 du cookie _ga (format GA1.1.<cid1>.<cid2>). */
function gaClientIdFromCookies(): string {
  const ga = cookies().get('_ga')?.value ?? '';
  const parts = ga.split('.');
  return parts.length >= 4 ? `${parts[parts.length - 2]}.${parts[parts.length - 1]}` : '';
}

const schema = z.object({
  photoId: z.string().min(1),
  locale: z.string().min(2),
});

export async function createCheckoutSession(
  raw: z.infer<typeof schema>,
): Promise<{ url?: string; error?: string }> {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: 'Invalid input' };
  const { photoId, locale } = parsed.data;

  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo || !photo.published) return { error: 'Photo not found' };

  const fees = buyerFees(photo.price);
  const total = Math.round((photo.price + fees) * 100) / 100;

  // Create the Order first so we can reference it in Stripe metadata.
  // Buyer details (email, name, phone) are filled in by the webhook once
  // Stripe Checkout has collected them natively.
  const order = await prisma.order.create({
    data: {
      photoId: photo.id,
      amount: photo.price,
      fees,
      total,
      currency: photo.currency,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com';
  const stripe = getStripe();

  // Metadata partagées entre la Checkout Session et le PaymentIntent. Les
  // copier sur le PaymentIntent permet de retrouver la photo directement sur
  // la page paiement du Dashboard Stripe, avec slug + titre lisibles (pas que
  // le cuid interne).
  const metadata = {
    orderId: order.id,
    photoId: photo.id,
    photoSlug: photo.slug,
    photoTitle: photo.title,
    locale,
    gaClientId: gaClientIdFromCookies(),
  };

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    locale: locale === 'fr' ? 'fr' : 'en',
    // Stripe-native collection of customer details
    billing_address_collection: 'required',
    phone_number_collection: { enabled: true },
    customer_creation: 'always',
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: photo.currency.toLowerCase(),
          unit_amount: Math.round(total * 100),
          product_data: {
            name: photo.title,
            description: photo.description ?? undefined,
          },
        },
      },
    ],
    metadata,
    payment_intent_data: { metadata },
    success_url: `${siteUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/${locale}/gallery/${photo.slug}`,
  });

  if (!session.url) return { error: 'Stripe session failed' };

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return { url: session.url };
}

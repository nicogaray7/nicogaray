'use server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { getStripe, buyerFees } from '@/lib/stripe';

const schema = z.object({
  photoId: z.string().min(1),
  locale: z.string().min(2),
  email: z.string().email(),
  firstName: z.string().trim().min(1, 'First name required'),
  lastName: z.string().trim().min(1, 'Last name required'),
});

export async function createCheckoutSession(
  raw: z.infer<typeof schema>,
): Promise<{ url?: string; error?: string }> {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { error: 'Invalid input' };
  const { photoId, locale, email, firstName, lastName } = parsed.data;
  const name = `${firstName} ${lastName}`;

  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo || !photo.published) return { error: 'Photo not found' };

  const fees = buyerFees(photo.price);
  const total = Math.round((photo.price + fees) * 100) / 100;

  const order = await prisma.order.create({
    data: {
      photoId: photo.id,
      buyerEmail: email.toLowerCase(),
      buyerName: name,
      amount: photo.price,
      fees,
      total,
      currency: photo.currency,
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com';
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: email,
    locale: locale === 'fr' ? 'fr' : 'en',
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
    metadata: {
      orderId: order.id,
      photoId: photo.id,
      locale,
    },
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

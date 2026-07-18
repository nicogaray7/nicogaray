'use server';

import { revalidatePath } from 'next/cache';
import crypto from 'crypto';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { sendPurchaseEmail } from '@/lib/email';
import { logAudit } from '@/lib/audit';

async function requireAdmin() {
  const s = await auth();
  if (!s?.user) throw new Error('Unauthorized');
  return s.user;
}

function revalidateOrders(id: string) {
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
}

export async function refundOrder(id: string, reason?: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new Error('Order not found');
  if (order.paymentStatus !== 'paid') {
    throw new Error(`Cannot refund order with status "${order.paymentStatus}"`);
  }

  if (order.stripePaymentIntentId) {
    try {
      const stripe = getStripe();
      await stripe.refunds.create({ payment_intent: order.stripePaymentIntentId });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      throw new Error(`Stripe refund failed: ${msg}`);
    }
  }

  await prisma.order.update({
    where: { id },
    data: {
      paymentStatus: 'refunded',
      refundedAt: new Date(),
      refundReason: reason ?? null,
    },
  });

  await logAudit('order.refund', {
    target: id,
    meta: { amount: order.total, currency: order.currency, reason },
  });

  revalidateOrders(id);
}

export async function resendDownloadLink(id: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id },
    include: { photo: { select: { title: true } } },
  });
  if (!order) throw new Error('Order not found');
  if (!order.buyerEmail) throw new Error('No buyer email on this order');

  await sendPurchaseEmail({
    to: order.buyerEmail,
    photoTitle: order.photo?.title ?? 'Photo',
    downloadToken: order.downloadToken,
    total: order.total,
    currency: order.currency,
    paymentIntentId: order.stripePaymentIntentId,
  });

  await logAudit('order.resend_link', { target: id, meta: { buyerEmail: order.buyerEmail } });

  revalidateOrders(id);
}

export async function resetDownloads(id: string) {
  await requireAdmin();

  const downloadToken = crypto.randomUUID();
  const downloadExpiry = new Date(Date.now() + 30 * 24 * 3600 * 1000);

  await prisma.order.update({
    where: { id },
    data: {
      downloadToken,
      downloadCount: 0,
      downloadExpiry,
    },
  });

  await logAudit('order.reset_downloads', { target: id });

  revalidateOrders(id);
}

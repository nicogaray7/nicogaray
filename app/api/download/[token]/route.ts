import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { r2SignedGetUrl } from '@/lib/r2';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_: Request, props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const order = await prisma.order.findUnique({
    where: { downloadToken: params.token },
    include: { photo: true },
  });

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (order.paymentStatus !== 'paid') return NextResponse.json({ error: 'Not paid' }, { status: 403 });
  if (order.downloadExpiry && order.downloadExpiry < new Date()) {
    return NextResponse.json({ error: 'Link expired' }, { status: 410 });
  }
  if (order.downloadCount >= order.downloadMax) {
    return NextResponse.json({ error: 'Download limit reached' }, { status: 410 });
  }

  await prisma.order.update({
    where: { id: order.id },
    data: {
      downloadCount: { increment: 1 },
      downloadedAt: new Date(),
    },
  });

  const url = await r2SignedGetUrl(order.photo.originalKey, 60 * 5);
  return NextResponse.redirect(url, 302);
}

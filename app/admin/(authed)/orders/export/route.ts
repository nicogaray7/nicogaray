import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '""';
  const str = String(value);
  if (str.includes('"') || str.includes(',') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q') ?? '';
  const status = searchParams.get('status') ?? '';

  const where = {
    ...(q
      ? {
          OR: [
            { buyerEmail: { contains: q, mode: 'insensitive' as const } },
            { buyerName: { contains: q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(status ? { paymentStatus: status } : {}),
  };

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { photo: { select: { title: true } } },
  });

  const header = [
    'id',
    'date',
    'photo',
    'buyerName',
    'buyerEmail',
    'status',
    'amount',
    'fees',
    'total',
    'currency',
    'downloadCount',
  ].map(escapeCsv).join(',');

  const rows = orders.map((o) => {
    return [
      o.id,
      new Date(o.createdAt).toISOString(),
      o.photo?.title ?? '',
      o.buyerName ?? '',
      o.buyerEmail ?? '',
      o.paymentStatus,
      o.amount,
      o.fees,
      o.total,
      o.currency,
      o.downloadCount,
    ]
      .map(escapeCsv)
      .join(',');
  });

  const csv = [header, ...rows].join('\n');
  const filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

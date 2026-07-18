import { prisma } from '@/lib/prisma';

export type MonthlyData = {
  month: string;
  label: string;
  revenue: number;
  orders: number;
};

export type TopPhoto = {
  id: string;
  title: string;
  slug: string;
  thumbKey: string;
  revenue: number;
  sales: number;
};

export type RecentOrder = {
  id: string;
  buyerEmail: string | null;
  paymentStatus: string;
  amount: number;
  currency: string;
  createdAt: Date;
  photo: { title: string; slug: string } | null;
};

export type DashboardData = {
  totalRevenue: number;
  paidOrders: number;
  pendingOrders: number;
  refundedOrders: number;
  avgOrderValue: number;
  totalPhotos: number;
  publishedPhotos: number;
  featuredPhotos: number;
  monthly: MonthlyData[];
  topPhotos: TopPhoto[];
  recent: RecentOrder[];
};

const MONTH_LABELS: Record<number, string> = {
  0: 'janv.',
  1: 'fevr.',
  2: 'mars',
  3: 'avr.',
  4: 'mai',
  5: 'juin',
  6: 'juil.',
  7: 'aout',
  8: 'sept.',
  9: 'oct.',
  10: 'nov.',
  11: 'dec.',
};

function buildMonthKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function buildMonthLabel(date: Date): string {
  const shortYear = String(date.getFullYear()).slice(2);
  return `${MONTH_LABELS[date.getMonth()]} ${shortYear}`;
}

function getLast12Months(): { month: string; label: string }[] {
  const result: { month: string; label: string }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({ month: buildMonthKey(d), label: buildMonthLabel(d) });
  }
  return result;
}

export async function getDashboardData(): Promise<DashboardData> {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  twelveMonthsAgo.setDate(1);
  twelveMonthsAgo.setHours(0, 0, 0, 0);

  const [
    revenueAgg,
    paidOrders,
    pendingOrders,
    refundedOrders,
    totalPhotos,
    publishedPhotos,
    featuredPhotos,
    monthlyOrders,
    topGroups,
    recent,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { paymentStatus: 'paid' },
      _sum: { amount: true },
    }),
    prisma.order.count({ where: { paymentStatus: 'paid' } }),
    prisma.order.count({ where: { paymentStatus: 'pending' } }),
    prisma.order.count({ where: { paymentStatus: 'refunded' } }),
    prisma.photo.count(),
    prisma.photo.count({ where: { published: true } }),
    prisma.photo.count({ where: { featured: true } }),
    prisma.order.findMany({
      where: {
        paymentStatus: 'paid',
        paidAt: { gte: twelveMonthsAgo },
      },
      select: { amount: true, paidAt: true },
    }),
    prisma.order.groupBy({
      by: ['photoId'],
      where: { paymentStatus: 'paid' },
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: 5,
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: {
        id: true,
        buyerEmail: true,
        paymentStatus: true,
        amount: true,
        currency: true,
        createdAt: true,
        photo: { select: { title: true, slug: true } },
      },
    }),
  ]);

  const totalRevenue = revenueAgg._sum.amount ?? 0;
  const avgOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;

  // Build monthly map
  const monthSlots = getLast12Months();
  const monthMap: Record<string, { revenue: number; orders: number }> = {};
  for (const slot of monthSlots) {
    monthMap[slot.month] = { revenue: 0, orders: 0 };
  }
  for (const o of monthlyOrders) {
    const key = buildMonthKey(o.paidAt ?? new Date());
    if (monthMap[key]) {
      monthMap[key].revenue += o.amount;
      monthMap[key].orders += 1;
    }
  }
  const monthly: MonthlyData[] = monthSlots.map((s) => ({
    month: s.month,
    label: s.label,
    revenue: monthMap[s.month]?.revenue ?? 0,
    orders: monthMap[s.month]?.orders ?? 0,
  }));

  // Resolve top photos
  const photoIds = topGroups.map((g) => g.photoId);
  const photos =
    photoIds.length > 0
      ? await prisma.photo.findMany({
          where: { id: { in: photoIds } },
          select: { id: true, title: true, slug: true, thumbKey: true },
        })
      : [];

  const photoMap = new Map(photos.map((p) => [p.id, p]));
  const topPhotos: TopPhoto[] = topGroups
    .map((g) => {
      const p = photoMap.get(g.photoId);
      if (!p) return null;
      return {
        id: p.id,
        title: p.title,
        slug: p.slug,
        thumbKey: p.thumbKey,
        revenue: g._sum.amount ?? 0,
        sales: g._count.id,
      };
    })
    .filter((x): x is TopPhoto => x !== null);

  return {
    totalRevenue,
    paidOrders,
    pendingOrders,
    refundedOrders,
    avgOrderValue,
    totalPhotos,
    publishedPhotos,
    featuredPhotos,
    monthly,
    topPhotos,
    recent,
  };
}

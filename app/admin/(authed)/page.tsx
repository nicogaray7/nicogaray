import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getStats() {
  const [photos, published, featured, pendingOrders, paidOrders, revenueRows] = await Promise.all([
    prisma.photo.count(),
    prisma.photo.count({ where: { published: true } }),
    prisma.photo.count({ where: { featured: true } }),
    prisma.order.count({ where: { paymentStatus: 'pending' } }),
    prisma.order.count({ where: { paymentStatus: 'paid' } }),
    prisma.order.aggregate({ where: { paymentStatus: 'paid' }, _sum: { amount: true } }),
  ]);
  return {
    photos,
    published,
    featured,
    pendingOrders,
    paidOrders,
    revenue: revenueRows._sum.amount ?? 0,
  };
}

async function getRecentOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { photo: { select: { title: true, slug: true } } },
  });
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const orders = await getRecentOrders();
  return (
    <Container size="wide">
      <div className="mb-12 space-y-3">
        <p className="eyebrow text-accent">Dashboard</p>
        <h1 className="text-display-lg font-display text-ink">Overview</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        <Stat label="Photos" value={stats.photos} />
        <Stat label="Published" value={stats.published} />
        <Stat label="Featured" value={stats.featured} />
        <Stat label="Pending" value={stats.pendingOrders} />
        <Stat label="Paid" value={stats.paidOrders} />
        <Stat label="Revenue" value={formatPrice(stats.revenue, 'EUR')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Quick actions">
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/photos/new" className="inline-flex items-center px-5 py-2.5 bg-ink text-paper text-[11px] tracking-widest uppercase hover:bg-accent transition-colors">
              + Upload photo
            </Link>
            <Link href="/admin/photos" className="inline-flex items-center px-5 py-2.5 border border-line text-[11px] tracking-widest uppercase text-ink hover:border-ink transition-colors">
              Manage photos
            </Link>
          </div>
        </Card>

        <Card title="Recent orders">
          {orders.length === 0 ? (
            <p className="caption">No orders yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {orders.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="truncate text-ink">{o.photo?.title ?? '—'}</p>
                    <p className="caption">{o.buyerEmail}</p>
                  </div>
                  <span
                    className={`text-[10px] tracking-widest uppercase ${
                      o.paymentStatus === 'paid' ? 'text-green-700' : 'text-ink-muted'
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </Container>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="bg-paper border border-line p-5">
      <p className="eyebrow text-ink-muted mb-2">{label}</p>
      <p className="font-display text-2xl text-ink tabular-nums">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-paper border border-line p-6">
      <p className="eyebrow text-accent mb-4">{title}</p>
      {children}
    </section>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { PageHeader, Card, StatCard, StatusPill, EmptyState } from '@/components/admin';
import { formatPrice } from '@/lib/utils';
import { r2PublicUrl } from '@/lib/r2-url';
import { getDashboardData } from '@/lib/admin/dashboard-data';
import { RevenueChart } from './_dashboard/RevenueChart';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const data = await getDashboardData();

  const {
    totalRevenue,
    paidOrders,
    pendingOrders,
    refundedOrders,
    avgOrderValue,
    publishedPhotos,
    monthly,
    topPhotos,
    recent,
  } = data;

  return (
    <Container size="wide">
      <PageHeader eyebrow="Dashboard" title="Overview" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
        <StatCard label="Revenue" value={formatPrice(totalRevenue)} />
        <StatCard label="Paid orders" value={paidOrders} />
        <StatCard label="Avg order" value={formatPrice(avgOrderValue)} />
        <StatCard label="Published" value={publishedPhotos} />
        <StatCard label="Pending" value={pendingOrders} />
        <StatCard label="Refunded" value={refundedOrders} />
      </div>

      <Card title="Revenue (12 mois)" className="mb-8">
        <RevenueChart data={monthly} />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Top photos">
          {topPhotos.length === 0 ? (
            <EmptyState title="Aucune vente" description="Les meilleures photos apparaîtront ici." />
          ) : (
            <ul className="divide-y divide-line">
              {topPhotos.map((p) => {
                const thumb = r2PublicUrl(p.thumbKey);
                return (
                  <li key={p.id} className="py-3 flex items-center gap-3">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={p.title}
                        width={40}
                        height={40}
                        className="object-cover shrink-0 border border-line"
                        unoptimized
                      />
                    ) : (
                      <div className="w-10 h-10 bg-paper-cool border border-line shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/photos/${p.id}`}
                        className="text-sm text-ink hover:text-accent truncate block"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs text-ink-muted">
                        {p.sales} vente{p.sales !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-ink shrink-0">
                      {formatPrice(p.revenue)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Recent orders">
          {recent.length === 0 ? (
            <EmptyState title="Aucune commande" description="Les dernières commandes apparaîtront ici." />
          ) : (
            <ul className="divide-y divide-line">
              {recent.map((o) => (
                <li key={o.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink truncate">{o.photo?.title ?? 'Photo supprimee'}</p>
                    {o.buyerEmail && (
                      <p className="text-xs text-ink-muted truncate">{o.buyerEmail}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusPill status={o.paymentStatus} />
                    <span className="text-sm font-medium text-ink tabular-nums">
                      {formatPrice(o.amount, o.currency)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </Container>
  );
}

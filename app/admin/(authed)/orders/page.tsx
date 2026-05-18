import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { photo: { select: { title: true, slug: true } } },
  });
}

export default async function AdminOrders() {
  const orders = await getOrders();
  return (
    <Container size="wide">
      <div className="space-y-3 mb-10">
        <p className="eyebrow text-accent">Orders</p>
        <h1 className="text-display-lg font-display text-ink">All orders</h1>
        <p className="caption">{orders.length} total</p>
      </div>

      {orders.length === 0 ? (
        <div className="border border-dashed border-line py-32 text-center">
          <p className="caption">No orders yet.</p>
        </div>
      ) : (
        <div className="bg-paper border border-line overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-cool">
              <tr className="text-left">
                <Th>Date</Th>
                <Th>Photo</Th>
                <Th>Buyer</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Downloads</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="p-3 text-ink-muted text-xs whitespace-nowrap">
                    {new Date(o.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-3 text-ink">{o.photo?.title ?? '-'}</td>
                  <td className="p-3">
                    <p className="text-ink">{o.buyerName ?? '-'}</p>
                    <p className="caption text-xs">{o.buyerEmail}</p>
                  </td>
                  <td className="p-3 tabular-nums">{formatPrice(o.total, o.currency)}</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] tracking-widest uppercase ${
                        o.paymentStatus === 'paid'
                          ? 'text-green-700'
                          : o.paymentStatus === 'failed' || o.paymentStatus === 'refunded'
                            ? 'text-red-700'
                            : 'text-ink-muted'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="p-3 text-ink-muted text-xs">
                    {o.downloadCount}/{o.downloadMax}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2.5 text-[10px] tracking-widest uppercase text-ink-muted font-normal">
      {children}
    </th>
  );
}

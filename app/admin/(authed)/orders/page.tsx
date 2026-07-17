import Link from 'next/link';
import { Download } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { parseListParams, buildQuery } from '@/lib/admin/list-params';
import {
  PageHeader,
  Toolbar,
  SearchInput,
  DataTable,
  EmptyState,
  Pagination,
  StatusPill,
} from '@/components/admin';
import type { Column } from '@/components/admin/DataTable';

export const dynamic = 'force-dynamic';

const PAYMENT_STATUSES = ['paid', 'pending', 'refunded', 'failed'] as const;

type OrderRow = {
  id: string;
  createdAt: Date;
  photo: { title: string; slug: string } | null;
  buyerName: string | null;
  buyerEmail: string | null;
  total: number;
  currency: string;
  paymentStatus: string;
  downloadCount: number;
  downloadMax: number;
};

const COLUMNS: Column<OrderRow>[] = [
  {
    key: 'createdAt',
    header: 'Date',
    sortable: true,
    render: (o) =>
      new Date(o.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
  },
  {
    key: 'photo',
    header: 'Photo',
    render: (o) => (
      <span className="text-ink">{o.photo?.title ?? '-'}</span>
    ),
  },
  {
    key: 'buyer',
    header: 'Acheteur',
    render: (o) => (
      <div>
        <p className="text-ink">{o.buyerName ?? '-'}</p>
        <p className="text-xs text-ink-muted">{o.buyerEmail ?? '-'}</p>
      </div>
    ),
  },
  {
    key: 'total',
    header: 'Montant',
    sortable: true,
    align: 'right',
    render: (o) => (
      <span className="tabular-nums">{formatPrice(o.total, o.currency)}</span>
    ),
  },
  {
    key: 'paymentStatus',
    header: 'Statut',
    sortable: true,
    render: (o) => <StatusPill status={o.paymentStatus} />,
  },
  {
    key: 'downloads',
    header: 'DL',
    render: (o) => (
      <span className="text-xs text-ink-muted tabular-nums">
        {o.downloadCount}/{o.downloadMax}
      </span>
    ),
  },
];

export default async function AdminOrdersPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const rawStatus = searchParams['status'];
  const status = typeof rawStatus === 'string' ? rawStatus : undefined;

  const params = parseListParams(searchParams, {
    sortable: ['createdAt', 'total', 'paymentStatus'],
    defaultSort: 'createdAt',
    defaultDir: 'desc',
    pageSize: 25,
  });

  const where = {
    ...(params.q
      ? {
          OR: [
            { buyerEmail: { contains: params.q, mode: 'insensitive' as const } },
            { buyerName: { contains: params.q, mode: 'insensitive' as const } },
          ],
        }
      : {}),
    ...(status && PAYMENT_STATUSES.includes(status as typeof PAYMENT_STATUSES[number])
      ? { paymentStatus: status }
      : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { [params.sort]: params.dir },
      skip: params.skip,
      take: params.take,
      include: { photo: { select: { title: true, slug: true } } },
    }),
    prisma.order.count({ where }),
  ]);

  const exportHref = `/admin/orders/export${buildQuery({
    q: params.q || undefined,
    status,
  })}`;

  return (
    <Container size="wide">
      <PageHeader
        eyebrow="Orders"
        title="Commandes"
        subtitle={`${total} commande${total !== 1 ? 's' : ''}`}
        actions={
          <a
            href={exportHref}
            className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2 text-sm text-ink-muted hover:text-ink hover:bg-paper-cool transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </a>
        }
      />

      <Toolbar
        search={<SearchInput placeholder="Email, nom..." />}
        filters={
          <div className="flex items-center gap-2">
            {(['', ...PAYMENT_STATUSES] as const).map((s) => {
              const label = s === '' ? 'Tous' : s;
              const href = `/admin/orders${buildQuery({
                q: params.q || undefined,
                status: s || undefined,
              })}`;
              const active = (status ?? '') === s;
              return (
                <Link
                  key={s}
                  href={href}
                  className={`rounded-md px-3 py-1.5 text-sm border transition-colors ${
                    active
                      ? 'bg-ink text-white border-ink'
                      : 'border-line text-ink-muted hover:text-ink hover:bg-paper-cool'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        }
        count={total}
      />

      {orders.length === 0 ? (
        <EmptyState
          title="Aucune commande"
          description={params.q || status ? 'Aucun résultat pour ces filtres.' : 'Aucune commande pour le moment.'}
        />
      ) : (
        <DataTable<OrderRow>
          columns={COLUMNS}
          rows={orders}
          getRowId={(o) => o.id}
          rowHref={(o) => `/admin/orders/${o.id}`}
        />
      )}

      {total > params.pageSize && (
        <Pagination page={params.page} pageSize={params.pageSize} total={total} />
      )}
    </Container>
  );
}

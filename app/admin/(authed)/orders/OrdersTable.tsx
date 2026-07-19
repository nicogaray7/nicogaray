'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { DataTable, StatusPill } from '@/components/admin';
import type { Column } from '@/components/admin/DataTable';

export type OrderRow = {
  id: string;
  createdAt: string | Date;
  photo: { title: string; slug: string } | null;
  buyerName: string | null;
  buyerEmail: string | null;
  total: number;
  currency: string;
  paymentStatus: string;
  downloadCount: number;
  downloadMax: number;
  isTest: boolean;
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
      <span className="inline-flex items-center gap-2">
        <span className="text-ink">{o.photo?.title ?? '-'}</span>
        {o.isTest && (
          <span className="inline-flex items-center rounded border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-amber-700">
            Test
          </span>
        )}
      </span>
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

export function OrdersTable({
  rows,
  sort,
  dir,
}: {
  rows: OrderRow[];
  sort: string;
  dir: 'asc' | 'desc';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onSortChange(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    const nextDir = sort === key && dir === 'desc' ? 'asc' : 'desc';
    params.set('sort', key);
    params.set('dir', nextDir);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <DataTable<OrderRow>
      columns={COLUMNS}
      rows={rows}
      getRowId={(o) => o.id}
      rowHref={(o) => `/admin/orders/${o.id}`}
      sort={sort}
      dir={dir}
      onSortChange={onSortChange}
    />
  );
}

'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Star } from 'lucide-react';
import { DataTable, type Column, StatusPill, ConfirmDialog } from '@/components/admin';
import { r2PublicUrl } from '@/lib/r2-url';
import { formatPrice } from '@/lib/utils';
import {
  bulkSetPublished,
  bulkSetFeatured,
  bulkDelete,
} from './photos-actions';

type PhotoRow = {
  id: string;
  slug: string;
  title: string;
  country: string | null;
  countryCode: string | null;
  price: number;
  currency: string;
  published: boolean;
  featured: boolean;
  thumbKey: string;
  sortOrder: number;
  createdAt: Date;
};

function shortDate(d: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(d));
}

export function PhotosTable({
  photos,
  sort,
  dir,
}: {
  photos: PhotoRow[];
  sort: string;
  dir: 'asc' | 'desc';
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleSortChange(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort === key) {
      params.set('dir', dir === 'asc' ? 'desc' : 'asc');
    } else {
      params.set('sort', key);
      params.set('dir', 'asc');
    }
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  function runAction(fn: () => Promise<void>) {
    startTransition(async () => {
      await fn();
      clearSelection();
      router.refresh();
    });
  }

  const columns: Column<PhotoRow>[] = [
    {
      key: 'thumb',
      header: '',
      render: (p) => {
        const url = r2PublicUrl(p.thumbKey) ?? '';
        return url ? (
          <img src={url} alt="" className="h-10 w-14 object-cover" />
        ) : (
          <div className="h-10 w-14 bg-paper-cool" />
        );
      },
    },
    {
      key: 'title',
      header: 'Titre',
      sortable: true,
      render: (p) => (
        <div>
          <Link href={`/admin/photos/${p.id}`} className="text-ink hover:text-accent transition-colors">
            {p.title}
          </Link>
          <p className="caption text-ink-muted">{p.slug}</p>
        </div>
      ),
    },
    {
      key: 'country',
      header: 'Pays',
      render: (p) => <span className="text-ink-muted">{p.country ?? '-'}</span>,
    },
    {
      key: 'price',
      header: 'Prix',
      sortable: true,
      align: 'right',
      render: (p) => (
        <span className="tabular-nums">{formatPrice(p.price, p.currency)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Statut',
      render: (p) => (
        <div className="flex items-center gap-2">
          <StatusPill status={p.published ? 'published' : 'draft'} />
          {p.featured && <Star className="w-3.5 h-3.5 fill-accent text-accent" />}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (p) => (
        <span className="caption text-ink-muted">{shortDate(p.createdAt)}</span>
      ),
    },
  ];

  return (
    <div className="space-y-3">
      {selectedIds.length > 0 && (
        <div className="sticky top-16 z-10 bg-paper border border-line px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm text-ink-muted">
            {selectedIds.length} selection{selectedIds.length > 1 ? 's' : ''}
          </span>

          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(() => bulkSetPublished(selectedIds, true))}
            className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-line text-ink-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-40"
          >
            Publier
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(() => bulkSetPublished(selectedIds, false))}
            className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-line text-ink-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-40"
          >
            Dépublier
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(() => bulkSetFeatured(selectedIds, true))}
            className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-line text-ink-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-40"
          >
            Featured
          </button>

          <button
            type="button"
            disabled={isPending}
            onClick={() => runAction(() => bulkSetFeatured(selectedIds, false))}
            className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-line text-ink-muted hover:text-ink hover:border-ink transition-colors disabled:opacity-40"
          >
            Retirer featured
          </button>

          <ConfirmDialog
            trigger={
              <button
                type="button"
                disabled={isPending}
                className="text-[10px] tracking-widest uppercase px-3 py-1.5 border border-red-300 text-red-700 hover:bg-red-700 hover:text-white transition-colors disabled:opacity-40"
              >
                Supprimer
              </button>
            }
            title="Supprimer les photos"
            description={`Supprimer ${selectedIds.length} photo${selectedIds.length > 1 ? 's' : ''} ? Cette action est irreversible.`}
            confirmLabel="Supprimer"
            destructive
            onConfirm={() =>
              new Promise<void>((resolve, reject) => {
                startTransition(async () => {
                  try {
                    await bulkDelete(selectedIds);
                    clearSelection();
                    router.refresh();
                    resolve();
                  } catch (e) {
                    reject(e);
                  }
                });
              })
            }
          />
        </div>
      )}

      <DataTable
        columns={columns}
        rows={photos}
        getRowId={(p) => p.id}
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        sort={sort}
        dir={dir}
        onSortChange={handleSortChange}
        emptyState={
          <div className="border border-dashed border-line py-24 text-center">
            <p className="caption text-ink-muted">Aucune photo ne correspond aux filtres.</p>
          </div>
        }
      />
    </div>
  );
}

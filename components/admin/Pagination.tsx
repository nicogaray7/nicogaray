'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(total / pageSize);
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function navigate(nextPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(nextPage));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center justify-between py-4 border-t border-line mt-2">
      <button
        type="button"
        onClick={() => navigate(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Page precedente"
      >
        <ChevronLeft className="w-4 h-4" />
        Précédent
      </button>

      <span className="caption text-ink-muted">
        {from}-{to} sur {total}
      </span>

      <button
        type="button"
        onClick={() => navigate(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-1 text-sm text-ink-muted hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
        aria-label="Page suivante"
      >
        Suivant
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

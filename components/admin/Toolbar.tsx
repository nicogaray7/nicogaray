import React from 'react';

export function Toolbar({
  search,
  filters,
  bulk,
  count,
}: {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  bulk?: React.ReactNode;
  count?: number;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-3 mb-4">
      <div className="flex items-center gap-3 flex-wrap min-w-0">
        {search}
        {filters}
        {bulk && <div className="flex items-center gap-2 flex-wrap">{bulk}</div>}
      </div>
      {count !== undefined && (
        <span className="text-sm text-ink-muted sm:shrink-0">
          {count} {count === 1 ? 'element' : 'elements'}
        </span>
      )}
    </div>
  );
}

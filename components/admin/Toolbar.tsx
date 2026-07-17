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
    <div className="flex items-center justify-between gap-4 py-3 border-b border-line mb-4">
      <div className="flex items-center gap-3 flex-wrap">
        {search}
        {filters}
        {bulk && <div className="flex items-center gap-2">{bulk}</div>}
      </div>
      {count !== undefined && (
        <span className="caption text-ink-muted shrink-0">
          {count} {count === 1 ? 'element' : 'elements'}
        </span>
      )}
    </div>
  );
}

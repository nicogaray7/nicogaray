'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronUp, ChevronDown } from 'lucide-react';

export type Column<T> = {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'right';
  className?: string;
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  rowHref?: (row: T) => string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  sort?: string;
  dir?: 'asc' | 'desc';
  onSortChange?: (key: string) => void;
  emptyState?: React.ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  rowHref,
  selectable,
  selectedIds = [],
  onSelectionChange,
  sort,
  dir,
  onSortChange,
  emptyState,
}: DataTableProps<T>) {
  const allIds = rows.map(getRowId);
  const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.includes(id));
  const someSelected = allIds.some((id) => selectedIds.includes(id));

  function toggleAll() {
    if (!onSelectionChange) return;
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allIds);
    }
  }

  function toggleRow(id: string) {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((s) => s !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  }

  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-ink border-collapse">
        <thead className="bg-paper-cool">
          <tr>
            {selectable && (
              <th className="w-10 px-4 py-3 border-b border-line">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={toggleAll}
                  className="accent-ink cursor-pointer"
                  aria-label="Select all"
                />
              </th>
            )}
            {columns.map((col) => {
              const isActive = sort === col.key;
              return (
                <th
                  key={col.key}
                  className={`px-4 py-3 border-b border-line text-[10px] tracking-widest uppercase text-ink-muted font-sans font-normal ${
                    col.align === 'right' ? 'text-right' : 'text-left'
                  } ${col.className ?? ''}`}
                >
                  {col.sortable && onSortChange ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(col.key)}
                      className="inline-flex items-center gap-1 hover:text-ink transition-colors"
                    >
                      {col.header}
                      {isActive ? (
                        dir === 'desc' ? (
                          <ChevronDown className="w-3 h-3" />
                        ) : (
                          <ChevronUp className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronUp className="w-3 h-3 opacity-30" />
                      )}
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const id = getRowId(row);
            const href = rowHref?.(row);
            const isSelected = selectedIds.includes(id);

            return (
              <tr
                key={id}
                className={`border-b border-line transition-colors hover:bg-paper-cool ${
                  isSelected ? 'bg-accent/5' : ''
                }`}
              >
                {selectable && (
                  <td
                    className="w-10 px-4 py-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleRow(id)}
                      className="accent-ink cursor-pointer"
                      aria-label={`Select row ${id}`}
                    />
                  </td>
                )}
                {columns.map((col) => {
                  const cellContent = col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key] ?? '');

                  return (
                    <td
                      key={col.key}
                      className={`px-4 py-3 ${
                        col.align === 'right' ? 'text-right' : 'text-left'
                      } ${col.className ?? ''}`}
                    >
                      {href && !selectable ? (
                        <Link href={href} className="block w-full h-full">
                          {cellContent}
                        </Link>
                      ) : href ? (
                        <Link href={href} className="block w-full h-full" tabIndex={-1}>
                          {cellContent}
                        </Link>
                      ) : (
                        cellContent
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

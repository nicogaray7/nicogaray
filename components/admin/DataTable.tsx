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
  const sortableCols = columns.filter((c) => c.sortable);

  function toggleAll() {
    if (!onSelectionChange) return;
    onSelectionChange(allSelected ? [] : allIds);
  }

  function toggleRow(id: string) {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((s) => s !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  }

  function renderCell(col: Column<T>, row: T): React.ReactNode {
    return col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '');
  }

  if (rows.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <>
      {/* Mobile : cartes empilees (mobile-first) */}
      <div className="md:hidden space-y-3">
        {(selectable || (sortableCols.length > 0 && onSortChange)) && (
          <div className="flex items-center justify-between gap-3">
            {selectable ? (
              <label className="flex items-center gap-2 text-sm text-ink-muted">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded accent-ink"
                  aria-label="Tout sélectionner"
                />
                Tout sélectionner
              </label>
            ) : (
              <span />
            )}
            {sortableCols.length > 0 && onSortChange && (
              <select
                value={sort ?? ''}
                onChange={(e) => onSortChange(e.target.value)}
                className="rounded-md border border-line bg-white px-2 py-1.5 text-sm text-ink"
                aria-label="Trier"
              >
                {sortableCols.map((c) => (
                  <option key={c.key} value={c.key}>
                    Trier : {c.header}
                    {sort === c.key ? (dir === 'desc' ? ' (desc)' : ' (asc)') : ''}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {rows.map((row) => {
          const id = getRowId(row);
          const href = rowHref?.(row);
          const isSelected = selectedIds.includes(id);
          const [first, ...rest] = columns;

          const card = (
            <div
              className={`bg-white rounded-xl border p-4 transition-colors ${
                isSelected ? 'border-accent ring-1 ring-accent/30' : 'border-line'
              } ${href ? 'active:bg-paper-cool/60' : ''}`}
            >
              {first && (
                <div className="text-sm font-medium text-ink mb-2 pr-8">{renderCell(first, row)}</div>
              )}
              <div className="space-y-1">
                {rest.map((col) => (
                  <div key={col.key} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-ink-muted shrink-0">{col.header}</span>
                    <span className="text-sm text-ink text-right min-w-0 truncate">
                      {renderCell(col, row)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );

          return (
            <div key={id} className="relative">
              {selectable && (
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleRow(id)}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-4 top-4 z-10 h-4 w-4 rounded accent-ink"
                  aria-label={`Sélectionner ${id}`}
                />
              )}
              {href ? (
                <Link href={href} className="block">
                  {card}
                </Link>
              ) : (
                card
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop : tableau */}
      <div className="hidden md:block bg-white rounded-xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
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
                      className="h-4 w-4 rounded accent-ink cursor-pointer"
                      aria-label="Tout sélectionner"
                    />
                  </th>
                )}
                {columns.map((col) => {
                  const isActive = sort === col.key;
                  return (
                    <th
                      key={col.key}
                      className={`px-4 py-3 border-b border-line text-[11px] font-medium text-ink-muted ${
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
            <tbody className="divide-y divide-line">
              {rows.map((row) => {
                const id = getRowId(row);
                const href = rowHref?.(row);
                const isSelected = selectedIds.includes(id);

                return (
                  <tr
                    key={id}
                    className={`transition-colors hover:bg-paper-cool/60 ${
                      href ? 'cursor-pointer' : ''
                    } ${isSelected ? 'bg-accent/5' : ''}`}
                  >
                    {selectable && (
                      <td className="w-10 px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(id)}
                          className="h-4 w-4 rounded accent-ink cursor-pointer"
                          aria-label={`Sélectionner ${id}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const cellContent = renderCell(col, row);
                      return (
                        <td
                          key={col.key}
                          className={`px-4 py-3.5 text-sm text-ink ${
                            col.align === 'right' ? 'text-right' : 'text-left'
                          } ${col.className ?? ''}`}
                        >
                          {href ? (
                            <Link href={href} className="block w-full h-full">
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
      </div>
    </>
  );
}

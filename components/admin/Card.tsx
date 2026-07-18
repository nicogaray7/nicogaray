import React from 'react';

export function Card({
  title,
  actions,
  children,
  className,
}: {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-white rounded-xl border border-line shadow-sm p-5 ${className ?? ''}`}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <span className="text-sm font-semibold text-ink">{title}</span>}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  hint,
  delta,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  delta?: { value: string; positive?: boolean };
}) {
  return (
    <div className="bg-white rounded-xl border border-line shadow-sm p-5">
      <p className="text-xs text-ink-muted mb-2">{label}</p>
      <p className="text-3xl font-semibold text-ink tabular-nums leading-none mb-1">
        {value}
      </p>
      <div className="flex items-center gap-3 mt-1">
        {hint && <span className="text-xs text-ink-muted">{hint}</span>}
        {delta && (
          <span
            className={`text-xs font-medium ${
              delta.positive ? 'text-emerald-700' : 'text-red-700'
            }`}
          >
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}

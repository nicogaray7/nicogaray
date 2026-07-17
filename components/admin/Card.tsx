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
      className={`bg-paper border border-line p-6 ${className ?? ''}`}
    >
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          {title && <span className="eyebrow text-accent">{title}</span>}
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
    <div className="bg-paper border border-line p-6">
      <p className="eyebrow text-ink-muted mb-2">{label}</p>
      <p className="font-display text-display-lg text-ink leading-none mb-1">
        {value}
      </p>
      <div className="flex items-center gap-3 mt-1">
        {hint && <span className="caption text-ink-muted">{hint}</span>}
        {delta && (
          <span
            className={`caption font-sans text-[10px] tracking-widest ${
              delta.positive ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {delta.value}
          </span>
        )}
      </div>
    </div>
  );
}

import React from 'react';

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div className="flex flex-col gap-1">
        {eyebrow && <span className="text-xs font-medium text-accent uppercase tracking-wide">{eyebrow}</span>}
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

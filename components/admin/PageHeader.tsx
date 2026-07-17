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
        {eyebrow && <span className="eyebrow text-accent">{eyebrow}</span>}
        <h1 className="font-display text-display-lg text-ink">{title}</h1>
        {subtitle && <p className="caption text-ink-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

import React from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-line py-24 text-center bg-white">
      {icon && (
        <div className="flex justify-center mb-4 text-ink-muted">{icon}</div>
      )}
      <p className="text-base font-semibold text-ink mb-1">{title}</p>
      {description && (
        <p className="text-sm text-ink-muted mb-4">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

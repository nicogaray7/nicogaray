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
    <div className="border border-dashed border-line py-24 text-center">
      {icon && (
        <div className="flex justify-center mb-4 text-ink-muted">{icon}</div>
      )}
      <p className="font-display text-ink text-lg mb-1">{title}</p>
      {description && (
        <p className="caption text-ink-muted mb-4">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

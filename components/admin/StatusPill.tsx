const DEFAULT_TONE_MAP: Record<string, 'green' | 'amber' | 'red' | 'neutral'> = {
  paid: 'green',
  published: 'green',
  active: 'green',
  enabled: 'green',
  pending: 'amber',
  failed: 'red',
  refunded: 'red',
  disabled: 'neutral',
};

const TONE_CLASSES: Record<string, string> = {
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  neutral: 'bg-zinc-100 text-zinc-600',
};

export function StatusPill({
  status,
  tone,
}: {
  status: string;
  tone?: 'green' | 'amber' | 'red' | 'neutral';
}) {
  const resolved = tone ?? DEFAULT_TONE_MAP[status.toLowerCase()] ?? 'neutral';
  const classes = TONE_CLASSES[resolved];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  );
}

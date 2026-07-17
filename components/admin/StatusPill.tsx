const DEFAULT_TONE_MAP: Record<string, 'green' | 'amber' | 'red' | 'neutral'> = {
  paid: 'green',
  published: 'green',
  active: 'green',
  pending: 'amber',
  failed: 'red',
  refunded: 'red',
};

const TONE_CLASSES: Record<string, string> = {
  green: 'text-green-700 bg-green-50 border-green-200',
  amber: 'text-amber-600 bg-amber-50 border-amber-200',
  red: 'text-red-700 bg-red-50 border-red-200',
  neutral: 'text-ink-muted bg-paper-cool border-line',
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
      className={`inline-flex items-center border px-2 py-0.5 text-[10px] tracking-widest uppercase font-sans ${classes}`}
    >
      {status}
    </span>
  );
}

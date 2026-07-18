'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { formatPrice } from '@/lib/utils';

type DataPoint = {
  label: string;
  revenue: number;
  orders: number;
};

type TooltipEntry = { value?: number | string };

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const revenue = Number(payload[0]?.value ?? 0);
  const orders = Number(payload[1]?.value ?? 0);
  return (
    <div className="bg-paper border border-line px-3 py-2 text-xs shadow-sm">
      <p className="eyebrow text-ink-muted mb-1">{label}</p>
      <p className="font-display text-ink">{formatPrice(revenue)}</p>
      <p className="caption text-ink-muted">{orders} vente{Number(orders) !== 1 ? 's' : ''}</p>
    </div>
  );
}

export function RevenueChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent, #0F172A)" stopOpacity={0.18} />
            <stop offset="100%" stopColor="var(--color-accent, #0F172A)" stopOpacity={0.01} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="var(--color-line, #E5E7EB)" strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: 'var(--color-ink-muted, #6B7280)', fontFamily: 'inherit' }}
          axisLine={false}
          tickLine={false}
          dy={6}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-line, #E5E7EB)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="var(--color-accent, #0F172A)"
          strokeWidth={1.5}
          fill="url(#revenueGradient)"
          dot={false}
          activeDot={{ r: 3, fill: 'var(--color-accent, #0F172A)', strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="orders"
          stroke="transparent"
          fill="transparent"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

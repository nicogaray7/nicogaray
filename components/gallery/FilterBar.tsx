'use client';
import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountryOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  countries: CountryOption[];
  total: number;
}

export function FilterBar({ countries, total }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations('gallery.filters');
  const tResults = useTranslations('gallery');

  const country = params.get('country') ?? '';
  const orientation = params.get('orientation') ?? '';

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const reset = () => router.replace(pathname, { scroll: false });
  const hasFilters = Boolean(country || orientation);

  return (
    <div className="border-y border-line py-5 mb-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={country} onChange={(v) => update('country', v)} label={t('country')}>
          <option value="">{t('all')}</option>
          {countries.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
        <Select value={orientation} onChange={(v) => update('orientation', v)} label={t('orientation')}>
          <option value="">{t('all')}</option>
          <option value="landscape">{t('landscape')}</option>
          <option value="portrait">{t('portrait')}</option>
        </Select>
        {hasFilters && (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors ml-2"
          >
            <X className="w-3 h-3" />
            {t('reset')}
          </button>
        )}
      </div>
      <p className="caption">{tResults('results', { count: total })}</p>
    </div>
  );
}

function Select({
  value,
  onChange,
  label,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className={cn(
          'appearance-none pl-3 pr-8 py-1.5 bg-paper border border-line text-[11px] tracking-widest uppercase text-ink hover:border-ink/40 focus:border-ink focus:outline-none transition-colors cursor-pointer',
          value && 'border-accent text-accent',
        )}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-muted text-[8px]">▼</span>
    </div>
  );
}

'use client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { locales } from '@/i18n/config';

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  const other = locales.find((l) => l !== locale) ?? 'en';
  const target = pathname.replace(new RegExp(`^/${locale}`), `/${other}`);

  return (
    <Link
      href={target || `/${other}`}
      className={cn(
        'text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors duration-200 border border-ink/15 hover:border-accent/40 px-3 py-1.5',
        className,
      )}
      aria-label={`Switch to ${other.toUpperCase()}`}
    >
      {other.toUpperCase()}
    </Link>
  );
}

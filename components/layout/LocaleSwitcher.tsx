'use client';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { locales } from '@/i18n/config';
import { track } from '@/lib/analytics';

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  const other = locales.find((l) => l !== locale) ?? 'en';
  const target = pathname.replace(new RegExp(`^/${locale}`), `/${other}`);

  return (
    <Link
      href={target || `/${other}`}
      onClick={() => track.languageSwitch(locale, other)}
      className={cn(
        'text-xs text-ink-muted hover:text-accent transition-colors',
        className,
      )}
      aria-label={`Switch to ${other.toUpperCase()}`}
    >
      {other.toUpperCase()}
    </Link>
  );
}

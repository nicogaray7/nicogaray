'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from './Container';
import { LocaleSwitcher } from './LocaleSwitcher';

export function Nav() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/gallery`, label: t('gallery') },
    { href: `/${locale}/about`, label: t('about') },
  ];

  const isActive = (href: string) =>
    href === `/${locale}` ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-40 transition-all duration-500',
        scrolled ? 'bg-paper/95 backdrop-blur border-b border-line' : 'bg-transparent border-b border-transparent',
      )}
    >
      <Container>
        <div className="h-16 sm:h-20 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="font-display text-xl sm:text-2xl text-ink tracking-wide leading-none hover:text-accent transition-colors"
          >
            Nico Garay
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'text-[11px] tracking-widest uppercase transition-colors duration-200',
                  isActive(l.href) ? 'text-accent' : 'text-ink-muted hover:text-ink',
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LocaleSwitcher />
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center text-ink-muted hover:text-ink transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-50 bg-paper transition-all duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <div className="absolute top-0 right-0 p-5">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-ink-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center min-h-screen gap-8 px-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'font-display text-3xl transition-colors',
                isActive(l.href) ? 'text-accent' : 'text-ink-muted hover:text-ink',
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

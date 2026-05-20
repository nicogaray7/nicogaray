'use client';
import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Container } from './Container';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from './Logo';

export function Nav() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('common');
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  // Pages with a dark/photo hero behind the nav at the top of the page.
  const isHome = pathname === `/${locale}`;
  const overDark = isHome && !scrolled;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => setOpen(false), [pathname]);

  const links = [
    { href: `/${locale}/gallery`, label: t('gallery') },
    { href: `/${locale}/map`, label: locale === 'en' ? 'Map' : 'Carte' },
    { href: `/${locale}/about`, label: t('about') },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-40 transition-all duration-300',
        scrolled ? 'bg-paper/90 backdrop-blur-md border-b border-line' : 'bg-transparent',
      )}
    >
      <Container>
        <div className="h-16 sm:h-20 flex items-center justify-between">
          <Logo href={`/${locale}`} size="md" variant={overDark ? 'light' : 'dark'} />

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  'text-xs tracking-[0.18em] uppercase transition-colors',
                  isActive(l.href)
                    ? overDark ? 'text-paper' : 'text-accent'
                    : overDark ? 'text-paper/70 hover:text-paper' : 'text-ink-muted hover:text-ink',
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LocaleSwitcher
              className={overDark ? 'text-paper/70 hover:text-paper' : undefined}
            />
            <button
              type="button"
              aria-label="Menu"
              onClick={() => setOpen((v) => !v)}
              className={cn(
                'md:hidden w-9 h-9 -mr-2 flex items-center justify-center transition-colors',
                overDark ? 'text-paper/80 hover:text-paper' : 'text-ink-muted hover:text-ink',
              )}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          'md:hidden fixed inset-0 z-50 bg-paper transition-all duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
      >
        <div className="absolute top-0 right-0 p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="w-9 h-9 flex items-center justify-center text-ink-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center min-h-screen gap-6 px-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                'font-display text-3xl tracking-[0.18em] uppercase transition-colors',
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

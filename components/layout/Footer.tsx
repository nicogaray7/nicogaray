import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Container } from './Container';

export function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line mt-20">
      <Container>
        <div className="py-10 sm:py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <Link href={`/${locale}`} className="text-base font-medium text-ink hover:text-accent transition-colors">
              Nico Garay
            </Link>
            <p className="text-sm text-ink-muted mt-1">© {year} · Tous droits réservés</p>
          </div>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            <Link href={`/${locale}/gallery`} className="hover:text-accent transition-colors">Galerie</Link>
            <Link href={`/${locale}/map`} className="hover:text-accent transition-colors">Carte</Link>
            <Link href={`/${locale}/about`} className="hover:text-accent transition-colors">À propos</Link>
            <Link href={`/${locale}/legal/cgv`} className="hover:text-accent transition-colors">CGV</Link>
            <Link href={`/${locale}/legal/license`} className="hover:text-accent transition-colors">Licence</Link>
            <Link href={`/${locale}/legal/mentions`} className="hover:text-accent transition-colors">Mentions</Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}

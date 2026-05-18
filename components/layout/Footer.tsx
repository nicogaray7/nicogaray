import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { Container } from './Container';

export function Footer() {
  const locale = useLocale();
  const t = useTranslations('footer');
  const tNav = useTranslations('common');
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line mt-32">
      <Container>
        <div className="py-16 sm:py-20 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12 md:mb-14">
          <div className="space-y-4 md:col-span-6">
            <Link href={`/${locale}`} className="inline-block">
              <span className="font-display text-2xl sm:text-3xl text-ink tracking-wide">Nico Garay</span>
            </Link>
            <p className="text-ink-muted text-sm leading-relaxed max-w-sm">
              Photographies de voyage. Éditions numériques en haute résolution.
            </p>
          </div>

          <div className="space-y-4 md:col-span-3">
            <p className="eyebrow">Navigation</p>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}`} className="text-ink-soft hover:text-accent text-sm transition-colors">
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/gallery`} className="text-ink-soft hover:text-accent text-sm transition-colors">
                  {tNav('gallery')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-ink-soft hover:text-accent text-sm transition-colors">
                  {tNav('about')}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:col-span-3">
            <p className="eyebrow">Information</p>
            <ul className="space-y-3">
              <li>
                <Link href={`/${locale}/legal/cgv`} className="text-ink-soft hover:text-accent text-sm transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/license`} className="text-ink-soft hover:text-accent text-sm transition-colors">
                  Licence
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/legal/mentions`} className="text-ink-soft hover:text-accent text-sm transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-line py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-ink-muted">{t('rights', { year })}</p>
          <p className="eyebrow">{t('edition')}</p>
        </div>
      </Container>
    </footer>
  );
}

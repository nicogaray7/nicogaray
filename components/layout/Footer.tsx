import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const year = new Date().getFullYear()

  const legal = [
    { href: `/${locale}/legal/cgv`,      label: t('cgv') },
    { href: `/${locale}/legal/license`,  label: t('license') },
    { href: `/${locale}/legal/mentions`, label: t('legal') },
  ]

  return (
    <footer className="bg-ink-900 text-ink-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24">

        {/* Bloc principal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 mb-12 md:mb-16">

          {/* Marque */}
          <div className="space-y-4 md:col-span-1">
            <Link href={`/${locale}`} className="inline-block">
              <span className="font-display text-2xl sm:text-3xl">
                <span className="font-medium text-white">Nico</span>
                <span className="font-light italic text-white/80 ml-1.5">Garay</span>
              </span>
            </Link>
            <p className="text-ink-400 text-sm leading-relaxed max-w-xs">
              {locale === 'fr'
                ? 'Photographies de voyage en haute résolution. Tirages numériques sous licence personnelle.'
                : 'Travel photography in high resolution. Digital prints under personal license.'}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.25em] uppercase text-ink-500 font-medium">
              {locale === 'fr' ? 'Navigation' : 'Navigation'}
            </p>
            <ul className="space-y-3">
              {[
                { href: `/${locale}`,       label: locale === 'fr' ? 'Accueil'  : 'Home'  },
                { href: `/${locale}/shop`,  label: locale === 'fr' ? 'Boutique' : 'Shop'  },
                { href: `/${locale}/about`, label: locale === 'fr' ? 'À propos': 'About' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-200 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div className="space-y-4">
            <p className="text-[10px] tracking-[0.25em] uppercase text-ink-500 font-medium">
              {locale === 'fr' ? 'Informations' : 'Information'}
            </p>
            <ul className="space-y-3">
              {legal.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-200 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-ink-700 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-ink-500">
            {t('rights', { year })}
          </p>
          <p className="text-[10px] tracking-[0.25em] uppercase text-ink-600">
            {locale === 'fr' ? 'Made with care' : 'Made with care'}
          </p>
        </div>
      </div>
    </footer>
  )
}

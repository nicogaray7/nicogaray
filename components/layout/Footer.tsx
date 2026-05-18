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
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12 md:mb-14">

          {/* Brand */}
          <div className="space-y-4 md:col-span-6">
            <Link href={`/${locale}`} className="inline-block">
              <span className="font-display text-[32px] sm:text-[40px] text-white tracking-[0.04em]">
                Nico Garay
              </span>
            </Link>
            <p className="text-ink-300 text-sm leading-relaxed max-w-sm">
              {locale === 'fr'
                ? 'Photographies de mes voyages. Editions numeriques sous licence personnelle.'
                : 'Photography from my travels. Digital editions under personal license.'}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-3 md:col-span-3">
            <p className="text-[10px] tracking-[0.25em] uppercase text-ink-400">
              {locale === 'fr' ? 'Navigation' : 'Navigation'}
            </p>
            <ul className="space-y-3">
              {[
                { href: `/${locale}`,       label: locale === 'fr' ? 'Accueil'  : 'Home'  },
                { href: `/${locale}/shop`,  label: locale === 'fr' ? 'Boutique' : 'Shop'  },
                { href: `/${locale}/about`, label: locale === 'fr' ? 'A propos' : 'About' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-200 hover:text-accent-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3 md:col-span-3">
            <p className="text-[10px] tracking-[0.25em] uppercase text-ink-400">
              {locale === 'fr' ? 'Informations' : 'Information'}
            </p>
            <ul className="space-y-3">
              {legal.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-ink-200 hover:text-accent-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-ink-700 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-ink-300">
            {t('rights', { year })}
          </p>
          <p className="text-[10px] tracking-[0.23em] uppercase text-ink-400">
            {locale === 'fr' ? 'Edition numerique' : 'Digital edition'}
          </p>
        </div>
      </div>
    </footer>
  )
}

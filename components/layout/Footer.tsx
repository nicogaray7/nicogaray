'use client'

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
    <footer className="border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 mb-12 md:mb-14">

          {/* Brand */}
          <div className="space-y-4 md:col-span-6">
            <Link href={`/${locale}`} className="inline-block">
              <span className="font-display text-2xl sm:text-3xl text-foreground tracking-wide">
                Nico Garay
              </span>
            </Link>
            <p className="text-foreground-muted text-sm leading-relaxed max-w-sm">
              {locale === 'fr'
                ? 'Photographies de voyage. Editions numeriques haute resolution.'
                : 'Travel photography. High-resolution digital editions.'}
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4 md:col-span-3">
            <p className="text-[10px] tracking-[0.25em] uppercase text-foreground-muted">
              Navigation
            </p>
            <ul className="space-y-3">
              {[
                { href: `/${locale}`,       label: locale === 'fr' ? 'Accueil'  : 'Home'  },
                { href: `/${locale}/shop`,  label: locale === 'fr' ? 'Galerie' : 'Gallery'  },
                { href: `/${locale}/about`, label: locale === 'fr' ? 'A propos' : 'About' },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-foreground-dim hover:text-accent text-sm transition-colors duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4 md:col-span-3">
            <p className="text-[10px] tracking-[0.25em] uppercase text-foreground-muted">
              {locale === 'fr' ? 'Informations' : 'Information'}
            </p>
            <ul className="space-y-3">
              {legal.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-foreground-dim hover:text-accent text-sm transition-colors duration-300">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-line pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-foreground-muted">
            {t('rights', { year })}
          </p>
          <p className="text-[10px] tracking-[0.2em] uppercase text-foreground-muted">
            {locale === 'fr' ? 'Edition numerique' : 'Digital edition'}
          </p>
        </div>
      </div>
    </footer>
  )
}

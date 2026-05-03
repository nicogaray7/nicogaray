'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/shop`, label: t('shop') },
    { href: `/${locale}/about`, label: t('about') },
  ]

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-sm border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={`/${locale}`} className="font-serif text-xl tracking-widest text-stone-800 hover:text-stone-600 transition-colors">
          Nico Garay
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm tracking-wide transition-colors',
                pathname === link.href
                  ? 'text-stone-900 border-b border-stone-800 pb-0.5'
                  : 'text-stone-500 hover:text-stone-800',
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  )
}

function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  return (
    <Link
      href={newPath}
      className="text-xs tracking-widest text-stone-400 hover:text-stone-800 transition-colors uppercase border border-stone-200 px-2 py-1 rounded"
    >
      {otherLocale}
    </Link>
  )
}

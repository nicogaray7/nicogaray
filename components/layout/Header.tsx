'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Header() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Bloquer le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Fermer le menu au changement de route
  useEffect(() => { setOpen(false) }, [pathname])

  const navLinks = [
    { href: `/${locale}`,        label: t('home') },
    { href: `/${locale}/shop`,   label: t('shop') },
    { href: `/${locale}/about`,  label: t('about') },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-500',
          scrolled || open
            ? 'bg-white/95 backdrop-blur-lg border-b border-ink-100'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className={cn(
              'font-display text-lg sm:text-xl tracking-tight transition-colors',
              scrolled || open ? 'text-ink-900' : 'text-ink-900'
            )}
          >
            <span className="font-medium">Nico</span>
            <span className="font-light italic ml-1.5">Garay</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-[13px] tracking-wider uppercase transition-colors link-underline',
                  pathname === link.href
                    ? 'text-ink-900'
                    : 'text-ink-500 hover:text-ink-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {/* Bouton menu mobile */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center text-ink-900"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu mobile fullscreen */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-30 bg-white transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col items-center justify-center min-h-screen gap-2 px-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-display text-4xl py-3 transition-colors',
                pathname === link.href
                  ? 'text-ink-900 italic'
                  : 'text-ink-400 hover:text-ink-900',
                open && 'animate-fade-up'
              )}
              style={{ animationDelay: `${100 + i * 80}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const newPath = pathname.replace(`/${locale}`, `/${otherLocale}`) || `/${otherLocale}`

  return (
    <Link
      href={newPath}
      className="text-[10px] tracking-[0.2em] text-ink-400 hover:text-ink-900 transition-colors uppercase"
    >
      {locale.toUpperCase()} <span className="text-ink-200 mx-0.5">/</span> <span>{otherLocale.toUpperCase()}</span>
    </Link>
  )
}

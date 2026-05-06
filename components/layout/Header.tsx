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

  const navLinks = [
    { href: `/${locale}`,        label: t('home') },
    { href: `/${locale}/shop`,   label: t('shop') },
    { href: `/${locale}/about`,  label: t('about') },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-300',
          scrolled || open
            ? 'bg-ink-50/95 backdrop-blur-sm border-b border-accent-500/30'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="font-display text-xl sm:text-2xl text-accent-500"
          >
            <span className="font-light">Nico</span>
            <span className="italic ml-1">Garay</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-xs tracking-[0.15em] uppercase transition-colors',
                  pathname === link.href
                    ? 'text-accent-500 font-medium'
                    : 'text-ink-600 hover:text-ink-900'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {/* Menu toggle mobile */}
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

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-50 bg-ink-50 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col items-center justify-center min-h-screen gap-3 px-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-display text-3xl sm:text-4xl transition-colors',
                pathname === link.href ? 'text-accent-500 italic' : 'text-ink-600 hover:text-ink-900',
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
      className="text-[10px] tracking-[0.2em] text-ink-600 hover:text-accent-500 transition-colors uppercase"
    >
      {locale.toUpperCase()} <span className="text-ink-400 mx-0.5">/</span> <span>{otherLocale.toUpperCase()}</span>
    </Link>
  )
}

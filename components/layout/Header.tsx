'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

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

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const navLinks = [
    { href: `/${locale}`,        label: t('home') },
    { href: `/${locale}/shop`,   label: t('shop') },
    { href: `/${locale}/about`,  label: t('about') },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header
        className={[
          'fixed top-0 inset-x-0 z-40 transition-all duration-500',
          scrolled || open
            ? 'bg-surface/90 backdrop-blur-xl border-b border-line'
            : 'bg-transparent border-b border-transparent',
        ].join(' ')}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="font-display text-xl sm:text-2xl text-foreground tracking-wide leading-none"
          >
            Nico Garay
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  'text-[11px] tracking-[0.18em] uppercase transition-colors duration-300',
                  isActive(link.href)
                    ? 'text-accent'
                    : 'text-foreground-dim hover:text-foreground',
                ].join(' ')}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />

            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center text-foreground-dim hover:text-foreground transition-colors"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={[
          'md:hidden fixed inset-0 z-50 bg-surface transition-all duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className="absolute top-0 right-0 p-5">
          <button
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="w-10 h-10 flex items-center justify-center text-foreground-dim"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center min-h-screen gap-6 px-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'font-display text-3xl transition-colors duration-300',
                isActive(link.href) ? 'text-accent' : 'text-foreground-dim hover:text-foreground',
                open ? 'animate-fade-up' : '',
              ].join(' ')}
              style={{ animationDelay: `${100 + i * 80}ms` }}
              onClick={() => setOpen(false)}
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
      className="text-[10px] tracking-[0.2em] text-foreground-muted hover:text-accent transition-colors duration-300 uppercase border border-foreground-muted/20 hover:border-accent/40 rounded-full px-3 py-1.5"
    >
      {otherLocale.toUpperCase()}
    </Link>
  )
}

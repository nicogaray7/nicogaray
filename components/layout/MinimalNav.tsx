'use client'

import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MinimalNav() {
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
    { href: `/${locale}`, label: 'Home' },
    { href: `/${locale}/shop`, label: 'Gallery' },
  ]

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 transition-all duration-300',
          scrolled || open
            ? 'bg-white/95 backdrop-blur-md border-b border-ink-200'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between">
          <Link
            href={`/${locale}`}
            className="font-display text-2xl sm:text-3xl text-ink-900 tracking-tight leading-none"
          >
            NICO GARAY
          </Link>

          <nav className="hidden md:flex items-center gap-12">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-semibold tracking-wide uppercase transition-colors',
                  pathname === link.href
                    ? 'text-accent-500'
                    : 'text-ink-800 hover:text-accent-500'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <button
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              className="md:hidden w-10 h-10 flex items-center justify-center text-ink-900 hover:text-accent-500 transition-colors"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 z-50 bg-white transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <nav className="flex flex-col items-center justify-center min-h-screen gap-8 px-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-display text-4xl transition-colors',
                pathname === link.href ? 'text-accent-500' : 'text-ink-900 hover:text-accent-500',
                open && 'animate-fade-up'
              )}
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
      className="text-xs font-bold tracking-widest uppercase text-ink-900 hover:text-accent-500 transition-colors border border-ink-800 rounded-full px-3 py-2"
    >
      {locale.toUpperCase()}
    </Link>
  )
}

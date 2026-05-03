import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-stone-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-stone-400 tracking-wide">
          {t('rights', { year })}
        </p>
        <nav className="flex items-center gap-6">
          {[
            { href: `/${locale}/legal/cgv`, label: t('cgv') },
            { href: `/${locale}/legal/license`, label: t('license') },
            { href: `/${locale}/legal/mentions`, label: t('legal') },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

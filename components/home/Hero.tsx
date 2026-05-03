'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'

interface HeroPhoto {
  id: string
  thumbKeyR2: string
  previewKeyR2: string
  title: string
  titleEn: string
}

export function HeroSection({
  heroPhoto,
  locale,
}: {
  heroPhoto: HeroPhoto | null
  locale: string
}) {
  const t = useTranslations('home.hero')

  const bgStyle = heroPhoto
    ? { backgroundImage: `url(/api/image/${heroPhoto.previewKeyR2})` }
    : { background: 'linear-gradient(135deg, #1c1917 0%, #44403c 100%)' }

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
      style={bgStyle}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <p className="text-xs tracking-[0.4em] uppercase text-stone-300 mb-4">
          {t('tagline')}
        </p>
        <h1 className="font-serif text-6xl md:text-8xl tracking-widest mb-8 text-white">
          Nico Garay
        </h1>
        <Link
          href={`/${locale}/shop`}
          className="inline-block border border-white text-white text-sm tracking-widest uppercase px-8 py-3 hover:bg-white hover:text-stone-900 transition-colors"
        >
          {t('cta')}
        </Link>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}

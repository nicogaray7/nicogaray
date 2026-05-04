'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { photoPublicLabel } from '@/lib/photoLabel'

interface HeroPhoto {
  id: string
  thumbKeyR2: string
  previewKeyR2: string
  country: string | null
  city: string | null
}

export function HeroSection({
  heroPhoto,
  locale,
}: {
  heroPhoto: HeroPhoto | null
  locale: string
}) {
  const t = useTranslations('home.hero')

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-ink-900">

      {/* Image de fond avec effet ken-burns */}
      {heroPhoto && (
        <div
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{ backgroundImage: `url(/api/image/${heroPhoto.previewKeyR2})` }}
        />
      )}

      {/* Vignette + overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-900/90 via-ink-900/30 to-ink-900/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-900/40 via-transparent to-ink-900/20" />

      {/* Contenu */}
      <div className="relative z-10 min-h-[100svh] flex flex-col justify-end pb-24 sm:pb-32 px-5 sm:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <p
            className="text-[11px] sm:text-xs tracking-[0.4em] uppercase text-white/70 mb-6 sm:mb-8 animate-fade-up delay-100"
          >
            {t('tagline')}
          </p>

          <h1 className="font-display text-[14vw] sm:text-[10vw] lg:text-[140px] leading-[0.85] text-white mb-8 sm:mb-12 animate-fade-up delay-200">
            <span className="block font-light">Nico</span>
            <span className="block italic font-light text-white/90 -mt-2">Garay</span>
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 animate-fade-up delay-300">
            <Link
              href={`/${locale}/shop`}
              className="group inline-flex items-center gap-3 self-start text-white border-b border-white/40 hover:border-white pb-2 text-sm tracking-[0.2em] uppercase transition-colors"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="text-white/60 text-sm max-w-md text-pretty">
              {locale === 'fr'
                ? 'Photographies en haute résolution capturées au fil de mes voyages.'
                : 'High-resolution photographs captured throughout my travels.'}
            </p>
          </div>
        </div>
      </div>

      {/* Crédit photo discret */}
      {heroPhoto && (
        <p className="absolute bottom-6 right-5 sm:right-12 text-[10px] tracking-[0.2em] uppercase text-white/40">
          {photoPublicLabel(heroPhoto, locale)}
        </p>
      )}

      {/* Indicateur scroll */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 animate-fade-in delay-500">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">
          {locale === 'fr' ? 'Découvrir' : 'Discover'}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  )
}

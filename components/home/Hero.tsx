'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <section className="relative min-h-screen overflow-hidden bg-ink-50">

      {/* Background image with ken-burns effect */}
      {heroPhoto && (
        <div
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{ backgroundImage: `url(/api/image/${heroPhoto.previewKeyR2})` }}
        />
      )}

      {/* Overlay gradients - bold dark with vibrant accent edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-50/98 via-ink-50/50 to-ink-50/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-accent-500/20 via-transparent to-accent-400/10" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-24 sm:pb-32 px-5 sm:px-12">
        <div className="max-w-7xl mx-auto w-full">
          <motion.p
            className="text-[11px] sm:text-xs tracking-[0.3em] uppercase text-ink-700 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            {t('tagline')}
          </motion.p>

          <motion.h1
            className="font-display text-[14vw] sm:text-[10vw] lg:text-[140px] leading-[0.85] text-ink-900 mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <span className="block">Nico</span>
            <span className="block italic -mt-2">Garay</span>
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <Link
              href={`/${locale}/shop`}
              className="group inline-flex items-center gap-3 self-start text-accent-500 border-b border-accent-500/50 hover:border-accent-500 pb-2 text-sm tracking-[0.15em] uppercase transition-colors font-medium"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="text-ink-700 text-sm max-w-md leading-relaxed">
              {t('description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Photo credit */}
      {heroPhoto && (
        <motion.p
          className="absolute bottom-6 right-5 sm:right-12 text-[10px] tracking-[0.2em] uppercase text-ink-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {photoPublicLabel(heroPhoto, locale)}
        </motion.p>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-accent-500">
          {locale === 'fr' ? 'Decouvrir' : 'Discover'}
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-accent-500/40 to-transparent" />
      </motion.div>
    </section>
  )
}

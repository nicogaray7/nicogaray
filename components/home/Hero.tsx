'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
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
    <section className="relative min-h-screen overflow-hidden bg-ink-900">

      {/* Background image (semantic, preloaded, accessible) */}
      {heroPhoto && (
        <Image
          src={`/api/image/${heroPhoto.previewKeyR2}`}
          alt={photoPublicLabel(heroPhoto, locale)}
          fill
          priority
          sizes="100vw"
          className="object-cover scale-[1.01]"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/56 to-black/34" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-16 sm:pb-24 lg:pb-28 px-5 sm:px-12">
        <div className="max-w-6xl mx-auto w-full">
          <motion.p
            className="text-[11px] sm:text-xs tracking-[0.28em] uppercase text-white/80 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          >
            {t('tagline')}
          </motion.p>

          <motion.h1
            className="font-display text-[16vw] sm:text-[12vw] lg:text-[156px] leading-[0.84] text-white mb-6 sm:mb-8 max-w-5xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <span className="block">Nico</span>
            <span className="block -mt-1 text-white">Garay</span>
          </motion.h1>

          <motion.div
            className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          >
            <Link
              href={`/${locale}/shop`}
              className="group inline-flex items-center gap-3 self-start bg-accent-500 text-white hover:bg-accent-600 px-6 py-3 rounded-full text-[11px] tracking-[0.16em] uppercase transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>

            <p className="text-white/90 text-sm sm:text-[15px] max-w-md leading-relaxed">
              {t('description')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Photo credit */}
      {heroPhoto && (
        <motion.p
          className="absolute bottom-5 right-5 sm:right-12 text-[10px] tracking-[0.18em] uppercase text-white/70"
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
        <span className="text-[10px] tracking-[0.26em] uppercase text-white/80">
          {locale === 'fr' ? 'Decouvrir' : 'Discover'}
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-white/65 to-transparent" />
      </motion.div>
    </section>
  )
}

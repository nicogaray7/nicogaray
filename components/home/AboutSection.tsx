'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'

export function AboutSection({
  locale,
  countriesCount,
  photosCount,
}: {
  locale: string
  countriesCount: number
  photosCount: number
}) {
  const t = useTranslations('home.about')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 sm:py-32 bg-ink-150" ref={ref}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Text */}
          <motion.div
            className="lg:col-span-7 space-y-6 sm:space-y-8 order-2 lg:order-1"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-accent-400">
              {locale === 'fr' ? 'A propos' : 'About'}
            </p>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[1.05] text-balance">
              {t('title')}
            </h2>

            <p className="text-ink-700 text-base sm:text-lg leading-[1.7] max-w-xl">
              {t('text')}
            </p>

            <Link
              href={`/${locale}/about`}
              className="group inline-flex items-center gap-3 text-accent-500 border-b border-accent-500/50 hover:border-accent-500 pb-1 text-sm tracking-[0.15em] uppercase transition-colors font-medium"
            >
              {locale === 'fr' ? 'En savoir plus' : 'Read more'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="lg:col-span-5 order-1 lg:order-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Stat number={countriesCount} label={t('countries')} />
              <Stat number={photosCount}    label={t('photos')} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Stat({ number, label }: { number: number; label: string }) {
  return (
    <div className="bg-ink-50 border border-accent-500/30 rounded-lg p-6 sm:p-10 aspect-square flex flex-col justify-between">
      <p className="font-display text-6xl sm:text-7xl lg:text-8xl text-accent-500 leading-none tabular-nums">
        {number}
      </p>
      <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-ink-700">
        {label}
      </p>
    </div>
  )
}

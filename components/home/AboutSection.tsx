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
    <section className="py-20 sm:py-32 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <motion.div
            className="lg:col-span-6 space-y-6 sm:space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-accent-500 font-medium">
              {locale === 'fr' ? 'A propos' : 'About'}
            </p>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[0.95] text-balance">
              {t('title')}
            </h2>

            <p className="text-ink-600 text-base sm:text-lg leading-[1.7] max-w-xl">
              {t('text')}
            </p>

            <Link
              href={`/${locale}/about`}
              className="group inline-flex items-center gap-3 text-accent-500 border-b border-accent-500/40 hover:border-accent-500 pb-1 text-sm tracking-[0.15em] uppercase transition-colors font-semibold"
            >
              {locale === 'fr' ? 'En savoir plus' : 'Read more'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <MetricCard value={countriesCount.toString()} label={t('countries')} />
              <MetricCard value={photosCount.toString()} label={t('photos')} />
              <MetricCard value="100%" label={locale === 'fr' ? 'fichiers HD' : 'hd files'} />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-accent-500/30 bg-ink-50 px-5 py-6 sm:px-6 sm:py-7">
      <p className="font-display text-5xl sm:text-6xl text-accent-500 leading-none tabular-nums">
        {value}
      </p>
      <p className="mt-3 text-[10px] sm:text-xs tracking-[0.23em] uppercase text-accent-400">
        {label}
      </p>
    </div>
  )
}

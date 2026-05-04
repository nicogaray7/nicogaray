'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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

  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">

          {/* Texte */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 order-2 lg:order-1">
            <p className="text-[11px] tracking-[0.3em] uppercase text-ink-400">
              {locale === 'fr' ? 'À propos' : 'About'}
            </p>

            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[1] text-balance">
              {t('title')}
            </h2>

            <p className="text-ink-600 text-base sm:text-lg leading-relaxed text-pretty max-w-xl">
              {t('text')}
            </p>

            <Link
              href={`/${locale}/about`}
              className="group inline-flex items-center gap-3 text-ink-900 border-b border-ink-300 hover:border-ink-900 pb-1 text-sm tracking-wider uppercase transition-colors"
            >
              {locale === 'fr' ? 'En savoir plus' : 'Read more'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Stats */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <Stat number={countriesCount} label={t('countries')} />
              <Stat number={photosCount}    label={t('photos')} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ number, label }: { number: number; label: string }) {
  return (
    <div className="bg-ink-50 rounded-2xl p-6 sm:p-10 aspect-square flex flex-col justify-between">
      <p className="font-display text-6xl sm:text-7xl lg:text-8xl text-ink-900 leading-none tabular-nums">
        {number}
      </p>
      <p className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-ink-400">
        {label}
      </p>
    </div>
  )
}

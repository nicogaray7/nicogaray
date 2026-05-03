'use client'

import { useTranslations } from 'next-intl'

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
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mb-8">{t('title')}</h2>
        <p className="text-stone-500 text-lg leading-relaxed mb-12">{t('text')}</p>

        <div className="flex justify-center gap-16">
          <div>
            <p className="font-serif text-5xl text-stone-800 mb-1">{countriesCount}</p>
            <p className="text-xs tracking-widest uppercase text-stone-400">{t('countries')}</p>
          </div>
          <div className="border-l border-stone-200" />
          <div>
            <p className="font-serif text-5xl text-stone-800 mb-1">{photosCount}</p>
            <p className="text-xs tracking-widest uppercase text-stone-400">{t('photos')}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

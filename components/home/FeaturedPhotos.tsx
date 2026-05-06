'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { PhotoCard } from '@/components/shop/PhotoCard'

interface Photo {
  id: string
  thumbKeyR2: string
  previewKeyR2: string
  country: string | null
  city: string | null
  orientation: string
  price: number
}

export function FeaturedPhotos({
  photos,
  locale,
}: {
  photos: Photo[]
  locale: string
}) {
  const t = useTranslations('home.featured')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-20 sm:py-32 bg-ink-50 overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="max-w-xl">
            <p className="text-[11px] tracking-[0.3em] uppercase text-accent-400 mb-4">
              {locale === 'fr' ? 'Selection' : 'Selection'}
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[1.05] text-balance">
              {t('title')}
            </h2>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="group inline-flex items-center gap-3 self-start sm:self-end text-accent-500 border-b border-accent-500/50 hover:border-accent-500 pb-2 text-sm tracking-[0.15em] uppercase transition-colors font-medium"
          >
            {t('cta')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className={i === 0 ? 'col-span-2 lg:col-span-2 lg:row-span-2' : ''}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: 'easeOut' }}
            >
              <PhotoCard photo={photo} locale={locale} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

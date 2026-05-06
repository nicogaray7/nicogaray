export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { ProtectedImage } from '@/components/shop/ProtectedImage'
import { photoPublicLabel } from '@/lib/photoLabel'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'À propos - Nico Garay' : 'About - Nico Garay',
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('about')

  const [portrait, totalPhotos, totalCountries] = await Promise.all([
    prisma.photo.findFirst({
      where: { published: true, featured: true },
      select: { previewKeyR2: true, country: true, city: true },
    }),
    prisma.photo.count({ where: { published: true } }),
    prisma.photo.findMany({
      where: { published: true, country: { not: null } },
      select: { country: true },
      distinct: ['country'],
    }),
  ])

  return (
    <>
      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-20 sm:pb-32">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl text-ink-900 leading-[0.95] text-balance mb-12 sm:mb-16">
            {t('title')}
          </h1>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 w-full sm:max-w-sm">
            <div>
              <p className="font-display text-4xl sm:text-5xl text-accent-500 tabular-nums mb-2">
                {totalCountries.length}
              </p>
              <p className="text-xs tracking-widest uppercase text-accent-400">
                {locale === 'fr' ? 'Pays' : 'Countries'}
              </p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-accent-500 tabular-nums mb-2">
                {totalPhotos}
              </p>
              <p className="text-xs tracking-widest uppercase text-accent-400">
                {locale === 'fr' ? 'Photos' : 'Photos'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured image */}
      {portrait && (
        <section className="py-20 sm:py-32">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="relative aspect-video bg-ink-150 overflow-hidden border border-accent-500/30 rounded-lg">
              <ProtectedImage
                src={`/api/image/${portrait.previewKeyR2}`}
                alt={photoPublicLabel(portrait, locale)}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </section>
      )}

      {/* Editorial text */}
      <section className="py-20 sm:py-32">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="space-y-7 text-ink-700 text-lg sm:text-xl leading-relaxed">
            <p>{t('text1')}</p>
            <p>{t('text2')}</p>
          </div>

          <div className="mt-16 pt-10 border-t border-accent-500/20">
            <Link
              href={`/${locale}/shop`}
              className="group inline-flex items-center gap-2 text-accent-500 text-sm tracking-wider uppercase hover:text-accent-600 transition-colors"
            >
              {locale === 'fr' ? 'Voir les travaux' : 'View the work'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

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
    title: locale === 'fr' ? 'A propos | Nico Garay' : 'About | Nico Garay',
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('about')
  const en = locale === 'en'

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
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-32 sm:pt-40 pb-16 sm:pb-24">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <p className="text-[10px] tracking-[0.25em] uppercase text-accent mb-4 animate-fade-up">
            {en ? 'About' : 'A propos'}
          </p>
          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-foreground leading-[0.95] text-balance mb-12 sm:mb-16 animate-fade-up delay-100">
            {t('title')}
          </h1>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 w-full sm:max-w-xs animate-fade-up delay-200">
            <div>
              <p className="font-display text-4xl sm:text-5xl text-accent tabular-nums mb-2">
                {totalCountries.length}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground-muted">
                {en ? 'Countries' : 'Pays'}
              </p>
            </div>
            <div>
              <p className="font-display text-4xl sm:text-5xl text-accent tabular-nums mb-2">
                {totalPhotos}
              </p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground-muted">
                Photos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured image */}
      {portrait && (
        <section className="py-12 sm:py-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="relative aspect-video bg-surface-card overflow-hidden">
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

      {/* Text */}
      <section className="py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-5 sm:px-8">
          <div className="space-y-7 text-foreground-dim text-lg sm:text-xl leading-relaxed">
            <p>{t('text1')}</p>
            <p>{t('text2')}</p>
          </div>

          <div className="mt-16 pt-10 border-t border-line">
            <Link
              href={`/${locale}/shop`}
              className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-accent hover:text-foreground transition-colors duration-300"
            >
              {en ? 'View the work' : 'Voir les travaux'}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

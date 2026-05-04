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
    title: locale === 'fr' ? 'À propos — Nico Garay' : 'About — Nico Garay',
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
      {/* Hero About */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 bg-ink-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            <div className="lg:col-span-7">
              <p className="text-[11px] tracking-[0.3em] uppercase text-ink-400 mb-4">
                {locale === 'fr' ? 'À propos' : 'About'}
              </p>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-ink-900 leading-[0.95] text-balance">
                {t('title')}
              </h1>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-3 lg:gap-4">
              <div className="bg-white rounded-xl p-4 sm:p-6">
                <p className="font-display text-4xl sm:text-5xl text-ink-900 tabular-nums">{totalCountries.length}</p>
                <p className="text-[10px] tracking-[0.25em] uppercase text-ink-400 mt-2">
                  {locale === 'fr' ? 'Pays' : 'Countries'}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6">
                <p className="font-display text-4xl sm:text-5xl text-ink-900 tabular-nums">{totalPhotos}</p>
                <p className="text-[10px] tracking-[0.25em] uppercase text-ink-400 mt-2">
                  {locale === 'fr' ? 'Photos' : 'Photos'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image immersive */}
      {portrait && (
        <section className="bg-ink-50 -mt-8">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <div className="relative aspect-[16/10] sm:aspect-[21/9] bg-ink-100 rounded-2xl overflow-hidden">
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

      {/* Texte éditorial */}
      <section className="py-20 sm:py-32 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="space-y-8 text-ink-700 text-lg sm:text-xl leading-[1.7] text-pretty">
            <p className="first-letter:font-display first-letter:text-7xl first-letter:float-left first-letter:mr-3 first-letter:leading-[0.85] first-letter:text-ink-900">
              {t('text1')}
            </p>
            <p>{t('text2')}</p>
          </div>

          <div className="mt-16 pt-10 border-t border-ink-100">
            <Link
              href={`/${locale}/shop`}
              className="group inline-flex items-center gap-3 text-ink-900 text-sm tracking-wider uppercase border-b border-ink-300 hover:border-ink-900 pb-1 transition-colors"
            >
              {locale === 'fr' ? 'Découvrir la boutique' : 'Discover the shop'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

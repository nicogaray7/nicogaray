export const dynamic = 'force-dynamic'

import { getTranslations } from 'next-intl/server'
import { prisma } from '@/lib/db'
import { HeroSection } from '@/components/home/Hero'
import { MapSection } from '@/components/home/MapSection'
import { AboutSection } from '@/components/home/AboutSection'
import { FeaturedPhotos } from '@/components/home/FeaturedPhotos'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'Nico Garay — Photographe Voyageur' : 'Nico Garay — Travel Photographer',
    description:
      locale === 'fr'
        ? 'Photos de voyage en haute résolution. Achetez et téléchargez les fichiers HD.'
        : 'High-resolution travel photography. Buy and download HD files.',
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const [featuredPhotos, heroPhoto, countriesRaw, totalPhotos] = await Promise.all([
    prisma.photo.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true, title: true, titleEn: true,
        thumbKeyR2: true, previewKeyR2: true,
        country: true, orientation: true, price: true,
      },
    }),
    prisma.photo.findFirst({
      where: { published: true, featured: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, thumbKeyR2: true, previewKeyR2: true, title: true, titleEn: true },
    }),
    prisma.photo.findMany({
      where: { published: true, country: { not: null } },
      select: { country: true },
      distinct: ['country'],
    }),
    prisma.photo.count({ where: { published: true } }),
  ])

  const countries = countriesRaw
    .map((p) => p.country!)
    .filter(Boolean)
    .sort()

  return (
    <>
      <HeroSection heroPhoto={heroPhoto} locale={locale} />
      <MapSection countries={countries} locale={locale} />
      <AboutSection
        locale={locale}
        countriesCount={countries.length}
        photosCount={totalPhotos}
      />
      <FeaturedPhotos photos={featuredPhotos} locale={locale} />
    </>
  )
}

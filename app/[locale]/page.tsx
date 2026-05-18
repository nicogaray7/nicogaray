export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/db'
import { StoryCard } from '@/components/StoryCard'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('home')

  const [heroPhoto, featuredPhotos, totalPhotos, totalCountries] = await Promise.all([
    prisma.photo.findFirst({
      where: { published: true, featured: true },
      select: { previewKeyR2: true, country: true },
    }),
    prisma.photo.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        thumbKeyR2: true,
        previewKeyR2: true,
        country: true,
        city: true,
        orientation: true,
        price: true,
      },
    }),
    prisma.photo.count({ where: { published: true } }),
    prisma.photo.findMany({
      where: { published: true, country: { not: null } },
      select: { country: true },
      distinct: ['country'],
    }),
  ])

  const en = locale === 'en'

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-end">
        {heroPhoto ? (
          <div className="absolute inset-0">
            <Image
              src={`/api/image/${heroPhoto.previewKeyR2}`}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-surface-elevated" />
        )}

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pb-16 sm:pb-24">
          <div className="max-w-2xl space-y-6">
            <p className="text-[11px] tracking-[0.25em] uppercase text-accent animate-fade-up">
              {t('hero.tagline')}
            </p>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl text-foreground leading-[0.95] animate-fade-up delay-100">
              Nico Garay
            </h1>
            <p className="text-lg sm:text-xl text-foreground-dim leading-relaxed max-w-lg animate-fade-up delay-200">
              {t('hero.description')}
            </p>
            <div className="pt-4 animate-fade-up delay-300">
              <Link
                href={`/${locale}/shop`}
                className="group inline-flex items-center gap-3 text-[11px] tracking-[0.2em] uppercase text-accent hover:text-foreground transition-colors duration-300"
              >
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="border-y border-line bg-surface-elevated">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-display text-3xl sm:text-4xl text-accent tabular-nums">{totalCountries.length}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground-muted mt-2">
                {t('about.countries')}
              </p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl text-accent tabular-nums">{totalPhotos}</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground-muted mt-2">
                {t('about.photos')}
              </p>
            </div>
            <div>
              <p className="font-display text-3xl sm:text-4xl text-accent tabular-nums">HD</p>
              <p className="text-[10px] tracking-[0.2em] uppercase text-foreground-muted mt-2">
                {en ? 'Resolution' : 'Resolution'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            {t('about.title')}
          </h2>
          <p className="text-foreground-dim text-lg leading-relaxed">
            {t('about.text')}
          </p>
          <Link
            href={`/${locale}/about`}
            className="group inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-accent hover:text-foreground transition-colors duration-300 mt-4"
          >
            {en ? 'About me' : 'En savoir plus'}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Featured grid */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 bg-surface-elevated">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12 sm:mb-16">
            <div>
              <p className="text-[10px] tracking-[0.25em] uppercase text-accent mb-3">
                {en ? 'Recent work' : 'Travaux recents'}
              </p>
              <h2 className="font-display text-3xl sm:text-5xl text-foreground">
                {t('featured.title')}
              </h2>
            </div>
            <Link
              href={`/${locale}/shop`}
              className="hidden sm:inline-flex group items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-foreground-dim hover:text-accent transition-colors duration-300"
            >
              {t('featured.cta')}
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {featuredPhotos.map((photo, i) => (
              <div
                key={photo.id}
                className="animate-reveal"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <StoryCard photo={photo} locale={locale} />
              </div>
            ))}
          </div>

          <div className="sm:hidden mt-10 text-center">
            <Link
              href={`/${locale}/shop`}
              className="group inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-foreground-dim hover:text-accent transition-colors duration-300"
            >
              {t('featured.cta')}
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="font-display text-3xl sm:text-4xl text-foreground">
            {en ? 'Own a piece of the journey' : 'Possedez un fragment du voyage'}
          </h2>
          <p className="text-foreground-dim text-base sm:text-lg">
            {en
              ? 'Every photo is available as a high-resolution digital file with a personal-use license.'
              : 'Chaque photo est disponible en fichier numerique haute resolution avec licence personnelle.'}
          </p>
          <Link
            href={`/${locale}/shop`}
            className="inline-block px-8 py-3.5 bg-accent text-surface text-sm font-medium tracking-wide hover:bg-accent-dim transition-colors duration-300"
          >
            {en ? 'Browse Gallery' : 'Parcourir la Galerie'}
          </Link>
        </div>
      </section>
    </>
  )
}

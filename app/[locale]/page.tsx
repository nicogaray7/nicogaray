export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/db'
import { StoryCard } from '@/components/StoryCard'
import { getTranslations } from 'next-intl/server'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('home')

  const featuredPhotos = await prisma.photo.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 9,
    select: {
      id: true,
      thumbKeyR2: true,
      previewKeyR2: true,
      country: true,
      city: true,
      orientation: true,
      price: true,
    },
  })

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-[60vh] bg-gradient-to-br from-ink-900 via-ink-800 to-brown-700 text-white flex items-center justify-center py-20 px-5">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="font-display text-5xl sm:text-7xl leading-tight text-white">
            Slow Travel
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            Editorial photography exploring light and presence across the world
          </p>
          <Link
            href={`/${locale}/shop`}
            className="inline-block mt-6 px-8 py-3 bg-accent-500 text-white font-bold text-sm tracking-widest uppercase hover:bg-accent-600 transition-colors"
          >
            Browse Gallery
          </Link>
        </div>
      </section>

      {/* Featured Stories Grid */}
      <section className="py-20 sm:py-32 px-5 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <h2 className="font-display text-4xl sm:text-5xl text-ink-900 text-center">
              {locale === 'fr' ? 'Histoires Récentes' : 'Recent Stories'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredPhotos.map((photo) => (
              <StoryCard key={photo.id} photo={photo} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-ink-900 text-white text-center px-5">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-display text-3xl sm:text-4xl">
            {locale === 'fr' ? 'Explorez la Collection Complète' : 'Explore Full Collection'}
          </h2>
          <Link
            href={`/${locale}/shop`}
            className="inline-block px-10 py-4 bg-accent-500 text-white font-bold text-sm tracking-widest uppercase hover:bg-accent-600 transition-colors"
          >
            {locale === 'fr' ? 'Voir la Galerie' : 'View Gallery'}
          </Link>
        </div>
      </section>
    </div>
  )
}

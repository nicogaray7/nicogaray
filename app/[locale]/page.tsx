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

  const isEnglish = locale === 'en'

  return (
    <div className="bg-white">
      {/* Hero Section - Personal Brand */}
      <section className="min-h-screen flex items-center justify-center py-20 px-5 sm:px-8 bg-gradient-subtle">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm tracking-widest uppercase text-accent-primary font-semibold">
              {isEnglish ? 'Travel Photographer' : 'Photographe de Voyage'}
            </p>
            <h1 className="font-display text-6xl sm:text-8xl leading-tight text-text-primary">
              Nico Garay
            </h1>
          </div>

          <p className="text-xl sm:text-2xl text-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
            {isEnglish
              ? "I'm Nico Garay, I share my trips until National Geographic sees my content"
              : "Je suis Nico Garay, je partage mes voyages jusqu'à ce que National Geographic voie mon contenu"}
          </p>

          <div className="pt-8">
            <Link
              href={isEnglish ? "/en/shop" : "/fr/shop"}
              className="inline-block px-8 py-4 bg-accent-primary text-white font-semibold text-sm tracking-wide hover:bg-accent-secondary transition-colors duration-300"
            >
              {isEnglish ? 'Explore My Work' : 'Découvrez Mon Travail'}
            </Link>
          </div>
        </div>
      </section>

      {/* About the Journey */}
      <section className="py-20 sm:py-32 px-5 sm:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-display text-4xl sm:text-5xl text-text-primary">
            {isEnglish ? 'Travel & Photography' : 'Voyage & Photographie'}
          </h2>
          <p className="text-lg sm:text-xl text-text-secondary leading-relaxed">
            {isEnglish
              ? 'Every trip is a story worth sharing. These high-resolution editions capture the light, moment, and feeling of travel across the world.'
              : 'Chaque voyage est une histoire qui mérite d\'être partagée. Ces éditions haute résolution capturent la lumière, le moment et la sensation du voyage à travers le monde.'}
          </p>
        </div>
      </section>

      {/* Featured Stories Grid */}
      <section className="py-20 sm:py-32 px-5 sm:px-8 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16">
            <h2 className="font-display text-4xl sm:text-5xl text-text-primary">
              {isEnglish ? 'Recent Stories' : 'Histoires Récentes'}
            </h2>
            <p className="text-text-secondary mt-4">
              {isEnglish
                ? 'Available as high-resolution digital editions'
                : 'Disponibles en tant qu\'éditions numériques haute résolution'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredPhotos.map((photo, i) => (
              <div 
                key={photo.id} 
                className="animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <StoryCard photo={photo} locale={locale} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 sm:py-24 px-5 sm:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-display text-3xl sm:text-4xl text-text-primary">
            {isEnglish ? 'Browse the Full Gallery' : 'Parcourez la Galerie Complète'}
          </h2>
          <p className="text-text-secondary text-lg">
            {isEnglish
              ? 'All photos are available as personal-use digital editions'
              : 'Toutes les photos sont disponibles en tant qu\'éditions numériques à usage personnel'}
          </p>
          <Link
            href={isEnglish ? "/en/shop" : "/fr/shop"}
            className="inline-block px-10 py-4 bg-accent-primary text-white font-semibold text-sm tracking-wide hover:bg-accent-secondary transition-colors duration-300"
          >
            {isEnglish ? 'View Gallery' : 'Voir la Galerie'}
          </Link>
        </div>
      </section>
    </div>
  )
}

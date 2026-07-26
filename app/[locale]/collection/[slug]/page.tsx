import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowLeft, Images } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { PhoneMockup } from '@/components/gallery/PhoneMockup';
import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2-url';
import { cn } from '@/lib/utils';
import type { Prisma } from '@prisma/client';

// Généré au runtime (pas au build) : sinon la DB n'est pas joignable pendant le
// build Docker et la collection sort figée à 0 photo jusqu'à la revalidation ISR.
export const dynamic = 'force-dynamic';

// ---------------------------------------------------------------------------
// Collection definitions (hardcoded - no DB required)
// ---------------------------------------------------------------------------

type CollectionSlug =
  | 'photographie-voyage'
  | 'fonds-decran-mer'
  | 'fonds-decran-montagne'
  | 'fonds-decran-desert'
  | 'fonds-decran-coucher-de-soleil'
  | 'fonds-decran-tropical';

interface CollectionDef {
  slugFr: string;
  slugEn: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  introFr: string;
  introEn: string;
  filter: Prisma.PhotoWhereInput;
  orderBy: Prisma.PhotoOrderByWithRelationInput[];
  limit?: number;
}

const COLLECTIONS: Record<CollectionSlug, CollectionDef> = {
  'photographie-voyage': {
    slugFr: 'photographie-voyage',
    slugEn: 'photographie-voyage',
    titleFr: 'Photographie de voyage : le monde en images',
    titleEn: 'Travel photography: the world in pictures',
    descriptionFr:
      "Collection de photographie de voyage : Australie, Vietnam, Philippines, France et quelques autres pays d'Europe. Paysages, mer, montagne et instants de voyage. Fonds d'écran en fichier numérique, à partir de 2 €.",
    descriptionEn:
      "Travel photography collection: Australia, Vietnam, the Philippines, France and a few other European countries. Landscapes, sea, mountains and travel moments. Digital wallpaper file, from €2.",
    introFr: `La photographie de voyage est une façon de voir le monde deux fois : une première fois à travers l'objectif, une deuxième en revoyant les images longtemps après. Ce qui reste, ce n'est jamais le monument ou le paysage attendu, mais la lumière d'un matin particulier, la texture d'un mur, un regard capté par hasard dans une rue.

Cette collection rassemble des images prises au fil de plusieurs voyages : l'outback et les côtes d'Australie, les montagnes karstiques du Vietnam, les îles des Philippines, les volcans du Cantal et quelques détours en Europe. Pas de mise en scène, pas de retouche excessive : juste la lumière, le moment et l'endroit.

Chaque photo est un fichier numérique en haute résolution, calibré pour un écran de smartphone. Emporter un paysage de voyage sur son téléphone, c'est aussi une façon de ne jamais tout à fait rentrer.`,
    introEn: `Travel photography is a way of seeing the world twice: first through the lens, then again when revisiting the images long after. What remains is never the expected monument or landscape, but the light of a particular morning, the texture of a wall, a glance caught by chance in a street.

This collection brings together images taken across several trips: the outback and coastlines of Australia, the karst mountains of Vietnam, the islands of the Philippines, the volcanoes of Cantal and a few detours across Europe. No staging, no heavy retouching, just light, timing and place.

Each photo is a high-resolution digital file, calibrated for a smartphone screen. Carrying a travel landscape on your phone is also a way of never quite coming home.`,
    filter: { published: true },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { takenAt: 'desc' }],
    limit: 30,
  },

  'fonds-decran-mer': {
    slugFr: 'fonds-decran-mer',
    slugEn: 'fonds-decran-mer',
    titleFr: "Fonds d'écran mer et océan",
    titleEn: 'Sea and ocean wallpapers',
    descriptionFr:
      "Fonds d'écran HD de mer et d'océan, format vertical optimisé mobile : lagons turquoise, vagues, plages et horizons infinis. Fichier numérique, téléchargement immédiat, à partir de 2 €.",
    descriptionEn:
      'HD sea and ocean wallpapers, vertical format optimized for mobile: turquoise lagoons, waves, beaches and endless horizons. Digital file, from €2.',
    introFr: `Un lagon turquoise, une vague qui se brise, un horizon qui se perd dans le bleu : ces images ont été prises entre les Philippines, l'Australie et le Vietnam, là où la mer change de couleur à chaque heure de la journée.

Chaque photo est recadrée et calibrée pour un écran de smartphone, en haute résolution, pour un rendu net sur l'écran d'accueil ou de verrouillage.`,
    introEn: `A turquoise lagoon, a breaking wave, a horizon dissolving into blue: these images were taken between the Philippines, Australia and Vietnam, where the sea shifts color throughout the day.

Each photo is cropped and calibrated for a smartphone screen, in high resolution, for a crisp result on your home or lock screen.`,
    filter: { published: true, tags: { has: 'mer' } },
    orderBy: [{ featured: 'desc' }, { takenAt: 'desc' }],
    limit: 40,
  },

  'fonds-decran-montagne': {
    slugFr: 'fonds-decran-montagne',
    slugEn: 'fonds-decran-montagne',
    titleFr: "Fonds d'écran de montagne",
    titleEn: 'Mountain wallpapers',
    descriptionFr:
      "Fonds d'écran HD de montagne, format vertical optimisé mobile : sommets, vallées et reliefs d'Auvergne, du Vietnam et d'Australie. Fichier numérique à partir de 2 €.",
    descriptionEn:
      'HD mountain wallpapers, vertical format optimized for mobile: peaks, valleys and reliefs from Auvergne, Vietnam and Australia. Digital file from €2.',
    introFr: `Des volcans du Cantal aux montagnes karstiques du nord du Vietnam, ces photos capturent des reliefs qui donnent l'impression de tenir un paysage entier dans la poche.

Format vertical, haute résolution : ces images sont pensées pour habiller un écran de téléphone, pas un mur.`,
    introEn: `From the volcanoes of Cantal to the karst mountains of northern Vietnam, these photos capture landscapes that feel like holding an entire vista in your pocket.

Vertical format, high resolution: these images are made to dress a phone screen, not a wall.`,
    filter: { published: true, tags: { has: 'montagne' } },
    orderBy: [{ featured: 'desc' }, { takenAt: 'desc' }],
    limit: 40,
  },

  'fonds-decran-desert': {
    slugFr: 'fonds-decran-desert',
    slugEn: 'fonds-decran-desert',
    titleFr: "Fonds d'écran du désert",
    titleEn: 'Desert wallpapers',
    descriptionFr:
      "Fonds d'écran HD de désert et d'outback australien, format vertical optimisé mobile : terres arides, routes infinies et couleurs ocre. Fichier numérique à partir de 2 €.",
    descriptionEn:
      'HD desert and Australian outback wallpapers, vertical format optimized for mobile: arid land, endless roads and ochre tones. Digital file from €2.',
    introFr: `L'outback australien impose ses propres règles : des routes qui filent à l'horizon, une terre rouge à perte de vue, un ciel qui prend feu au coucher du soleil.

Ces images en haute résolution restituent ces étendues arides directement sur l'écran d'un smartphone.`,
    introEn: `The Australian outback plays by its own rules: roads stretching to the horizon, red earth as far as the eye can see, a sky catching fire at sunset.

These high-resolution images bring those arid expanses straight to a smartphone screen.`,
    filter: { published: true, tags: { has: 'desert' } },
    orderBy: [{ featured: 'desc' }, { takenAt: 'desc' }],
    limit: 40,
  },

  'fonds-decran-coucher-de-soleil': {
    slugFr: 'fonds-decran-coucher-de-soleil',
    slugEn: 'fonds-decran-coucher-de-soleil',
    titleFr: "Fonds d'écran couchers de soleil",
    titleEn: 'Sunset wallpapers',
    descriptionFr:
      "Fonds d'écran HD de couchers de soleil, format vertical optimisé mobile : ciels orangés, silhouettes et lumière rasante capturés en voyage. Fichier numérique à partir de 2 €.",
    descriptionEn:
      'HD sunset wallpapers, vertical format optimized for mobile: orange skies, silhouettes and raking light captured while traveling. Digital file from €2.',
    introFr: `Le moment le plus court de la journée est souvent le plus photographié : quelques minutes où la lumière devient orange, rose, presque rouge, avant de disparaître.

Cette sélection rassemble des couchers de soleil pris entre l'Australie, les Philippines et le Vietnam, prêts à remplacer l'écran d'accueil du téléphone.`,
    introEn: `The shortest moment of the day is often the most photographed: a few minutes when the light turns orange, pink, almost red, before fading away.

This selection brings together sunsets captured between Australia, the Philippines and Vietnam, ready to replace a phone's home screen.`,
    filter: { published: true, tags: { has: 'coucher-de-soleil' } },
    orderBy: [{ featured: 'desc' }, { takenAt: 'desc' }],
    limit: 40,
  },

  'fonds-decran-tropical': {
    slugFr: 'fonds-decran-tropical',
    slugEn: 'fonds-decran-tropical',
    titleFr: "Fonds d'écran tropicaux",
    titleEn: 'Tropical wallpapers',
    descriptionFr:
      "Fonds d'écran HD tropical, format vertical optimisé mobile : îles, palmiers et eaux turquoise des Philippines et d'Asie du Sud-Est. Fichier numérique à partir de 2 €.",
    descriptionEn:
      'HD tropical wallpapers, vertical format optimized for mobile: islands, palm trees and turquoise waters from the Philippines and Southeast Asia. Digital file from €2.',
    introFr: `Des îles de Palawan à la baie de Bangka, cette sélection tropicale rassemble des couleurs qu'on associe instinctivement aux vacances : sable blanc, eau turquoise, végétation dense.

De quoi transformer un écran de téléphone en carte postale, toute l'année.`,
    introEn: `From the islands of Palawan to Bangka Bay, this tropical selection brings together colors instinctively associated with vacation: white sand, turquoise water, dense vegetation.

Enough to turn a phone screen into a postcard, all year round.`,
    filter: { published: true, tags: { has: 'tropical' } },
    orderBy: [{ featured: 'desc' }, { takenAt: 'desc' }],
    limit: 40,
  },
};

const ALL_SLUGS = Object.keys(COLLECTIONS) as CollectionSlug[];

function getCollection(slug: string): CollectionDef | null {
  return COLLECTIONS[slug as CollectionSlug] ?? null;
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getPhotos(collection: CollectionDef) {
  return prisma.photo
    .findMany({
      where: collection.filter,
      orderBy: collection.orderBy,
      ...(collection.limit ? { take: collection.limit } : {}),
    })
    .catch(() => []);
}

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const locales = ['fr', 'en'];
  return ALL_SLUGS.flatMap((slug) =>
    locales.map((locale) => ({ locale, slug }))
  );
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata(
  props: {
    params: Promise<{ locale: string; slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const collection = getCollection(params.slug);
  if (!collection) return {};
  const isEn = params.locale === 'en';
  return {
    title: isEn ? collection.titleEn : collection.titleFr,
    description: isEn ? collection.descriptionEn : collection.descriptionFr,
    alternates: {
      canonical: `/${params.locale}/collection/${params.slug}`,
      languages: {
        fr: `/fr/collection/${params.slug}`,
        en: `/en/collection/${params.slug}`,
      },
    },
    openGraph: {
      title: isEn ? collection.titleEn : collection.titleFr,
      description: isEn ? collection.descriptionEn : collection.descriptionFr,
      type: 'website',
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function CollectionPage(
  props: {
    params: Promise<{ locale: string; slug: string }>;
  }
) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const collection = getCollection(params.slug);
  if (!collection) notFound();

  const photos = await getPhotos(collection);
  const isEn = params.locale === 'en';
  const title = isEn ? collection.titleEn : collection.titleFr;
  const intro = isEn ? collection.introEn : collection.introFr;
  const locale = params.locale;

  // Aperçus en fond d'écran : on privilégie les formats portrait/carré
  // (mieux rendus dans un cadre de téléphone), sinon on prend les premières.
  const previewPhotos = [...photos]
    .sort((a, b) => {
      const score = (o: string) => (o === 'portrait' ? 0 : o === 'square' ? 1 : 2);
      return score(a.orientation) - score(b.orientation);
    })
    .slice(0, 3);

  return (
    <article>
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14">
        <Container size="wide">
          <Link
            href={`/${locale}/gallery`}
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {isEn ? 'All photos' : 'Toutes les photos'}
          </Link>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-paper-cool">
                  <Images className="w-5 h-5 text-ink-muted" />
                </span>
                <p className="text-sm text-ink-muted uppercase tracking-widest">
                  {isEn ? 'Wallpapers' : "Fonds d'écran"}
                </p>
              </div>
              <h1 className="text-display-xl font-display text-ink">{title}</h1>
              <div className="prose-feed text-lg mt-6 whitespace-pre-line text-ink-muted">
                {intro}
              </div>
              <p className="text-sm text-ink-muted mt-6">
                {photos.length}{' '}
                {photos.length === 1 ? 'photo' : 'photos'}
              </p>
            </div>

            {previewPhotos.length > 0 && (
              <div className="flex items-end justify-center gap-4 sm:gap-6">
                {previewPhotos.map((p, i) => {
                  const src = r2PublicUrl(p.previewKey) ?? '';
                  const alt = isEn && p.titleEn ? p.titleEn : p.title;
                  const isMain = i === 0;
                  return (
                    <Link
                      key={p.id}
                      href={`/${locale}/gallery/${p.slug}`}
                      aria-label={alt}
                      className={cn(
                        'transition-transform duration-500 hover:-translate-y-1',
                        isMain
                          ? 'order-2 block w-[62%] max-w-[190px] sm:w-[42%]'
                          : 'hidden w-[32%] max-w-[150px] pb-4 sm:block',
                        i === 1 && 'order-1',
                        i === 2 && 'order-3',
                      )}
                    >
                      <PhoneMockup src={src} alt={alt} uid={p.id} />
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container size="wide">
          {photos.length === 0 ? (
            <div className="border border-dashed border-line py-32 text-center">
              <p className="caption">
                {isEn
                  ? 'No photos in this collection yet.'
                  : 'Aucune photo dans cette collection pour l\'instant.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {photos.map((p, i) => (
                <PhotoCard key={p.id} photo={p} locale={locale} priority={i < 4} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </article>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowLeft, Images } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export const revalidate = 3600;

// ---------------------------------------------------------------------------
// Collection definitions (hardcoded — no DB required)
// ---------------------------------------------------------------------------

type CollectionSlug = 'japon' | 'islande' | 'photographie-voyage';

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
  japon: {
    slugFr: 'japon',
    slugEn: 'japon',
    titleFr: 'Photos du Japon : torii, temples et paysages',
    titleEn: 'Photos of Japan: torii gates, temples and landscapes',
    descriptionFr:
      'Galerie de photos du Japon : torii de Fushimi Inari, Mont Fuji, temples de Kyoto, geishas de Gion, cerisiers en fleurs. Tirages photo disponibles à la vente.',
    descriptionEn:
      'Photo gallery of Japan: Fushimi Inari torii gates, Mount Fuji, Kyoto temples, Gion geishas, cherry blossoms. Fine art prints available for purchase.',
    introFr: `Le Japon est un pays qui se photographie autant qu'il se vit. Chaque recoin cache une invitation à s'arrêter — une rangée de torii vermillon qui disparaît dans la brume, un jardin de mousse immobile dans la lumière de l'après-midi, une rue d'Asakusa balayée par la neige un matin de janvier.

Ces images ont été prises au fil de plusieurs voyages, de Tokyo à Kyoto, d'Osaka aux montagnes du nord. Je cherche toujours ce moment suspendu entre ordre et chaos propre au Japon : une geisha qui traverse les pavés de Gion tandis que les lanternes s'allument, le Fuji-san qui se dessine au-dessus des nuages à l'aube, les temples envahis par la foule quelques heures plus tard et pourtant déjà silencieux en contre-lumière.

Photographier le Japon, c'est apprendre à ralentir. À attendre que la lumière change, que la foule s'écarte ou que le brouillard se lève. Les tirages disponibles ici sont tous des éditions limitées, imprimées sur papier Hahnemühle pour restituer la profondeur des ombres et la douceur des tons de l'archipel.`,
    introEn: `Japan is a country that rewards the patient photographer. Every corner holds an invitation to stop — a row of vermillion torii dissolving into morning mist, a moss garden frozen in afternoon light, a snow-covered street in Asakusa before the city wakes.

These images were taken across several trips, from Tokyo to Kyoto, from Osaka to the northern mountains. I am always chasing that suspended moment unique to Japan: a geisha crossing the cobblestones of Gion as lanterns flicker to life, Fuji-san emerging above the clouds at dawn, temples packed with visitors yet somehow serene when caught in backlight.

Photographing Japan is an exercise in slowing down. Waiting for the light to shift, for the crowd to part, for the fog to lift. The prints available here are all limited editions, printed on Hahnemühle paper to preserve the depth of shadow and subtle warmth of the archipelago.`,
    filter: { published: true, countryCode: 'JP' },
    orderBy: [{ featured: 'desc' }, { takenAt: 'desc' }],
  },

  islande: {
    slugFr: 'islande',
    slugEn: 'islande',
    titleFr: "Photos d'Islande : aurores boréales et volcans",
    titleEn: 'Photos of Iceland: northern lights and volcanoes',
    descriptionFr:
      "Galerie de photos d'Islande : aurores boréales sur Jökulsárlón, cascades de Skógafoss et Seljalandsfoss, paysages volcaniques, landes et déserts de lave. Tirages disponibles.",
    descriptionEn:
      'Photo gallery of Iceland: northern lights over Jökulsárlón, Skógafoss and Seljalandsfoss waterfalls, volcanic landscapes, lava fields. Fine art prints available.',
    introFr: `L'Islande ressemble à une planète parallèle. En quelques heures de route, on passe des champs de lave noire aux prairies vertes lumineuses, des cascades géantes aux plages de sable noir, des geysers bouillonnants au silence total d'un intérieur enneigé. C'est un terrain de jeu exceptionnel pour la photographie de paysage.

La lumière y est particulière : en été, elle ne disparaît jamais vraiment et baigne tout d'une teinte dorée pendant des heures. En hiver, elle est courte, rasante, dramatique — idéale pour les aurores boréales qui dansent au-dessus des icebergs du lagon de Jökulsárlón.

Ces photos ont été prises lors de plusieurs séjours, été comme hiver. Certaines demandent d'attendre des heures dans le froid, d'autres se donnent en quelques secondes. Toutes racontent une Islande qui n'appartient qu'à elle-même — sauvage, imprévisible et inoubliable. Les tirages sont disponibles en édition limitée, sur papier baryté pour les noirs profonds des paysages nocturnes.`,
    introEn: `Iceland resembles a parallel planet. Within a few hours of driving, you move from black lava fields to luminous green meadows, from towering waterfalls to black sand beaches, from boiling geysers to the complete silence of the snowy interior. It is an exceptional playground for landscape photography.

The light here is unlike anywhere else: in summer it never fully disappears, bathing everything in golden tones for hours. In winter it is short, raking, dramatic — perfect for the northern lights that dance above the icebergs of the Jökulsárlón lagoon.

These photographs were taken across several trips, both in summer and winter. Some required waiting hours in the cold; others revealed themselves in seconds. All of them tell of an Iceland that belongs only to itself — wild, unpredictable and unforgettable. Prints are available in limited editions, on baryta paper to render the deep blacks of night landscapes.`,
    filter: { published: true, countryCode: 'IS' },
    orderBy: [{ featured: 'desc' }, { takenAt: 'desc' }],
  },

  'photographie-voyage': {
    slugFr: 'photographie-voyage',
    slugEn: 'photographie-voyage',
    titleFr: 'Photographie de voyage : le monde en images',
    titleEn: 'Travel photography: the world in pictures',
    descriptionFr:
      "Collection de photographie de voyage : Asie, Europe, Amérique du Sud, Afrique. Portraits, paysages, architecture et instants de vie du monde entier. Tirages photo d'art disponibles.",
    descriptionEn:
      'Travel photography collection: Asia, Europe, South America, Africa. Portraits, landscapes, architecture and moments of life from around the world. Fine art prints available.',
    introFr: `La photographie de voyage est une façon de voir le monde deux fois — une première fois à travers l'objectif, une deuxième en revoyant les images longtemps après. Ce qui reste, ce n'est jamais le monument ou le paysage attendu : c'est la lumière d'un matin particulier, la texture d'un mur, un regard capté par hasard dans une rue.

Cette collection rassemble des images prises sur plusieurs continents, au fil d'années de voyages. Du Japon à Cuba, de la Patagonie au Myanmar, chaque photo cherche à saisir ce moment où un lieu révèle quelque chose qu'on ne pouvait pas anticiper. Pas de mise en scène, pas de retouche excessive : juste la lumière, le moment et l'endroit.

Chaque tirage est une édition limitée, imprimée sur papier photo d'art et accompagnée d'un certificat d'authenticité. Voyager avec une photo sur son mur, c'est aussi une façon de ne jamais tout à fait rentrer.`,
    introEn: `Travel photography is a way of seeing the world twice — first through the lens, then again when revisiting the images long after. What remains is never the expected monument or landscape: it is the light of a particular morning, the texture of a wall, a glance caught by chance in a street.

This collection brings together images taken across several continents over years of travel. From Japan to Cuba, from Patagonia to Myanmar, each photograph reaches for the moment when a place reveals something unforeseen. No staging, no heavy retouching — just light, timing and place.

Every print is a limited edition, produced on fine art paper and accompanied by a certificate of authenticity. Hanging a travel photograph on your wall is also a way of never quite coming home.`,
    filter: { published: true },
    orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { takenAt: 'desc' }],
    limit: 30,
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

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
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

export default async function CollectionPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(params.locale);
  const collection = getCollection(params.slug);
  if (!collection) notFound();

  const photos = await getPhotos(collection);
  const isEn = params.locale === 'en';
  const title = isEn ? collection.titleEn : collection.titleFr;
  const intro = isEn ? collection.introEn : collection.introFr;
  const locale = params.locale;

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
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-paper-cool">
                <Images className="w-5 h-5 text-ink-muted" />
              </span>
              <p className="text-sm text-ink-muted uppercase tracking-widest">
                {isEn ? 'Collection' : 'Collection'}
              </p>
            </div>
            <h1 className="text-display-xl font-display text-ink">{title}</h1>
            <div className="prose-feed text-lg mt-6 whitespace-pre-line text-ink-muted">
              {intro}
            </div>
            <p className="text-sm text-ink-muted mt-6">
              {photos.length}{' '}
              {isEn
                ? photos.length === 1
                  ? 'photo'
                  : 'photos'
                : photos.length === 1
                  ? 'photo'
                  : 'photos'}
            </p>
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

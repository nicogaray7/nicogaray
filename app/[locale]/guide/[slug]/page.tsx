import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { Container } from '@/components/layout/Container';

// ---------------------------------------------------------------------------
// Guide definitions (hardcoded - no DB required)
// ---------------------------------------------------------------------------

type GuideSlug = 'fond-decran-iphone' | 'fond-decran-android';

interface Step {
  fr: string;
  en: string;
}

interface GuideDef {
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  ledeFr: string;
  ledeEn: string;
  steps: Step[];
  tipFr: string;
  tipEn: string;
}

const GUIDES: Record<GuideSlug, GuideDef> = {
  'fond-decran-iphone': {
    titleFr: "Comment mettre une photo en fond d'écran sur iPhone",
    titleEn: 'How to set a photo as wallpaper on iPhone',
    descriptionFr:
      "Guide pas à pas pour installer un fond d'écran haute résolution sur iPhone, écran verrouillé et écran d'accueil.",
    descriptionEn:
      'Step-by-step guide to set a high-resolution wallpaper on iPhone, lock screen and home screen.',
    ledeFr: "Une fois la photo téléchargée, l'installer prend moins d'une minute.",
    ledeEn: 'Once the photo is downloaded, setting it up takes less than a minute.',
    steps: [
      {
        fr: "Téléchargez le fichier après votre achat (lien reçu par e-mail), il est enregistré dans l'application Photos.",
        en: 'Download the file after purchase (link sent by email), it is saved to the Photos app.',
      },
      {
        fr: "Ouvrez Réglages, puis Fond d'écran.",
        en: 'Open Settings, then Wallpaper.',
      },
      {
        fr: "Appuyez sur Ajouter un nouveau fond d'écran, puis Photos, et sélectionnez l'image téléchargée.",
        en: 'Tap Add New Wallpaper, then Photos, and select the downloaded image.',
      },
      {
        fr: "Ajustez le cadrage si besoin, puis appuyez sur Ajouter. iOS propose de l'appliquer à l'écran verrouillé, à l'écran d'accueil, ou aux deux.",
        en: 'Adjust the crop if needed, then tap Add. iOS offers to apply it to the lock screen, the home screen, or both.',
      },
    ],
    tipFr: "Astuce : pour un rendu net, choisissez toujours un fichier en format vertical (portrait), c'est le cas de toutes les photos de ce site.",
    tipEn: 'Tip: for a crisp result, always pick a vertical (portrait) file, all photos on this site are already in that format.',
  },

  'fond-decran-android': {
    titleFr: "Comment mettre une photo en fond d'écran sur Android",
    titleEn: 'How to set a photo as wallpaper on Android',
    descriptionFr:
      "Guide pas à pas pour installer un fond d'écran haute résolution sur Android, écran verrouillé et écran d'accueil.",
    descriptionEn:
      'Step-by-step guide to set a high-resolution wallpaper on Android, lock screen and home screen.',
    ledeFr: 'La marche à suivre est presque identique sur tous les téléphones Android.',
    ledeEn: 'The steps are nearly identical across Android phones.',
    steps: [
      {
        fr: "Téléchargez le fichier après votre achat (lien reçu par e-mail), il est enregistré dans votre galerie photo.",
        en: 'Download the file after purchase (link sent by email), it is saved to your photo gallery.',
      },
      {
        fr: "Ouvrez la photo dans votre application Galerie ou Photos.",
        en: 'Open the photo in your Gallery or Photos app.',
      },
      {
        fr: "Appuyez sur le menu (icône ⋮ ou Partager), puis sur Définir comme fond d'écran.",
        en: 'Tap the menu (⋮ icon or Share), then Set as wallpaper.',
      },
      {
        fr: "Choisissez écran verrouillé, écran d'accueil, ou les deux, ajustez le cadrage, puis validez.",
        en: 'Choose lock screen, home screen, or both, adjust the crop, then confirm.',
      },
    ],
    tipFr: "Astuce : sur certains téléphones (Samsung, Pixel), le raccourci se trouve aussi dans Réglages > Fond d'écran et style.",
    tipEn: 'Tip: on some phones (Samsung, Pixel), the shortcut is also in Settings > Wallpaper and style.',
  },
};

const ALL_SLUGS = Object.keys(GUIDES) as GuideSlug[];

function getGuide(slug: string): GuideDef | null {
  return GUIDES[slug as GuideSlug] ?? null;
}

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  const locales = ['fr', 'en'];
  return ALL_SLUGS.flatMap((slug) => locales.map((locale) => ({ locale, slug })));
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const guide = getGuide(params.slug);
  if (!guide) return {};
  const isEn = params.locale === 'en';
  return {
    title: isEn ? guide.titleEn : guide.titleFr,
    description: isEn ? guide.descriptionEn : guide.descriptionFr,
    alternates: {
      canonical: `/${params.locale}/guide/${params.slug}`,
      languages: {
        fr: `/fr/guide/${params.slug}`,
        en: `/en/guide/${params.slug}`,
      },
    },
    openGraph: {
      title: isEn ? guide.titleEn : guide.titleFr,
      description: isEn ? guide.descriptionEn : guide.descriptionFr,
      type: 'article',
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function GuidePage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const guide = getGuide(params.slug);
  if (!guide) notFound();

  const isEn = params.locale === 'en';
  const locale = params.locale;
  const title = isEn ? guide.titleEn : guide.titleFr;
  const lede = isEn ? guide.ledeEn : guide.ledeFr;
  const tip = isEn ? guide.tipEn : guide.tipFr;

  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description: isEn ? guide.descriptionEn : guide.descriptionFr,
    step: guide.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: isEn ? s.en : s.fr,
    })),
  };

  return (
    <article className="py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <Container size="narrow">
        <Link
          href={`/${locale}/gallery`}
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {isEn ? 'All photos' : 'Toutes les photos'}
        </Link>

        <p className="text-sm text-ink-muted uppercase tracking-widest mb-3">
          {isEn ? 'Guide' : 'Guide'}
        </p>
        <h1 className="text-display-xl font-display text-ink">{title}</h1>
        <p className="text-lg text-ink-muted mt-4">{lede}</p>

        <ol className="mt-10 space-y-6">
          {guide.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper-cool text-sm font-semibold text-ink">
                {i + 1}
              </span>
              <p className="text-base text-ink pt-1">{isEn ? step.en : step.fr}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 border border-line bg-paper-warm p-5 text-sm text-ink-muted">
          {tip}
        </div>

        <div className="mt-14 border-t border-line pt-10">
          <p className="text-lg font-display text-ink mb-4">
            {isEn ? 'Find your next wallpaper' : 'Trouver votre prochain fond d\'écran'}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href={`/${locale}/collection/fonds-decran-mer`} className="text-accent hover:underline">
              {isEn ? 'Sea wallpapers' : "Fonds d'écran mer"}
            </Link>
            <Link href={`/${locale}/collection/fonds-decran-montagne`} className="text-accent hover:underline">
              {isEn ? 'Mountain wallpapers' : "Fonds d'écran montagne"}
            </Link>
            <Link href={`/${locale}/collection/fonds-decran-tropical`} className="text-accent hover:underline">
              {isEn ? 'Tropical wallpapers' : "Fonds d'écran tropicaux"}
            </Link>
            <Link href={`/${locale}/gallery`} className="text-accent hover:underline">
              {isEn ? 'All photos' : 'Toutes les photos'}
            </Link>
          </div>
        </div>
      </Container>
    </article>
  );
}

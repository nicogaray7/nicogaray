import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { r2PublicUrl } from '@/lib/r2';
import { ProtectedImg } from '@/components/ProtectedImg';
import { Logo } from '@/components/layout/Logo';

export const revalidate = 60;

async function getFeaturedPhotos() {
  try {
    return await prisma.photo.findMany({
      where: { published: true, featured: true },
      orderBy: [{ takenAt: 'desc' }, { createdAt: 'desc' }],
      take: 6,
    });
  } catch {
    return [];
  }
}

const HERO_SLUG = 'photographie-n-182';

async function getHeroPhoto() {
  try {
    const pinned = await prisma.photo.findUnique({
      where: { slug: HERO_SLUG },
    });
    if (pinned && pinned.published) return pinned;
    // Fallback to most recent featured landscape
    return await prisma.photo.findFirst({
      where: { published: true, featured: true, orientation: 'landscape' },
      orderBy: [{ takenAt: 'desc' }, { createdAt: 'desc' }],
    });
  } catch {
    return null;
  }
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const [featured, hero] = await Promise.all([getFeaturedPhotos(), getHeroPhoto()]);

  return (
    <>
      <Hero hero={hero} />
      <FeaturedSection photos={featured} locale={params.locale} />
      <AboutTeaser locale={params.locale} />
    </>
  );
}

function Hero({ hero }: { hero: Awaited<ReturnType<typeof getHeroPhoto>> }) {
  const t = useTranslations('home');
  const heroUrl = hero ? r2PublicUrl(hero.previewKey) : null;

  return (
    <section className="relative min-h-[90vh] flex items-end overflow-hidden bg-ink">
      {heroUrl && (
        <ProtectedImg
          src={heroUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

      <Container className="relative z-10 pb-16 sm:pb-24">
        <div className="max-w-3xl space-y-6 text-paper">
          <h1 className="animate-fade-up">
            <Logo as="span" size="xl" variant="light" />
          </h1>
          <p className="font-sans text-lg sm:text-2xl text-paper/90 leading-snug max-w-xl animate-fade-up" style={{ animationDelay: '100ms' }}>
            {t('subtitle')}
          </p>
          <div className="pt-4 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 px-6 py-3 bg-paper text-ink text-xs tracking-[0.18em] uppercase hover:bg-accent hover:text-paper transition-colors"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FeaturedSection({ photos, locale }: { photos: Awaited<ReturnType<typeof getFeaturedPhotos>>; locale: string }) {
  const t = useTranslations('home.featured');
  if (photos.length === 0) return null;
  return (
    <section className="py-16 sm:py-24">
      <Container size="wide">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="text-display-lg font-display text-ink">{t('title')}</h2>
          </div>
          <Link
            href={`/${locale}/gallery`}
            className="group inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent transition-colors"
          >
            {t('cta')}
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {photos.map((p, i) => (
            <PhotoCard key={p.id} photo={p} locale={locale} priority={i < 3} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function AboutTeaser({ locale }: { locale: string }) {
  const t = useTranslations('home.about');
  return (
    <section className="py-20 sm:py-28 border-t border-line">
      <Container>
        <div className="max-w-2xl space-y-5">
          <h2 className="text-display-lg font-display text-ink">{t('title')}</h2>
          <p className="prose-feed text-lg">{t('text1')}</p>
          <p className="prose-feed text-lg">{t('text2')}</p>
          <div className="pt-2">
            <Link
              href={`/${locale}/about`}
              className="group inline-flex items-center gap-2 text-sm text-accent hover:text-ink transition-colors"
            >
              {t('cta')}
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

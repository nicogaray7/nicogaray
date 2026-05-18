import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { PhotoCard } from '@/components/gallery/PhotoCard';

export const revalidate = 60;

async function getFeaturedPhotos() {
  try {
    return await prisma.photo.findMany({
      where: { published: true, featured: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const featured = await getFeaturedPhotos();

  return (
    <>
      <Hero />
      <FeaturedSection photos={featured} locale={params.locale} />
      <AboutTeaser locale={params.locale} />
      <ShopBlock locale={params.locale} />
    </>
  );
}

function Hero() {
  const t = useTranslations('home');
  return (
    <section className="relative min-h-[88vh] flex items-end overflow-hidden">
      <div className="absolute inset-0 bg-paper-warm" />
      <Container className="relative z-10 pb-20 sm:pb-28">
        <div className="max-w-2xl space-y-6">
          <p className="eyebrow animate-fade-up">{t('tagline')}</p>
          <h1 className="text-display-2xl font-display text-ink animate-fade-up" style={{ animationDelay: '100ms' }}>
            {t('title')}
          </h1>
          <p className="text-lg sm:text-xl text-ink-soft leading-relaxed max-w-lg animate-fade-up" style={{ animationDelay: '200ms' }}>
            {t('subtitle')}
          </p>
          <div className="pt-4 animate-fade-up" style={{ animationDelay: '300ms' }}>
            <CtaLink href="/gallery" label={t('cta')} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function CtaLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-3 text-[11px] tracking-widest uppercase text-accent hover:text-ink transition-colors duration-300"
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
    </Link>
  );
}

function FeaturedSection({ photos, locale }: { photos: Awaited<ReturnType<typeof getFeaturedPhotos>>; locale: string }) {
  const t = useTranslations('home.featured');
  return (
    <section className="py-24 sm:py-32 bg-paper">
      <Container>
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <div>
            <p className="eyebrow mb-3 text-accent">{t('eyebrow')}</p>
            <h2 className="text-display-lg font-display text-ink">{t('title')}</h2>
          </div>
          <Link
            href={`/${locale}/gallery`}
            className="hidden sm:inline-flex group items-center gap-2 text-[11px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors"
          >
            {t('cta')}
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {photos.length === 0 ? (
          <div className="border border-dashed border-line py-32 text-center">
            <p className="caption">No featured photos yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {photos.map((p) => (
              <PhotoCard key={p.id} photo={p} locale={locale} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

function AboutTeaser({ locale }: { locale: string }) {
  const t = useTranslations('home.about');
  return (
    <section className="py-24 sm:py-32 bg-paper-cool">
      <Container size="narrow">
        <div className="text-center space-y-6">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="text-display-lg font-display text-ink">{t('title')}</h2>
          <div className="prose-editorial space-y-4">
            <p>{t('text1')}</p>
            <p>{t('text2')}</p>
          </div>
          <div className="pt-2">
            <CtaLink href={`/${locale}/about`} label={t('cta')} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function ShopBlock({ locale }: { locale: string }) {
  const t = useTranslations('home.shopBlock');
  return (
    <section className="py-24 sm:py-32 bg-paper">
      <Container size="narrow">
        <div className="text-center space-y-8">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h2 className="text-display-lg font-display text-ink">{t('title')}</h2>
          <p className="prose-editorial">{t('text')}</p>
          <div className="pt-4">
            <Link
              href={`/${locale}/gallery`}
              className="inline-block px-9 py-3.5 bg-ink text-paper text-[11px] tracking-widest uppercase hover:bg-accent transition-colors duration-300"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

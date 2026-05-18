import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { prisma } from '@/lib/prisma';

export const revalidate = 60;

async function getCountry(code: string) {
  return prisma.country.findUnique({ where: { code: code.toUpperCase() } });
}

async function getPhotosForCountry(code: string) {
  return prisma.photo.findMany({
    where: { published: true, countryCode: code.toUpperCase() },
    orderBy: [{ takenAt: 'desc' }, { createdAt: 'desc' }],
  });
}

export async function generateMetadata({ params }: { params: { locale: string; code: string } }) {
  const country = await getCountry(params.code);
  if (!country) return {};
  const name = params.locale === 'en' ? country.nameEn : country.nameFr;
  return { title: name, description: params.locale === 'en' ? country.introEn : country.intro };
}

export default async function CountryPage({ params }: { params: { locale: string; code: string } }) {
  setRequestLocale(params.locale);
  const country = await getCountry(params.code);
  if (!country) notFound();
  const photos = await getPhotosForCountry(params.code);
  return <CountryView country={country} photos={photos} locale={params.locale} />;
}

function CountryView({
  country,
  photos,
  locale,
}: {
  country: NonNullable<Awaited<ReturnType<typeof getCountry>>>;
  photos: Awaited<ReturnType<typeof getPhotosForCountry>>;
  locale: string;
}) {
  const tCommon = useTranslations('common');
  const name = locale === 'en' ? country.nameEn : country.nameFr;
  const intro = locale === 'en' && country.introEn ? country.introEn : country.intro;

  return (
    <article>
      <section className="pt-12 pb-10 sm:pt-16 sm:pb-14">
        <Container size="wide">
          <Link
            href={`/${locale}/map`}
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === 'en' ? 'World map' : 'Carte du monde'}
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-paper-cool text-2xl">
                {flagEmoji(country.code)}
              </span>
              <p className="text-sm text-ink-muted">
                <MapPin className="inline w-3.5 h-3.5 mr-1" />
                {country.code}
              </p>
            </div>
            <h1 className="text-display-xl font-display text-ink">{name}</h1>
            {intro && (
              <div className="prose-feed text-lg mt-6 whitespace-pre-line">{intro}</div>
            )}
            <p className="text-sm text-ink-muted mt-6">
              {photos.length} {locale === 'en' ? (photos.length === 1 ? 'photo' : 'photos') : photos.length === 1 ? 'photo' : 'photos'}
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container size="wide">
          {photos.length === 0 ? (
            <div className="border border-dashed border-line py-32 text-center">
              <p className="caption">{locale === 'en' ? 'No photos yet from this country.' : 'Aucune photo pour ce pays pour l\'instant.'}</p>
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

function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  const base = 0x1F1E6;
  const A = 'A'.charCodeAt(0);
  return String.fromCodePoint(base + code.charCodeAt(0) - A, base + code.charCodeAt(1) - A);
}

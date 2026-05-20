import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { FilterBar } from '@/components/gallery/FilterBar';
import { GalleryTracker } from '@/components/gallery/GalleryTracker';
import { COUNTRY_NAMES } from '@/lib/country-names';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface GallerySearchParams {
  country?: string;
  orientation?: string;
}

async function getCountries(locale: string) {
  try {
    const rows = await prisma.photo.findMany({
      where: { published: true, country: { not: null } },
      select: { country: true, countryCode: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    });
    return rows
      .filter((r) => r.country)
      .map((r) => {
        const meta = r.countryCode ? COUNTRY_NAMES[r.countryCode.toUpperCase()] : null;
        const label = meta ? (locale === 'en' ? meta.en : meta.fr) : r.country!;
        return { value: r.country!, label };
      })
      .sort((a, b) => a.label.localeCompare(b.label));
  } catch {
    return [];
  }
}

async function getPhotos(params: GallerySearchParams) {
  try {
    const where: Prisma.PhotoWhereInput = { published: true };
    if (params.country) where.country = params.country;
    if (params.orientation) where.orientation = params.orientation;

    const orderBy: Prisma.PhotoOrderByWithRelationInput[] = [{ takenAt: 'desc' }, { createdAt: 'desc' }];

    return await prisma.photo.findMany({ where, orderBy });
  } catch {
    return [];
  }
}

export default async function GalleryPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: GallerySearchParams;
}) {
  setRequestLocale(params.locale);
  const [photos, countries] = await Promise.all([getPhotos(searchParams), getCountries(params.locale)]);
  return <GalleryView photos={photos} countries={countries} locale={params.locale} />;
}

function GalleryView({
  photos,
  countries,
  locale,
}: {
  photos: Awaited<ReturnType<typeof getPhotos>>;
  countries: Awaited<ReturnType<typeof getCountries>>;
  locale: string;
}) {
  const t = useTranslations('gallery');
  return (
    <>
      <section className="pt-16 pb-10 sm:pt-24 sm:pb-14">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-display-xl font-display text-ink">{t('title')}</h1>
            <p className="prose-feed text-ink-muted mt-4">{t('subtitle')}</p>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container size="wide">
          <FilterBar countries={countries} total={photos.length} />
          {photos.length === 0 ? (
            <div className="border border-dashed border-line py-32 text-center">
              <p className="caption">{t('empty')}</p>
            </div>
          ) : (
            <>
              <GalleryTracker photos={photos} listId="gallery" listName="Gallery" />
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 [column-fill:_balance]">
                {photos.map((p, i) => (
                  <div key={p.id} className="mb-6 sm:mb-8 break-inside-avoid">
                    <PhotoCard
                      photo={p}
                      locale={locale}
                      priority={i < 4}
                      index={i}
                      listId="gallery"
                      listName="Gallery"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>
    </>
  );
}

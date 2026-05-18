import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { FilterBar } from '@/components/gallery/FilterBar';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface GallerySearchParams {
  country?: string;
  orientation?: string;
  sort?: string;
}

async function getCountries() {
  try {
    const rows = await prisma.photo.findMany({
      where: { published: true, country: { not: null } },
      select: { country: true },
      distinct: ['country'],
      orderBy: { country: 'asc' },
    });
    return rows.map((r) => r.country!).filter(Boolean);
  } catch {
    return [];
  }
}

async function getPhotos(params: GallerySearchParams) {
  try {
    const where: Prisma.PhotoWhereInput = { published: true };
    if (params.country) where.country = params.country;
    if (params.orientation) where.orientation = params.orientation;

    const orderBy: Prisma.PhotoOrderByWithRelationInput[] =
      params.sort === 'priceAsc'
        ? [{ price: 'asc' }, { createdAt: 'desc' }]
        : params.sort === 'priceDesc'
          ? [{ price: 'desc' }, { createdAt: 'desc' }]
          : [{ sortOrder: 'asc' }, { createdAt: 'desc' }];

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
  const [photos, countries] = await Promise.all([getPhotos(searchParams), getCountries()]);
  return <GalleryView photos={photos} countries={countries} locale={params.locale} />;
}

function GalleryView({
  photos,
  countries,
  locale,
}: {
  photos: Awaited<ReturnType<typeof getPhotos>>;
  countries: string[];
  locale: string;
}) {
  const t = useTranslations('gallery');
  return (
    <>
      <section className="py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl space-y-6">
            <p className="eyebrow text-accent">{t('title')}</p>
            <h1 className="text-display-xl font-display text-ink">{t('title')}</h1>
            <p className="prose-editorial">{t('subtitle')}</p>
          </div>
        </Container>
      </section>

      <section className="pb-24">
        <Container>
          <FilterBar countries={countries} total={photos.length} />
          {photos.length === 0 ? (
            <div className="border border-dashed border-line py-32 text-center">
              <p className="caption">{t('empty')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {photos.map((p, i) => (
                <PhotoCard key={p.id} photo={p} locale={locale} priority={i < 3} />
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

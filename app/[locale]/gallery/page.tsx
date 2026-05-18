import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { PhotoCard } from '@/components/gallery/PhotoCard';

export const revalidate = 60;

async function getPhotos() {
  try {
    return await prisma.photo.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  } catch {
    return [];
  }
}

export default async function GalleryPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const photos = await getPhotos();
  return <GalleryView photos={photos} locale={params.locale} />;
}

function GalleryView({
  photos,
  locale,
}: {
  photos: Awaited<ReturnType<typeof getPhotos>>;
  locale: string;
}) {
  const t = useTranslations('gallery');
  return (
    <>
      <section className="py-24 sm:py-32 border-b border-line">
        <Container>
          <div className="max-w-2xl space-y-6">
            <p className="eyebrow text-accent">{t('title')}</p>
            <h1 className="text-display-xl font-display text-ink">{t('title')}</h1>
            <p className="prose-editorial">{t('subtitle')}</p>
            <p className="caption">{t('results', { count: photos.length })}</p>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
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

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Camera, Aperture } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2';
import { formatPrice } from '@/lib/utils';

export const revalidate = 60;

async function getPhoto(slug: string) {
  try {
    return await prisma.photo.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

async function getRelated(currentId: string, country: string | null) {
  try {
    return await prisma.photo.findMany({
      where: {
        published: true,
        NOT: { id: currentId },
        ...(country ? { country } : {}),
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      take: 3,
    });
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }) {
  const photo = await getPhoto(params.slug);
  if (!photo) return {};
  const title = params.locale === 'en' && photo.titleEn ? photo.titleEn : photo.title;
  const description =
    (params.locale === 'en' && photo.descriptionEn) ||
    photo.description ||
    [photo.city, photo.country].filter(Boolean).join(', ') ||
    title;
  return { title, description };
}

export default async function PhotoPage({ params }: { params: { locale: string; slug: string } }) {
  setRequestLocale(params.locale);
  const photo = await getPhoto(params.slug);
  if (!photo) notFound();

  const related = await getRelated(photo.id, photo.country);
  return <PhotoView photo={photo} related={related} locale={params.locale} />;
}

function PhotoView({
  photo,
  related,
  locale,
}: {
  photo: NonNullable<Awaited<ReturnType<typeof getPhoto>>>;
  related: Awaited<ReturnType<typeof getRelated>>;
  locale: string;
}) {
  const t = useTranslations('photo');
  const tCommon = useTranslations('common');

  const title = locale === 'en' && photo.titleEn ? photo.titleEn : photo.title;
  const description =
    locale === 'en' && photo.descriptionEn ? photo.descriptionEn : photo.description;
  const story = locale === 'en' && photo.storyEn ? photo.storyEn : photo.story;
  const location = [photo.city, photo.country].filter(Boolean).join(', ');
  const previewUrl = r2PublicUrl(photo.previewKey) ?? '';
  const formattedPrice = formatPrice(photo.price, photo.currency, locale === 'en' ? 'en-GB' : 'fr-FR');

  const dateFmt = photo.takenAt
    ? new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
        year: 'numeric',
        month: 'long',
      }).format(photo.takenAt)
    : null;

  return (
    <article>
      {/* Editorial header */}
      <header className="py-12 sm:py-16 border-b border-line">
        <Container size="narrow">
          <Link
            href={`/${locale}/gallery`}
            className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors mb-10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {tCommon('back')}
          </Link>
          <div className="space-y-6">
            {location && (
              <p className="eyebrow text-accent">{location}</p>
            )}
            <h1 className="text-display-xl font-display text-ink">{title}</h1>
            {description && (
              <p className="text-xl font-display text-ink-soft leading-snug max-w-xl">{description}</p>
            )}
          </div>
        </Container>
      </header>

      {/* Full-bleed image */}
      <section className="py-12 sm:py-16 bg-paper-warm">
        <Container size="wide">
          <div className="relative w-full bg-paper-dark">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt={title}
                className="w-full h-auto block"
              />
            ) : (
              <div className="aspect-[3/2] flex items-center justify-center text-ink-dim">No preview</div>
            )}
          </div>
          {description && (
            <p className="caption mt-4 text-center italic">{description}</p>
          )}
        </Container>
      </section>

      {/* Story + buy column */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-7 space-y-10">
              {story && (
                <div>
                  <p className="eyebrow mb-5 text-accent">{t('story')}</p>
                  <div className="prose-editorial space-y-5 whitespace-pre-line">{story}</div>
                </div>
              )}

              <div className="border-t border-line pt-10 space-y-5">
                <p className="eyebrow text-accent">{t('details')}</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  {location && (
                    <DetailRow icon={<MapPin className="w-3.5 h-3.5" />} label={t('location')} value={location} />
                  )}
                  {dateFmt && (
                    <DetailRow icon={<Calendar className="w-3.5 h-3.5" />} label={t('date')} value={dateFmt} />
                  )}
                  {photo.camera && (
                    <DetailRow icon={<Camera className="w-3.5 h-3.5" />} label={t('camera')} value={photo.camera} />
                  )}
                  {photo.lens && (
                    <DetailRow icon={<Aperture className="w-3.5 h-3.5" />} label={t('lens')} value={photo.lens} />
                  )}
                  {(photo.focalLength || photo.aperture || photo.shutterSpeed || photo.iso) && (
                    <DetailRow
                      icon={<Aperture className="w-3.5 h-3.5" />}
                      label={t('settings')}
                      value={[
                        photo.focalLength,
                        photo.aperture,
                        photo.shutterSpeed,
                        photo.iso ? `ISO ${photo.iso}` : null,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    />
                  )}
                </dl>
              </div>
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-28 self-start">
              <div className="bg-paper-cool p-8 sm:p-10 border border-line space-y-6">
                <p className="eyebrow text-accent">{t('buyTitle')}</p>
                <p className="prose-editorial text-base">{t('buyDescription')}</p>
                <div className="border-t border-line pt-6 space-y-3">
                  <p className="text-3xl font-display text-ink">{formattedPrice}</p>
                  <p className="caption">{t('license')}</p>
                  <p className="caption">{t('fees')}</p>
                  <p className="caption">{t('expiry')}</p>
                </div>
                <Link
                  href={`/${locale}/checkout/${photo.id}`}
                  className="inline-flex items-center justify-center w-full px-9 py-4 bg-ink text-paper text-[11px] tracking-widest uppercase hover:bg-accent transition-colors duration-300 gap-3 group"
                >
                  {t('buyCta', { price: formattedPrice })}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-20 sm:py-24 border-t border-line bg-paper-cool">
          <Container>
            <p className="eyebrow text-accent mb-8">More from this journey</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {related.map((p) => (
                <PhotoCard key={p.id} photo={p} locale={locale} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase text-ink-muted">
        {icon}
        {label}
      </dt>
      <dd className="text-ink-soft text-sm">{value}</dd>
    </div>
  );
}

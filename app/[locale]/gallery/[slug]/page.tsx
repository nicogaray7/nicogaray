import Link from 'next/link';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { ArrowLeft, MapPin, Calendar, Camera, Aperture } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { PhotoPageTracker } from '@/components/gallery/PhotoPageTracker';
import { BuyButton } from '@/components/gallery/BuyButton';
import { PhotoNav } from '@/components/gallery/PhotoNav';
import { PhotoImageSwipe } from '@/components/gallery/PhotoImageSwipe';
import { ProtectedImg } from '@/components/ProtectedImg';
import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2';
import { formatPrice, slugify } from '@/lib/utils';
import { COUNTRY_NAMES } from '@/lib/country-names';

export const revalidate = 60;

async function getPhoto(slug: string) {
  try {
    return await prisma.photo.findUnique({ where: { slug } });
  } catch {
    return null;
  }
}

async function getSiblings(slug: string) {
  try {
    const rows = await prisma.photo.findMany({
      where: { published: true },
      orderBy: [{ takenAt: 'desc' }, { createdAt: 'desc' }],
      select: { slug: true },
    });
    const slugs = rows.map((r) => r.slug);
    const i = slugs.indexOf(slug);
    if (i === -1 || slugs.length < 2) return null;
    const prevSlug = slugs[(i - 1 + slugs.length) % slugs.length];
    const nextSlug = slugs[(i + 1) % slugs.length];
    return { prevSlug, nextSlug };
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
      orderBy: [{ takenAt: 'desc' }, { createdAt: 'desc' }],
      take: 4,
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

  const [related, siblings] = await Promise.all([
    getRelated(photo.id, photo.country),
    getSiblings(photo.slug),
  ]);
  return <PhotoView photo={photo} related={related} siblings={siblings} locale={params.locale} />;
}

function PhotoView({
  photo,
  related,
  siblings,
  locale,
}: {
  photo: NonNullable<Awaited<ReturnType<typeof getPhoto>>>;
  related: Awaited<ReturnType<typeof getRelated>>;
  siblings: Awaited<ReturnType<typeof getSiblings>>;
  locale: string;
}) {
  const t = useTranslations('photo');
  const tCommon = useTranslations('common');

  const title = locale === 'en' && photo.titleEn ? photo.titleEn : photo.title;
  const description = locale === 'en' && photo.descriptionEn ? photo.descriptionEn : photo.description;
  const story = locale === 'en' && photo.storyEn ? photo.storyEn : photo.story;
  const countryName = photo.countryCode && COUNTRY_NAMES[photo.countryCode]
    ? COUNTRY_NAMES[photo.countryCode][locale === 'en' ? 'en' : 'fr']
    : photo.country;
  const location = [photo.city, countryName].filter(Boolean).join(', ');
  const previewUrl = r2PublicUrl(photo.previewKey) ?? '';
  const intl = locale === 'en' ? 'en-GB' : 'fr-FR';
  const formattedPrice = formatPrice(photo.price, photo.currency, intl);
  const dateFmt = photo.takenAt
    ? new Intl.DateTimeFormat(intl, { year: 'numeric', month: 'long' }).format(photo.takenAt)
    : null;

  return (
    <article>
      <PhotoPageTracker
        photo={{
          id: photo.id,
          slug: photo.slug,
          title,
          price: photo.price,
          currency: photo.currency,
          country: photo.country,
          city: photo.city,
          orientation: photo.orientation,
        }}
      />
      {/* Full-bleed image dominates the page */}
      <section className="bg-paper-cool">
        <Container size="wide">
          <div className="pt-6 sm:pt-8 pb-4">
            <Link
              href={`/${locale}/gallery`}
              className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-accent transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {tCommon('back')}
            </Link>
          </div>
          {siblings ? (
            <PhotoImageSwipe
              prevSlug={siblings.prevSlug}
              nextSlug={siblings.nextSlug}
              locale={locale}
              className="relative w-full bg-ink"
            >
              {previewUrl ? (
                <ProtectedImg src={previewUrl} alt={title} className="w-full h-auto block max-h-[88vh] object-contain mx-auto" />
              ) : (
                <div className="aspect-[3/2] flex items-center justify-center text-ink-dim">No preview</div>
              )}
              <PhotoNav
                prevSlug={siblings.prevSlug}
                nextSlug={siblings.nextSlug}
                locale={locale}
                variant="side"
              />
            </PhotoImageSwipe>
          ) : (
            <div className="relative w-full bg-ink">
              {previewUrl ? (
                <ProtectedImg src={previewUrl} alt={title} className="w-full h-auto block max-h-[88vh] object-contain mx-auto" />
              ) : (
                <div className="aspect-[3/2] flex items-center justify-center text-ink-dim">No preview</div>
              )}
            </div>
          )}
          {siblings && (
            <PhotoNav
              prevSlug={siblings.prevSlug}
              nextSlug={siblings.nextSlug}
              locale={locale}
              variant="bar"
            />
          )}
        </Container>
      </section>

      {/* Meta + buy */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-7 space-y-8">
              <header className="space-y-3">
                {(photo.countryCode || photo.country) && (
                  <Link
                    href={`/${locale}/country/${photo.countryCode ?? slugify(photo.country ?? '')}`}
                    className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-ink transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {location || countryName}
                  </Link>
                )}
                <h1 className="text-display-lg font-display text-ink">{title}</h1>
                {dateFmt && <p className="text-sm text-ink-muted">{dateFmt}</p>}
                {description && <p className="prose-feed text-lg pt-2">{description}</p>}
              </header>

              {story && (
                <div className="border-t border-line pt-8">
                  <div className="prose-feed whitespace-pre-line">{story}</div>
                </div>
              )}

              {(photo.camera || photo.lens || photo.focalLength || photo.iso) && (
                <div className="border-t border-line pt-8">
                  <p className="text-sm text-ink-muted mb-3">{t('details')}</p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
                    {photo.camera && <Detail icon={<Camera className="w-3.5 h-3.5" />} value={photo.camera} />}
                    {photo.lens && <Detail icon={<Aperture className="w-3.5 h-3.5" />} value={photo.lens} />}
                    {(photo.focalLength || photo.aperture || photo.shutterSpeed || photo.iso) && (
                      <Detail
                        icon={<Calendar className="w-3.5 h-3.5" />}
                        value={[photo.focalLength, photo.aperture, photo.shutterSpeed, photo.iso ? `ISO ${photo.iso}` : null].filter(Boolean).join(' · ')}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-24 self-start">
              <div className="bg-paper-warm p-6 sm:p-8 space-y-5 border border-line">
                <p className="text-2xl font-display text-ink">{formattedPrice}</p>
                <p className="text-sm text-ink-soft">{t('buyDescription')}</p>
                <ul className="text-xs text-ink-muted space-y-1.5">
                  <li>· {t('license')}</li>
                  <li>· {t('expiry')}</li>
                </ul>
                <BuyButton
                  href={`/${locale}/checkout/${photo.id}`}
                  label={t('buyCta', { price: formattedPrice })}
                  photo={{
                    id: photo.id,
                    slug: photo.slug,
                    title,
                    price: photo.price,
                    currency: photo.currency,
                    country: photo.country,
                    city: photo.city,
                    orientation: photo.orientation,
                  }}
                />
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="py-16 border-t border-line bg-paper-warm">
          <Container size="wide">
            <h2 className="text-display-lg font-display text-ink mb-8">
              {photo.country ? `${photo.country}` : 'Plus'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
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

function Detail({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {value}
    </span>
  );
}

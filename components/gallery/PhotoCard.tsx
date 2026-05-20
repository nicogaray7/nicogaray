'use client';
import Link from 'next/link';
import type { Photo } from '@prisma/client';
import { r2PublicUrl } from '@/lib/r2';
import { cn } from '@/lib/utils';
import { ProtectedImg } from '@/components/ProtectedImg';
import { COUNTRY_NAMES } from '@/lib/country-names';
import { track, toItem } from '@/lib/analytics';

export function PhotoCard({
  photo,
  locale,
  priority = false,
  showMeta = true,
  index,
  listId = 'gallery',
  listName = 'Gallery',
}: {
  photo: Photo;
  locale: string;
  priority?: boolean;
  showMeta?: boolean;
  index?: number;
  listId?: string;
  listName?: string;
}) {
  const thumbUrl = r2PublicUrl(photo.previewKey) ?? '';
  const title = locale === 'en' && photo.titleEn ? photo.titleEn : photo.title;
  const countryName = photo.countryCode && COUNTRY_NAMES[photo.countryCode]
    ? COUNTRY_NAMES[photo.countryCode][locale === 'en' ? 'en' : 'fr']
    : photo.country;
  const location = [photo.city, countryName].filter(Boolean).join(', ');
  const date = photo.takenAt
    ? new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', {
        month: 'short',
        year: 'numeric',
      }).format(photo.takenAt)
    : null;

  // Use the photo's true aspect ratio so the masonry grid has no empty gaps
  const aspectRatio = photo.width && photo.height ? `${photo.width} / ${photo.height}` : '3 / 2';

  return (
    <Link
      href={`/${locale}/gallery/${photo.slug}`}
      className="group block"
      onClick={() => track.selectItem(listId, listName, toItem(photo, index))}
    >
      <div
        className={cn('relative w-full overflow-hidden bg-paper-cool')}
        style={{ aspectRatio }}
      >
        {thumbUrl ? (
          <ProtectedImg
            src={thumbUrl}
            alt={title}
            loading={priority ? 'eager' : 'lazy'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-dim text-xs">
            No image
          </div>
        )}
      </div>

      {showMeta && (
        <div className="pt-3 pb-1 min-w-0">
          <p className="text-[15px] text-ink truncate group-hover:text-accent transition-colors">
            {location || title}
          </p>
          {date && <p className="text-xs text-ink-dim mt-0.5">{date}</p>}
        </div>
      )}
    </Link>
  );
}

import Link from 'next/link';
import type { Photo } from '@prisma/client';
import { r2PublicUrl } from '@/lib/r2';
import { cn } from '@/lib/utils';

export function PhotoCard({
  photo,
  locale,
  priority = false,
}: {
  photo: Photo;
  locale: string;
  priority?: boolean;
}) {
  const thumbUrl = r2PublicUrl(photo.thumbKey) ?? '';
  const title = locale === 'en' && photo.titleEn ? photo.titleEn : photo.title;
  const location = [photo.city, photo.country].filter(Boolean).join(', ');

  return (
    <Link
      href={`/${locale}/gallery/${photo.slug}`}
      className="group block bg-paper-warm overflow-hidden"
    >
      <div
        className={cn(
          'relative w-full overflow-hidden bg-paper-dark',
          photo.orientation === 'portrait' && 'aspect-[3/4]',
          photo.orientation === 'square' && 'aspect-square',
          photo.orientation === 'landscape' && 'aspect-[4/3]',
        )}
      >
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={title}
            loading={priority ? 'eager' : 'lazy'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-ink-dim text-xs">
            No image
          </div>
        )}
      </div>

      <div className="pt-4 pb-2 flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="font-display text-base text-ink leading-snug">{title}</p>
          {location && <p className="caption">{location}</p>}
        </div>
        <p className="text-[10px] tracking-widest uppercase text-ink-muted whitespace-nowrap mt-1">
          {photo.price === 0 ? 'Free' : `${photo.price} ${photo.currency}`}
        </p>
      </div>
    </Link>
  );
}

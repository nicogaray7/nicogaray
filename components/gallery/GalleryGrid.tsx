'use client';

import { useState } from 'react';
import type { Photo } from '@prisma/client';
import { PhotoCard } from '@/components/gallery/PhotoCard';
import { GalleryLightbox, type LightboxPhoto } from '@/components/gallery/GalleryLightbox';

interface Props {
  photos: Photo[];
  lightboxPhotos: LightboxPhoto[];
  locale: string;
}

export function GalleryGrid({ photos, lightboxPhotos, locale }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleOpen = (e: React.MouseEvent, index: number) => {
    // Let modified clicks through (new tab, middle-click) and right-click.
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    setOpenIndex(index);
  };

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-3 xl:columns-4 gap-3 sm:gap-5 [column-fill:_balance]">
        {photos.map((p, i) => (
          <div
            key={p.id}
            className="mb-3 sm:mb-5 break-inside-avoid"
            onClickCapture={(e) => handleOpen(e, i)}
          >
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

      {openIndex !== null && (
        <GalleryLightbox
          photos={lightboxPhotos}
          index={openIndex}
          locale={locale}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  );
}

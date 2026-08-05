import type { Photo } from '@prisma/client';
import { PhotoCard } from '@/components/gallery/PhotoCard';

interface Props {
  photos: Photo[];
  locale: string;
  priorityCount?: number;
  columnsClass?: string;
  listId?: string;
  listName?: string;
}

// Same CSS-columns masonry as the main gallery: photos of mixed aspect
// ratios stack without empty gaps. Use this for every public photo grid.
export function MasonryGrid({
  photos,
  locale,
  priorityCount = 0,
  columnsClass = 'columns-2 sm:columns-3 lg:columns-3 xl:columns-4',
  listId = 'gallery',
  listName = 'Gallery',
}: Props) {
  return (
    <div className={`${columnsClass} gap-3 sm:gap-5 [column-fill:_balance]`}>
      {photos.map((p, i) => (
        <div key={p.id} className="mb-3 sm:mb-5 break-inside-avoid">
          <PhotoCard
            photo={p}
            locale={locale}
            priority={i < priorityCount}
            index={i}
            listId={listId}
            listName={listName}
          />
        </div>
      ))}
    </div>
  );
}

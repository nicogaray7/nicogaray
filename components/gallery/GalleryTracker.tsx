'use client';
import { useEffect } from 'react';
import { track, toItem, type PhotoLike } from '@/lib/analytics';

interface Props {
  photos: PhotoLike[];
  listId: string;
  listName: string;
}

/** Fires view_item_list once when the gallery mounts. */
export function GalleryTracker({ photos, listId, listName }: Props) {
  useEffect(() => {
    if (!photos.length) return;
    const items = photos.map((p, i) => toItem(p, i));
    track.viewItemList(listId, listName, items);
  }, [photos, listId, listName]);

  return null;
}

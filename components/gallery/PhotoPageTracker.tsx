'use client';
import { useEffect } from 'react';
import { track, toItem, type PhotoLike } from '@/lib/analytics';

/** Fires view_item on mount for the photo detail page. */
export function PhotoPageTracker({ photo }: { photo: PhotoLike }) {
  useEffect(() => {
    track.viewItem(toItem(photo));
  }, [photo]);
  return null;
}

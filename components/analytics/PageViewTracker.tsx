'use client';
import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { track } from '@/lib/analytics';

/**
 * Fires GA4 page_view on client-side navigation. Next.js does not
 * re-execute the gtag config script on route change, so we forward
 * the new path manually after the initial mount.
 */
export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      // initial page_view is already emitted by the gtag config script
      isFirst.current = false;
      return;
    }
    const qs = searchParams?.toString();
    const path = qs ? `${pathname}?${qs}` : pathname;
    track.pageView(path);
  }, [pathname, searchParams]);

  return null;
}

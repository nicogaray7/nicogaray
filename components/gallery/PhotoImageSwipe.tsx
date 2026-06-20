'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  prevSlug: string;
  nextSlug: string;
  locale: string;
  children: React.ReactNode;
  className?: string;
}

const SWIPE_THRESHOLD = 50;

export function PhotoImageSwipe({ prevSlug, nextSlug, locale, children, className }: Props) {
  const router = useRouter();
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || startY.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    const dy = e.changedTouches[0].clientY - startY.current;
    startX.current = null;
    startY.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) router.push(`/${locale}/gallery/${nextSlug}`);
    else router.push(`/${locale}/gallery/${prevSlug}`);
  };

  return (
    <div className={className} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {children}
    </div>
  );
}

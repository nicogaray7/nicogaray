'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import { ProtectedImg } from '@/components/ProtectedImg';
import { track, toItem } from '@/lib/analytics';

export interface LightboxPhoto {
  id: string;
  slug: string;
  url: string;
  title: string;
  location: string;
  dateLabel: string | null;
  width: number | null;
  height: number | null;
  price: number;
  currency: string;
  country?: string | null;
  city?: string | null;
  orientation?: string | null;
}

interface Props {
  photos: LightboxPhoto[];
  index: number;
  locale: string;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const SWIPE_THRESHOLD = 50;

export function GalleryLightbox({ photos, index, locale, onClose, onIndexChange }: Props) {
  const t = useTranslations('lightbox');
  const total = photos.length;
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const photo = photos[index];

  // view_item à l'ouverture/affichage d'une photo dans le lightbox (1 fois par photo)
  const viewedItems = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!photo || viewedItems.current.has(photo.id)) return;
    viewedItems.current.add(photo.id);
    track.viewItem(
      toItem({
        id: photo.id,
        slug: photo.slug,
        title: photo.title,
        price: photo.price,
        currency: photo.currency,
        country: photo.country ?? null,
        city: photo.city ?? null,
        orientation: photo.orientation ?? null,
      }),
    );
  }, [photo]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + total) % total);
  }, [index, total, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, onClose]);

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Focus management (simple trap: focus close button on open)
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Preload neighbouring images
  useEffect(() => {
    const next = photos[(index + 1) % total];
    const prev = photos[(index - 1 + total) % total];
    [next, prev].forEach((p) => {
      if (p?.url) {
        const img = new Image();
        img.src = p.url;
      }
    });
  }, [index, photos, total]);

  // Track fullscreen state
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      overlayRef.current?.requestFullscreen?.();
    }
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    touchStartX.current = null;
    touchStartY.current = null;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  if (!photo) return null;

  const meta = [photo.location, photo.dateLabel].filter(Boolean).join(' · ');

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={photo.title || photo.location}
      className="fixed inset-0 z-[100] flex flex-col bg-ink/95"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 text-paper">
        <span className="text-sm tabular-nums text-paper/70" aria-live="polite">
          {index + 1} / {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={t('fullscreen')}
            onClick={toggleFullscreen}
            className="flex h-11 w-11 items-center justify-center text-paper/80 transition-colors hover:text-paper"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
          <button
            ref={closeBtnRef}
            type="button"
            aria-label={t('close')}
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-paper/80 transition-colors hover:text-paper"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Image area */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-4"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {total > 1 && (
          <button
            type="button"
            aria-label={t('prev')}
            onClick={goPrev}
            className="absolute left-1 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ink/40 text-paper/90 transition-colors hover:bg-ink/70 hover:text-paper sm:left-4"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
        )}

        {photo.url ? (
          <ProtectedImg
            key={photo.id}
            src={photo.url}
            alt={photo.title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-paper/50">No image</div>
        )}

        {total > 1 && (
          <button
            type="button"
            aria-label={t('next')}
            onClick={goNext}
            className="absolute right-1 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-ink/40 text-paper/90 transition-colors hover:bg-ink/70 hover:text-paper sm:right-4"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        )}
      </div>

      {/* Bottom info bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-4 sm:px-6 text-paper">
        <p className="min-w-0 truncate text-sm text-paper/80">{meta || photo.title}</p>
        <Link
          href={`/${locale}/gallery/${photo.slug}`}
          className="shrink-0 border-b border-paper/40 pb-0.5 text-sm text-paper transition-colors hover:border-paper hover:text-paper"
        >
          {t('viewBuy')}
        </Link>
      </div>
    </div>
  );
}

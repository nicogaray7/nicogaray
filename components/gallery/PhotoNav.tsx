'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  prevSlug: string;
  nextSlug: string;
  locale: string;
  /** 'side' = floating arrows around the image (desktop), 'bar' = buttons below (mobile) */
  variant: 'side' | 'bar';
}

export function PhotoNav({ prevSlug, nextSlug, locale, variant }: Props) {
  const t = useTranslations('photoNav');
  const router = useRouter();

  const prevHref = `/${locale}/gallery/${prevSlug}`;
  const nextHref = `/${locale}/gallery/${nextSlug}`;

  const prevRef = useRef(prevHref);
  const nextRef = useRef(nextHref);
  prevRef.current = prevHref;
  nextRef.current = nextHref;

  // Keyboard navigation (only attach once, on the 'bar' variant to avoid double binding)
  useEffect(() => {
    if (variant !== 'bar') return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') router.push(nextRef.current);
      else if (e.key === 'ArrowLeft') router.push(prevRef.current);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [variant, router]);

  if (variant === 'side') {
    return (
      <>
        <Link
          href={prevHref}
          aria-label={t('prev')}
          className="pointer-events-auto absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/40 text-paper/90 transition-colors hover:bg-ink/70 hover:text-paper lg:flex"
        >
          <ChevronLeft className="h-7 w-7" />
        </Link>
        <Link
          href={nextHref}
          aria-label={t('next')}
          className="pointer-events-auto absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-ink/40 text-paper/90 transition-colors hover:bg-ink/70 hover:text-paper lg:flex"
        >
          <ChevronRight className="h-7 w-7" />
        </Link>
      </>
    );
  }

  return (
    <div className="mt-4 flex items-center justify-between gap-4 lg:hidden">
      <Link
        href={prevHref}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-accent"
      >
        <ChevronLeft className="h-4 w-4" />
        {t('prev')}
      </Link>
      <Link
        href={nextHref}
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-accent"
      >
        {t('next')}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

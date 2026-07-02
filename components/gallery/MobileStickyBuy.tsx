'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { track, toItem, type PhotoLike } from '@/lib/analytics';

interface Props {
  photo: PhotoLike;
  href: string;
  label: string;
}

/**
 * Barre sticky visible seulement sur mobile (< lg) en bas de la page photo.
 * Donne accès au CTA d'achat sans avoir à remonter vers le panneau latéral.
 */
export function MobileStickyBuy({ photo, href, label }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-paper border-t border-line p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      <Link
        href={href}
        onClick={() => track.beginCheckout(toItem(photo))}
        className="inline-flex items-center justify-center w-full gap-2 px-6 py-3.5 bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors group"
      >
        {label}
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

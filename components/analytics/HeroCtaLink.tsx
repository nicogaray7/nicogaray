'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { track } from '@/lib/analytics';

/** CTA "Explorer la galerie" du hero, avec suivi GA4 clic_cta. */
export function HeroCtaLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      onClick={() =>
        track.event('clic_cta', {
          cta_label: label,
          cta_location: 'hero',
          cta_url: href,
        })
      }
      className="inline-flex items-center gap-2 px-6 py-3 bg-paper text-ink text-xs tracking-[0.18em] uppercase hover:bg-accent hover:text-paper transition-colors"
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </Link>
  );
}

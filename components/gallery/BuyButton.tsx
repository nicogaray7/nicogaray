'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { track, toItem, type PhotoLike } from '@/lib/analytics';

interface Props {
  photo: PhotoLike;
  href: string;
  label: string;
}

/** Buy CTA that fires begin_checkout in GA4 before navigating. */
export function BuyButton({ photo, href, label }: Props) {
  return (
    <Link
      href={href}
      onClick={() => track.beginCheckout(toItem(photo))}
      className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 bg-ink text-paper text-sm font-medium hover:bg-accent transition-colors group"
    >
      {label}
      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

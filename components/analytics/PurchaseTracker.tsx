'use client';
import { useEffect, useRef } from 'react';
import { track, toItem, type PhotoLike } from '@/lib/analytics';

declare global {
  interface Window {
    pintrk?: (...args: unknown[]) => void;
  }
}

interface Props {
  transactionId: string;
  total: number;
  photo: PhotoLike;
  hashedEmail?: string;
}

/**
 * Fires GA4 purchase + Pinterest checkout events exactly once per
 * transaction, with a localStorage guard so a page refresh (or later
 * revisit) of the success URL doesn't double-count the conversion.
 */
export function PurchaseTracker({ transactionId, total, photo, hashedEmail }: Props) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    const key = `ga4_purchase_${transactionId}`;
    try {
      if (typeof localStorage !== 'undefined' && localStorage.getItem(key)) return;
      localStorage.setItem(key, '1');
    } catch {}
    const item = toItem(photo);
    track.purchase(transactionId, item, total);
    if (typeof window.pintrk === 'function') {
      window.pintrk('track', 'checkout', {
        value: total,
        order_quantity: 1,
        currency: item.currency,
        em: hashedEmail,
      });
    }
    fired.current = true;
  }, [transactionId, total, photo, hashedEmail]);
  return null;
}

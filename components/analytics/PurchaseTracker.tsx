'use client';
import { useEffect, useRef } from 'react';
import { track, toItem, type PhotoLike } from '@/lib/analytics';

interface Props {
  transactionId: string;
  total: number;
  photo: PhotoLike;
}

/**
 * Fires GA4 purchase event exactly once per transaction, with a
 * sessionStorage guard so a page refresh on the success URL doesn't
 * double-count the conversion.
 */
export function PurchaseTracker({ transactionId, total, photo }: Props) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    const key = `ga4_purchase_${transactionId}`;
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {}
    track.purchase(transactionId, toItem(photo), total);
    fired.current = true;
  }, [transactionId, total, photo]);
  return null;
}

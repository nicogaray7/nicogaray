/**
 * Typed wrappers around gtag.js for GA4. All public events follow the
 * GA4 e-commerce schema (https://developers.google.com/analytics/devguides/collection/ga4/ecommerce).
 *
 * Usage:
 *   import { track } from '@/lib/analytics';
 *   track.viewItem(photo);
 */

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export interface GAItem {
  item_id: string;
  item_name: string;
  item_brand?: string;
  item_category?: string;
  item_category2?: string;
  item_variant?: string;
  price?: number;
  currency?: string;
  index?: number;
  quantity?: number;
}

export interface PhotoLike {
  id: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  country?: string | null;
  city?: string | null;
  orientation?: string | null;
}

export function toItem(photo: PhotoLike, index?: number): GAItem {
  return {
    item_id: photo.slug,
    item_name: photo.title,
    item_brand: 'Nico Garay',
    item_category: photo.country ?? undefined,
    item_category2: photo.city ?? undefined,
    item_variant: photo.orientation ?? undefined,
    price: photo.price,
    currency: photo.currency || 'EUR',
    quantity: 1,
    index,
  };
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag(...args);
  } else if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(args);
  }
}

export const track = {
  event: (name: string, params?: Record<string, unknown>) => gtag('event', name, params ?? {}),

  pageView: (path: string, title?: string) =>
    gtag('event', 'page_view', {
      page_path: path,
      page_title: title ?? (typeof document !== 'undefined' ? document.title : undefined),
      page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    }),

  viewItemList: (listId: string, listName: string, items: GAItem[]) =>
    gtag('event', 'view_item_list', {
      item_list_id: listId,
      item_list_name: listName,
      items: items.slice(0, 50),
    }),

  selectItem: (listId: string, listName: string, item: GAItem) =>
    gtag('event', 'select_item', {
      item_list_id: listId,
      item_list_name: listName,
      items: [item],
    }),

  viewItem: (item: GAItem) =>
    gtag('event', 'view_item', {
      currency: item.currency || 'EUR',
      value: item.price ?? 0,
      items: [item],
    }),

  addToCart: (item: GAItem) =>
    gtag('event', 'add_to_cart', {
      currency: item.currency || 'EUR',
      value: item.price ?? 0,
      items: [item],
    }),

  beginCheckout: (item: GAItem) =>
    gtag('event', 'begin_checkout', {
      currency: item.currency || 'EUR',
      value: item.price ?? 0,
      items: [item],
    }),

  purchase: (transactionId: string, item: GAItem, total: number) =>
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      currency: item.currency || 'EUR',
      value: total,
      items: [item],
    }),

  filterApply: (filterType: string, value: string) =>
    gtag('event', 'filter_apply', { filter_type: filterType, filter_value: value }),

  languageSwitch: (from: string, to: string) =>
    gtag('event', 'language_switch', { from_locale: from, to_locale: to }),

  outboundClick: (url: string, label?: string) =>
    gtag('event', 'click', { link_url: url, link_text: label, outbound: true }),
};

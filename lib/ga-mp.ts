/**
 * Envoi server-side d'évènements GA4 via le Measurement Protocol.
 * Sert de filet de sécurité pour le purchase : les acheteurs qui ne
 * reviennent pas sur la page de succès ne déclenchent pas le purchase
 * client-side, mais le webhook Stripe, lui, est toujours reçu.
 *
 * GA4 déduplique les évènements purchase par transaction_id, donc envoyer
 * aussi le purchase server-side ne crée pas de double comptage avec le
 * client-side (même transaction_id = order.id).
 *
 * No-op tant que GA4_MP_API_SECRET n'est pas défini dans l'environnement.
 */

const MP_ENDPOINT = 'https://www.google-analytics.com/mp/collect';

interface MpItem {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
  item_variant?: string;
}

interface MpPurchase {
  clientId: string;
  transactionId: string;
  value: number;
  currency: string;
  items: MpItem[];
}

export async function sendPurchaseToGA4(p: MpPurchase): Promise<void> {
  const apiSecret = process.env.GA4_MP_API_SECRET;
  const measurementId = process.env.GA4_MEASUREMENT_ID ?? 'G-TF7WRXVYLC';
  if (!apiSecret) return;

  const clientId =
    p.clientId && p.clientId.length > 0
      ? p.clientId
      : `${Math.floor(Math.random() * 1e10)}.${Math.floor(Date.now() / 1000)}`;

  const body = {
    client_id: clientId,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: p.transactionId,
          currency: p.currency,
          value: p.value,
          items: p.items,
        },
      },
    ],
  };

  const url = `${MP_ENDPOINT}?measurement_id=${encodeURIComponent(measurementId)}&api_secret=${encodeURIComponent(apiSecret)}`;
  await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

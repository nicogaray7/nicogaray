import Stripe from 'stripe';

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error('STRIPE_SECRET_KEY is not set');
  _stripe = new Stripe(key, { apiVersion: '2025-02-24.acacia' });
  return _stripe;
}

// Stripe fees passed to buyer: 1.5% + 0.25€ (EU cards). Computed so that
// the seller receives the full `amount`. Note Stripe's actual settlement
// is amount * 1.5% + 0.25 from the seller — we pre-add it to the total
// the buyer pays, so net to seller ≈ photo price.
export function buyerFees(amount: number): number {
  const rate = 0.015;
  const fixed = 0.25;
  const total = (amount + fixed) / (1 - rate);
  const fees = Math.round((total - amount) * 100) / 100;
  return fees;
}

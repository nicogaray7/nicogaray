/**
 * Calcul des frais de paiement répercutés sur le client.
 *
 * Stripe (cartes européennes EEA) : 1.5% + 0.25€
 * Stripe (cartes non-EEA / international) : 2.5% + 0.25€
 *
 * Pour répercuter exactement les frais, on utilise un calcul "gross-up" :
 *   total = (prix + frais_fixes) / (1 - taux_pourcentage)
 *
 * Exemple à 5€ : (5 + 0.25) / (1 - 0.015) = 5.33€
 *
 * Wise SEPA en EUR : reçu gratuit côté bénéficiaire en zone SEPA → 0 frais.
 */

const STRIPE_PERCENT      = 0.015   // 1.5%
const STRIPE_FIXED_EUR    = 0.25    // 25 centimes
const ROUND_PRECISION     = 100     // 2 décimales

export interface PriceBreakdown {
  amount:   number   // prix HT du produit
  fees:     number   // frais répercutés
  total:    number   // total payé par le client
  currency: 'EUR'
}

/**
 * Calcule le prix total à payer pour Stripe (avec frais répercutés).
 */
export function calculateStripeTotal(amount: number): PriceBreakdown {
  const total = (amount + STRIPE_FIXED_EUR) / (1 - STRIPE_PERCENT)
  const totalRounded = Math.ceil(total * ROUND_PRECISION) / ROUND_PRECISION
  const fees = Math.round((totalRounded - amount) * ROUND_PRECISION) / ROUND_PRECISION
  return {
    amount,
    fees,
    total:    totalRounded,
    currency: 'EUR',
  }
}

/**
 * Calcule le total pour Wise (virement SEPA EUR — pas de frais côté receveur).
 */
export function calculateWiseTotal(amount: number): PriceBreakdown {
  return {
    amount,
    fees:     0,
    total:    amount,
    currency: 'EUR',
  }
}

/**
 * Format pour affichage : 5.33 → "5.33"
 */
export function formatPrice(value: number): string {
  return value.toFixed(2)
}

import Stripe from 'stripe'

export const STRIPE_PHOTO_PRICE_EUR = 500
export const STRIPE_CURRENCY = 'eur'

let _stripe: Stripe | null = null

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop: string | symbol) {
    if (!_stripe) {
      _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        apiVersion: '2026-04-22.dahlia',
      })
    }
    return Reflect.get(_stripe, prop)
  },
})

import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const STRIPE_PHOTO_PRICE_EUR = 500 // centimes
export const STRIPE_CURRENCY = 'eur'

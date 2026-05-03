'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CreditCard, Building2 } from 'lucide-react'

export function BuyButton({ photoId, locale }: { photoId: string; locale: string }) {
  const t = useTranslations('checkout')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'stripe' | 'wise' | null>(null)
  const [wiseOrder, setWiseOrder] = useState<Record<string, string> | null>(null)

  async function handleStripe() {
    setLoading(true)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId, locale }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally {
      setLoading(false)
    }
  }

  async function handleWise() {
    setLoading(true)
    try {
      const res = await fetch('/api/wise/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId, locale }),
      })
      const data = await res.json()
      if (data.reference) {
        setMode('wise')
        setWiseOrder(data)
      }
    } finally {
      setLoading(false)
    }
  }

  if (mode === 'wise' && wiseOrder) {
    const order = wiseOrder
    return (
      <div className="bg-stone-50 border border-stone-200 rounded p-5 space-y-3">
        <p className="text-sm text-stone-600">{t('wise_instructions')}</p>
        <div className="font-mono text-sm bg-white border border-stone-200 rounded px-4 py-3 space-y-1">
          <div className="flex justify-between">
            <span className="text-stone-400">IBAN</span>
            <span className="text-stone-800">{order.iban ?? '(IBAN admin)'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Montant</span>
            <span className="text-stone-800">{order.total} EUR</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-400">Référence</span>
            <span className="text-stone-800 font-semibold">{order.reference}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleStripe}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-stone-900 text-white text-sm tracking-wide px-6 py-3 rounded hover:bg-stone-700 transition-colors disabled:opacity-50"
      >
        <CreditCard className="w-4 h-4" />
        {t('stripe')}
      </button>
      <button
        onClick={handleWise}
        disabled={loading}
        className="flex items-center justify-center gap-2 border border-stone-300 text-stone-700 text-sm tracking-wide px-6 py-3 rounded hover:border-stone-600 hover:text-stone-900 transition-colors disabled:opacity-50"
      >
        <Building2 className="w-4 h-4" />
        {t('wise')}
      </button>
    </div>
  )
}

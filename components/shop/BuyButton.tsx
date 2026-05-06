'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { CreditCard, Building2, CheckCircle2, Loader2, Copy, ArrowRight, ChevronLeft } from 'lucide-react'

interface WiseOrder {
  orderId:   string
  reference: string
  iban:      string
  amount:    number
  total:     number
  currency:  string
}

export function BuyButton({ photoId, locale }: { photoId: string; locale: string }) {
  const t = useTranslations('checkout')
  const [loading,      setLoading]      = useState(false)
  const [mode,         setMode]         = useState<'choice' | 'wise' | 'wise_pending' | 'wise_paid'>('choice')
  const [wiseOrder,    setWiseOrder]    = useState<WiseOrder | null>(null)
  const [buyerEmail,   setBuyerEmail]   = useState('')
  const [verifyLoading,setVerifyLoading]= useState(false)
  const [downloadUrl,  setDownloadUrl]  = useState('')
  const [copied,       setCopied]       = useState<string | null>(null)

  async function handleStripe() {
    setLoading(true)
    try {
      const res  = await fetch('/api/stripe/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ photoId, locale }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } finally { setLoading(false) }
  }

  async function handleWise() {
    setLoading(true)
    try {
      const res  = await fetch('/api/wise/order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ photoId, locale }),
      })
      const data = await res.json()
      if (data.reference) {
        setMode('wise')
        setWiseOrder(data)
      }
    } finally { setLoading(false) }
  }

  async function handleVerify() {
    if (!wiseOrder) return
    setVerifyLoading(true)
    try {
      const res  = await fetch('/api/wise/verify', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ reference: wiseOrder.reference, buyerEmail }),
      })
      const data = await res.json()
      if (data.status === 'paid') {
        setMode('wise_paid')
        setDownloadUrl(data.downloadUrl)
      } else {
        setMode('wise_pending')
      }
    } finally { setVerifyLoading(false) }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  /* ── Transfer confirmed ─────────────────────────────────────────── */
  if (mode === 'wise_paid') {
    return (
      <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-6 text-center space-y-4 animate-fade-up">
        <CheckCircle2 className="w-8 h-8 text-accent-500 mx-auto" strokeWidth={1.5} />
        <div className="space-y-2">
          <p className="text-ink-900 font-medium text-sm">
            {locale === 'fr' ? 'Paiement confirme' : 'Payment confirmed'}
          </p>
          <p className="text-ink-700 text-xs">
            {locale === 'fr' ? 'Acces a votre fichier' : 'Access to your file'}
          </p>
        </div>
        <a
          href={downloadUrl}
          className="block bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium px-5 py-3 rounded-full transition-colors"
        >
          {locale === 'fr' ? 'Telecharger la photo HD' : 'Download HD photo'}
        </a>
      </div>
    )
  }

  /* ── Transfer pending validation ──────────────────────────────────── */
  if (mode === 'wise_pending') {
    return (
      <div className="bg-accent-400/10 border border-accent-400/30 rounded-lg p-6 space-y-3 animate-fade-up">
        <p className="text-ink-900 font-medium text-sm">
          {locale === 'fr' ? 'Virement enregistre' : 'Transfer registered'}
        </p>
        <p className="text-ink-700 text-xs leading-relaxed">
          {locale === 'fr'
            ? 'Vous recevrez votre lien de telechargement par email des confirmation du virement, generalement sous 24 heures.'
            : 'You will receive your download link by email once the transfer is confirmed, usually within 24 hours.'}
        </p>
        {wiseOrder && (
          <p className="text-ink-700 text-xs pt-2 border-t border-accent-400/20">
            <span className="text-accent-400">{locale === 'fr' ? 'Ref' : 'Ref'}:</span> <span className="font-mono">{wiseOrder.reference}</span>
          </p>
        )}
      </div>
    )
  }

  /* ── Transfer details view ──────────────────────────────────────── */
  if (mode === 'wise' && wiseOrder) {
    return (
      <div className="space-y-5 animate-fade-up">
        <button
          onClick={() => setMode('choice')}
          className="flex items-center gap-1 text-xs text-accent-400 hover:text-accent-500 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {locale === 'fr' ? 'Retour' : 'Back'}
        </button>

        <div className="bg-ink-150 rounded-lg border border-accent-500/30 p-6 space-y-3">
          <p className="text-[9px] tracking-[0.2em] uppercase text-accent-400 mb-4">
            {locale === 'fr' ? 'Coordonnees du virement' : 'Transfer details'}
          </p>
          {[
            { label: locale === 'fr' ? 'Beneficiaire' : 'Recipient', value: 'Nico Garay', key: 'name' },
            { label: 'IBAN',        value: wiseOrder.iban,           key: 'iban'   },
            { label: 'BIC',         value: 'TRWIBEB1XXX',            key: 'bic'    },
            { label: locale === 'fr' ? 'Montant' : 'Amount', value: `${wiseOrder.total} EUR`, key: 'amount' },
            { label: locale === 'fr' ? 'Reference' : 'Reference', value: wiseOrder.reference, key: 'ref' },
          ].map(({ label, value, key }) => (
            <div key={key} className="flex items-center gap-3 text-xs">
              <span className="text-ink-700 w-20 flex-shrink-0">{label}</span>
              <span className="text-ink-900 font-mono text-xs flex-1 break-all">{value}</span>
              <button
                onClick={() => copyText(value, key)}
                className="text-ink-600 hover:text-accent-500 flex-shrink-0 p-1 transition-colors"
                title={locale === 'fr' ? 'Copier' : 'Copy'}
              >
                {copied === key ? <CheckCircle2 className="w-3.5 h-3.5 text-accent-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>

        <input
          type="email"
          required
          placeholder={locale === 'fr' ? 'Votre email' : 'Your email'}
          value={buyerEmail}
          onChange={e => setBuyerEmail(e.target.value)}
          className="w-full border border-accent-500/40 rounded-full px-5 py-3 text-sm text-ink-900 placeholder-ink-600 bg-ink-50 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30 transition-colors"
        />

        <button
          onClick={handleVerify}
          disabled={verifyLoading || !buyerEmail}
          className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium px-5 py-3.5 rounded-full transition-colors disabled:opacity-40"
        >
          {verifyLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> {locale === 'fr' ? 'Verification' : 'Verifying'}</>
            : <>{locale === 'fr' ? 'Confirmer le virement' : 'Confirm transfer'} <ArrowRight className="w-4 h-4" /></>
          }
        </button>

        <p className="text-ink-700 text-xs text-center">
          {locale === 'fr' ? 'SEPA: 1 a 2 jours ouvres' : 'SEPA: 1-2 business days'}
        </p>
      </div>
    )
  }

  /* ── Payment method choice ─────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleStripe}
        disabled={loading}
        className="group flex items-center justify-between gap-3 bg-accent-500 hover:bg-accent-600 text-white text-sm font-medium px-6 py-3 rounded-full transition-colors disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          {t('stripe')}
        </span>
        <span className="text-xs text-white/70 font-normal">
          {locale === 'fr' ? '+1.5%' : '+1.5%'}
        </span>
      </button>
      <button
        onClick={handleWise}
        disabled={loading}
        className="flex items-center justify-between gap-3 bg-ink-50 border border-accent-500/40 hover:border-accent-500 text-ink-900 text-sm font-medium px-6 py-3 rounded-full transition-colors disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4" />
          {t('wise')}
        </span>
        <span className="text-xs text-accent-400 font-normal">
          {locale === 'fr' ? 'Sans frais' : 'No fees'}
        </span>
      </button>
    </div>
  )
}

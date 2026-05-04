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

  /* ── Paiement Wise confirmé ─────────────────────────────────────────── */
  if (mode === 'wise_paid') {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center space-y-3 animate-fade-up">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" strokeWidth={1.5} />
        <p className="text-emerald-800 font-medium text-sm">
          {locale === 'fr' ? 'Paiement confirmé' : 'Payment confirmed'}
        </p>
        <a
          href={downloadUrl}
          className="block bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-5 py-3 rounded-full transition-colors"
        >
          {locale === 'fr' ? 'Télécharger la photo HD' : 'Download HD photo'}
        </a>
      </div>
    )
  }

  /* ── Wise en attente de validation ──────────────────────────────────── */
  if (mode === 'wise_pending') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-2 animate-fade-up">
        <p className="text-amber-800 font-medium text-sm">
          {locale === 'fr' ? 'Virement enregistré' : 'Transfer registered'}
        </p>
        <p className="text-amber-700 text-xs leading-relaxed">
          {locale === 'fr'
            ? "Vous recevrez votre lien de téléchargement par email dès confirmation du virement (généralement sous 24h)."
            : "You will receive your download link by email once the transfer is confirmed (usually within 24h)."}
        </p>
        {wiseOrder && (
          <p className="text-amber-600 text-xs pt-2 border-t border-amber-100">
            {locale === 'fr' ? 'Référence' : 'Reference'} : <span className="font-mono font-medium">{wiseOrder.reference}</span>
          </p>
        )}
      </div>
    )
  }

  /* ── Vue détails du virement Wise ──────────────────────────────────── */
  if (mode === 'wise' && wiseOrder) {
    return (
      <div className="space-y-4 animate-fade-up">
        <button
          onClick={() => setMode('choice')}
          className="flex items-center gap-1 text-xs text-ink-500 hover:text-ink-900 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {locale === 'fr' ? 'Retour' : 'Back'}
        </button>

        <div className="bg-ink-50 rounded-xl p-4 space-y-2.5">
          <p className="text-[10px] tracking-[0.2em] uppercase text-ink-400 mb-3">
            {locale === 'fr' ? 'Coordonnées du virement' : 'Transfer details'}
          </p>
          {[
            { label: locale === 'fr' ? 'Bénéficiaire' : 'Recipient', value: 'Nico Garay', key: 'name' },
            { label: 'IBAN',        value: wiseOrder.iban,           key: 'iban'   },
            { label: 'BIC',         value: 'TRWIBEB1XXX',            key: 'bic'    },
            { label: locale === 'fr' ? 'Montant' : 'Amount', value: `${wiseOrder.total} EUR`, key: 'amount' },
            { label: locale === 'fr' ? 'Référence' : 'Reference', value: wiseOrder.reference, key: 'ref' },
          ].map(({ label, value, key }) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="text-ink-400 w-24 flex-shrink-0">{label}</span>
              <span className="text-ink-800 font-mono flex-1 truncate">{value}</span>
              <button
                onClick={() => copyText(value, key)}
                className="text-ink-400 hover:text-ink-900 flex-shrink-0 p-1"
                title="Copier"
              >
                {copied === key ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
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
          className="w-full border border-ink-200 rounded-full px-5 py-3 text-sm text-ink-900 placeholder-ink-300 focus:outline-none focus:border-ink-900 transition-colors"
        />

        <button
          onClick={handleVerify}
          disabled={verifyLoading || !buyerEmail}
          className="w-full flex items-center justify-center gap-2 bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium px-5 py-3.5 rounded-full transition-colors disabled:opacity-40"
        >
          {verifyLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> {locale === 'fr' ? 'Vérification…' : 'Verifying…'}</>
            : <>{locale === 'fr' ? "J'ai effectué le virement" : "I made the transfer"} <ArrowRight className="w-4 h-4" /></>
          }
        </button>

        <p className="text-ink-400 text-xs text-center">
          {locale === 'fr' ? 'Délai SEPA : 1–2 jours ouvrés' : 'SEPA: 1–2 business days'}
        </p>
      </div>
    )
  }

  /* ── Choix du mode de paiement ─────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleStripe}
        disabled={loading}
        className="group flex items-center justify-between gap-2.5 bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium px-6 py-3.5 rounded-full transition-colors disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          {t('stripe')}
        </span>
        <span className="text-xs text-white/70 font-normal">
          {locale === 'fr' ? '+ frais 1.5%' : '+ 1.5% fees'}
        </span>
      </button>
      <button
        onClick={handleWise}
        disabled={loading}
        className="flex items-center justify-between gap-2.5 bg-white border border-ink-200 hover:border-ink-900 text-ink-900 text-sm font-medium px-6 py-3.5 rounded-full transition-colors disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4" />
          {t('wise')}
        </span>
        <span className="text-xs text-ink-400 font-normal">
          {locale === 'fr' ? 'sans frais' : 'no fees'}
        </span>
      </button>
    </div>
  )
}

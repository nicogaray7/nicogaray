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
  const en = locale === 'en'

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

  /* Transfer confirmed */
  if (mode === 'wise_paid') {
    return (
      <div className="bg-accent/10 border border-accent/20 p-6 text-center space-y-4 animate-fade-up">
        <CheckCircle2 className="w-8 h-8 text-accent mx-auto" strokeWidth={1.5} />
        <div className="space-y-2">
          <p className="text-foreground font-medium text-sm">
            {en ? 'Payment confirmed' : 'Paiement confirme'}
          </p>
          <p className="text-foreground-dim text-xs">
            {en ? 'Access your file' : 'Acces a votre fichier'}
          </p>
        </div>
        <a
          href={downloadUrl}
          className="block bg-accent hover:bg-accent-dim text-surface text-sm font-medium px-5 py-3 transition-colors"
        >
          {en ? 'Download HD photo' : 'Telecharger la photo HD'}
        </a>
      </div>
    )
  }

  /* Transfer pending */
  if (mode === 'wise_pending') {
    return (
      <div className="bg-accent/5 border border-accent/15 p-6 space-y-3 animate-fade-up">
        <p className="text-foreground font-medium text-sm">
          {en ? 'Transfer registered' : 'Virement enregistre'}
        </p>
        <p className="text-foreground-dim text-xs leading-relaxed">
          {en
            ? 'You will receive your download link by email once the transfer is confirmed, usually within 24 hours.'
            : 'Vous recevrez votre lien de telechargement par email des confirmation du virement, generalement sous 24 heures.'}
        </p>
        {wiseOrder && (
          <p className="text-foreground-dim text-xs pt-2 border-t border-line">
            <span className="text-accent">Ref:</span>{' '}
            <span className="font-mono">{wiseOrder.reference}</span>
          </p>
        )}
      </div>
    )
  }

  /* Transfer details */
  if (mode === 'wise' && wiseOrder) {
    return (
      <div className="space-y-5 animate-fade-up">
        <button
          onClick={() => setMode('choice')}
          className="flex items-center gap-1 text-xs text-foreground-dim hover:text-accent transition-colors duration-300"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          {en ? 'Back' : 'Retour'}
        </button>

        <div className="bg-surface-elevated border border-line p-6 space-y-3">
          <p className="text-[9px] tracking-[0.2em] uppercase text-accent mb-4">
            {en ? 'Transfer details' : 'Coordonnees du virement'}
          </p>
          {[
            { label: en ? 'Recipient' : 'Beneficiaire', value: 'Nico Garay', key: 'name' },
            { label: 'IBAN',        value: wiseOrder.iban,           key: 'iban'   },
            { label: 'BIC',         value: 'TRWIBEB1XXX',            key: 'bic'    },
            { label: en ? 'Amount' : 'Montant', value: `${wiseOrder.total} EUR`, key: 'amount' },
            { label: 'Reference',   value: wiseOrder.reference,      key: 'ref'    },
          ].map(({ label, value, key }) => (
            <div key={key} className="flex items-center gap-3 text-xs">
              <span className="text-foreground-muted w-20 shrink-0">{label}</span>
              <span className="text-foreground font-mono text-xs flex-1 break-all">{value}</span>
              <button
                onClick={() => copyText(value, key)}
                className="text-foreground-muted hover:text-accent shrink-0 p-1 transition-colors duration-300"
                title={en ? 'Copy' : 'Copier'}
              >
                {copied === key ? <CheckCircle2 className="w-3.5 h-3.5 text-accent" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          ))}
        </div>

        <input
          type="email"
          required
          placeholder={en ? 'Your email' : 'Votre email'}
          value={buyerEmail}
          onChange={e => setBuyerEmail(e.target.value)}
          className="w-full border border-line px-5 py-3 text-sm text-foreground placeholder-foreground-muted bg-surface-elevated focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
        />

        <button
          onClick={handleVerify}
          disabled={verifyLoading || !buyerEmail}
          className="w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-dim text-surface text-sm font-medium px-5 py-3.5 transition-colors disabled:opacity-40"
        >
          {verifyLoading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> {en ? 'Verifying' : 'Verification'}</>
            : <>{en ? 'Confirm transfer' : 'Confirmer le virement'} <ArrowRight className="w-4 h-4" /></>
          }
        </button>

        <p className="text-foreground-muted text-xs text-center">
          {en ? 'SEPA: 1-2 business days' : 'SEPA: 1 a 2 jours ouvres'}
        </p>
      </div>
    )
  }

  /* Payment method choice */
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleStripe}
        disabled={loading}
        className="group flex items-center justify-between gap-3 bg-accent hover:bg-accent-dim text-surface text-sm font-medium px-6 py-3.5 transition-colors disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
          {t('stripe')}
        </span>
        <span className="text-xs opacity-70 font-normal">+1.5%</span>
      </button>
      <button
        onClick={handleWise}
        disabled={loading}
        className="flex items-center justify-between gap-3 bg-surface-elevated border border-line hover:border-accent/40 text-foreground text-sm font-medium px-6 py-3.5 transition-colors disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          <Building2 className="w-4 h-4" />
          {t('wise')}
        </span>
        <span className="text-xs text-accent font-normal">
          {en ? 'No fees' : 'Sans frais'}
        </span>
      </button>
    </div>
  )
}

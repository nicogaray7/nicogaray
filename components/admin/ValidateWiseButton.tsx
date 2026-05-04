'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, Loader } from 'lucide-react'

export function ValidateWiseButton({ orderId }: { orderId: string }) {
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const router = useRouter()

  async function handleValidate() {
    if (!confirm('Confirmer que le virement a bien été reçu et envoyer le lien de téléchargement ?')) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/validate-wise', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ orderId }),
      })
      if (res.ok) {
        setDone(true)
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  if (done) return <span className="text-xs text-green-600">Validé ✓</span>

  return (
    <button
      onClick={handleValidate}
      disabled={loading}
      className="flex items-center gap-1 text-xs bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 transition-colors disabled:opacity-50"
    >
      {loading
        ? <Loader className="w-3 h-3 animate-spin" />
        : <CheckCircle className="w-3 h-3" />
      }
      Valider
    </button>
  )
}

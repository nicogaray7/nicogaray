'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function PublishButton({ photoId }: { photoId: string }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handlePublish() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId, published: true }),
      })
      if (res.ok) {
        setDone(true)
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error ?? 'Erreur lors de la publication')
      }
    } catch {
      alert('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return <span className="text-xs text-green-600 font-medium">Publié ✓</span>
  }

  return (
    <button
      onClick={handlePublish}
      disabled={loading}
      className="text-xs border border-stone-300 text-stone-600 px-2 py-0.5 rounded hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-colors disabled:opacity-50"
    >
      {loading ? '...' : 'Publier'}
    </button>
  )
}

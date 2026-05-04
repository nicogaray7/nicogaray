'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, CheckCircle, XCircle, Loader, RefreshCw, Zap } from 'lucide-react'

const CONCURRENCY = 4

interface FileItem {
  file:     File
  status:   'pending' | 'uploading' | 'done' | 'error'
  photoId?: string
  country?: string
  city?:    string
  error?:   string
}

export function UploadZone() {
  const [items,          setItems]          = useState<FileItem[]>([])
  const [dragging,       setDragging]       = useState(false)
  const [running,        setRunning]        = useState(false)
  const [publishedCount, setPublishedCount] = useState<number | null>(null)
  const [publishing,     setPublishing]     = useState(false)

  const queue         = useRef<number[]>([])
  const activeCount   = useRef(0)
  const totalExpected = useRef(0)
  const doneCount     = useRef(0)

  /* ─── Ajouter des fichiers ─────────────────────────────────────────────── */
  const addFiles = useCallback((newFiles: File[]) => {
    const valid = newFiles.filter(f => f.type.startsWith('image/'))
    if (!valid.length) return
    setItems(prev => [
      ...prev,
      ...valid.map(f => ({ file: f, status: 'pending' as const })),
    ])
  }, [])

  /* ─── Lancer la queue ──────────────────────────────────────────────────── */
  function startQueue(snapshot: FileItem[]) {
    const pending = snapshot
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => it.status === 'pending')

    if (!pending.length) return

    queue.current       = pending.map(p => p.i)
    activeCount.current = 0
    totalExpected.current = queue.current.length
    doneCount.current   = 0
    setRunning(true)

    const slots = Math.min(CONCURRENCY, queue.current.length)
    for (let i = 0; i < slots; i++) runNext(snapshot)
  }

  function runNext(snapshot: FileItem[]) {
    const idx = queue.current.shift()
    if (idx === undefined) {
      // Plus rien à faire pour ce worker
      activeCount.current--
      if (activeCount.current <= 0) setRunning(false)
      return
    }
    activeCount.current++
    doUpload(snapshot[idx].file, idx, () => runNext(snapshot))
  }

  async function doUpload(file: File, idx: number, next: () => void) {
    setItems(prev => prev.map((it, i) =>
      i === idx ? { ...it, status: 'uploading' } : it
    ))

    try {
      const form = new FormData()
      form.append('file', file)
      const res  = await fetch('/api/upload', { method: 'POST', body: form })
      const data = await res.json()

      if (res.ok) {
        setItems(prev => prev.map((it, i) =>
          i === idx ? {
            ...it, status: 'done',
            photoId: data.photo?.id,
            country: data.photo?.country,
            city:    data.photo?.city,
          } : it
        ))
      } else {
        throw new Error(data.error ?? 'Échec upload')
      }
    } catch (err) {
      setItems(prev => prev.map((it, i) =>
        i === idx ? {
          ...it, status: 'error',
          error: err instanceof Error ? err.message : String(err),
        } : it
      ))
    } finally {
      activeCount.current--
      next()
    }
  }

  /* ─── Relancer les erreurs ─────────────────────────────────────────────── */
  function retryErrors(snapshot: FileItem[]) {
    const errored = snapshot
      .map((it, i) => ({ it, i }))
      .filter(({ it }) => it.status === 'error')

    if (!errored.length) return

    setItems(prev => prev.map((it, i) =>
      errored.find(e => e.i === i) ? { ...it, status: 'pending', error: undefined } : it
    ))

    queue.current       = errored.map(e => e.i)
    activeCount.current = 0
    setRunning(true)

    const slots = Math.min(CONCURRENCY, queue.current.length)
    for (let i = 0; i < slots; i++) runNext(snapshot)
  }

  /* ─── Publier tout en une requête ──────────────────────────────────────── */
  async function publishAll(snapshot: FileItem[]) {
    setPublishing(true)
    setPublishedCount(null)
    const photoIds = snapshot
      .filter(it => it.status === 'done' && it.photoId)
      .map(it => it.photoId as string)

    try {
      const res  = await fetch('/api/admin/publish-all', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ photoIds }),
      })
      const data = await res.json()
      setPublishedCount(data.published ?? 0)
    } catch {
      alert('Erreur lors de la publication')
    } finally {
      setPublishing(false)
    }
  }

  /* ─── Calculs ──────────────────────────────────────────────────────────── */
  const total   = items.length
  const done    = items.filter(it => it.status === 'done').length
  const errors  = items.filter(it => it.status === 'error').length
  const pending = items.filter(it => it.status === 'pending').length

  return (
    <div className="space-y-6">

      {/* Zone drop */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-default ${
          dragging ? 'border-stone-600 bg-stone-100' : 'border-stone-300 bg-white'
        }`}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => {
          e.preventDefault()
          setDragging(false)
          addFiles(Array.from(e.dataTransfer.files))
        }}
      >
        <Upload className="w-10 h-10 mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500 mb-1">Glissez vos photos ici</p>
        <p className="text-stone-400 text-sm mb-4">JPEG · Pas de limite de nombre</p>
        <label className="cursor-pointer inline-block border border-stone-300 text-stone-600 text-sm px-4 py-2 rounded hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-colors">
          Parcourir les fichiers
          <input
            type="file" accept="image/jpeg,image/jpg,image/png" multiple className="hidden"
            onChange={e => {
              addFiles(Array.from(e.target.files ?? []))
              e.target.value = '' // reset pour permettre re-sélection
            }}
          />
        </label>
      </div>

      {/* Panneau de contrôle */}
      {total > 0 && (
        <div className="bg-white border border-stone-100 rounded-xl p-5 space-y-4">

          {/* Stats + boutons */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-stone-500">
                <span className="font-semibold text-stone-800">{done}</span>
                <span className="text-stone-400"> / {total}</span>
              </span>
              {errors > 0 && (
                <span className="text-red-500 text-xs">{errors} erreur{errors > 1 ? 's' : ''}</span>
              )}
              {running && (
                <span className="text-amber-500 text-xs flex items-center gap-1">
                  <Loader className="w-3 h-3 animate-spin" />
                  {activeCount.current} actif{activeCount.current > 1 ? 's' : ''}
                </span>
              )}
              {publishedCount !== null && (
                <span className="text-green-600 text-xs font-medium">
                  ✓ {publishedCount} publiée{publishedCount > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Lancer */}
              {!running && pending > 0 && (
                <button
                  onClick={() => startQueue(items)}
                  className="flex items-center gap-1.5 bg-stone-900 text-white text-sm px-4 py-1.5 rounded hover:bg-stone-700 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Lancer ({pending})
                </button>
              )}

              {/* Relancer erreurs */}
              {!running && errors > 0 && (
                <button
                  onClick={() => retryErrors(items)}
                  className="flex items-center gap-1.5 border border-red-300 text-red-500 text-sm px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Relancer ({errors})
                </button>
              )}

              {/* Publier tout */}
              {!running && done > 0 && (
                <button
                  onClick={() => publishAll(items)}
                  disabled={publishing}
                  className="flex items-center gap-1.5 bg-green-700 text-white text-sm px-4 py-1.5 rounded hover:bg-green-800 transition-colors disabled:opacity-50"
                >
                  {publishing
                    ? <><Loader className="w-3.5 h-3.5 animate-spin" /> Publication…</>
                    : <><CheckCircle className="w-3.5 h-3.5" /> Tout publier ({done})</>
                  }
                </button>
              )}
            </div>
          </div>

          {/* Barre globale */}
          <div className="w-full bg-stone-100 rounded-full h-1.5">
            <div
              className="bg-stone-800 h-1.5 rounded-full transition-all duration-300"
              style={{ width: total > 0 ? `${Math.round((done / total) * 100)}%` : '0%' }}
            />
          </div>

          {/* Liste (virtualisée visuellement par scroll) */}
          <div className="max-h-96 overflow-y-auto divide-y divide-stone-50">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1.5 text-sm">
                {item.status === 'done'      && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                {item.status === 'uploading' && <Loader      className="w-4 h-4 text-amber-400 animate-spin flex-shrink-0" />}
                {item.status === 'error'     && <XCircle     className="w-4 h-4 text-red-400 flex-shrink-0" />}
                {item.status === 'pending'   && <div className="w-4 h-4 rounded-full border-2 border-stone-200 flex-shrink-0" />}

                <span className="flex-1 truncate text-stone-600 text-xs">{item.file.name}</span>

                {(item.city || item.country) && (
                  <span className="text-stone-400 text-xs flex-shrink-0 truncate max-w-[10rem]">
                    {[item.city, item.country].filter(Boolean).join(', ')}
                  </span>
                )}
                {item.status === 'error' && item.error && (
                  <span className="text-red-400 text-xs truncate max-w-40" title={item.error}>
                    {item.error}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

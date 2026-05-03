'use client'

import { useState, useCallback } from 'react'
import { Upload, CheckCircle, XCircle, Loader } from 'lucide-react'

interface UploadResult {
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  photo?: { id: string; title: string; country?: string }
  error?: string
}

export function UploadZone() {
  const [files, setFiles] = useState<UploadResult[]>([])
  const [dragging, setDragging] = useState(false)

  const processFiles = useCallback((newFiles: File[]) => {
    const items: UploadResult[] = newFiles
      .filter((f) => f.type.startsWith('image/'))
      .map((f) => ({ file: f, status: 'pending', progress: 0 }))
    setFiles((prev) => [...prev, ...items])

    items.forEach((item, idx) => {
      uploadFile(item.file, idx + files.length)
    })
  }, [files.length])

  async function uploadFile(file: File, index: number) {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status: 'uploading', progress: 10 } : f)),
    )

    const formData = new FormData()
    formData.append('file', file)

    try {
      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, progress: 40 } : f)),
      )

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (res.ok) {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index ? { ...f, status: 'done', progress: 100, photo: data.photo } : f,
          ),
        )
      } else {
        throw new Error(data.error ?? 'Upload failed')
      }
    } catch (err) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: 'error', error: String(err), progress: 0 } : f,
        ),
      )
    }
  }

  return (
    <div className="space-y-6">
      {/* Zone drag-and-drop */}
      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
          dragging ? 'border-stone-600 bg-stone-100' : 'border-stone-300 bg-white'
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          processFiles(Array.from(e.dataTransfer.files))
        }}
      >
        <Upload className="w-10 h-10 mx-auto text-stone-300 mb-3" />
        <p className="text-stone-500 mb-2">Glissez vos photos ici</p>
        <p className="text-stone-300 text-sm mb-4">JPEG, PNG — plusieurs fichiers acceptés</p>
        <label className="cursor-pointer inline-block border border-stone-300 text-stone-600 text-sm px-4 py-2 rounded hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-colors">
          Parcourir
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => processFiles(Array.from(e.target.files ?? []))}
          />
        </label>
      </div>

      {/* Liste des uploads */}
      {files.length > 0 && (
        <ul className="space-y-3">
          {files.map((item, i) => (
            <li key={i} className="bg-white border border-stone-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-stone-700">{item.file.name}</p>
                  {item.photo?.country && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      {item.photo.country} · {item.photo.title}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 ml-4">
                  {item.status === 'uploading' && (
                    <Loader className="w-5 h-5 text-stone-400 animate-spin" />
                  )}
                  {item.status === 'done' && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {item.status === 'error' && (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                </div>
              </div>

              {/* Barre de progression */}
              {item.status === 'uploading' && (
                <div className="w-full bg-stone-100 rounded-full h-1">
                  <div
                    className="bg-stone-700 h-1 rounded-full transition-all duration-500"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              )}

              {item.status === 'error' && (
                <p className="text-xs text-red-400 mt-1">{item.error}</p>
              )}

              {item.status === 'done' && item.photo && (
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={`/admin/photos/${item.photo.id}`}
                    className="text-xs text-stone-400 hover:text-stone-700 underline"
                  >
                    Éditer
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

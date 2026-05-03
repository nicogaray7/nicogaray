'use client'

import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { useState, useCallback } from 'react'
import { UploadZone } from '@/components/admin/UploadZone'

export default function AdminUploadPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-serif text-3xl text-stone-800 mb-2">Upload photos</h1>
        <p className="text-stone-400 text-sm mb-10">
          Glissez vos fichiers. EXIF et géolocalisation extraits automatiquement.
          Le pays peut être corrigé après upload.
        </p>
        <UploadZone />
      </div>
    </div>
  )
}

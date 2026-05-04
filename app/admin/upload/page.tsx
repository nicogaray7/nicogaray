import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { UploadZone } from '@/components/admin/UploadZone'

export const metadata = {
  title: 'Upload — Admin',
  robots: 'noindex',
}

export default async function AdminUploadPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl text-stone-800 mb-1">Upload photos</h1>
            <p className="text-stone-400 text-sm">
              EXIF et géolocalisation extraits automatiquement.
            </p>
          </div>
          <a
            href="/admin"
            className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
          >
            ← Dashboard
          </a>
        </div>
        <UploadZone />
      </div>
    </div>
  )
}

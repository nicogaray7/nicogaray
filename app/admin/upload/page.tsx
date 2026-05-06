import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { UploadZone } from '@/components/admin/UploadZone'

export const metadata = {
  title: 'Upload - Admin',
  robots: 'noindex',
}

export default async function AdminUploadPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-baseline justify-between mb-12">
          <div>
            <h1 className="font-serif text-4xl lg:text-5xl text-[#2C2416] tracking-wide mb-3">Ajouter photos</h1>
            <p className="text-[#9E9580] text-sm">
              EXIF et géolocalisation extraits automatiquement
            </p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-[#9E9580] hover:text-[#2C2416] transition-colors duration-200"
          >
            Dashboard
          </Link>
        </div>
        <UploadZone />
      </div>
    </div>
  )
}

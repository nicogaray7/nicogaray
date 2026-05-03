export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const [totalPhotos, publishedPhotos, totalOrders, paidOrders] = await Promise.all([
    prisma.photo.count(),
    prisma.photo.count({ where: { published: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: 'paid' } }),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { photo: { select: { title: true } } },
  })

  const unpublished = await prisma.photo.findMany({
    where: { published: false },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, title: true, country: true, orientation: true, createdAt: true },
  })

  return (
    <div className="min-h-screen bg-stone-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-3xl text-stone-800">Admin — Nico Garay</h1>
          <Link
            href="/admin/upload"
            className="bg-stone-900 text-white text-sm px-4 py-2 rounded hover:bg-stone-700 transition-colors"
          >
            + Uploader des photos
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Photos totales', value: totalPhotos },
            { label: 'Photos publiées', value: publishedPhotos },
            { label: 'Commandes', value: totalOrders },
            { label: 'Ventes confirmées', value: paidOrders },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded border border-stone-100 p-5">
              <p className="text-3xl font-serif text-stone-800">{stat.value}</p>
              <p className="text-xs text-stone-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photos à publier */}
          <div className="bg-white rounded border border-stone-100 p-6">
            <h2 className="font-serif text-xl text-stone-700 mb-4">Photos en attente de publication</h2>
            {unpublished.length === 0 ? (
              <p className="text-stone-400 text-sm">Aucune photo en attente.</p>
            ) : (
              <ul className="space-y-2">
                {unpublished.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-stone-700">{p.title}</span>
                      {p.country && <span className="text-stone-400 ml-2">· {p.country}</span>}
                    </div>
                    <PublishButton photoId={p.id} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Commandes récentes */}
          <div className="bg-white rounded border border-stone-100 p-6">
            <h2 className="font-serif text-xl text-stone-700 mb-4">Commandes récentes</h2>
            {recentOrders.length === 0 ? (
              <p className="text-stone-400 text-sm">Aucune commande.</p>
            ) : (
              <ul className="space-y-2">
                {recentOrders.map((o) => (
                  <li key={o.id} className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-stone-600">{o.buyerEmail || '—'}</span>
                      <span className="text-stone-400 ml-2">· {o.photo.title}</span>
                    </div>
                    <span className={
                      o.paymentStatus === 'paid' ? 'text-green-600' :
                      o.paymentStatus === 'failed' ? 'text-red-500' : 'text-amber-500'
                    }>
                      {o.paymentStatus}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PublishButton({ photoId }: { photoId: string }) {
  return (
    <form action={`/api/admin/publish`} method="POST">
      <input type="hidden" name="photoId" value={photoId} />
      <button
        type="submit"
        className="text-xs border border-stone-300 text-stone-600 px-2 py-0.5 rounded hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-colors"
      >
        Publier
      </button>
    </form>
  )
}

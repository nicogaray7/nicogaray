export const dynamic = 'force-dynamic'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { photoPublicLabel } from '@/lib/photoLabel'
import Link from 'next/link'
import { PublishButton } from '@/components/admin/PublishButton'
import { ValidateWiseButton } from '@/components/admin/ValidateWiseButton'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const [totalPhotos, publishedPhotos, totalOrders, paidOrders] = await Promise.all([
    prisma.photo.count(),
    prisma.photo.count({ where: { published: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: 'paid' } }),
  ])

  const wiseOrders = await prisma.order.findMany({
    where: { paymentMethod: 'wise', paymentStatus: 'awaiting_verification' },
    orderBy: { createdAt: 'desc' },
    include: { photo: { select: { country: true, city: true } } },
  })

  const recentOrders = await prisma.order.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { photo: { select: { country: true, city: true } } },
  })

  const unpublished = await prisma.photo.findMany({
    where: { published: false },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: { id: true, country: true, city: true },
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
            { label: 'Photos totales',   value: totalPhotos },
            { label: 'Photos publiées',  value: publishedPhotos },
            { label: 'Commandes',        value: totalOrders },
            { label: 'Ventes confirmées',value: paidOrders },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded border border-stone-100 p-5">
              <p className="text-3xl font-serif text-stone-800">{stat.value}</p>
              <p className="text-xs text-stone-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Virements Wise en attente */}
        {wiseOrders.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded p-6 mb-8">
            <h2 className="font-serif text-xl text-amber-800 mb-4">
              ⚠ Virements Wise à valider ({wiseOrders.length})
            </h2>
            <ul className="space-y-3">
              {wiseOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between text-sm bg-white rounded p-3 border border-amber-100">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-stone-500">{o.wiseReference}</span>
                      <span className="text-stone-700">{photoPublicLabel(o.photo, 'fr')}</span>
                    </div>
                    <div className="text-xs text-stone-400">
                      {o.buyerEmail || 'Email non renseigné'} · {o.total} EUR · {new Date(o.createdAt).toLocaleDateString('fr')}
                    </div>
                  </div>
                  <ValidateWiseButton orderId={o.id} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photos à publier */}
          <div className="bg-white rounded border border-stone-100 p-6">
            <h2 className="font-serif text-xl text-stone-700 mb-4">Photos en attente</h2>
            {unpublished.length === 0 ? (
              <p className="text-stone-400 text-sm">Toutes les photos sont publiées.</p>
            ) : (
              <ul className="space-y-2">
                {unpublished.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-stone-700">{photoPublicLabel(p, 'fr')}</span>
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
                      <span className="text-stone-400 ml-2">· {photoPublicLabel(o.photo, 'fr')}</span>
                      {o.paymentMethod === 'wise' && (
                        <span className="text-stone-300 ml-1">(virement)</span>
                      )}
                    </div>
                    <span className={
                      o.paymentStatus === 'paid'                  ? 'text-green-600' :
                      o.paymentStatus === 'failed'                ? 'text-red-500'   :
                      o.paymentStatus === 'awaiting_verification' ? 'text-amber-500' :
                      'text-stone-400'
                    }>
                      {o.paymentStatus === 'awaiting_verification' ? 'en attente' : o.paymentStatus}
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

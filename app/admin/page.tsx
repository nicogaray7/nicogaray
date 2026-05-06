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
    <div className="min-h-screen bg-ink-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-baseline justify-between mb-16">
          <div>
            <h1 className="font-serif text-4xl lg:text-5xl text-accent-500 tracking-wide">Admin</h1>
            <p className="text-ink-600 text-sm mt-2">Nico Garay Photography</p>
          </div>
          <Link
            href="/admin/upload"
            className="bg-accent-500 text-white text-sm font-medium px-5 py-2.5 rounded-sm hover:bg-accent-600 transition-colors duration-200"
          >
            Ajouter photos
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { label: 'Photos totales',   value: totalPhotos },
            { label: 'Photos publiées',  value: publishedPhotos },
            { label: 'Commandes',        value: totalOrders },
            { label: 'Ventes confirmées',value: paidOrders },
          ].map((stat) => (
            <div key={stat.label} className="bg-ink-150 border border-accent-500/30 rounded-sm p-6">
              <p className="text-4xl font-serif text-accent-500">{stat.value}</p>
              <p className="text-xs text-accent-400 mt-3 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Virements Wise en attente */}
        {wiseOrders.length > 0 && (
          <div className="bg-accent-500/10 border border-accent-500/30 rounded-sm p-8 mb-12">
            <h2 className="font-serif text-xl text-accent-500 mb-6">
              Virements Wise en attente ({wiseOrders.length})
            </h2>
            <ul className="space-y-4">
              {wiseOrders.map((o) => (
                <li key={o.id} className="flex items-center justify-between text-sm bg-ink-50 rounded-sm p-4 border border-accent-500/30">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-ink-700">{o.wiseReference}</span>
                      <span className="text-ink-900 font-medium">{photoPublicLabel(o.photo, 'fr')}</span>
                    </div>
                    <div className="text-xs text-ink-700">
                      {o.buyerEmail || 'Email non renseigné'} {o.total} EUR {new Date(o.createdAt).toLocaleDateString('fr')}
                    </div>
                  </div>
                  <ValidateWiseButton orderId={o.id} />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Photos à publier */}
          <div className="bg-ink-150 border border-accent-500/30 rounded-sm p-8">
            <h2 className="font-serif text-xl text-ink-900 mb-6">Photos en attente</h2>
            {unpublished.length === 0 ? (
              <p className="text-ink-700 text-sm">Toutes les photos sont publiées.</p>
            ) : (
              <ul className="space-y-3 divide-y divide-accent-500/20">
                {unpublished.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm py-2.5 first:pt-0">
                    <div>
                      <span className="text-ink-900 font-medium">{photoPublicLabel(p, 'fr')}</span>
                      {p.country && <span className="text-ink-700 ml-3 text-xs">{p.country}</span>}
                    </div>
                    <PublishButton photoId={p.id} />
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Commandes récentes */}
          <div className="bg-ink-150 border border-accent-500/30 rounded-sm p-8">
            <h2 className="font-serif text-xl text-ink-900 mb-6">Commandes récentes</h2>
            {recentOrders.length === 0 ? (
              <p className="text-ink-700 text-sm">Aucune commande.</p>
            ) : (
              <ul className="space-y-3 divide-y divide-accent-500/20">
                {recentOrders.map((o) => (
                  <li key={o.id} className="flex items-center justify-between text-xs py-2.5 first:pt-0">
                    <div>
                      <span className="text-ink-900 font-medium">{o.buyerEmail || 'N/A'}</span>
                      <span className="text-ink-700 ml-3">{photoPublicLabel(o.photo, 'fr')}</span>
                      {o.paymentMethod === 'wise' && (
                        <span className="text-accent-400 ml-2">(virement)</span>
                      )}
                    </div>
                    <span className={
                      o.paymentStatus === 'paid'                  ? 'text-accent-500 font-medium' :
                      o.paymentStatus === 'failed'                ? 'text-red-500 font-medium'   :
                      o.paymentStatus === 'awaiting_verification' ? 'text-accent-400 font-medium' :
                      'text-ink-700'
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

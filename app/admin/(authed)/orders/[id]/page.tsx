import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2-url';
import { formatPrice } from '@/lib/utils';
import { StatusPill } from '@/components/admin';
import { OrderActions } from '../OrderActions';

export const dynamic = 'force-dynamic';

function formatDate(d: Date | null | undefined) {
  if (!d) return '-';
  return new Date(d).toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function OrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      photo: {
        select: {
          id: true,
          title: true,
          slug: true,
          thumbKey: true,
        },
      },
    },
  });

  if (!order) notFound();

  const thumbUrl = order.photo?.thumbKey ? r2PublicUrl(order.photo.thumbKey) : null;

  return (
    <Container size="wide">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Retour aux commandes
      </Link>

      <div className="flex items-start justify-between mb-10 gap-6 flex-wrap">
        <div className="space-y-2">
          <p className="eyebrow text-accent">Commande</p>
          <h1 className="text-display-lg font-display text-ink font-mono text-base">{order.id}</h1>
          <p className="caption text-ink-muted">{formatDate(order.createdAt)}</p>
        </div>
        <StatusPill status={order.paymentStatus} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: buyer + payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buyer */}
          <section className="bg-paper border border-line p-6">
            <h2 className="eyebrow text-ink-muted mb-4">Acheteur</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Nom</dt>
                <dd className="text-ink">{order.buyerName ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Email</dt>
                <dd className="text-ink">{order.buyerEmail ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Telephone</dt>
                <dd className="text-ink">{order.buyerPhone ?? '-'}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Pays</dt>
                <dd className="text-ink">{order.buyerCountry ?? '-'}</dd>
              </div>
            </dl>
          </section>

          {/* Payment */}
          <section className="bg-paper border border-line p-6">
            <h2 className="eyebrow text-ink-muted mb-4">Paiement</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Methode</dt>
                <dd className="text-ink capitalize">{order.paymentMethod}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Statut</dt>
                <dd><StatusPill status={order.paymentStatus} /></dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Montant photo</dt>
                <dd className="text-ink tabular-nums">{formatPrice(order.amount, order.currency)}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Frais</dt>
                <dd className="text-ink tabular-nums">{formatPrice(order.fees, order.currency)}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Total</dt>
                <dd className="text-ink tabular-nums font-medium">{formatPrice(order.total, order.currency)}</dd>
              </div>
              {order.refundReason && (
                <div className="col-span-2">
                  <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Motif remboursement</dt>
                  <dd className="text-ink">{order.refundReason}</dd>
                </div>
              )}
              {order.stripeSessionId && (
                <div className="col-span-2">
                  <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Stripe Session</dt>
                  <dd className="text-ink font-mono text-xs break-all">{order.stripeSessionId}</dd>
                </div>
              )}
              {order.stripePaymentIntentId && (
                <div className="col-span-2">
                  <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Payment Intent</dt>
                  <dd className="text-ink font-mono text-xs break-all">{order.stripePaymentIntentId}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Downloads */}
          <section className="bg-paper border border-line p-6">
            <h2 className="eyebrow text-ink-muted mb-4">Telechargements</h2>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Compteur</dt>
                <dd className="text-ink tabular-nums">{order.downloadCount} / {order.downloadMax}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Expiration</dt>
                <dd className="text-ink">{formatDate(order.downloadExpiry)}</dd>
              </div>
              <div>
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Dernier DL</dt>
                <dd className="text-ink">{formatDate(order.downloadedAt)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[10px] tracking-widest uppercase text-ink-muted mb-1">Token</dt>
                <dd className="text-ink font-mono text-xs break-all">{order.downloadToken}</dd>
              </div>
            </dl>
          </section>

          {/* Timeline */}
          <section className="bg-paper border border-line p-6">
            <h2 className="eyebrow text-ink-muted mb-4">Timeline</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between">
                <span className="text-ink-muted text-[10px] tracking-widest uppercase">Créé le</span>
                <span className="text-ink">{formatDate(order.createdAt)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-muted text-[10px] tracking-widest uppercase">Paye le</span>
                <span className="text-ink">{formatDate(order.paidAt)}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-ink-muted text-[10px] tracking-widest uppercase">Remboursé le</span>
                <span className="text-ink">{formatDate(order.refundedAt)}</span>
              </li>
            </ul>
          </section>
        </div>

        {/* Right column: photo + actions */}
        <div className="space-y-6">
          {/* Photo */}
          {order.photo && (
            <section className="bg-paper border border-line p-4">
              <h2 className="eyebrow text-ink-muted mb-3">Photo</h2>
              {thumbUrl && (
                <div className="aspect-square bg-paper-cool overflow-hidden mb-3 relative">
                  <Image
                    src={thumbUrl}
                    alt={order.photo.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 300px"
                  />
                </div>
              )}
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-ink font-medium">{order.photo.title}</p>
                <Link
                  href={`/admin/photos/${order.photo.id}`}
                  className="inline-flex items-center gap-1 text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors"
                >
                  Voir
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </section>
          )}

          {/* Actions */}
          <section className="bg-paper border border-line p-4">
            <h2 className="eyebrow text-ink-muted mb-3">Actions</h2>
            <OrderActions orderId={order.id} paymentStatus={order.paymentStatus} />
          </section>
        </div>
      </div>
    </Container>
  );
}

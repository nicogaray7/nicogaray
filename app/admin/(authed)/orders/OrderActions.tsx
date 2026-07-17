'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Mail, RotateCcw } from 'lucide-react';
import { ConfirmDialog } from '@/components/admin';
import { refundOrder, resendDownloadLink, resetDownloads } from './orders-actions';

export function OrderActions({
  orderId,
  paymentStatus,
}: {
  orderId: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Une erreur est survenue');
      }
    });
  }

  const canRefund = paymentStatus === 'paid';

  return (
    <div className="flex flex-col gap-3">
      <ConfirmDialog
        trigger={
          <button
            type="button"
            disabled={!canRefund || isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase border transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-red-300 text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Rembourser
          </button>
        }
        title="Rembourser la commande"
        description="Cette action est irreversible. Le remboursement sera execute via Stripe et le statut de la commande passera a 'refunded'."
        confirmLabel="Rembourser"
        destructive
        onConfirm={() => run(() => refundOrder(orderId))}
      />

      <ConfirmDialog
        trigger={
          <button
            type="button"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase border border-line text-ink-muted hover:text-ink transition-colors disabled:opacity-40"
          >
            <Mail className="w-3.5 h-3.5" />
            Renvoyer le lien
          </button>
        }
        title="Renvoyer le lien de telechargement"
        description="Un email avec le lien de telechargement actuel sera renvoye a l'acheteur."
        confirmLabel="Envoyer"
        onConfirm={() => run(() => resendDownloadLink(orderId))}
      />

      <ConfirmDialog
        trigger={
          <button
            type="button"
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase border border-line text-ink-muted hover:text-ink transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reinitialiser les DL
          </button>
        }
        title="Reinitialiser les telechargements"
        description="Le compteur sera remis a zero et un nouveau token genere. Valable 30 jours."
        confirmLabel="Reinitialiser"
        onConfirm={() => run(() => resetDownloads(orderId))}
      />
    </div>
  );
}

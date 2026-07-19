'use client';

import React, { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, Mail, RotateCcw, FlaskConical } from 'lucide-react';
import { ConfirmDialog } from '@/components/admin';
import { refundOrder, resendDownloadLink, resetDownloads, setOrderTest } from './orders-actions';

export function OrderActions({
  orderId,
  paymentStatus,
  isTest,
}: {
  orderId: string;
  paymentStatus: string;
  isTest: boolean;
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
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium border border-red-300 text-red-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-4 h-4" />
            Rembourser
          </button>
        }
        title="Rembourser la commande"
        description="Cette action est irréversible. Le remboursement sera exécuté via Stripe et le statut de la commande passera à 'refunded'."
        confirmLabel="Rembourser"
        destructive
        onConfirm={() => run(() => refundOrder(orderId))}
      />

      <ConfirmDialog
        trigger={
          <button
            type="button"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm border border-line text-ink-muted hover:text-ink hover:bg-paper-cool transition-colors disabled:opacity-40"
          >
            <Mail className="w-4 h-4" />
            Renvoyer le lien
          </button>
        }
        title="Renvoyer le lien de téléchargement"
        description="Un email avec le lien de téléchargement actuel sera renvoyé à l'acheteur."
        confirmLabel="Envoyer"
        onConfirm={() => run(() => resendDownloadLink(orderId))}
      />

      <ConfirmDialog
        trigger={
          <button
            type="button"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm border border-line text-ink-muted hover:text-ink hover:bg-paper-cool transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser les DL
          </button>
        }
        title="Réinitialiser les téléchargements"
        description="Le compteur sera remis à zéro et un nouveau token généré. Valable 30 jours."
        confirmLabel="Réinitialiser"
        onConfirm={() => run(() => resetDownloads(orderId))}
      />

      <button
        type="button"
        disabled={isPending}
        onClick={() => run(() => setOrderTest(orderId, !isTest))}
        className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm border border-line text-ink-muted hover:text-ink hover:bg-paper-cool transition-colors disabled:opacity-40"
      >
        <FlaskConical className="w-4 h-4" />
        {isTest ? 'Retirer le marquage test' : 'Marquer comme test'}
      </button>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirmer',
  destructive = false,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void | Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleConfirm() {
    setPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-ink/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl border border-line p-6 max-w-sm w-full shadow-lg focus:outline-none">
          <Dialog.Title className="text-base font-semibold text-ink mb-2">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="text-sm text-ink-muted mb-6">
              {description}
            </Dialog.Description>
          )}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-md border border-line px-4 py-2 text-sm text-ink-muted hover:bg-paper-cool transition-colors disabled:opacity-50"
                disabled={pending}
              >
                Annuler
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={pending}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                destructive
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-ink text-white hover:bg-ink-soft'
              }`}
            >
              {pending ? 'En cours...' : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

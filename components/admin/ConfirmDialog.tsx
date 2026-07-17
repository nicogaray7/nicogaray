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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-paper border border-line p-6 max-w-sm w-full shadow-lg focus:outline-none">
          <Dialog.Title className="font-display text-ink text-lg mb-2">
            {title}
          </Dialog.Title>
          {description && (
            <Dialog.Description className="caption text-ink-muted mb-6">
              {description}
            </Dialog.Description>
          )}
          <div className="flex items-center justify-end gap-3 mt-6">
            <Dialog.Close asChild>
              <button
                type="button"
                className="text-sm text-ink-muted hover:text-ink transition-colors px-4 py-2 border border-line"
                disabled={pending}
              >
                Annuler
              </button>
            </Dialog.Close>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={pending}
              className={`text-sm px-4 py-2 transition-colors disabled:opacity-50 ${
                destructive
                  ? 'bg-red-700 text-white hover:bg-red-800'
                  : 'bg-ink text-paper hover:bg-ink-soft'
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

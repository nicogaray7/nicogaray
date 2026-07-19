'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { startRegistration } from '@simplewebauthn/browser';
import { beginRegistration, finishRegistration, deletePasskey } from '@/app/admin/passkey-actions';

type PK = { id: string; name: string | null; createdAt: string; lastUsedAt: string | null };

export function PasskeysClient({ passkeys }: { passkeys: PK[] }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState('');

  async function add() {
    setError('');
    setPending(true);
    try {
      const options = await beginRegistration();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const resp = await startRegistration(options as any);
      const label =
        typeof navigator !== 'undefined' && navigator.platform ? navigator.platform : 'Appareil';
      await finishRegistration(JSON.stringify(resp), label);
      router.refresh();
    } catch {
      setError("Enregistrement annulé ou clé déjà présente.");
    } finally {
      setPending(false);
    }
  }

  async function remove(id: string) {
    setPending(true);
    try {
      await deletePasskey(id);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      {passkeys.length === 0 ? (
        <p className="text-sm text-ink-muted mb-4">
          Aucune clé d&apos;accès. Ajoutez-en une pour vous connecter avec Touch ID / Face ID.
        </p>
      ) : (
        <ul className="divide-y divide-line mb-4">
          {passkeys.map((p) => (
            <li key={p.id} className="py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-ink">{p.name || "Clé d'accès"}</p>
                <p className="text-xs text-ink-muted">
                  Ajoutée le {new Date(p.createdAt).toLocaleDateString('fr-FR')}
                  {p.lastUsedAt
                    ? ` · dernière utilisation le ${new Date(p.lastUsedAt).toLocaleDateString('fr-FR')}`
                    : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(p.id)}
                disabled={pending}
                className="text-xs text-red-700 hover:underline disabled:opacity-50"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}
      {error && <p className="text-xs text-red-700 mb-3">{error}</p>}
      <button
        type="button"
        onClick={add}
        disabled={pending}
        className="rounded-md bg-ink text-white px-4 py-2 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
      >
        {pending ? '...' : "Ajouter une clé d'accès"}
      </button>
    </div>
  );
}

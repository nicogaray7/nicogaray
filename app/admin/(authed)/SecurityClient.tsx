'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { ConfirmDialog } from '@/components/admin';
import { startTotpSetup, enableTotp, disableTotp } from '@/app/admin/security-actions';

interface SetupData {
  secret: string;
  qr: string;
}

export function SecurityClient({ enabled }: { enabled: boolean }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [setup, setSetup] = useState<SetupData | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  function handleStartSetup() {
    setError('');
    startTransition(async () => {
      try {
        const data = await startTotpSetup();
        setSetup({ secret: data.secret, qr: data.qr });
        setCode('');
      } catch {
        setError('Erreur lors de la generation du secret 2FA.');
      }
    });
  }

  function handleEnable() {
    if (!setup) return;
    setError('');
    startTransition(async () => {
      try {
        await enableTotp(setup.secret, code);
        setSetup(null);
        setCode('');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de l\'activation.');
      }
    });
  }

  function handleDisable() {
    setError('');
    startTransition(async () => {
      try {
        await disableTotp(code);
        setCode('');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors de la désactivation.');
      }
    });
  }

  if (!enabled) {
    return (
      <div className="space-y-4">
        {!setup ? (
          <Button onClick={handleStartSetup} disabled={isPending}>
            {isPending ? 'Chargement...' : 'Activer la 2FA'}
          </Button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-ink-muted">
              Scannez ce QR code avec votre application d'authentification (ex. Google Authenticator, Authy).
            </p>
            <img src={setup.qr} alt="QR code 2FA" className="w-48 h-48 border border-line" />
            <div className="space-y-1">
              <p className="text-sm text-ink-muted">Ou entrez le secret manuellement :</p>
              <code className="text-xs font-mono bg-paper-cool border border-line px-2 py-1 block break-all">
                {setup.secret}
              </code>
            </div>
            <div className="space-y-2 max-w-xs">
              <Label htmlFor="enable-code">Code de verification</Label>
              <Input
                id="enable-code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                disabled={isPending}
              />
            </div>
            {error && (
              <p className="text-xs text-red-700 border-l-2 border-red-700 pl-3 py-1">{error}</p>
            )}
            <Button onClick={handleEnable} disabled={isPending || code.length < 6}>
              {isPending ? 'Vérification...' : 'Vérifier et activer'}
            </Button>
          </div>
        )}
        {error && !setup && (
          <p className="text-xs text-red-700 border-l-2 border-red-700 pl-3 py-1">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-w-xs">
        <Label htmlFor="disable-code">Code 2FA pour confirmer la désactivation</Label>
        <Input
          id="disable-code"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="000000"
          disabled={isPending}
        />
      </div>
      {error && (
        <p className="text-xs text-red-700 border-l-2 border-red-700 pl-3 py-1">{error}</p>
      )}
      <ConfirmDialog
        trigger={
          <Button variant="destructive" disabled={isPending || code.length < 6}>
            Désactiver la 2FA
          </Button>
        }
        title="Désactiver la 2FA ?"
        description="Cela supprimera la double authentification de votre compte. Confirmez avec votre code 2FA."
        confirmLabel="Désactiver"
        destructive
        onConfirm={handleDisable}
      />
    </div>
  );
}

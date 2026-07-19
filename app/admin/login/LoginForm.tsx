'use client';
import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { startAuthentication } from '@simplewebauthn/browser';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { beginAuthentication } from '@/app/admin/passkey-actions';

export function LoginForm({
  redirectTo,
  initialError,
}: {
  redirectTo?: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState(initialError ?? '');
  const [totp, setTotp] = React.useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setPending(true);

    const formData = new FormData(e.currentTarget);
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      totp,
      redirect: false,
    });

    setPending(false);
    if (result?.error) {
      setError('Email ou mot de passe invalide');
      return;
    }
    router.push(redirectTo ?? '/admin');
    router.refresh();
  }

  async function onPasskey() {
    setError('');
    setPending(true);
    try {
      const options = await beginAuthentication();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const assertion = await startAuthentication(options as any);
      const result = await signIn('passkey', {
        assertion: JSON.stringify(assertion),
        redirect: false,
      });
      if (result?.error) {
        setError("Clé d'accès non reconnue.");
        setPending(false);
        return;
      }
      router.push(redirectTo ?? '/admin');
      router.refresh();
    } catch {
      setError("Connexion par clé d'accès annulée ou indisponible.");
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 bg-white rounded-xl p-8 sm:p-10 border border-line shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="totp">Code 2FA</Label>
        <Input
          id="totp"
          name="totp"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={totp}
          onChange={(e) => setTotp(e.target.value)}
          autoComplete="one-time-code"
        />
        <p className="text-xs text-ink-muted">Si la 2FA est activee</p>
      </div>
      {error && (
        <p className="text-xs text-red-700 border-l-2 border-red-700 pl-3 py-1">{error}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Connexion...' : 'Se connecter'}
      </Button>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-ink-muted">ou</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={onPasskey}
        disabled={pending}
        className="w-full rounded-md border border-line px-4 py-2.5 text-sm font-medium text-ink hover:bg-paper-cool transition-colors disabled:opacity-50"
      >
        Se connecter avec une clé d'accès (Touch ID / Face ID)
      </button>
    </form>
  );
}

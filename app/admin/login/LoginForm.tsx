'use client';
import * as React from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

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
    </form>
  );
}

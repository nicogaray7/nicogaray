'use client';
import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { createCheckoutSession } from './actions';

export function CheckoutForm({ photoId, locale }: { photoId: string; locale: string }) {
  const t = useTranslations('checkout');
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await createCheckoutSession({
      photoId,
      locale,
      email: String(formData.get('email')),
      name: String(formData.get('name')) || undefined,
    });
    if (result.error) {
      setError(result.error);
      setPending(false);
      return;
    }
    if (result.url) window.location.href = result.url;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">{t('email')}</Label>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">{t('name')}</Label>
        <Input id="name" name="name" autoComplete="name" />
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? '…' : t('submit')}
      </Button>
    </form>
  );
}

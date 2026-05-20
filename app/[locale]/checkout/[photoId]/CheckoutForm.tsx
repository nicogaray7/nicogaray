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
    const firstName = String(formData.get('firstName') || '').trim();
    const lastName = String(formData.get('lastName') || '').trim();
    const result = await createCheckoutSession({
      photoId,
      locale,
      email: String(formData.get('email')),
      firstName,
      lastName,
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t('firstName')}</Label>
          <Input id="firstName" name="firstName" required autoComplete="given-name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t('lastName')}</Label>
          <Input id="lastName" name="lastName" required autoComplete="family-name" />
        </div>
      </div>
      {error && <p className="text-xs text-red-700">{error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? '…' : t('submit')}
      </Button>
    </form>
  );
}

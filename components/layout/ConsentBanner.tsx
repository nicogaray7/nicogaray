'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

const CONSENT_KEY = 'consent-accepted';

export function ConsentBanner() {
  const t = useTranslations('consent');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem(CONSENT_KEY);
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const updateConsent = (accepted: boolean) => {
    window.gtag?.('consent', 'update', {
      ad_storage: accepted ? 'granted' : 'denied',
      ad_user_data: accepted ? 'granted' : 'denied',
      ad_personalization: accepted ? 'granted' : 'denied',
      analytics_storage: 'granted',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });

    localStorage.setItem(CONSENT_KEY, String(accepted));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink text-paper border-t border-ink/20 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm mb-4">{t('description')}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="sm" onClick={() => updateConsent(false)}>
            {t('reject')}
          </Button>
          <Button variant="accent" size="sm" onClick={() => updateConsent(true)}>
            {t('accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}

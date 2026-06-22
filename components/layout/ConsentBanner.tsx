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
      analytics_storage: accepted ? 'granted' : 'denied',
      functionality_storage: 'granted',
      security_storage: 'granted',
    });

    localStorage.setItem(CONSENT_KEY, String(accepted));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ink/95 text-paper border-t border-paper/10 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-paper/80 leading-snug">{t('short')}</p>
        <div className="flex shrink-0 items-center gap-2 self-end sm:self-auto">
          <Button
            variant="primary"
            size="sm"
            className="bg-paper text-ink hover:bg-paper/90"
            onClick={() => updateConsent(false)}
          >
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

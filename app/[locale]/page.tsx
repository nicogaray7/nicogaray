import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';

export default function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = useTranslations('home');

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-2xl text-center space-y-6">
        <p className="eyebrow">{t('tagline')}</p>
        <h1 className="text-display-2xl font-display">{t('title')}</h1>
        <p className="prose-editorial">{t('subtitle')}</p>
      </div>
    </main>
  );
}

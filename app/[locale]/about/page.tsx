import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';

export default function AboutPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <AboutView />;
}

function AboutView() {
  const t = useTranslations('about');
  return (
    <article className="py-24 sm:py-32">
      <Container size="narrow">
        <header className="mb-16 space-y-6">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h1 className="text-display-xl font-display text-ink">{t('title')}</h1>
          <p className="text-2xl font-display text-ink-soft leading-snug">{t('lede')}</p>
        </header>

        <div className="prose-editorial space-y-6">
          <p>{t('p1')}</p>
          <p>{t('p2')}</p>
          <p>{t('p3')}</p>
        </div>
      </Container>
    </article>
  );
}

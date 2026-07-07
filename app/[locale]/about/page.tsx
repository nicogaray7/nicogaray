import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { getSetting, pickText, type AboutSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  setRequestLocale(params.locale);
  const settings = await getSetting<AboutSettings>('about');
  return <AboutView locale={params.locale} settings={settings} />;
}

function AboutView({ locale, settings }: { locale: string; settings: AboutSettings | null }) {
  const t = useTranslations('about');
  const title = pickText(settings?.title, locale, t('title'));
  const lede = pickText(settings?.lede, locale, t('lede'));
  const fallbackBody = [t('p1'), t('p2'), t('p3')].join('\n\n');
  const body = pickText(settings?.body, locale, fallbackBody);

  return (
    <article className="py-24 sm:py-32">
      <Container size="narrow">
        <header className="mb-16 space-y-6">
          <p className="eyebrow text-accent">{t('eyebrow')}</p>
          <h1 className="text-display-xl font-display text-ink">{title}</h1>
          <p className="text-2xl font-display text-ink-soft leading-snug">{lede}</p>
        </header>

        <div className="prose-feed text-lg space-y-6 whitespace-pre-line">{body}</div>
      </Container>
    </article>
  );
}

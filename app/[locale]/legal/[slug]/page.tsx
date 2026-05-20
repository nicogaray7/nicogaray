import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { getSetting, pickText, type LegalSettings } from '@/lib/settings';

const SLUGS = ['cgv', 'license', 'mentions'] as const;
type LegalSlug = (typeof SLUGS)[number];

export const dynamic = 'force-dynamic';

export default async function LegalPage({ params }: { params: { locale: string; slug: string } }) {
  if (!SLUGS.includes(params.slug as LegalSlug)) notFound();
  setRequestLocale(params.locale);
  const settings = await getSetting<LegalSettings>('legal');
  return <LegalView slug={params.slug as LegalSlug} locale={params.locale} settings={settings} />;
}

function LegalView({ slug, locale, settings }: { slug: LegalSlug; locale: string; settings: LegalSettings | null }) {
  const t = useTranslations(`legal.${slug}`);
  const entry = settings?.[slug];
  const title = pickText(entry?.title, locale, t('title'));
  const body = pickText(entry?.body, locale, t('body'));

  return (
    <article className="py-24 sm:py-32">
      <Container size="narrow">
        <header className="mb-12 space-y-4">
          <p className="eyebrow text-accent">Legal</p>
          <h1 className="text-display-lg font-display text-ink">{title}</h1>
        </header>
        <div className="prose-feed text-lg space-y-5 whitespace-pre-line">{body}</div>
      </Container>
    </article>
  );
}

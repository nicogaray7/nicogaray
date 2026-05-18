import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';

const SLUGS = ['cgv', 'license', 'mentions'] as const;
type LegalSlug = (typeof SLUGS)[number];

export function generateStaticParams() {
  return SLUGS.flatMap((slug) =>
    ['fr', 'en'].map((locale) => ({ locale, slug })),
  );
}

export default function LegalPage({ params }: { params: { locale: string; slug: string } }) {
  if (!SLUGS.includes(params.slug as LegalSlug)) notFound();
  setRequestLocale(params.locale);
  return <LegalView slug={params.slug as LegalSlug} />;
}

function LegalView({ slug }: { slug: LegalSlug }) {
  const t = useTranslations(`legal.${slug}`);
  return (
    <article className="py-24 sm:py-32">
      <Container size="narrow">
        <header className="mb-12 space-y-4">
          <p className="eyebrow text-accent">Legal</p>
          <h1 className="text-display-lg font-display text-ink">{t('title')}</h1>
        </header>
        <div className="prose-editorial space-y-5 whitespace-pre-line">{t('body')}</div>
      </Container>
    </article>
  );
}

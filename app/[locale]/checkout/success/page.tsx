import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getOrder(sessionId: string) {
  return prisma.order.findFirst({
    where: { stripeSessionId: sessionId },
    include: { photo: { select: { title: true, slug: true } } },
  });
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { session_id?: string };
}) {
  setRequestLocale(params.locale);
  const order = searchParams.session_id ? await getOrder(searchParams.session_id) : null;
  return <SuccessView locale={params.locale} token={order?.downloadToken} photoTitle={order?.photo.title} />;
}

function SuccessView({
  locale,
  token,
  photoTitle,
}: {
  locale: string;
  token?: string;
  photoTitle?: string;
}) {
  const t = useTranslations('checkout.success');
  return (
    <section className="min-h-[70vh] flex items-center py-24">
      <Container size="narrow">
        <div className="text-center space-y-8">
          <CheckCircle2 className="w-16 h-16 text-accent mx-auto" />
          <div className="space-y-3">
            <p className="eyebrow text-accent">Confirmation</p>
            <h1 className="text-display-lg font-display text-ink">{t('title')}</h1>
            {photoTitle && <p className="prose-editorial">{photoTitle}</p>}
            <p className="prose-editorial">{t('subtitle')}</p>
          </div>
          {token ? (
            <Link
              href={`/${locale}/download/${token}`}
              className="inline-flex items-center gap-3 px-9 py-4 bg-ink text-paper text-[11px] tracking-widest uppercase hover:bg-accent transition-colors duration-300 group"
            >
              {t('download')}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          ) : (
            <p className="caption">{t('email')}</p>
          )}
          <p className="caption">{t('expiry')}</p>
          <p className="caption">{t('email')}</p>
        </div>
      </Container>
    </section>
  );
}

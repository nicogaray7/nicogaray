import Link from 'next/link';
import { Download, AlertTriangle } from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getOrder(token: string) {
  return prisma.order.findUnique({
    where: { downloadToken: token },
    include: { photo: { select: { title: true, slug: true } } },
  });
}

export default async function DownloadPage({ params }: { params: { locale: string; token: string } }) {
  setRequestLocale(params.locale);
  const order = await getOrder(params.token);

  const now = Date.now();
  const valid =
    !!order &&
    order.paymentStatus === 'paid' &&
    (!order.downloadExpiry || order.downloadExpiry.getTime() > now) &&
    order.downloadCount < order.downloadMax;

  return (
    <DownloadView
      valid={valid}
      photoTitle={order?.photo.title}
      token={params.token}
      remaining={order ? order.downloadMax - order.downloadCount : 0}
      locale={params.locale}
      expiry={order?.downloadExpiry}
    />
  );
}

function DownloadView({
  valid,
  photoTitle,
  token,
  remaining,
  locale,
  expiry,
}: {
  valid: boolean;
  photoTitle?: string;
  token: string;
  remaining: number;
  locale: string;
  expiry?: Date | null;
}) {
  const t = useTranslations('checkout.success');
  return (
    <section className="min-h-[70vh] flex items-center py-24">
      <Container size="narrow">
        {valid ? (
          <div className="text-center space-y-8">
            <p className="eyebrow text-accent">Download</p>
            <h1 className="text-display-lg font-display text-ink">{photoTitle}</h1>
            <a
              href={`/api/download/${token}`}
              className="inline-flex items-center gap-3 px-9 py-4 bg-ink text-paper text-[11px] tracking-widest uppercase hover:bg-accent transition-colors duration-300"
            >
              <Download className="w-4 h-4" />
              {t('download')}
            </a>
            <div className="space-y-1">
              <p className="caption">{remaining} download(s) remaining</p>
              {expiry && (
                <p className="caption">
                  Link expires {new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'fr-FR', { dateStyle: 'long', timeStyle: 'short' }).format(expiry)}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <AlertTriangle className="w-12 h-12 text-ink-muted mx-auto" />
            <h1 className="text-display-lg font-display text-ink">Link unavailable</h1>
            <p className="prose-editorial">
              This download link has expired, reached its limit, or doesn't exist.
            </p>
            <Link
              href={`/${locale}/gallery`}
              className="inline-flex items-center gap-2 text-[11px] tracking-widest uppercase text-accent hover:text-ink transition-colors"
            >
              Back to gallery
            </Link>
          </div>
        )}
      </Container>
    </section>
  );
}

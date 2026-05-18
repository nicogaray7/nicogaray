import { Resend } from 'resend';

let _resend: Resend | null = null;

function getResend(): Resend | null {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

const FROM = process.env.RESEND_FROM ?? 'Nico Garay <noreply@photos.nicogaray.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com';

export async function sendPurchaseEmail(params: {
  to: string;
  photoTitle: string;
  downloadToken: string;
  total: number;
  currency: string;
  locale?: 'fr' | 'en';
}) {
  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping email');
    return;
  }
  const downloadUrl = `${SITE_URL}/${params.locale ?? 'fr'}/download/${params.downloadToken}`;
  const isFr = (params.locale ?? 'fr') === 'fr';

  const subject = isFr
    ? `Votre achat — ${params.photoTitle}`
    : `Your purchase — ${params.photoTitle}`;

  const body = isFr
    ? `Bonjour,\n\nMerci pour votre achat de "${params.photoTitle}".\n\nVotre fichier HD est prêt au téléchargement :\n${downloadUrl}\n\nLien valable 48 heures, 3 téléchargements maximum.\n\nÀ très vite,\nNico`
    : `Hi,\n\nThank you for purchasing "${params.photoTitle}".\n\nYour HD file is ready to download:\n${downloadUrl}\n\nLink valid for 48 hours, 3 downloads max.\n\nCheers,\nNico`;

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject,
    text: body,
  });
}

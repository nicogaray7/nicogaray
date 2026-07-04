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
  /** Stripe Payment Intent ID (pi_xxx). Shown to the client and searchable in the Stripe dashboard for 1:1 reconciliation. */
  paymentIntentId?: string | null;
  locale?: 'fr' | 'en';
}) {
  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set, skipping email');
    return;
  }
  const locale = params.locale ?? 'fr';
  const downloadUrl = `${SITE_URL}/${locale}/download/${params.downloadToken}`;
  const isFr = locale === 'fr';
  const ref = params.paymentIntentId ?? '';
  // Short, human-friendly reference for the subject line (last 8 chars of the PI ID, uppercase).
  const shortRef = ref ? ref.slice(-8).toUpperCase() : '';

  const subject = isFr
    ? `Votre achat, ${params.photoTitle}${shortRef ? ` · #${shortRef}` : ''}`
    : `Your purchase, ${params.photoTitle}${shortRef ? ` · #${shortRef}` : ''}`;

  const refBlockFr = ref
    ? `\nRéférence de commande : ${ref}\n(à conserver, elle permet de retrouver votre paiement côté Stripe)\n`
    : '';
  const refBlockEn = ref
    ? `\nOrder reference: ${ref}\n(keep it - it locates your payment on the Stripe side)\n`
    : '';

  const body = isFr
    ? `Bonjour,\n\nMerci pour votre achat de "${params.photoTitle}".\n${refBlockFr}\nVotre fichier HD est prêt au téléchargement :\n${downloadUrl}\n\nLien valable 48 heures, 3 téléchargements maximum.\n\nÀ très vite,\nNico`
    : `Hi,\n\nThank you for purchasing "${params.photoTitle}".\n${refBlockEn}\nYour HD file is ready to download:\n${downloadUrl}\n\nLink valid for 48 hours, 3 downloads max.\n\nCheers,\nNico`;

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject,
    text: body,
  });
}

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = process.env.RESEND_FROM ?? 'noreply@photos-garaynico.com'

export async function sendDownloadEmail({
  to,
  name,
  photoTitle,
  downloadUrl,
  expiry,
  locale = 'fr',
}: {
  to: string
  name?: string
  photoTitle: string
  downloadUrl: string
  expiry: Date
  locale?: string
}): Promise<void> {
  const isFr = locale === 'fr'
  const subject = isFr
    ? `Votre photo "${photoTitle}" est prête`
    : `Your photo "${photoTitle}" is ready`

  const html = isFr
    ? `
      <p>Bonjour ${name ?? ''},</p>
      <p>Merci pour votre achat ! Votre fichier HD <strong>${photoTitle}</strong> est prêt.</p>
      <p><a href="${downloadUrl}" style="background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;">Télécharger la photo HD</a></p>
      <p style="color:#888;font-size:12px;">Lien valable jusqu'au ${expiry.toLocaleDateString('fr-FR')} · maximum 3 téléchargements.</p>
      <p style="color:#888;font-size:12px;">© Nico Garay - photos-garaynico.com</p>
    `
    : `
      <p>Hello ${name ?? ''},</p>
      <p>Thank you for your purchase! Your HD file <strong>${photoTitle}</strong> is ready.</p>
      <p><a href="${downloadUrl}" style="background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;">Download HD photo</a></p>
      <p style="color:#888;font-size:12px;">Link valid until ${expiry.toLocaleDateString('en-GB')} · max 3 downloads.</p>
      <p style="color:#888;font-size:12px;">© Nico Garay - photos-garaynico.com</p>
    `

  await resend.emails.send({ from: FROM, to, subject, html })
}

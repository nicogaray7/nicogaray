import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { findIncomingByReference } from '@/lib/wise'
import { sendDownloadEmail } from '@/lib/email'
import { photoPublicLabel } from '@/lib/photoLabel'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com'

export async function POST(req: NextRequest) {
  try {
    const { reference, buyerEmail } = await req.json()

    const order = await prisma.order.findFirst({
      where: { wiseReference: reference },
      include: { photo: true },
    })

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 })
    }

    // Déjà payé → renvoyer le lien
    if (order.paymentStatus === 'paid') {
      return NextResponse.json({
        status: 'paid',
        downloadUrl: `${SITE_URL}/api/download/${order.downloadToken}`,
      })
    }

    // Sauvegarder l'email si fourni
    if (buyerEmail && !order.buyerEmail) {
      await prisma.order.update({
        where: { id: order.id },
        data: { buyerEmail },
      })
    }

    // Tenter vérification automatique Wise (nécessite READ_STATEMENTS)
    const transfer = await findIncomingByReference(reference)

    if (transfer) {
      // Virement confirmé automatiquement
      const paidAt = new Date()
      await prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'paid', paidAt },
      })

      const email = buyerEmail || order.buyerEmail
      if (email) {
        await sendDownloadEmail({
          to: email,
          photoTitle: photoPublicLabel(order.photo, 'fr'),
          downloadUrl: `${SITE_URL}/api/download/${order.downloadToken}`,
          expiry: order.downloadExpiry!,
          locale: 'fr',
        }).catch(console.error)
      }

      return NextResponse.json({
        status: 'paid',
        downloadUrl: `${SITE_URL}/api/download/${order.downloadToken}`,
      })
    }

    // Vérification automatique impossible → passer en "awaiting"
    // L'admin recevra la commande dans le dashboard et pourra valider manuellement
    if (order.paymentStatus === 'pending') {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'awaiting_verification',
          ...(buyerEmail ? { buyerEmail } : {}),
        },
      })
    }

    return NextResponse.json({
      status: 'awaiting',
      message: 'Virement enregistré. Vous recevrez votre lien de téléchargement par email dès confirmation (généralement sous 24h).',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[WISE VERIFY]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

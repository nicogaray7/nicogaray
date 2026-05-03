import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getFromR2, r2Key } from '@/lib/r2'
import { applyBuyerWatermark } from '@/lib/watermark'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params

  const order = await prisma.order.findUnique({
    where: { downloadToken: token },
    include: { photo: true },
  })

  if (!order) {
    return NextResponse.json({ error: 'Token invalide' }, { status: 404 })
  }

  if (order.paymentStatus !== 'paid') {
    return NextResponse.json({ error: 'Paiement non confirmé' }, { status: 403 })
  }

  if (order.downloadExpiry && new Date() > order.downloadExpiry) {
    return NextResponse.json({ error: 'Lien expiré' }, { status: 410 })
  }

  if (order.downloadCount >= order.downloadMax) {
    return NextResponse.json({ error: 'Limite de téléchargements atteinte' }, { status: 429 })
  }

  // Incrémenter le compteur
  await prisma.order.update({
    where: { id: order.id },
    data: {
      downloadCount: { increment: 1 },
      downloadedAt: order.downloadedAt ?? new Date(),
    },
  })

  // Récupérer le HD original depuis R2
  const hdKey = r2Key('hd', order.photoId)
  const hdBuffer = await getFromR2(hdKey)

  // Appliquer le watermark acheteur en mémoire
  const watermarked = await applyBuyerWatermark(hdBuffer, {
    buyerEmail: order.buyerEmail,
    id: order.id,
    paidAt: order.paidAt ?? new Date(),
  })

  const filename = `nico-garay-${order.photo.id}.jpg`

  return new NextResponse(new Uint8Array(watermarked), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': String(watermarked.length),
      'Cache-Control': 'no-store',
    },
  })
}

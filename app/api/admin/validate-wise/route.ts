import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { sendDownloadEmail } from '@/lib/email'
import { photoPublicLabel } from '@/lib/photoLabel'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { orderId } = await req.json()

    const order = await prisma.order.update({
      where: { id: orderId },
      data:  { paymentStatus: 'paid', paidAt: new Date() },
      include: { photo: true },
    })

    if (order.buyerEmail) {
      await sendDownloadEmail({
        to:          order.buyerEmail,
        photoTitle:  photoPublicLabel(order.photo, 'fr'),
        downloadUrl: `${SITE_URL}/api/download/${order.downloadToken}`,
        expiry:      order.downloadExpiry!,
        locale:      'fr',
      }).catch(console.error)
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

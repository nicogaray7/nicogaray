import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { findTransferByReference } from '@/lib/wise'
import { sendDownloadEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  const { reference } = await req.json()

  const order = await prisma.order.findFirst({
    where: { wiseReference: reference },
    include: { photo: true },
  })

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  if (order.paymentStatus === 'paid') {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos-garaynico.com'
    return NextResponse.json({
      status: 'paid',
      downloadUrl: `${siteUrl}/api/download/${order.downloadToken}`,
    })
  }

  const transfer = await findTransferByReference(reference)

  if (!transfer) {
    return NextResponse.json({ status: 'pending' })
  }

  const paidAt = new Date()
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: 'paid', paidAt },
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos-garaynico.com'
  const downloadUrl = `${siteUrl}/api/download/${order.downloadToken}`

  if (order.buyerEmail) {
    await sendDownloadEmail({
      to: order.buyerEmail,
      photoTitle: order.photo.title,
      downloadUrl,
      expiry: order.downloadExpiry!,
      locale: 'fr',
    }).catch(console.error)
  }

  return NextResponse.json({ status: 'paid', downloadUrl })
}

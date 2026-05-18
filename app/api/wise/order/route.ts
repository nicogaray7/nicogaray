import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateWiseReference } from '@/lib/wise'
import { generateDownloadToken, getDownloadExpiry } from '@/lib/tokens'

export async function POST(req: NextRequest) {
  const { photoId } = await req.json()

  const photo = await prisma.photo.findUnique({
    where: { id: photoId, published: true },
  })

  if (!photo) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
  }

  const order = await prisma.order.create({
    data: {
      photoId: photo.id,
      buyerEmail: '',
      paymentMethod: 'wise',
      paymentStatus: 'pending',
      amount: photo.price,
      fees: 0,
      total: photo.price,
      downloadToken: generateDownloadToken(),
      downloadExpiry: getDownloadExpiry(72), // 72h pour le virement
    },
  })

  const reference = generateWiseReference(order.id)
  await prisma.order.update({
    where: { id: order.id },
    data: { wiseReference: reference },
  })

  return NextResponse.json({
    orderId: order.id,
    reference,
    iban: process.env.WISE_ACCOUNT_IBAN ?? '',
    amount: photo.price,
    total: photo.price,
    currency: 'EUR',
  })
}

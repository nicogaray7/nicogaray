import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { photoId, published } = await req.json()

  const photo = await prisma.photo.update({
    where: { id: photoId },
    data: { published: published ?? true },
  })

  return NextResponse.json({ photo })
}

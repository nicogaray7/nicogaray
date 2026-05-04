import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { photoId, published } = await req.json()

    if (!photoId) {
      return NextResponse.json({ error: 'photoId manquant' }, { status: 400 })
    }

    const photo = await prisma.photo.update({
      where: { id: photoId },
      data: { published: published ?? true },
    })

    return NextResponse.json({ photo })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[PUBLISH ERROR]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

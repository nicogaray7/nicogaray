import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { photoIds } = await req.json() as { photoIds?: string[] }

    let count: number

    if (photoIds && photoIds.length > 0) {
      // Publier une liste spécifique
      const result = await prisma.photo.updateMany({
        where: { id: { in: photoIds } },
        data:  { published: true },
      })
      count = result.count
    } else {
      // Publier TOUTES les photos non publiées
      const result = await prisma.photo.updateMany({
        where: { published: false },
        data:  { published: true },
      })
      count = result.count
    }

    return NextResponse.json({ published: count })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[PUBLISH-ALL ERROR]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

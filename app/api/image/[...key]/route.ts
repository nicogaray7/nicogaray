import { NextRequest, NextResponse } from 'next/server'
import { getFromR2 } from '@/lib/r2'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params
  const fullKey = key.join('/')

  // Anti-hotlinking : bloquer les requêtes venant d'un autre domaine
  // On autorise : pas de referer (accès direct / serveur interne), ou referer du site
  if (process.env.NODE_ENV === 'production') {
    const referer = req.headers.get('referer') ?? ''
    const host    = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com'

    const isInternal = !referer                           // fetch serveur (Next Image)
    const isOwn      = referer.startsWith(host)          // pages du site
    const isNextImg  = referer.includes('/_next/')        // optimisation Next.js

    if (!isInternal && !isOwn && !isNextImg) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  try {
    const imageBuffer = await getFromR2(fullKey)
    const isWebp = fullKey.startsWith('thumb/')
    const contentType = isWebp ? 'image/webp' : 'image/jpeg'

    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type':  contentType,
        'Cache-Control': 'private, max-age=86400',
        'X-Robots-Tag':  'noindex',
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}

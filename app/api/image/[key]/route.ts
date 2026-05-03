import { NextRequest, NextResponse } from 'next/server'
import { getFromR2 } from '@/lib/r2'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params

  // Protection anti-hotlinking : bloquer les requêtes sans referer en prod
  if (process.env.NODE_ENV === 'production') {
    const referer = req.headers.get('referer') ?? ''
    const host = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos-garaynico.com'
    if (!referer.startsWith(host)) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  try {
    const imageBuffer = await getFromR2(key)
    const isWebp = key.includes('thumb')
    const contentType = isWebp ? 'image/webp' : 'image/jpeg'

    return new NextResponse(new Uint8Array(imageBuffer), {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, max-age=3600',
        'X-Robots-Tag': 'noindex',
        'Content-Security-Policy': "default-src 'none'",
      },
    })
  } catch {
    return new NextResponse('Not Found', { status: 404 })
  }
}

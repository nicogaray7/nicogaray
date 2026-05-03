import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { uploadToR2, r2Key } from '@/lib/r2'
import { processPhoto } from '@/lib/watermark'
import { extractExif, getOrientation, reverseGeocode, buildTags } from '@/lib/exif'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cuid } from '@/lib/cuidgen'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const photoId = cuid()

  // 1. Traitement des images (sharp + watermarks)
  const { hd, preview, thumb, width, height } = await processPhoto(buffer)

  // 2. Upload vers R2
  await Promise.all([
    uploadToR2(r2Key('hd', photoId), hd, 'image/jpeg'),
    uploadToR2(r2Key('preview', photoId), preview, 'image/jpeg'),
    uploadToR2(r2Key('thumb', photoId), thumb, 'image/webp'),
  ])

  // 3. EXIF + géocodage
  const exif = await extractExif(buffer)
  const orientation = getOrientation(width, height)
  let country: string | undefined
  let city: string | undefined

  if (exif.latitude && exif.longitude) {
    const geo = await reverseGeocode(exif.latitude, exif.longitude)
    country = geo?.country
    city = geo?.city
  }

  const tags = buildTags(country, orientation)

  // 4. Titre par défaut depuis le nom du fichier
  const defaultTitle = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')

  // 5. Sauvegarde en base
  const photo = await prisma.photo.create({
    data: {
      id: photoId,
      title: (formData.get('title') as string) || defaultTitle,
      titleEn: (formData.get('titleEn') as string) || defaultTitle,
      description: (formData.get('description') as string) || undefined,
      descriptionEn: (formData.get('descriptionEn') as string) || undefined,
      fileKeyR2: r2Key('hd', photoId),
      thumbKeyR2: r2Key('thumb', photoId),
      previewKeyR2: r2Key('preview', photoId),
      fileSize: buffer.length,
      width,
      height,
      orientation,
      tags,
      country: country ?? undefined,
      city: city ?? undefined,
      latitude: exif.latitude,
      longitude: exif.longitude,
      takenAt: exif.takenAt,
      camera: exif.camera,
      lens: exif.lens,
      published: false,
    },
  })

  return NextResponse.json({ photo })
}

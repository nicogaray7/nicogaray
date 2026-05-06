import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { uploadToR2, r2Key } from '@/lib/r2'
import { processPhoto } from '@/lib/watermark'
import { extractExif, getOrientation, reverseGeocode, buildTags } from '@/lib/exif'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { cuid } from '@/lib/cuidgen'
import sharp from 'sharp'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const photoId = cuid()

    // 1. Extraire les métadonnées EXIF AVANT tout traitement
    const exif = await extractExif(buffer)
    console.log(`[UPLOAD] EXIF extrait pour ${file.name}:`, {
      camera: exif.camera,
      lens: exif.lens,
      takenAt: exif.takenAt,
      gps: exif.latitude ? `${exif.latitude?.toFixed(4)}, ${exif.longitude?.toFixed(4)}` : 'non disponible',
      exifDims: exif.width && exif.height ? `${exif.width}×${exif.height}` : 'non disponible',
    })

    // 2. Traitement sharp (watermarks + redimensionnement)
    const { hd, preview, thumb, width: sharpW, height: sharpH } = await processPhoto(buffer)

    // Dimensions réelles : EXIF en priorité (corrige rotation), sinon sharp
    const width  = exif.width  ?? sharpW
    const height = exif.height ?? sharpH

    // Vérification avec sharp en fallback
    const finalW = width  || (await sharp(buffer).metadata()).width  || 0
    const finalH = height || (await sharp(buffer).metadata()).height || 0

    const orientation = getOrientation(finalW, finalH)
    console.log(`[UPLOAD] Dimensions: ${finalW}×${finalH} → orientation: ${orientation}`)

    // 3. Upload vers R2
    await Promise.all([
      uploadToR2(r2Key('hd', photoId), hd, 'image/jpeg'),
      uploadToR2(r2Key('preview', photoId), preview, 'image/jpeg'),
      uploadToR2(r2Key('thumb', photoId), thumb, 'image/webp'),
    ])
    console.log(`[UPLOAD] R2 upload OK pour ${photoId}`)

    // 4. Géocodage inverse (si GPS disponible)
    let country: string | undefined
    let city: string | undefined

    if (exif.latitude && exif.longitude) {
      const geo = await reverseGeocode(exif.latitude, exif.longitude)
      country = geo?.country || undefined
      city    = geo?.city    || undefined
      console.log(`[UPLOAD] Géolocalisation: ${city ?? '-'}, ${country ?? '-'}`)
    } else {
      console.log('[UPLOAD] Pas de données GPS dans cette photo')
    }

    const tags = buildTags(country, orientation)

    // 5. Sauvegarde en base (titres vides : libellé public = lieu)
    const photo = await prisma.photo.create({
      data: {
        id:            photoId,
        title:         '',
        titleEn:       '',
        description:   (formData.get('description')   as string) || undefined,
        descriptionEn: (formData.get('descriptionEn') as string) || undefined,
        fileKeyR2:     r2Key('hd', photoId),
        thumbKeyR2:    r2Key('thumb', photoId),
        previewKeyR2:  r2Key('preview', photoId),
        fileSize:      buffer.length,
        width:         finalW,
        height:        finalH,
        orientation,
        tags,
        country:       country   ?? undefined,
        city:          city      ?? undefined,
        latitude:      exif.latitude,
        longitude:     exif.longitude,
        takenAt:       exif.takenAt,
        published:     false,
      },
    })

    console.log(`[UPLOAD] Photo sauvegardée en DB: ${photo.id} - ${country ?? 'sans pays'}`)
    return NextResponse.json({ photo })

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[UPLOAD ERROR]', message)
    return NextResponse.json({ error: `Erreur upload : ${message}` }, { status: 500 })
  }
}

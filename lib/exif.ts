import exifr from 'exifr'

export interface ExifData {
  latitude?: number
  longitude?: number
  takenAt?: Date
  camera?: string
  lens?: string
  /** Dimensions réelles après correction rotation EXIF */
  width?: number
  height?: number
}

export async function extractExif(buffer: Buffer): Promise<ExifData> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = await (exifr.parse as any)(buffer, {
      tiff: true,   // Make, Model, Orientation
      exif: true,   // DateTimeOriginal, LensModel, dimensions
      gps:  true,   // latitude, longitude
      ifd0: true,
      translateKeys: true,
      translateValues: true,
      reviveValues: true,
    })

    if (!data) return {}

    const rawW: number = data.ExifImageWidth  ?? data.PixelXDimension ?? data.ImageWidth  ?? 0
    const rawH: number = data.ExifImageHeight ?? data.PixelYDimension ?? data.ImageHeight ?? 0

    // EXIF Orientation : numéro ou texte traduit par exifr
    // Orientations 5-8 signifient une rotation de 90°/270° → swap largeur/hauteur
    const orientVal = data.Orientation
    const swapped = typeof orientVal === 'number'
      ? orientVal >= 5 && orientVal <= 8
      : typeof orientVal === 'string' && (
          orientVal.includes('90 CW') ||
          orientVal.includes('270 CW') ||
          orientVal.includes('rotate 90') ||
          orientVal.includes('rotate 270')
        )
    const width  = swapped ? rawH : rawW
    const height = swapped ? rawW : rawH

    return {
      latitude:  data.latitude  ?? data.GPSLatitude,
      longitude: data.longitude ?? data.GPSLongitude,
      takenAt:   data.DateTimeOriginal ?? data.DateTime,
      camera:    [data.Make, data.Model].filter(Boolean).join(' ') || undefined,
      lens:      data.LensModel || data.Lens || undefined,
      width:     width || undefined,
      height:    height || undefined,
    }
  } catch {
    return {}
  }
}

export type Orientation = 'landscape' | 'portrait' | 'square'

export function getOrientation(width: number, height: number): Orientation {
  if (width > height * 1.05) return 'landscape'
  if (height > width * 1.05) return 'portrait'
  return 'square'
}

export interface GeoLocation {
  country:     string
  countryCode: string
  city?:       string
}

const geocodeCache = new Map<string, GeoLocation>()

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation | null> {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`
  if (geocodeCache.has(key)) return geocodeCache.get(key)!

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=fr`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const data = await res.json()

    const result: GeoLocation = {
      country:     data.countryName   || '',
      countryCode: data.countryCode   || '',
      city:        data.city || data.locality || data.principalSubdivision || undefined,
    }
    geocodeCache.set(key, result)
    return result
  } catch {
    return null
  }
}

export function buildTags(country: string | undefined, orientation: Orientation): string[] {
  const tags: string[] = [orientation]
  if (country) tags.push(country)
  return tags
}

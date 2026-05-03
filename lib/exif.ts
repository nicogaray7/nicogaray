import exifr from 'exifr'

export interface ExifData {
  latitude?: number
  longitude?: number
  takenAt?: Date
  camera?: string
  lens?: string
  width?: number
  height?: number
}

export async function extractExif(buffer: Buffer): Promise<ExifData> {
  try {
    const data = await exifr.parse(buffer, {
      gps: true,
      pick: ['Make', 'Model', 'LensModel', 'DateTimeOriginal', 'ExifImageWidth', 'ExifImageHeight', 'PixelXDimension', 'PixelYDimension'],
    })
    if (!data) return {}

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      takenAt: data.DateTimeOriginal,
      camera: [data.Make, data.Model].filter(Boolean).join(' ') || undefined,
      lens: data.LensModel || undefined,
      width: data.ExifImageWidth || data.PixelXDimension,
      height: data.ExifImageHeight || data.PixelYDimension,
    }
  } catch {
    return {}
  }
}

export type Orientation = 'landscape' | 'portrait' | 'square'

export function getOrientation(width: number, height: number): Orientation {
  if (width > height * 1.1) return 'landscape'
  if (height > width * 1.1) return 'portrait'
  return 'square'
}

export interface GeoLocation {
  country: string
  countryCode: string
  city?: string
}

const geocodeCache = new Map<string, GeoLocation>()

export async function reverseGeocode(lat: number, lon: number): Promise<GeoLocation | null> {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`
  if (geocodeCache.has(key)) return geocodeCache.get(key)!

  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    const res = await fetch(url)
    if (!res.ok) return null
    const data = await res.json()
    const result: GeoLocation = {
      country: data.countryName || '',
      countryCode: data.countryCode || '',
      city: data.city || data.locality || undefined,
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

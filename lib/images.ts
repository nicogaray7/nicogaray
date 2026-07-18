import sharp from 'sharp';
import exifr from 'exifr';

export interface ImageVariants {
  original: Buffer;
  preview: Buffer; // ~1600px, watermarked
  thumb: Buffer; // ~600px, watermarked
  width: number;
  height: number;
  orientation: 'landscape' | 'portrait' | 'square';
}

export interface ExtractedExif {
  takenAt?: Date;
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: number;
  latitude?: number;
  longitude?: number;
}

const PREVIEW_MAX = 1600;
const THUMB_MAX = 600;
const PREVIEW_QUALITY = 82;
const THUMB_QUALITY = 78;

const WM_TEXT = '© NICO GARAY · photos.nicogaray.com';

/**
 * Build a tiled diagonal watermark covering the whole image.
 * Very low opacity (~7%) so it stays unobtrusive while making cropping
 * the image to remove the mark essentially impractical (the text
 * repeats every ~280px in a -30deg pattern, soft mix-blend).
 */
export function watermarkSvg(width: number, height: number): Buffer {
  const dim = Math.max(width, height);
  const fontSize = Math.max(14, Math.round(dim * 0.016));
  const stepX = Math.max(260, Math.round(fontSize * 18));
  const stepY = Math.max(160, Math.round(fontSize * 7));

  // Two-tone watermark: a stronger dark stroke for readability on bright
  // areas, a white fill for readability on dark areas. Light enough to
  // remain unobtrusive when looking at the photo, dense enough that
  // cropping it out isn't realistic.
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <pattern id="wm" patternUnits="userSpaceOnUse" width="${stepX}" height="${stepY}" patternTransform="rotate(-28)">
      <text x="0" y="${stepY / 2}"
        font-family="-apple-system, system-ui, 'Segoe UI', sans-serif"
        font-size="${fontSize}" font-weight="600"
        fill="#FFFFFF" fill-opacity="0.22"
        stroke="#000000" stroke-width="0.6" stroke-opacity="0.22"
        paint-order="stroke"
        letter-spacing="${fontSize * 0.18}">${WM_TEXT}</text>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#wm)"/>
</svg>`);
}

async function applyWatermark(buffer: Buffer): Promise<Buffer> {
  const meta = await sharp(buffer).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) return buffer;
  return sharp(buffer)
    .composite([{ input: watermarkSvg(w, h), top: 0, left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

export async function processImage(buffer: Buffer): Promise<ImageVariants> {
  const base = sharp(buffer, { failOn: 'none' }).rotate();
  const meta = await base.metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;

  const orientation: ImageVariants['orientation'] =
    Math.abs(width - height) < Math.min(width, height) * 0.05
      ? 'square'
      : width > height
        ? 'landscape'
        : 'portrait';

  const original = await sharp(buffer).rotate().jpeg({ quality: 92, mozjpeg: true }).toBuffer();

  const previewRaw = await sharp(buffer)
    .rotate()
    .resize({ width: PREVIEW_MAX, height: PREVIEW_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: PREVIEW_QUALITY, mozjpeg: true })
    .toBuffer();
  const preview = await applyWatermark(previewRaw);

  const thumbRaw = await sharp(buffer)
    .rotate()
    .resize({ width: THUMB_MAX, height: THUMB_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
    .toBuffer();
  const thumb = await applyWatermark(thumbRaw);

  return { original, preview, thumb, width, height, orientation };
}

export async function extractExif(buffer: Buffer): Promise<ExtractedExif> {
  try {
    const exif = await exifr.parse(buffer, {
      tiff: true,
      exif: true,
      gps: true,
      pick: [
        'DateTimeOriginal',
        'CreateDate',
        'Make',
        'Model',
        'LensModel',
        'LensMake',
        'FocalLength',
        'FNumber',
        'ExposureTime',
        'ISO',
        'latitude',
        'longitude',
      ],
    });
    if (!exif) return {};

    const camera = [exif.Make, exif.Model].filter(Boolean).join(' ').trim() || undefined;
    const lens = [exif.LensMake, exif.LensModel].filter(Boolean).join(' ').trim() || undefined;
    const focalLength = exif.FocalLength ? `${Math.round(exif.FocalLength)}mm` : undefined;
    const aperture = exif.FNumber ? `f/${Math.round(exif.FNumber * 10) / 10}` : undefined;
    const shutterSpeed = exif.ExposureTime
      ? exif.ExposureTime >= 1
        ? `${exif.ExposureTime}s`
        : `1/${Math.round(1 / exif.ExposureTime)}s`
      : undefined;

    return {
      takenAt: exif.DateTimeOriginal ?? exif.CreateDate,
      camera,
      lens,
      focalLength,
      aperture,
      shutterSpeed,
      iso: exif.ISO,
      latitude: exif.latitude,
      longitude: exif.longitude,
    };
  } catch {
    return {};
  }
}

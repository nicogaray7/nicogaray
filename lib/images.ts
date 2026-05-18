import sharp from 'sharp';
import exifr from 'exifr';

export interface ImageVariants {
  original: Buffer;
  preview: Buffer; // ~1600px watermarked
  thumb: Buffer; // ~600px
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
  const preview = await sharp(buffer)
    .rotate()
    .resize({ width: PREVIEW_MAX, height: PREVIEW_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: PREVIEW_QUALITY, mozjpeg: true })
    .toBuffer();
  const thumb = await sharp(buffer)
    .rotate()
    .resize({ width: THUMB_MAX, height: THUMB_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
    .toBuffer();

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
    const aperture = exif.FNumber ? `f/${exif.FNumber}` : undefined;
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

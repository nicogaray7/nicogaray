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

const WATERMARK_TEXT = '© NICO GARAY';

function watermarkSvg(width: number, height: number, opts: { large?: boolean } = {}): Buffer {
  // Two-line watermark in the bottom-right corner: name + URL.
  // The font size scales with the smaller dimension so it stays readable
  // across orientations.
  const dim = Math.min(width, height);
  const baseSize = opts.large ? Math.max(18, Math.round(dim * 0.022)) : Math.max(12, Math.round(dim * 0.026));
  const sub = Math.round(baseSize * 0.6);
  const pad = Math.round(dim * 0.025);
  const x = width - pad;
  const y = height - pad - sub - 4;
  const ySub = height - pad;
  const opacity = 0.85;
  const blur = Math.max(2, Math.round(baseSize * 0.15));

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}"/>
      <feOffset dx="0" dy="${blur / 3}" result="o"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.55"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g filter="url(#s)" font-family="-apple-system, system-ui, 'Segoe UI', sans-serif" text-anchor="end">
    <text x="${x}" y="${y}" font-size="${baseSize}" font-weight="600" fill="#FFFFFF" opacity="${opacity}" letter-spacing="${baseSize * 0.08}">${WATERMARK_TEXT}</text>
    <text x="${x}" y="${ySub}" font-size="${sub}" fill="#FFFFFF" opacity="${opacity * 0.85}" letter-spacing="${sub * 0.08}">photos.nicogaray.com</text>
  </g>
</svg>`);
}

async function watermark(buffer: Buffer, opts: { large?: boolean } = {}): Promise<Buffer> {
  const meta = await sharp(buffer).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) return buffer;
  return sharp(buffer)
    .composite([{ input: watermarkSvg(w, h, opts), top: 0, left: 0 }])
    .jpeg({ quality: meta.format === 'jpeg' ? 82 : 85, mozjpeg: true })
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

  // Original: untouched, HD, no watermark, what buyers download
  const original = await sharp(buffer).rotate().jpeg({ quality: 92, mozjpeg: true }).toBuffer();

  // Preview + thumb: resized AND watermarked
  const previewRaw = await sharp(buffer)
    .rotate()
    .resize({ width: PREVIEW_MAX, height: PREVIEW_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: PREVIEW_QUALITY, mozjpeg: true })
    .toBuffer();
  const preview = await watermark(previewRaw, { large: true });

  const thumbRaw = await sharp(buffer)
    .rotate()
    .resize({ width: THUMB_MAX, height: THUMB_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: THUMB_QUALITY, mozjpeg: true })
    .toBuffer();
  const thumb = await watermark(thumbRaw, { large: false });

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

/**
 * Re-fetch each Photo.originalKey from R2 and re-upload watermarked
 * preview + thumb variants. Originals are left untouched (buyers always
 * get the un-watermarked HD via signed download).
 */
import { PrismaClient } from '@prisma/client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { r2, r2Put, R2_BUCKET } from '../lib/r2';

const prisma = new PrismaClient();

const PREVIEW_MAX = 1600;
const THUMB_MAX = 600;
const WATERMARK_TEXT = '© NICO GARAY';

function watermarkSvg(width: number, height: number, large: boolean): Buffer {
  const dim = Math.min(width, height);
  const baseSize = large ? Math.max(18, Math.round(dim * 0.022)) : Math.max(12, Math.round(dim * 0.026));
  const sub = Math.round(baseSize * 0.6);
  const pad = Math.round(dim * 0.025);
  const x = width - pad;
  const y = height - pad - sub - 4;
  const ySub = height - pad;
  const blur = Math.max(2, Math.round(baseSize * 0.15));

  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <defs>
    <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}"/>
      <feOffset dx="0" dy="${blur / 3}"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.55"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <g filter="url(#s)" font-family="-apple-system, system-ui, 'Segoe UI', sans-serif" text-anchor="end">
    <text x="${x}" y="${y}" font-size="${baseSize}" font-weight="600" fill="#FFFFFF" opacity="0.85" letter-spacing="${baseSize * 0.08}">${WATERMARK_TEXT}</text>
    <text x="${x}" y="${ySub}" font-size="${sub}" fill="#FFFFFF" opacity="0.72" letter-spacing="${sub * 0.08}">photos.nicogaray.com</text>
  </g>
</svg>`);
}

async function fetchKey(key: string): Promise<Buffer> {
  const resp = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  const chunks: Buffer[] = [];
  // @ts-expect-error — stream type from AWS SDK is opaque
  for await (const c of resp.Body) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks);
}

async function main() {
  const photos = await prisma.photo.findMany({
    select: { id: true, slug: true, originalKey: true, previewKey: true, thumbKey: true },
    orderBy: { sortOrder: 'asc' },
  });

  console.log(`Re-processing ${photos.length} photos…`);
  let ok = 0;
  let fail = 0;

  for (const [i, p] of photos.entries()) {
    const tag = `[${i + 1}/${photos.length}]`;
    try {
      const buf = await fetchKey(p.originalKey);

      // Preview
      const previewRaw = await sharp(buf)
        .rotate()
        .resize({ width: PREVIEW_MAX, height: PREVIEW_MAX, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();
      const pMeta = await sharp(previewRaw).metadata();
      const preview = await sharp(previewRaw)
        .composite([{ input: watermarkSvg(pMeta.width!, pMeta.height!, true), top: 0, left: 0 }])
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer();

      // Thumb
      const thumbRaw = await sharp(buf)
        .rotate()
        .resize({ width: THUMB_MAX, height: THUMB_MAX, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toBuffer();
      const tMeta = await sharp(thumbRaw).metadata();
      const thumb = await sharp(thumbRaw)
        .composite([{ input: watermarkSvg(tMeta.width!, tMeta.height!, false), top: 0, left: 0 }])
        .jpeg({ quality: 78, mozjpeg: true })
        .toBuffer();

      await Promise.all([
        r2Put(p.previewKey, preview, 'image/jpeg'),
        r2Put(p.thumbKey, thumb, 'image/jpeg'),
      ]);

      ok++;
      console.log(`${tag} ok  ${p.slug}`);
    } catch (err) {
      fail++;
      console.error(`${tag} fail  ${p.slug}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log('');
  console.log(`Re-processed: ${ok}`);
  console.log(`Failed:       ${fail}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

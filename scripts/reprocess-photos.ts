/**
 * Re-fetch each Photo.originalKey from R2 and re-upload watermarked
 * preview + thumb variants. Originals are left untouched (buyers always
 * get the un-watermarked HD via signed download).
 */
import { PrismaClient } from '@prisma/client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { r2, r2Put, R2_BUCKET } from '../lib/r2';
import { watermarkSvg } from '../lib/images';

const prisma = new PrismaClient();

const PREVIEW_MAX = 1600;
const THUMB_MAX = 600;

async function fetchKey(key: string): Promise<Buffer> {
  const resp = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  const chunks: Buffer[] = [];
  // @ts-expect-error - stream type from AWS SDK is opaque
  for await (const c of resp.Body) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks);
}

async function variantWithMark(buf: Buffer, max: number, quality: number): Promise<Buffer> {
  const raw = await sharp(buf)
    .rotate()
    .resize({ width: max, height: max, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
  const meta = await sharp(raw).metadata();
  return sharp(raw)
    .composite([{ input: watermarkSvg(meta.width!, meta.height!), top: 0, left: 0 }])
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
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
      const [preview, thumb] = await Promise.all([
        variantWithMark(buf, PREVIEW_MAX, 82),
        variantWithMark(buf, THUMB_MAX, 78),
      ]);
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

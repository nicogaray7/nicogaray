/**
 * Generate a few watermarked previews on a separate `samples/` key
 * prefix so you can validate the watermark style before re-running it
 * on all 213 photos. Picks 3 photos with varied content (landscape +
 * portrait + bright + dark) to stress-test the watermark.
 */
import { PrismaClient } from '@prisma/client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { r2, r2Put, R2_BUCKET, r2PublicUrl } from '../lib/r2';
import { watermarkSvg } from '../lib/images';

const prisma = new PrismaClient();

const PREVIEW_MAX = 1600;
const SAMPLE_SIZE = 3;
const SAMPLE_PREFIX = 'samples';

async function fetchKey(key: string): Promise<Buffer> {
  const resp = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  const chunks: Buffer[] = [];
  // @ts-expect-error - stream type from AWS SDK is opaque
  for await (const c of resp.Body) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks);
}

async function variant(buf: Buffer): Promise<Buffer> {
  const raw = await sharp(buf)
    .rotate()
    .resize({ width: PREVIEW_MAX, height: PREVIEW_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
  const meta = await sharp(raw).metadata();
  return sharp(raw)
    .composite([{ input: watermarkSvg(meta.width!, meta.height!), top: 0, left: 0 }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer();
}

async function main() {
  // Mix one landscape, one portrait, one bright/sky shot
  const picks = await prisma.photo.findMany({
    where: { published: true, originalKey: { not: '' } },
    orderBy: { takenAt: 'desc' },
    take: 60,
  });
  const landscape = picks.find((p) => p.orientation === 'landscape');
  const portrait = picks.find((p) => p.orientation === 'portrait');
  const square = picks.find((p) => p.orientation === 'square');
  const selection = [landscape, portrait, square].filter(Boolean).slice(0, SAMPLE_SIZE) as typeof picks;

  console.log(`Generating ${selection.length} sample(s):`);
  const urls: string[] = [];

  for (const p of selection) {
    const buf = await fetchKey(p.originalKey);
    const out = await variant(buf);
    const sampleKey = `${SAMPLE_PREFIX}/${p.id}-${Date.now()}.jpg`;
    await r2Put(sampleKey, out, 'image/jpeg');
    const url = r2PublicUrl(sampleKey);
    urls.push(url ?? sampleKey);
    console.log(`  ${p.slug.padEnd(30)}  ${p.orientation.padEnd(9)}  ${url}`);
  }

  console.log('');
  console.log('Sample URLs:');
  for (const u of urls) console.log('  ' + u);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

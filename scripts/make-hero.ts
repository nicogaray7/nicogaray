/**
 * Generate a clean (un-watermarked) preview for the home hero and
 * upload it to hero/main.jpg on R2. Run after changing the HERO_SLUG
 * in app/[locale]/page.tsx.
 */
import { PrismaClient } from '@prisma/client';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { r2, r2Put, R2_BUCKET, r2PublicUrl } from '../lib/r2';

const prisma = new PrismaClient();

const HERO_SLUG = process.argv[2] ?? 'photographie-n-182';
const HERO_KEY = 'hero/main.jpg';
const HERO_MAX = 2400; // larger than regular preview, hero is full-bleed

async function fetchKey(key: string): Promise<Buffer> {
  const resp = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  const chunks: Buffer[] = [];
  // @ts-expect-error - stream type from AWS SDK is opaque
  for await (const c of resp.Body) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks);
}

async function main() {
  const photo = await prisma.photo.findUnique({ where: { slug: HERO_SLUG } });
  if (!photo) {
    console.error(`No photo with slug ${HERO_SLUG}`);
    process.exit(1);
  }

  console.log(`Fetching ${photo.originalKey}…`);
  const buf = await fetchKey(photo.originalKey);

  const out = await sharp(buf)
    .rotate()
    .resize({ width: HERO_MAX, height: HERO_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  await r2Put(HERO_KEY, out, 'image/jpeg');
  console.log(`Uploaded ${HERO_KEY} (${(out.byteLength / 1024 / 1024).toFixed(1)} MB)`);
  console.log(`Public URL: ${r2PublicUrl(HERO_KEY)}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

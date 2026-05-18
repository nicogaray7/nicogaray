import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import * as crypto from 'node:crypto';
import slugify from 'slugify';
import { PrismaClient } from '@prisma/client';
import { processImage, extractExif } from '../lib/images';
import { r2Put } from '../lib/r2';

const prisma = new PrismaClient();

const ROOT = process.argv[2] ?? `${process.env.HOME}/Album`;
const EXT = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff', '.webp']);
const DEFAULT_PRICE = Number(process.env.DEFAULT_PHOTO_PRICE_EUR ?? 5);

async function listImages(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const out: string[] = [];
  for (const e of entries) {
    if (e.isFile() && EXT.has(path.extname(e.name).toLowerCase())) {
      out.push(path.join(dir, e.name));
    }
  }
  // Natural sort: 1, 2, 10, 11 not 1, 10, 11, 2
  return out.sort((a, b) =>
    path.basename(a).localeCompare(path.basename(b), undefined, { numeric: true, sensitivity: 'base' }),
  );
}

async function uniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 1;
  while (await prisma.photo.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }
  return slug;
}

async function main() {
  console.log(`--- Importing photos from ${ROOT} ---`);
  const files = await listImages(ROOT);
  console.log(`Found ${files.length} candidate images.`);
  if (files.length === 0) process.exit(0);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const [i, file] of files.entries()) {
    const name = path.basename(file, path.extname(file));
    const progress = `[${i + 1}/${files.length}]`;
    try {
      const buffer = await fs.readFile(file);
      const { original, preview, thumb, width, height, orientation } = await processImage(buffer);
      const exif = await extractExif(buffer);

      const title = name.match(/^\d+$/) ? `Photographie n° ${name}` : name.replace(/[_-]+/g, ' ');
      const baseSlug = slugify(title, { lower: true, strict: true }).slice(0, 60) || `photo-${name}`;
      const slug = await uniqueSlug(baseSlug);

      const id = crypto.randomBytes(4).toString('hex');
      const originalKey = `photos/${id}/original.jpg`;
      const previewKey = `photos/${id}/preview.jpg`;
      const thumbKey = `photos/${id}/thumb.jpg`;

      await Promise.all([
        r2Put(originalKey, original, 'image/jpeg'),
        r2Put(previewKey, preview, 'image/jpeg'),
        r2Put(thumbKey, thumb, 'image/jpeg'),
      ]);

      await prisma.photo.create({
        data: {
          slug,
          title,
          originalKey,
          previewKey,
          thumbKey,
          fileSize: original.byteLength,
          width,
          height,
          orientation,
          price: DEFAULT_PRICE,
          published: true,
          featured: i < 6,
          sortOrder: i,
          takenAt: exif.takenAt,
          camera: exif.camera,
          lens: exif.lens,
          focalLength: exif.focalLength,
          aperture: exif.aperture,
          shutterSpeed: exif.shutterSpeed,
          iso: exif.iso,
          latitude: exif.latitude,
          longitude: exif.longitude,
        },
      });

      imported++;
      console.log(`${progress} ok  ${title}  (${(original.byteLength / 1024 / 1024).toFixed(1)} MB)`);
    } catch (err) {
      failed++;
      console.error(`${progress} fail  ${file}:`, err instanceof Error ? err.message : err);
    }
  }

  console.log('');
  console.log(`Imported: ${imported}`);
  console.log(`Skipped:  ${skipped}`);
  console.log(`Failed:   ${failed}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

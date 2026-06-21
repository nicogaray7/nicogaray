'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import slugify from 'slugify';
import sharp from 'sharp';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { r2Put, r2Delete } from '@/lib/r2';
import { processImage, extractExif } from '@/lib/images';
import { COUNTRY_NAMES, nameToCode } from '@/lib/country-names';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

const updateSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  titleEn: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  story: z.string().optional(),
  storyEn: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  city: z.string().optional(),
  tags: z.string().optional(),
  price: z.coerce.number().min(0),
  published: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function updatePhoto(formData: FormData) {
  await requireAdmin();
  const raw = Object.fromEntries(formData.entries());
  const data = updateSchema.parse({
    ...raw,
    published: raw.published === 'on' || raw.published === 'true',
    featured: raw.featured === 'on' || raw.featured === 'true',
  });

  const tags = data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  // Resolve / normalise country code: prefer explicit code, else derive from name
  let countryCode = data.countryCode ? data.countryCode.toUpperCase() : null;
  let countryName = data.country?.trim() || null;
  if (!countryCode && countryName) countryCode = nameToCode(countryName);
  if (countryCode) {
    const meta = COUNTRY_NAMES[countryCode];
    if (meta && !countryName) countryName = meta.fr;
    // Make sure a Country row exists for this code so it appears on map + country pages
    await prisma.country.upsert({
      where: { code: countryCode },
      create: {
        code: countryCode,
        nameFr: meta?.fr ?? countryName ?? countryCode,
        nameEn: meta?.en ?? countryName ?? countryCode,
      },
      update: {},
    });
  }

  await prisma.photo.update({
    where: { id: data.id },
    data: {
      title: data.title,
      titleEn: data.titleEn || null,
      description: data.description || null,
      descriptionEn: data.descriptionEn || null,
      story: data.story || null,
      storyEn: data.storyEn || null,
      country: countryName,
      countryCode,
      city: data.city || null,
      tags,
      price: data.price,
      published: data.published ?? false,
      featured: data.featured ?? false,
      sortOrder: data.sortOrder ?? 0,
    },
  });

  revalidatePath(`/admin/photos`);
  revalidatePath(`/admin/photos/${data.id}`);
  revalidatePath(`/fr/gallery`);
  revalidatePath(`/en/gallery`);
}

export async function deletePhoto(id: string) {
  await requireAdmin();
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) return;

  await Promise.all(
    [photo.originalKey, photo.previewKey, photo.thumbKey]
      .filter(Boolean)
      .map((k) => r2Delete(k).catch(() => undefined)),
  );

  await prisma.photo.delete({ where: { id } });
  revalidatePath('/admin/photos');
  revalidatePath('/fr/gallery');
  revalidatePath('/en/gallery');
  redirect('/admin/photos');
}

export async function togglePublish(id: string) {
  await requireAdmin();
  const photo = await prisma.photo.findUnique({ where: { id }, select: { published: true } });
  if (!photo) return;
  await prisma.photo.update({ where: { id }, data: { published: !photo.published } });
  revalidatePath('/admin/photos');
  revalidatePath('/fr/gallery');
  revalidatePath('/en/gallery');
}

export async function toggleFeatured(id: string) {
  await requireAdmin();
  const photo = await prisma.photo.findUnique({ where: { id }, select: { featured: true } });
  if (!photo) return;
  await prisma.photo.update({ where: { id }, data: { featured: !photo.featured } });
  revalidatePath('/admin/photos');
  revalidatePath('/fr');
  revalidatePath('/en');
}

const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // 50 MB
const ALLOWED_UPLOAD_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/tiff',
]);

export async function uploadPhoto(formData: FormData) {
  await requireAdmin();
  const file = formData.get('file');
  const title = (formData.get('title') as string) || 'Untitled';
  if (!(file instanceof File) || file.size === 0) throw new Error('Missing file');
  if (file.size > MAX_UPLOAD_BYTES) throw new Error('File too large (max 50 MB)');
  if (file.type && !ALLOWED_UPLOAD_TYPES.has(file.type)) {
    throw new Error('Unsupported file type');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // Verify the bytes really are a supported raster image (don't trust the
  // client-provided MIME type). sharp throws on non-images.
  const probe = await sharp(buffer, { failOn: 'none' }).metadata();
  if (!probe.format || !['jpeg', 'png', 'webp', 'tiff'].includes(probe.format)) {
    throw new Error('Unsupported image format');
  }
  const { original, preview, thumb, width, height, orientation } = await processImage(buffer);
  const exif = await extractExif(buffer);

  const baseSlug = slugify(title, { lower: true, strict: true }).slice(0, 60) || 'photo';
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.photo.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const id = crypto.randomUUID().split('-')[0];
  const originalKey = `photos/${id}/original.jpg`;
  const previewKey = `photos/${id}/preview.jpg`;
  const thumbKey = `photos/${id}/thumb.jpg`;

  await Promise.all([
    r2Put(originalKey, original, 'image/jpeg'),
    r2Put(previewKey, preview, 'image/jpeg'),
    r2Put(thumbKey, thumb, 'image/jpeg'),
  ]);

  const defaultPrice = Number(process.env.DEFAULT_PHOTO_PRICE_EUR ?? 5);

  const created = await prisma.photo.create({
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
      price: defaultPrice,
      published: false,
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

  revalidatePath('/admin/photos');
  redirect(`/admin/photos/${created.id}`);
}

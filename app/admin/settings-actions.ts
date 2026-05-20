'use server';
import { revalidatePath } from 'next/cache';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { setSetting } from '@/lib/settings';
import { r2, r2Put, R2_BUCKET } from '@/lib/r2';

const HERO_KEY = 'hero/main.jpg';
const HERO_MAX = 2400;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
}

async function fetchR2(key: string): Promise<Buffer> {
  const resp = await r2.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  const chunks: Buffer[] = [];
  // @ts-expect-error - stream type from AWS SDK is opaque
  for await (const c of resp.Body) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks);
}

/**
 * Set a photo as the home hero. Clears the previous hero, marks this
 * one isHero, and regenerates hero/main.jpg from its untouched original.
 */
export async function setHeroPhoto(photoId: string) {
  await requireAdmin();
  const photo = await prisma.photo.findUnique({ where: { id: photoId } });
  if (!photo) throw new Error('Photo not found');

  await prisma.$transaction([
    prisma.photo.updateMany({ where: { isHero: true }, data: { isHero: false } }),
    prisma.photo.update({ where: { id: photoId }, data: { isHero: true } }),
  ]);

  // Build a fresh clean hero from the untouched original
  const buf = await fetchR2(photo.originalKey);
  const out = await sharp(buf)
    .rotate()
    .resize({ width: HERO_MAX, height: HERO_MAX, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();
  await r2Put(HERO_KEY, out, 'image/jpeg');

  revalidatePath('/fr');
  revalidatePath('/en');
  revalidatePath('/admin/photos');
  revalidatePath(`/admin/photos/${photoId}`);
  revalidatePath('/admin/settings');
}

export async function saveHomeText(formData: FormData) {
  await requireAdmin();
  await setSetting('home', {
    subtitle: {
      fr: (formData.get('subtitleFr') as string) || undefined,
      en: (formData.get('subtitleEn') as string) || undefined,
    },
    cta: {
      fr: (formData.get('ctaFr') as string) || undefined,
      en: (formData.get('ctaEn') as string) || undefined,
    },
  });
  revalidatePath('/fr');
  revalidatePath('/en');
}

export async function saveAboutText(formData: FormData) {
  await requireAdmin();
  await setSetting('about', {
    title: {
      fr: (formData.get('titleFr') as string) || undefined,
      en: (formData.get('titleEn') as string) || undefined,
    },
    lede: {
      fr: (formData.get('ledeFr') as string) || undefined,
      en: (formData.get('ledeEn') as string) || undefined,
    },
    body: {
      fr: (formData.get('bodyFr') as string) || undefined,
      en: (formData.get('bodyEn') as string) || undefined,
    },
  });
  revalidatePath('/fr/about');
  revalidatePath('/en/about');
}

export async function saveLegalText(formData: FormData) {
  await requireAdmin();
  const slug = formData.get('slug') as 'cgv' | 'license' | 'mentions';
  if (!['cgv', 'license', 'mentions'].includes(slug)) throw new Error('Bad slug');

  const current = (await prisma.siteSetting
    .findUnique({ where: { key: 'legal' } })
    .then((r) => (r?.value as Record<string, unknown>) ?? {})) as Record<string, unknown>;

  current[slug] = {
    title: {
      fr: (formData.get('titleFr') as string) || undefined,
      en: (formData.get('titleEn') as string) || undefined,
    },
    body: {
      fr: (formData.get('bodyFr') as string) || undefined,
      en: (formData.get('bodyEn') as string) || undefined,
    },
  };

  await setSetting('legal', current);
  revalidatePath(`/fr/legal/${slug}`);
  revalidatePath(`/en/legal/${slug}`);
}

// Bulk photo actions
type BulkOp = 'publish' | 'unpublish' | 'feature' | 'unfeature' | 'delete';

export async function bulkPhotoAction(formData: FormData) {
  await requireAdmin();
  const op = formData.get('op') as BulkOp;
  const ids = formData.getAll('ids').map((v) => String(v)).filter(Boolean);
  if (ids.length === 0) return;

  if (op === 'publish') await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { published: true } });
  else if (op === 'unpublish') await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { published: false } });
  else if (op === 'feature') await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { featured: true } });
  else if (op === 'unfeature') await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { featured: false } });
  else if (op === 'delete') await prisma.photo.deleteMany({ where: { id: { in: ids } } });

  revalidatePath('/admin/photos');
  revalidatePath('/fr/gallery');
  revalidatePath('/en/gallery');
}

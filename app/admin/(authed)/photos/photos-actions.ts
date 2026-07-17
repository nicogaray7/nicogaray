'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { r2Delete } from '@/lib/r2';
import { logAudit } from '@/lib/audit';

async function requireAdmin() {
  const s = await auth();
  if (!s?.user) throw new Error('Unauthorized');
  return s.user;
}

function revalidateAll() {
  revalidatePath('/admin/photos');
  revalidatePath('/fr/gallery');
  revalidatePath('/en/gallery');
}

export async function bulkSetPublished(ids: string[], value: boolean) {
  await requireAdmin();
  await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { published: value } });
  await logAudit('photo.bulk_publish', { meta: { count: ids.length, ids } });
  revalidateAll();
}

export async function bulkSetFeatured(ids: string[], value: boolean) {
  await requireAdmin();
  await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { featured: value } });
  await logAudit('photo.bulk_featured', { meta: { count: ids.length, ids } });
  revalidateAll();
}

export async function bulkDelete(ids: string[]) {
  await requireAdmin();

  const photos = await prisma.photo.findMany({
    where: { id: { in: ids } },
    select: { id: true, originalKey: true, previewKey: true, thumbKey: true },
  });

  // Delete R2 files best-effort
  await Promise.all(
    photos.flatMap((p) =>
      [p.originalKey, p.previewKey, p.thumbKey]
        .filter(Boolean)
        .map((k) => r2Delete(k).catch(() => undefined)),
    ),
  );

  await prisma.photo.deleteMany({ where: { id: { in: ids } } });
  await logAudit('photo.bulk_delete', { meta: { count: ids.length, ids } });
  revalidateAll();
}

export async function setSortOrder(id: string, order: number) {
  await requireAdmin();
  await prisma.photo.update({ where: { id }, data: { sortOrder: order } });
  await logAudit('photo.sort_order', { meta: { id, order } });
  revalidateAll();
}

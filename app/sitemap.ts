import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const photos = await prisma.photo.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }).catch(() => []);
  const locales = ['fr', 'en'] as const;

  const staticPaths = ['', '/gallery', '/about', '/legal/cgv', '/legal/license', '/legal/mentions'];
  const out: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of staticPaths) {
      out.push({
        url: `${BASE}/${locale}${p}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: p === '' ? 1 : 0.6,
      });
    }
    for (const photo of photos) {
      out.push({
        url: `${BASE}/${locale}/gallery/${photo.slug}`,
        lastModified: photo.updatedAt,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }
  return out;
}

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com'
  const locales = ['fr', 'en']

  const staticPages = [
    '',
    '/shop',
    '/about',
    '/legal/cgv',
    '/legal/license',
    '/legal/mentions',
  ]

  let photos: { id: string; updatedAt: Date }[] = []
  try {
    photos = await prisma.photo.findMany({
      where: { published: true },
      select: { id: true, updatedAt: true },
    })
  } catch {
    // DB non disponible au build
  }

  const routes: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const page of staticPages) {
      routes.push({
        url: `${siteUrl}/${locale}${page}`,
        lastModified: new Date(),
        alternates: {
          languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${page}`])),
        },
      })
    }

    for (const photo of photos) {
      routes.push({
        url: `${siteUrl}/${locale}/shop/${photo.id}`,
        lastModified: photo.updatedAt,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}/shop/${photo.id}`]),
          ),
        },
      })
    }
  }

  return routes
}

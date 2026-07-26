import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2-url';

// Flux RSS 2.0 pour la création groupée d'épingles Pinterest (1 flux = 1 tableau).
// Contient toutes les photos publiées du site (du plus ancien au plus récent).
// L'image est la preview filigranée ; l'original HD est le produit vendu et ne
// sort jamais ici. Le clic renvoie vers la page produit.
// Généré au runtime (pas au build) : sinon la DB n'est pas joignable pendant le
// build Docker et le flux sortirait vide.
export const dynamic = 'force-dynamic';

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com';

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function itemDescription(photo: {
  title: string;
  description: string | null;
  city: string | null;
  country: string | null;
}): string {
  if (photo.description) return photo.description;
  const place = [photo.city, photo.country].filter(Boolean).join(', ');
  return `${photo.title}${place ? `, ${place}` : ''}. Photographie de voyage en édition numérique haute résolution.`;
}

export async function GET() {
  const photos = await prisma.photo
    .findMany({
      where: { published: true },
      select: {
        slug: true,
        title: true,
        description: true,
        city: true,
        country: true,
        previewKey: true,
        createdAt: true,
      },
      // Pinterest publie le plus ancien en premier : tri croissant par date
      // d'ajout pour un ordre de publication prévisible.
      orderBy: { createdAt: 'asc' },
    })
    .catch(() => []);

  const items = photos
    .map((photo) => {
      const img = r2PublicUrl(photo.previewKey);
      if (!img) return null;
      const pageUrl = `${BASE}/fr/gallery/${photo.slug}`;
      const link = `${pageUrl}?utm_source=pinterest&utm_medium=rss`;
      return [
        '    <item>',
        `      <title>${xmlEscape(photo.title)}</title>`,
        `      <description>${xmlEscape(itemDescription(photo))}</description>`,
        `      <link>${xmlEscape(link)}</link>`,
        `      <guid isPermaLink="true">${xmlEscape(pageUrl)}</guid>`,
        `      <pubDate>${photo.createdAt.toUTCString()}</pubDate>`,
        `      <media:content url="${xmlEscape(img)}" medium="image"/>`,
        '    </item>',
      ].join('\n');
    })
    .filter(Boolean)
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Nico Garay · Photographie de voyage</title>
    <link>${xmlEscape(BASE)}</link>
    <description>Photographies de voyage en édition numérique haute résolution.</description>
    <language>fr</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

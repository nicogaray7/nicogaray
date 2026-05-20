import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2';
import { PhotosTable } from './PhotosTable';

export const dynamic = 'force-dynamic';

async function getPhotos() {
  return prisma.photo.findMany({
    orderBy: [{ takenAt: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      title: true,
      titleEn: true,
      country: true,
      city: true,
      price: true,
      currency: true,
      published: true,
      featured: true,
      isHero: true,
      thumbKey: true,
    },
  });
}

export default async function AdminPhotos() {
  const rows = await getPhotos();
  const photos = rows.map((p) => ({
    ...p,
    thumbUrl: r2PublicUrl(p.thumbKey) ?? '',
  }));

  return (
    <Container size="wide">
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div className="space-y-3">
          <p className="eyebrow text-accent">Photos</p>
          <h1 className="text-display-lg font-display text-ink">All photos</h1>
          <p className="caption">{photos.length} total</p>
        </div>
        <Link
          href="/admin/photos/new"
          className="inline-flex items-center px-5 py-2.5 bg-ink text-paper text-[11px] tracking-widest uppercase hover:bg-accent transition-colors"
        >
          + New
        </Link>
      </div>

      {photos.length === 0 ? (
        <div className="border border-dashed border-line py-32 text-center">
          <p className="caption">No photos yet. Upload one or run the import script.</p>
        </div>
      ) : (
        <PhotosTable photos={photos} />
      )}
    </Container>
  );
}

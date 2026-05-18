import Link from 'next/link';
import { Eye, EyeOff, Star, StarOff, Pencil } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2';
import { formatPrice } from '@/lib/utils';
import { togglePublish, toggleFeatured } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

async function getPhotos() {
  return prisma.photo.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  });
}

export default async function AdminPhotos() {
  const photos = await getPhotos();
  return (
    <Container size="wide">
      <div className="flex items-end justify-between mb-10">
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
        <div className="bg-paper border border-line overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-cool">
              <tr className="text-left">
                <Th>Photo</Th>
                <Th>Title</Th>
                <Th>Location</Th>
                <Th>Price</Th>
                <Th>Status</Th>
                <Th className="w-32 text-right">Actions</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {photos.map((p) => {
                const thumbUrl = r2PublicUrl(p.thumbKey) ?? '';
                const location = [p.city, p.country].filter(Boolean).join(', ');
                return (
                  <tr key={p.id} className="hover:bg-paper-cool/60">
                    <td className="p-3">
                      <div className="w-16 h-16 bg-paper-dark overflow-hidden">
                        {thumbUrl && <img src={thumbUrl} alt="" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="p-3">
                      <Link href={`/admin/photos/${p.id}`} className="text-ink hover:text-accent">
                        {p.title}
                      </Link>
                      {p.titleEn && <p className="caption text-xs">{p.titleEn}</p>}
                    </td>
                    <td className="p-3 text-ink-muted">{location || '—'}</td>
                    <td className="p-3 tabular-nums">{formatPrice(p.price, p.currency)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase">
                        <span className={p.published ? 'text-green-700' : 'text-ink-dim'}>
                          {p.published ? 'Published' : 'Draft'}
                        </span>
                        {p.featured && <span className="text-accent">★ Featured</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-1">
                        <form action={togglePublish.bind(null, p.id)}>
                          <IconButton title={p.published ? 'Unpublish' : 'Publish'}>
                            {p.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </IconButton>
                        </form>
                        <form action={toggleFeatured.bind(null, p.id)}>
                          <IconButton title={p.featured ? 'Unfeature' : 'Feature'}>
                            {p.featured ? <StarOff className="w-3.5 h-3.5" /> : <Star className="w-3.5 h-3.5" />}
                          </IconButton>
                        </form>
                        <Link href={`/admin/photos/${p.id}`} className="inline-flex items-center justify-center w-8 h-8 hover:text-accent">
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-3 py-2.5 text-[10px] tracking-widest uppercase text-ink-muted font-normal ${className}`}>
      {children}
    </th>
  );
}

function IconButton({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button type="submit" title={title} className="inline-flex items-center justify-center w-8 h-8 text-ink-muted hover:text-ink transition-colors">
      {children}
    </button>
  );
}

'use client';
import * as React from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Star, StarOff, Pencil, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn, formatPrice } from '@/lib/utils';
import { togglePublish, toggleFeatured } from '@/app/admin/actions';
import { bulkPhotoAction } from '@/app/admin/settings-actions';

interface PhotoRow {
  id: string;
  title: string;
  titleEn: string | null;
  country: string | null;
  city: string | null;
  price: number;
  currency: string;
  published: boolean;
  featured: boolean;
  isHero: boolean;
  thumbUrl: string;
}

export function PhotosTable({ photos }: { photos: PhotoRow[] }) {
  const [q, setQ] = React.useState('');
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return photos;
    return photos.filter((p) =>
      [p.title, p.titleEn, p.country, p.city].some((v) => v?.toLowerCase().includes(needle)),
    );
  }, [q, photos]);

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  function toggleAll() {
    const next = new Set(selected);
    if (allSelected) for (const p of filtered) next.delete(p.id);
    else for (const p of filtered) next.add(p.id);
    setSelected(next);
  }
  function toggleOne(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-dim pointer-events-none" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by title, city, country…"
            className="pl-10"
          />
        </div>
        <p className="caption text-xs">
          {filtered.length}/{photos.length} {selected.size > 0 && `· ${selected.size} selected`}
        </p>
      </div>

      {selected.size > 0 && (
        <BulkBar ids={Array.from(selected)} onDone={() => setSelected(new Set())} />
      )}

      <div className="bg-paper border border-line overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-cool">
            <tr className="text-left">
              <Th className="w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="w-4 h-4 accent-accent"
                  aria-label="Select all"
                />
              </Th>
              <Th>Photo</Th>
              <Th>Title</Th>
              <Th>Location</Th>
              <Th>Price</Th>
              <Th>Status</Th>
              <Th className="w-32 text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="p-10 text-center caption">
                  No photos match.
                </td>
              </tr>
            )}
            {filtered.map((p) => {
              const location = [p.city, p.country].filter(Boolean).join(', ');
              return (
                <tr key={p.id} className={cn('hover:bg-paper-cool/60', selected.has(p.id) && 'bg-accent/5')}>
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(p.id)}
                      onChange={() => toggleOne(p.id)}
                      className="w-4 h-4 accent-accent"
                      aria-label={`Select ${p.title}`}
                    />
                  </td>
                  <td className="p-3">
                    <div className="w-16 h-16 bg-paper-dark overflow-hidden">
                      {p.thumbUrl && <img src={p.thumbUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/photos/${p.id}`} className="text-ink hover:text-accent">
                      {p.title}
                    </Link>
                    {p.titleEn && <p className="caption text-xs">{p.titleEn}</p>}
                  </td>
                  <td className="p-3 text-ink-muted">{location || '-'}</td>
                  <td className="p-3 tabular-nums">{formatPrice(p.price, p.currency)}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase">
                      <span className={p.published ? 'text-green-700' : 'text-ink-dim'}>
                        {p.published ? 'Published' : 'Draft'}
                      </span>
                      {p.featured && <span className="text-accent">★</span>}
                      {p.isHero && <span className="text-accent">◆</span>}
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
                      <Link
                        href={`/admin/photos/${p.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 hover:text-accent"
                        title="Edit"
                      >
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
    </div>
  );
}

function BulkBar({ ids, onDone }: { ids: string[]; onDone: () => void }) {
  const submit = (op: string) => async (formData: FormData) => {
    formData.set('op', op);
    for (const id of ids) formData.append('ids', id);
    await bulkPhotoAction(formData);
    onDone();
  };

  return (
    <div className="bg-paper border border-line p-3 flex items-center gap-2 flex-wrap sticky top-16 z-10">
      <p className="text-sm text-ink mr-2">
        <strong>{ids.length}</strong> selected
      </p>
      <form action={submit('publish')}>
        <Button type="submit" size="sm" variant="secondary">Publish</Button>
      </form>
      <form action={submit('unpublish')}>
        <Button type="submit" size="sm" variant="secondary">Unpublish</Button>
      </form>
      <form action={submit('feature')}>
        <Button type="submit" size="sm" variant="secondary">Feature</Button>
      </form>
      <form action={submit('unfeature')}>
        <Button type="submit" size="sm" variant="secondary">Unfeature</Button>
      </form>
      <form action={submit('delete')}>
        <Button type="submit" size="sm" variant="destructive">Delete</Button>
      </form>
    </div>
  );
}

function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-3 py-2.5 text-[10px] tracking-widest uppercase text-ink-muted font-normal ${className}`}>{children}</th>;
}

function IconButton({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button type="submit" title={title} className="inline-flex items-center justify-center w-8 h-8 text-ink-muted hover:text-ink transition-colors">
      {children}
    </button>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2';
import { updatePhoto, deletePhoto } from '@/app/admin/actions';

export const dynamic = 'force-dynamic';

async function getPhoto(id: string) {
  return prisma.photo.findUnique({ where: { id } });
}

export default async function EditPhotoPage({ params }: { params: { id: string } }) {
  const photo = await getPhoto(params.id);
  if (!photo) notFound();

  const thumbUrl = r2PublicUrl(photo.thumbKey) ?? '';
  const previewUrl = r2PublicUrl(photo.previewKey) ?? '';

  return (
    <Container size="wide">
      <Link
        href="/admin/photos"
        className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to photos
      </Link>

      <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
        <div className="space-y-3">
          <p className="eyebrow text-accent">Edit</p>
          <h1 className="text-display-lg font-display text-ink">{photo.title}</h1>
          <div className="flex items-center gap-3 text-xs">
            <span className={photo.published ? 'text-green-700' : 'text-ink-dim'}>
              {photo.published ? 'Published' : 'Draft'}
            </span>
            {photo.featured && <span className="text-accent">★ Featured</span>}
          </div>
        </div>
        {photo.published && (
          <a
            href={`/fr/gallery/${photo.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors"
          >
            View live
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-paper-dark aspect-square overflow-hidden">
            {previewUrl ? (
              <img src={previewUrl} alt={photo.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-dim">No preview</div>
            )}
          </div>
          <dl className="grid grid-cols-2 gap-3 text-xs">
            <Info label="Slug" value={photo.slug} />
            <Info label="Dimensions" value={`${photo.width} × ${photo.height}`} />
            <Info label="Orientation" value={photo.orientation} />
            <Info label="Size" value={`${(photo.fileSize / 1024 / 1024).toFixed(1)} MB`} />
            <Info label="Camera" value={photo.camera ?? '-'} />
            <Info label="Lens" value={photo.lens ?? '-'} />
            <Info label="Date" value={photo.takenAt?.toISOString().slice(0, 10) ?? '-'} />
            <Info label="GPS" value={photo.latitude && photo.longitude ? `${photo.latitude.toFixed(3)}, ${photo.longitude.toFixed(3)}` : '-'} />
          </dl>
        </div>

        <form action={updatePhoto} className="lg:col-span-8 space-y-6 bg-paper border border-line p-6 sm:p-8">
          <input type="hidden" name="id" value={photo.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Title (FR)">
              <Input name="title" defaultValue={photo.title} required />
            </Field>
            <Field label="Title (EN)">
              <Input name="titleEn" defaultValue={photo.titleEn ?? ''} />
            </Field>
            <Field label="Description (FR)">
              <Input name="description" defaultValue={photo.description ?? ''} />
            </Field>
            <Field label="Description (EN)">
              <Input name="descriptionEn" defaultValue={photo.descriptionEn ?? ''} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Story (FR)">
              <Textarea name="story" defaultValue={photo.story ?? ''} rows={6} />
            </Field>
            <Field label="Story (EN)">
              <Textarea name="storyEn" defaultValue={photo.storyEn ?? ''} rows={6} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Country">
              <Input name="country" defaultValue={photo.country ?? ''} />
            </Field>
            <Field label="City">
              <Input name="city" defaultValue={photo.city ?? ''} />
            </Field>
            <Field label="Tags (comma)">
              <Input name="tags" defaultValue={photo.tags.join(', ')} />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <Field label="Price (EUR)">
              <Input name="price" type="number" min="0" step="0.5" defaultValue={photo.price} />
            </Field>
            <Field label="Sort order">
              <Input name="sortOrder" type="number" step="1" defaultValue={photo.sortOrder} />
            </Field>
            <div className="flex flex-col gap-3 pb-2">
              <Checkbox name="published" defaultChecked={photo.published} label="Published" />
              <Checkbox name="featured" defaultChecked={photo.featured} label="Featured" />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-line">
            <DeleteButton id={photo.id} />
            <Button type="submit" variant="primary">Save changes</Button>
          </div>
        </form>
      </div>
    </Container>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="eyebrow text-ink-muted">{label}</dt>
      <dd className="text-ink-soft text-xs">{value}</dd>
    </>
  );
}

function Checkbox({ name, defaultChecked, label }: { name: string; defaultChecked?: boolean; label: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="w-4 h-4 accent-accent" />
      <span className="text-xs tracking-wide uppercase text-ink">{label}</span>
    </label>
  );
}

function DeleteButton({ id }: { id: string }) {
  return (
    <form action={deletePhoto.bind(null, id)}>
      <Button type="submit" variant="destructive" size="sm">Delete</Button>
    </form>
  );
}

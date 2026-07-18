import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2';
import { updatePhoto, deletePhoto } from '@/app/admin/actions';
import { setHeroPhoto } from '@/app/admin/settings-actions';

export const dynamic = 'force-dynamic';

async function getPhoto(id: string) {
  return prisma.photo.findUnique({ where: { id } });
}

export default async function EditPhotoPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const photo = await getPhoto(params.id);
  if (!photo) notFound();

  const thumbUrl = r2PublicUrl(photo.thumbKey) ?? '';
  const previewUrl = r2PublicUrl(photo.previewKey) ?? '';

  return (
    <Container size="wide">
      <Link
        href="/admin/photos"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux photos
      </Link>

      <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
        <div className="space-y-2">
          <p className="text-xs font-medium text-accent uppercase tracking-wide">Edition</p>
          <h1 className="text-2xl font-semibold text-ink">{photo.title}</h1>
          <div className="flex items-center gap-3 text-sm">
            <span className={photo.published ? 'text-emerald-700 font-medium' : 'text-ink-muted'}>
              {photo.published ? 'Publiee' : 'Brouillon'}
            </span>
            {photo.featured && <span className="text-accent font-medium">Featured</span>}
            {photo.isHero && <span className="text-accent font-medium">Hero</span>}
          </div>
          <form action={setHeroPhoto.bind(null, photo.id)} className="pt-1">
            <Button type="submit" size="sm" variant={photo.isHero ? 'ghost' : 'secondary'} disabled={photo.isHero}>
              {photo.isHero ? 'Deja hero' : 'Definir comme hero'}
            </Button>
          </form>
        </div>
        {photo.published && (
          <a
            href={`/fr/gallery/${photo.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            Voir en ligne
            <ExternalLink className="w-4 h-4" />
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
          </dl>
        </div>

        <form action={updatePhoto} className="lg:col-span-8 space-y-6 bg-white rounded-xl border border-line p-6 sm:p-8">
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="Country">
              <Input name="country" defaultValue={photo.country ?? ''} placeholder="ex: Barbade" />
            </Field>
            <Field label="ISO code (2)">
              <Input name="countryCode" defaultValue={photo.countryCode ?? ''} maxLength={2} placeholder="BB" />
            </Field>
            <Field label="City">
              <Input name="city" defaultValue={photo.city ?? ''} />
            </Field>
            <Field label="Tags (comma)">
              <Input name="tags" defaultValue={photo.tags.join(', ')} />
            </Field>
          </div>

          <div className="pt-2 border-t border-line">
            <p className="text-xs font-medium text-ink-muted uppercase tracking-wide mb-3 mt-4">
              Métadonnées (EXIF)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Date de prise">
                <Input
                  name="takenAt"
                  type="date"
                  defaultValue={photo.takenAt ? photo.takenAt.toISOString().slice(0, 10) : ''}
                />
              </Field>
              <Field label="Région">
                <Input name="region" defaultValue={photo.region ?? ''} />
              </Field>
              <Field label="Appareil">
                <Input name="camera" defaultValue={photo.camera ?? ''} placeholder="ex: SONY ILCE-7M4" />
              </Field>
              <Field label="Objectif">
                <Input name="lens" defaultValue={photo.lens ?? ''} placeholder="ex: FE 24-70mm F2.8" />
              </Field>
              <Field label="Focale">
                <Input name="focalLength" defaultValue={photo.focalLength ?? ''} placeholder="ex: 35mm" />
              </Field>
              <Field label="Ouverture">
                <Input name="aperture" defaultValue={photo.aperture ?? ''} placeholder="ex: f/2.8" />
              </Field>
              <Field label="Vitesse">
                <Input name="shutterSpeed" defaultValue={photo.shutterSpeed ?? ''} placeholder="ex: 1/250s" />
              </Field>
              <Field label="ISO">
                <Input name="iso" type="number" min="0" step="1" defaultValue={photo.iso ?? ''} />
              </Field>
              <Field label="Latitude">
                <Input name="latitude" type="number" step="any" defaultValue={photo.latitude ?? ''} placeholder="ex: 45.764" />
              </Field>
              <Field label="Longitude">
                <Input name="longitude" type="number" step="any" defaultValue={photo.longitude ?? ''} placeholder="ex: 4.835" />
              </Field>
            </div>
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
      <dt className="text-[11px] font-medium text-ink-muted">{label}</dt>
      <dd className="text-xs text-ink-soft">{value}</dd>
    </>
  );
}

function Checkbox({ name, defaultChecked, label }: { name: string; defaultChecked?: boolean; label: string }) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 rounded accent-accent" />
      <span className="text-sm text-ink">{label}</span>
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

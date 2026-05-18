import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { prisma } from '@/lib/prisma';
import { updateCountry } from '@/app/admin/country-actions';

export const dynamic = 'force-dynamic';

async function getCountry(code: string) {
  return prisma.country.findUnique({ where: { code: code.toUpperCase() } });
}

export default async function EditCountryPage({ params }: { params: { code: string } }) {
  const country = await getCountry(params.code);
  if (!country) notFound();
  const photoCount = await prisma.photo.count({ where: { countryCode: country.code } });

  return (
    <Container size="wide">
      <Link
        href="/admin/countries"
        className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to countries
      </Link>

      <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
        <div className="space-y-3">
          <p className="eyebrow text-accent">Country · {country.code}</p>
          <h1 className="text-display-lg font-display text-ink">{country.nameFr}</h1>
          <p className="caption">{photoCount} photo(s)</p>
        </div>
        <a
          href={`/fr/country/${country.code}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-ink-muted hover:text-accent transition-colors"
        >
          View live
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      <form action={updateCountry} className="space-y-6 bg-paper border border-line p-6 sm:p-8 max-w-3xl">
        <input type="hidden" name="code" value={country.code} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Name (FR)">
            <Input name="nameFr" defaultValue={country.nameFr} required />
          </Field>
          <Field label="Name (EN)">
            <Input name="nameEn" defaultValue={country.nameEn} required />
          </Field>
        </div>

        <Field label="Intro (FR)">
          <Textarea name="intro" defaultValue={country.intro ?? ''} rows={10} placeholder="Markdown supporté…" />
        </Field>

        <Field label="Intro (EN)">
          <Textarea name="introEn" defaultValue={country.introEn ?? ''} rows={10} />
        </Field>

        <div className="pt-2">
          <Button type="submit" variant="primary">Save changes</Button>
        </div>
      </form>
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

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

export default async function EditCountryPage(props: { params: Promise<{ code: string }> }) {
  const params = await props.params;
  const country = await getCountry(params.code);
  if (!country) notFound();
  const photoCount = await prisma.photo.count({ where: { countryCode: country.code } });

  return (
    <Container size="wide">
      <Link
        href="/admin/countries"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux pays
      </Link>

      <div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
        <div className="space-y-2">
          <p className="text-xs font-medium text-accent uppercase tracking-wide">Country - {country.code}</p>
          <h1 className="text-2xl font-semibold text-ink">{country.nameFr}</h1>
          <p className="text-sm text-ink-muted">{photoCount} photo(s)</p>
        </div>
        <a
          href={`/fr/country/${country.code}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
        >
          Voir en ligne
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <form action={updateCountry} className="space-y-6 bg-white rounded-xl border border-line p-6 sm:p-8 max-w-3xl">
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

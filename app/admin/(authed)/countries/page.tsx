import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getCountries() {
  const photoCounts = await prisma.photo.groupBy({
    by: ['countryCode'],
    where: { countryCode: { not: null } },
    _count: { _all: true },
  });
  const counts = new Map(photoCounts.map((r) => [r.countryCode!, r._count._all]));

  const countries = await prisma.country.findMany({ orderBy: { nameFr: 'asc' } });
  return countries.map((c) => ({ ...c, photoCount: counts.get(c.code) ?? 0 }));
}

export default async function AdminCountries() {
  const countries = await getCountries();
  return (
    <Container size="wide">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Country intros</h1>
        <p className="text-sm text-ink-muted mt-1">{countries.length} countries</p>
      </div>

      {countries.length === 0 ? (
        <div className="border border-dashed border-line py-32 text-center">
          <p className="caption">No countries yet. Run the geocoding script first.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-line overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-paper-cool">
              <tr className="text-left">
                <Th>Code</Th>
                <Th>Name (FR)</Th>
                <Th>Name (EN)</Th>
                <Th>Photos</Th>
                <Th>Intro</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {countries.map((c) => (
                <tr key={c.code} className="hover:bg-paper-cool/60">
                  <td className="p-3 font-mono text-xs">{c.code} {flagEmoji(c.code)}</td>
                  <td className="p-3">
                    <Link href={`/admin/countries/${c.code}`} className="text-ink hover:text-accent">
                      {c.nameFr}
                    </Link>
                  </td>
                  <td className="p-3 text-ink-muted">{c.nameEn}</td>
                  <td className="p-3 tabular-nums">{c.photoCount}</td>
                  <td className="p-3">
                    <span className={c.intro ? 'text-green-700' : 'text-ink-dim'}>
                      {c.intro ? 'set' : 'missing'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-3 py-2.5 text-[11px] font-medium text-ink-muted text-left">{children}</th>;
}

function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return '🌍';
  const base = 0x1F1E6;
  const A = 'A'.charCodeAt(0);
  return String.fromCodePoint(base + code.charCodeAt(0) - A, base + code.charCodeAt(1) - A);
}

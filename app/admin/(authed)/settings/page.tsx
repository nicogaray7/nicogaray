import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';
import { getSetting, type HomeSettings, type AboutSettings, type LegalSettings } from '@/lib/settings';
import { saveHomeText, saveAboutText, saveLegalText } from '@/app/admin/settings-actions';
import { prisma } from '@/lib/prisma';
import { r2PublicUrl } from '@/lib/r2';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const [home, about, legal, hero] = await Promise.all([
    getSetting<HomeSettings>('home'),
    getSetting<AboutSettings>('about'),
    getSetting<LegalSettings>('legal'),
    prisma.photo.findFirst({ where: { isHero: true } }),
  ]);

  return (
    <Container size="wide">
      <div className="mb-10 space-y-3">
        <p className="eyebrow text-accent">Settings</p>
        <h1 className="text-display-lg font-display text-ink">Site content</h1>
        <p className="caption">
          Override the default text on the public pages. Empty fields fall back to the bundled translations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Hero pinned */}
        <Section title="Hero photo">
          {hero ? (
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-paper-dark overflow-hidden flex-shrink-0">
                <img src={r2PublicUrl(hero.thumbKey) ?? ''} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-ink font-medium truncate">{hero.title}</p>
                <p className="caption text-xs">{[hero.city, hero.country].filter(Boolean).join(', ') || '-'}</p>
                <p className="caption text-xs mt-1">
                  Change from <a href={`/admin/photos/${hero.id}`} className="text-accent hover:underline">photo edit page</a>.
                </p>
              </div>
            </div>
          ) : (
            <p className="caption">No hero pinned. Pick one from a photo edit page using <em>"Set as hero"</em>.</p>
          )}
        </Section>

        {/* Home text */}
        <Section title="Home subtitle" className="lg:col-span-2">
          <form action={saveHomeText} className="space-y-4">
            <Pair label="Subtitle">
              <Textarea name="subtitleFr" defaultValue={home?.subtitle?.fr ?? ''} rows={2} placeholder="(FR)" />
              <Textarea name="subtitleEn" defaultValue={home?.subtitle?.en ?? ''} rows={2} placeholder="(EN)" />
            </Pair>
            <Pair label="CTA label">
              <Input name="ctaFr" defaultValue={home?.cta?.fr ?? ''} placeholder="(FR) Explorer la galerie" />
              <Input name="ctaEn" defaultValue={home?.cta?.en ?? ''} placeholder="(EN) Explore the gallery" />
            </Pair>
            <Button type="submit" size="sm">Save</Button>
          </form>
        </Section>

        {/* About */}
        <Section title="About page" className="lg:col-span-3">
          <form action={saveAboutText} className="space-y-4">
            <Pair label="Title">
              <Input name="titleFr" defaultValue={about?.title?.fr ?? ''} placeholder="(FR)" />
              <Input name="titleEn" defaultValue={about?.title?.en ?? ''} placeholder="(EN)" />
            </Pair>
            <Pair label="Lede (large intro paragraph)">
              <Textarea name="ledeFr" defaultValue={about?.lede?.fr ?? ''} rows={3} placeholder="(FR)" />
              <Textarea name="ledeEn" defaultValue={about?.lede?.en ?? ''} rows={3} placeholder="(EN)" />
            </Pair>
            <Pair label="Body">
              <Textarea name="bodyFr" defaultValue={about?.body?.fr ?? ''} rows={10} placeholder="(FR), Markdown / line breaks supported" />
              <Textarea name="bodyEn" defaultValue={about?.body?.en ?? ''} rows={10} placeholder="(EN)" />
            </Pair>
            <Button type="submit" size="sm">Save</Button>
          </form>
        </Section>

        {/* Legal pages */}
        {(['cgv', 'license', 'mentions'] as const).map((slug) => {
          const entry = legal?.[slug];
          return (
            <Section key={slug} title={`Legal · ${slug.toUpperCase()}`} className="lg:col-span-3">
              <form action={saveLegalText} className="space-y-4">
                <input type="hidden" name="slug" value={slug} />
                <Pair label="Title">
                  <Input name="titleFr" defaultValue={entry?.title?.fr ?? ''} placeholder="(FR)" />
                  <Input name="titleEn" defaultValue={entry?.title?.en ?? ''} placeholder="(EN)" />
                </Pair>
                <Pair label="Body">
                  <Textarea name="bodyFr" defaultValue={entry?.body?.fr ?? ''} rows={12} placeholder="(FR)" />
                  <Textarea name="bodyEn" defaultValue={entry?.body?.en ?? ''} rows={12} placeholder="(EN)" />
                </Pair>
                <Button type="submit" size="sm">Save</Button>
              </form>
            </Section>
          );
        })}
      </div>
    </Container>
  );
}

function Section({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`bg-paper border border-line p-5 sm:p-6 ${className}`}>
      <p className="eyebrow text-accent mb-4">{title}</p>
      {children}
    </section>
  );
}

function Pair({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

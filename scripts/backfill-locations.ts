/**
 * Reverse-geocode all Photo rows that have GPS but no country.
 * Uses OpenStreetMap Nominatim (free, ~1 req/sec policy).
 * Also upserts the Country row keyed by ISO Alpha-2 code.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const UA = 'photos.nicogaray.com/1.0 (contact: garaynico.ng@gmail.com)';
const MIN_DELAY_MS = 1100;

const COUNTRY_NAMES_FR: Record<string, string> = {
  FR: 'France', JP: 'Japon', IT: 'Italie', ES: 'Espagne', PT: 'Portugal',
  US: 'États-Unis', CA: 'Canada', MX: 'Mexique', BR: 'Brésil', AR: 'Argentine',
  GB: 'Royaume-Uni', DE: 'Allemagne', NL: 'Pays-Bas', BE: 'Belgique',
  CH: 'Suisse', AT: 'Autriche', GR: 'Grèce', TR: 'Turquie', MA: 'Maroc',
  TN: 'Tunisie', EG: 'Égypte', IN: 'Inde', CN: 'Chine', KR: 'Corée du Sud',
  TH: 'Thaïlande', VN: 'Vietnam', ID: 'Indonésie', PH: 'Philippines',
  AU: 'Australie', NZ: 'Nouvelle-Zélande', PE: 'Pérou', CL: 'Chili',
  CO: 'Colombie', BO: 'Bolivie', EC: 'Équateur', ZA: 'Afrique du Sud',
  KE: 'Kenya', TZ: 'Tanzanie', IS: 'Islande', NO: 'Norvège', SE: 'Suède',
  FI: 'Finlande', DK: 'Danemark', IE: 'Irlande', PL: 'Pologne', CZ: 'Tchéquie',
  HU: 'Hongrie', RO: 'Roumanie', HR: 'Croatie', MT: 'Malte', CY: 'Chypre',
  RU: 'Russie', UA: 'Ukraine', LK: 'Sri Lanka', NP: 'Népal', BT: 'Bhoutan',
  MM: 'Birmanie', KH: 'Cambodge', LA: 'Laos', MY: 'Malaisie', SG: 'Singapour',
  AE: 'Émirats arabes unis', SA: 'Arabie saoudite', JO: 'Jordanie', IL: 'Israël',
  LB: 'Liban', IR: 'Iran', GE: 'Géorgie', AM: 'Arménie', AZ: 'Azerbaïdjan',
};

const COUNTRY_NAMES_EN: Record<string, string> = {
  FR: 'France', JP: 'Japan', IT: 'Italy', ES: 'Spain', PT: 'Portugal',
  US: 'United States', CA: 'Canada', MX: 'Mexico', BR: 'Brazil', AR: 'Argentina',
  GB: 'United Kingdom', DE: 'Germany', NL: 'Netherlands', BE: 'Belgium',
  CH: 'Switzerland', AT: 'Austria', GR: 'Greece', TR: 'Turkey', MA: 'Morocco',
  TN: 'Tunisia', EG: 'Egypt', IN: 'India', CN: 'China', KR: 'South Korea',
  TH: 'Thailand', VN: 'Vietnam', ID: 'Indonesia', PH: 'Philippines',
  AU: 'Australia', NZ: 'New Zealand', PE: 'Peru', CL: 'Chile',
  CO: 'Colombia', BO: 'Bolivia', EC: 'Ecuador', ZA: 'South Africa',
  KE: 'Kenya', TZ: 'Tanzania', IS: 'Iceland', NO: 'Norway', SE: 'Sweden',
  FI: 'Finland', DK: 'Denmark', IE: 'Ireland', PL: 'Poland', CZ: 'Czechia',
  HU: 'Hungary', RO: 'Romania', HR: 'Croatia', MT: 'Malta', CY: 'Cyprus',
  RU: 'Russia', UA: 'Ukraine', LK: 'Sri Lanka', NP: 'Nepal', BT: 'Bhutan',
  MM: 'Myanmar', KH: 'Cambodia', LA: 'Laos', MY: 'Malaysia', SG: 'Singapore',
  AE: 'United Arab Emirates', SA: 'Saudi Arabia', JO: 'Jordan', IL: 'Israel',
  LB: 'Lebanon', IR: 'Iran', GE: 'Georgia', AM: 'Armenia', AZ: 'Azerbaijan',
};

async function reverseGeocode(lat: number, lon: number) {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('zoom', '10');
  url.searchParams.set('accept-language', 'fr,en');

  const resp = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json' } });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const data = await resp.json();
  const addr = data.address ?? {};
  return {
    countryCode: addr.country_code ? String(addr.country_code).toUpperCase() : null,
    country: addr.country ?? null,
    city: addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? addr.hamlet ?? null,
    region: addr.state ?? addr.region ?? addr.province ?? null,
  };
}

async function main() {
  const photos = await prisma.photo.findMany({
    where: { latitude: { not: null }, longitude: { not: null }, country: null },
    select: { id: true, latitude: true, longitude: true },
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Geocoding ${photos.length} photos…`);
  let ok = 0;
  let fail = 0;
  const seenCountries = new Set<string>();

  for (const [i, p] of photos.entries()) {
    const tag = `[${i + 1}/${photos.length}]`;
    try {
      const r = await reverseGeocode(p.latitude!, p.longitude!);
      await prisma.photo.update({
        where: { id: p.id },
        data: {
          country: r.country,
          countryCode: r.countryCode,
          city: r.city,
          region: r.region,
        },
      });

      if (r.countryCode && !seenCountries.has(r.countryCode)) {
        seenCountries.add(r.countryCode);
        await prisma.country.upsert({
          where: { code: r.countryCode },
          create: {
            code: r.countryCode,
            nameFr: COUNTRY_NAMES_FR[r.countryCode] ?? r.country ?? r.countryCode,
            nameEn: COUNTRY_NAMES_EN[r.countryCode] ?? r.country ?? r.countryCode,
          },
          update: {},
        });
      }

      ok++;
      console.log(`${tag} ok  ${r.countryCode ?? '??'} ${r.city ?? ''}`);
    } catch (err) {
      fail++;
      console.error(`${tag} fail  ${p.id}:`, err instanceof Error ? err.message : err);
    }
    await new Promise((r) => setTimeout(r, MIN_DELAY_MS));
  }

  console.log('');
  console.log(`Geocoded: ${ok}`);
  console.log(`Failed:   ${fail}`);
  console.log(`Countries: ${seenCountries.size}, ${[...seenCountries].join(', ')}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

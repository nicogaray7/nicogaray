/**
 * Replace generic "Photographie n° N" titles with a short evocative
 * name based on geolocation (city / region / country) + month/year.
 * Only photos whose current title still matches the generic pattern
 * are touched, so user-edited titles are left alone.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COUNTRY_EN: Record<string, string> = {
  FR: 'France', JP: 'Japan', IT: 'Italy', ES: 'Spain', PT: 'Portugal',
  US: 'United States', CA: 'Canada', MX: 'Mexico', BR: 'Brazil', AR: 'Argentina',
  GB: 'United Kingdom', DE: 'Germany', NL: 'Netherlands', BE: 'Belgium',
  CH: 'Switzerland', AT: 'Austria', GR: 'Greece', TR: 'Turkey', MA: 'Morocco',
  ID: 'Indonesia', PH: 'Philippines', VN: 'Vietnam', AU: 'Australia',
  EE: 'Estonia', LV: 'Latvia', LT: 'Lithuania', CZ: 'Czechia', HU: 'Hungary',
  SK: 'Slovakia', SI: 'Slovenia', HR: 'Croatia',
};

const COUNTRY_FR: Record<string, string> = {
  FR: 'France', JP: 'Japon', IT: 'Italie', ES: 'Espagne', PT: 'Portugal',
  US: 'États-Unis', CA: 'Canada', MX: 'Mexique', BR: 'Brésil', AR: 'Argentine',
  GB: 'Royaume-Uni', DE: 'Allemagne', NL: 'Pays-Bas', BE: 'Belgique',
  CH: 'Suisse', AT: 'Autriche', GR: 'Grèce', TR: 'Turquie', MA: 'Maroc',
  ID: 'Indonésie', PH: 'Philippines', VN: 'Vietnam', AU: 'Australie',
  EE: 'Estonie', LV: 'Lettonie', LT: 'Lituanie', CZ: 'Tchéquie', HU: 'Hongrie',
  SK: 'Slovaquie', SI: 'Slovénie', HR: 'Croatie',
};

const GENERIC = /^Photographie\s*n°\s*\d+$/i;

// Strip overly long Vietnamese / generic admin suffixes like "Xã ...", "P. ..."
function cleanCity(raw: string | null): string | null {
  if (!raw) return null;
  return raw
    .replace(/^Xã\s+/, '')
    .replace(/^P\.\s+/, '')
    .replace(/\s+Ward$/i, '')
    .replace(/\s+District$/i, '')
    .replace(/^Tỉnh\s+/, '')
    .replace(/^Thành phố\s+/, '')
    .trim();
}

function placeFr(photo: { city: string | null; region: string | null; country: string | null; countryCode: string | null }) {
  const city = cleanCity(photo.city);
  if (city) return city;
  if (photo.region) return photo.region;
  if (photo.countryCode && COUNTRY_FR[photo.countryCode]) return COUNTRY_FR[photo.countryCode];
  return photo.country ?? null;
}

function placeEn(photo: { city: string | null; region: string | null; country: string | null; countryCode: string | null }) {
  const city = cleanCity(photo.city);
  if (city) return city;
  if (photo.region) return photo.region;
  if (photo.countryCode && COUNTRY_EN[photo.countryCode]) return COUNTRY_EN[photo.countryCode];
  return photo.country ?? null;
}

async function main() {
  const photos = await prisma.photo.findMany({
    select: {
      id: true, title: true, city: true, region: true, country: true,
      countryCode: true, takenAt: true,
    },
  });

  console.log(`Scanning ${photos.length} photos…`);
  let updated = 0;
  let kept = 0;
  let unnamed = 0;

  for (const p of photos) {
    if (!GENERIC.test(p.title)) {
      kept++;
      continue;
    }

    const fr = placeFr(p);
    const en = placeEn(p);

    if (!fr) {
      unnamed++;
      continue;
    }

    await prisma.photo.update({
      where: { id: p.id },
      data: {
        title: fr,
        titleEn: en ?? fr,
      },
    });
    updated++;
  }

  console.log('');
  console.log(`Renamed:  ${updated}`);
  console.log(`Kept:     ${kept} (user-edited or non-generic)`);
  console.log(`Unnamed:  ${unnamed} (no location data)`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

// Geocodage inverse via OpenStreetMap Nominatim (gratuit, ~1 req/sec).
// Utilise a l'upload pour remplir pays/ville/region depuis les coordonnees GPS EXIF.

const UA = 'photos.nicogaray.com/1.0 (contact: garaynico.ng@gmail.com)';

export type GeoResult = {
  countryCode: string | null;
  country: string | null;
  city: string | null;
  region: string | null;
};

export async function reverseGeocode(lat: number, lon: number): Promise<GeoResult> {
  const url = new URL('https://nominatim.openstreetmap.org/reverse');
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('lat', String(lat));
  url.searchParams.set('lon', String(lon));
  url.searchParams.set('zoom', '10');
  url.searchParams.set('accept-language', 'fr,en');

  const resp = await fetch(url, {
    headers: { 'User-Agent': UA, Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
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

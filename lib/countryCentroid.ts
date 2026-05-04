/**
 * Centroïdes approximatifs [longitude, latitude] pour afficher une carte quand
 * la photo n'a pas de GPS (noms de pays tels qu'en base, en français).
 */
const CENTROIDS: Record<string, [number, number]> = {
  France:       [2.2,   46.2],
  Australie:    [133.8, -25.3],
  Canada:       [-106.3, 56.1],
  Croatie:      [15.2,  45.1],
  Espagne:      [-3.7,  40.4],
  Estonie:      [25.0,  58.6],
  Hongrie:      [19.5,  47.2],
  Indonésie:    [113.9, -0.8],
  Lettonie:     [25.0,  57.0],
  Lituanie:     [23.9,  55.2],
  Philippines:  [122.6, 12.9],
  Portugal:     [-8.2,  39.4],
  Slovaquie:    [19.7,  48.7],
  Slovénie:     [14.8,  46.1],
  Tchéquie:     [15.5,  49.7],
  'Viet Nam':   [108.3, 14.1],
  Vietnam:    [108.3, 14.1],
}

export function getCountryMapCenter(country: string | null | undefined): [number, number] | null {
  if (!country) return null
  return CENTROIDS[country] ?? null
}

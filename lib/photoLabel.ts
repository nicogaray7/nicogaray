/**
 * Libelle public: pays uniquement (jamais la ville).
 */
export function photoPublicLabel(photo: {
  country?: string | null
  city?:    string | null
}, _locale: string): string {
  if (photo.country) return photo.country
  return _locale === 'fr' ? 'Photographie' : 'Photograph'
}

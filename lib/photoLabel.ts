/**
 * Libellé public sans titre de photo : ville + pays, ou pays seul.
 */
export function photoPublicLabel(photo: {
  country?: string | null
  city?:    string | null
}, _locale: string): string {
  if (photo.city && photo.country) return `${photo.city}, ${photo.country}`
  if (photo.country) return photo.country
  return _locale === 'fr' ? 'Photographie' : 'Photograph'
}

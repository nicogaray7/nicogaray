import { redirect } from 'next/navigation';

/**
 * Fallback : /[locale]/checkout sans photoId => redirection vers la galerie.
 * Evite le 404 si l'URL est saisie directement ou partagee sans identifiant.
 */
export default function CheckoutIndexPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/gallery`);
}

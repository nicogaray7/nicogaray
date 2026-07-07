import { redirect } from 'next/navigation';

/**
 * Fallback : /[locale]/checkout sans photoId => redirection vers la galerie.
 * Evite le 404 si l'URL est saisie directement ou partagee sans identifiant.
 */
export default async function CheckoutIndexPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  redirect(`/${params.locale}/gallery`);
}

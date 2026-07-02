# Analytics conversions - photos.nicogaray.com

## Propriete GA4 : G-TF7WRXVYLC

## Evenements e-commerce implementes

| Evenement | Declencheur | Parametres cles | Fichier |
|---|---|---|---|
| `view_item` | Chargement page photo | `item_id` (slug), `item_name`, `price`, `currency`, `item_category` (pays) | `components/gallery/PhotoPageTracker.tsx` |
| `begin_checkout` | Clic bouton "Acheter" | `item_id`, `item_name`, `price`, `currency` | `components/gallery/BuyButton.tsx` |
| `purchase` | Page de succes Stripe (client-side) | `transaction_id` (order.id), `value` (total TTC), `currency`, items | `components/analytics/PurchaseTracker.tsx` |
| `purchase` | Webhook Stripe (server-side, filet) | memes parametres, deduplique par `transaction_id` | `app/api/stripe/webhook/route.ts` via `lib/ga-mp.ts` |
| `select_item` | Clic sur une photo dans la galerie | `item_list_id`, items | `components/gallery/GalleryTracker.tsx` |
| `view_item_list` | Affichage de la galerie | `item_list_id`, items (50 max) | `components/gallery/GalleryTracker.tsx` |
| `page_view` | Navigation SPA | `page_path`, `page_location` | `components/analytics/PageViewTracker.tsx` |

## Quel event = quel signal business

- `purchase` : vente reelle d'une photo numerique. La valeur `value` est le total TTC (photo + frais acheteur). Le `transaction_id` = `order.id` dans Prisma/Supabase.
- `begin_checkout` : intention d'achat forte (clic "Acheter"). Utile pour calculer le taux de conversion panier -> paiement.
- `view_item` : interet pour une photo specifique. Peut servir a identifier les meilleures photos par vues.

## Architecture de deduplication du purchase

Le purchase est envoye deux fois par design :
1. Client-side (`PurchaseTracker`) : quand le visiteur revient sur la page de succes.
2. Server-side (`ga-mp.ts`) : depuis le webhook Stripe `checkout.session.completed`, avec le `gaClientId` issu du cookie `_ga` passe dans les metadata Stripe.

GA4 deduplique automatiquement les deux envois si le `transaction_id` est identique.

**Variable d'environnement requise pour le server-side** : `GA4_MP_API_SECRET` (secret Measurement Protocol GA4). Sans elle, seul le client-side fonctionne.

## Conversions a marquer manuellement dans GA4 (G-TF7WRXVYLC)

1. Ouvrir GA4 > Admin > Evenements
2. Marquer comme conversion cle :
   - `purchase` : conversion principale (vente reelle)
3. Marquer comme conversions secondaires (optionnel) :
   - `begin_checkout` : intention d'achat
   - `view_item` : engagement produit

## Actions manuelles restantes pour Nico

- [ ] Obtenir le `GA4_MP_API_SECRET` : GA4 > Admin > Flux de donnees > Photos > Secrets Measurement Protocol > Creer un secret. L'ajouter en variable d'environnement sur le VPS (fichier `.env` de la stack Docker photos).
- [ ] Marquer `purchase` comme conversion dans GA4 > Admin > Evenements
- [ ] Ajouter le filtre IP VPS dans GA4 > Admin > Filtres de donnees > Creer un filtre > Exclure les evenements du developpeur > adresse IP = 217.196.49.11
- [ ] Verifier dans GA4 DebugView (activer `?debug_mode=true` dans l'URL) que `view_item`, `begin_checkout` et `purchase` remontent correctement apres un achat test.

## Proprete de la donnee

- Pas de double comptage GTM : photos.nicogaray.com charge gtag directement (G-TF7WRXVYLC), pas de GTM.
- Consent Mode v2 : banner GDPR presente avec `gtag('consent', 'update', ...)`. Verifier que le `consent default` est bien declare avant le chargement du script gtag dans `app/layout.tsx`.

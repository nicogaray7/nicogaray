export default async function CGVPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isEN = locale === 'en'

  return (
    <section className="py-32 sm:py-40">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <h1 className="font-display text-5xl sm:text-6xl text-ink-900 mb-16">
          {isEN ? 'Terms of Sale' : 'Conditions Générales de Vente'}
        </h1>

        <div className="space-y-10 text-ink-700">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? '1. Subject' : '1. Objet'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'These terms govern the sale of high-resolution digital photography files offered by Nico Garay via photos-garaynico.com.'
                : 'Les présentes CGV régissent la vente de fichiers photographiques numériques en haute résolution proposés par Nico Garay via le site photos-garaynico.com.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? '2. Pricing' : '2. Prix'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Prices are stated in euros (VAT included). Bank transaction fees (Stripe or transfer) are the buyer\'s responsibility.'
                : 'Les prix sont indiqués en euros TTC. Les frais de transaction bancaire (Stripe ou virement) sont à la charge de l\'acheteur.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? '3. Order and Payment' : '3. Commande et paiement'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'All orders are firm and final upon payment confirmation. The download link is valid for 48 hours and limited to 3 downloads.'
                : 'Toute commande est ferme et définitive après confirmation du paiement. Le lien de téléchargement est valable 48 heures et limité à 3 téléchargements.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? '4. Delivery' : '4. Livraison'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Files are delivered digitally (download). No physical products are shipped.'
                : 'Les fichiers sont délivrés sous forme numérique (téléchargement). Aucun produit physique n\'est expédié.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? '5. Right of Withdrawal' : '5. Droit de rétractation'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'According to consumer law, the right of withdrawal does not apply to digital content immediately accessible after payment.'
                : 'Conformément à l\'article L.221-28 du Code de la consommation, le droit de rétractation ne s\'applique pas aux contenus numériques immédiatement accessibles après paiement.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? '6. Intellectual Property' : '6. Propriété intellectuelle'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Purchase grants a personal, non-exclusive license (see License). All rights remain the property of Nico Garay.'
                : 'L\'achat confère une licence d\'usage personnel non-exclusive (voir Licence). Tous les droits restent la propriété de Nico Garay.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? '7. Claims' : '7. Réclamations'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'For any issues, contact contact@photos-garaynico.com.'
                : 'Pour tout problème, contactez contact@photos-garaynico.com.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default async function CGVPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isEN = locale === 'en'

  return (
    <section className="min-h-screen pt-32 sm:pt-40 pb-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-16">
          {isEN ? 'Terms of Sale' : 'Conditions Generales de Vente'}
        </h1>

        <div className="space-y-10 text-foreground-dim">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? '1. Subject' : '1. Objet'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'These terms govern the sale of high-resolution digital photography files offered by Nico Garay via photos.nicogaray.com.'
                : 'Les presentes CGV regissent la vente de fichiers photographiques numeriques en haute resolution proposes par Nico Garay via le site photos.nicogaray.com.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? '2. Pricing' : '2. Prix'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Prices are stated in euros (VAT included). Bank transaction fees (Stripe or transfer) are the buyer\'s responsibility.'
                : 'Les prix sont indiques en euros TTC. Les frais de transaction bancaire (Stripe ou virement) sont a la charge de l\'acheteur.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? '3. Order and Payment' : '3. Commande et paiement'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'All orders are firm and final upon payment confirmation. The download link is valid for 48 hours and limited to 3 downloads.'
                : 'Toute commande est ferme et definitive apres confirmation du paiement. Le lien de telechargement est valable 48 heures et limite a 3 telechargements.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? '4. Delivery' : '4. Livraison'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Files are delivered digitally (download). No physical products are shipped.'
                : 'Les fichiers sont delivres sous forme numerique (telechargement). Aucun produit physique n\'est expedie.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? '5. Right of Withdrawal' : '5. Droit de retractation'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'According to consumer law, the right of withdrawal does not apply to digital content immediately accessible after payment.'
                : 'Conformement a l\'article L.221-28 du Code de la consommation, le droit de retractation ne s\'applique pas aux contenus numeriques immediatement accessibles apres paiement.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? '6. Intellectual Property' : '6. Propriete intellectuelle'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Purchase grants a personal, non-exclusive license (see License). All rights remain the property of Nico Garay.'
                : 'L\'achat confere une licence d\'usage personnel non-exclusive (voir Licence). Tous les droits restent la propriete de Nico Garay.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? '7. Claims' : '7. Reclamations'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'For any issues, contact contact@nicogaray.com.'
                : 'Pour tout probleme, contactez contact@nicogaray.com.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

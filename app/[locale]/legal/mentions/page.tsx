export default async function MentionsLegalesPage({
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
          {isEN ? 'Legal Notice' : 'Mentions légales'}
        </h1>

        <div className="space-y-12 text-ink-700">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? 'Publisher' : 'Éditeur'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              Nico Garay - {isEN ? 'independent photographer' : 'photographe indépendant'}
              <br />
              Email: contact@photos-garaynico.com
              <br />
              {isEN ? 'Website' : 'Site'}: photos-garaynico.com
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? 'Hosting' : 'Hébergement'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN ? 'This site is hosted on a private VPS server.' : 'Ce site est hébergé sur un serveur VPS privé.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? 'Personal Data' : 'Données personnelles'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Data collected during purchase (name, email) is used exclusively for delivery and billing. It is not resold or shared. Under GDPR, you can request deletion at contact@photos-garaynico.com.'
                : 'Les données collectées lors d\'un achat (nom, email) sont utilisées exclusivement pour la livraison et la facturation. Elles ne sont pas revendues ni partagées. Conformément au RGPD, vous pouvez demander leur suppression à contact@photos-garaynico.com.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? 'Cookies' : 'Cookies'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'This site does not use advertising cookies. Session cookies may be used for the cart and authentication.'
                : 'Ce site n\'utilise pas de cookies publicitaires. Des cookies de session peuvent être utilisés pour le panier et l\'authentification.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? 'Intellectual Property' : 'Propriété intellectuelle'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'All photographs published on this site are the exclusive property of Nico Garay and protected by copyright. Any reproduction without authorization is prohibited.'
                : 'Toutes les photographies publiées sur ce site sont la propriété exclusive de Nico Garay et sont protégées par le droit d\'auteur. Toute reproduction sans autorisation est interdite.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

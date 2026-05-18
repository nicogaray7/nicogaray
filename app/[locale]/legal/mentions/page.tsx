export default async function MentionsLegalesPage({
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
          {isEN ? 'Legal Notice' : 'Mentions legales'}
        </h1>

        <div className="space-y-12 text-foreground-dim">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? 'Publisher' : 'Editeur'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              Nico Garay - {isEN ? 'independent photographer' : 'photographe independant'}
              <br />
              Email: contact@nicogaray.com
              <br />
              {isEN ? 'Website' : 'Site'}: photos.nicogaray.com
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? 'Hosting' : 'Hebergement'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN ? 'This site is hosted on a private VPS server.' : 'Ce site est heberge sur un serveur VPS prive.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? 'Personal Data' : 'Donnees personnelles'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Data collected during purchase (name, email) is used exclusively for delivery and billing. It is not resold or shared. Under GDPR, you can request deletion at contact@nicogaray.com.'
                : 'Les donnees collectees lors d\'un achat (nom, email) sont utilisees exclusivement pour la livraison et la facturation. Elles ne sont pas revendues ni partagees. Conformement au RGPD, vous pouvez demander leur suppression a contact@nicogaray.com.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              Cookies
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'This site does not use advertising cookies. Session cookies may be used for the cart and authentication.'
                : 'Ce site n\'utilise pas de cookies publicitaires. Des cookies de session peuvent etre utilises pour le panier et l\'authentification.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? 'Intellectual Property' : 'Propriete intellectuelle'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'All photographs published on this site are the exclusive property of Nico Garay and protected by copyright. Any reproduction without authorization is prohibited.'
                : 'Toutes les photographies publiees sur ce site sont la propriete exclusive de Nico Garay et sont protegees par le droit d\'auteur. Toute reproduction sans autorisation est interdite.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

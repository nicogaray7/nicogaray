export default function MentionsLegalesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
      <h1 className="font-serif text-4xl text-stone-800 mb-10">Mentions légales</h1>
      <div className="prose prose-stone space-y-6 text-stone-600">
        <h2 className="font-serif text-xl text-stone-700">Éditeur</h2>
        <p>Nico Garay — photographe indépendant<br />Email : contact@photos-garaynico.com<br />Site : photos-garaynico.com</p>

        <h2 className="font-serif text-xl text-stone-700">Hébergement</h2>
        <p>Ce site est hébergé sur un serveur VPS privé.</p>

        <h2 className="font-serif text-xl text-stone-700">Données personnelles</h2>
        <p>Les données collectées lors d'un achat (nom, email) sont utilisées exclusivement pour la livraison et la facturation. Elles ne sont pas revendues ni partagées. Conformément au RGPD, vous pouvez demander leur suppression à contact@photos-garaynico.com.</p>

        <h2 className="font-serif text-xl text-stone-700">Cookies</h2>
        <p>Ce site n'utilise pas de cookies publicitaires. Des cookies de session peuvent être utilisés pour le panier et l'authentification.</p>

        <h2 className="font-serif text-xl text-stone-700">Propriété intellectuelle</h2>
        <p>Toutes les photographies publiées sur ce site sont la propriété exclusive de Nico Garay et sont protégées par le droit d'auteur. Toute reproduction sans autorisation est interdite.</p>
      </div>
    </div>
  )
}

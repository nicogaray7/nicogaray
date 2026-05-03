export default function LicensePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
      <h1 className="font-serif text-4xl text-stone-800 mb-10">Licence d'utilisation</h1>
      <div className="prose prose-stone space-y-6 text-stone-600">
        <h2 className="font-serif text-xl text-stone-700">Droits accordés</h2>
        <p>L'achat d'une photo sur photos-garaynico.com vous accorde une licence personnelle, non-exclusive et non-transférable permettant :</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>L'impression et l'affichage à domicile</li>
          <li>L'usage sur support numérique personnel (fond d'écran, etc.)</li>
          <li>Le partage sur réseaux sociaux avec mention © Nico Garay</li>
        </ul>

        <h2 className="font-serif text-xl text-stone-700">Usages interdits</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Revente ou redistribution du fichier</li>
          <li>Usage commercial sans accord écrit préalable</li>
          <li>Suppression du filigrane ou des métadonnées de copyright</li>
          <li>Modification substantielle et republication comme œuvre originale</li>
        </ul>

        <h2 className="font-serif text-xl text-stone-700">Usage commercial</h2>
        <p>Pour une utilisation commerciale (publicité, édition, etc.), contactez contact@photos-garaynico.com pour un devis de licence commerciale.</p>

        <h2 className="font-serif text-xl text-stone-700">Traçabilité</h2>
        <p>Chaque fichier HD livré contient un filigrane invisible et des métadonnées liés à votre commande. Toute utilisation non autorisée est traçable et constitue une contrefaçon.</p>
      </div>
    </div>
  )
}

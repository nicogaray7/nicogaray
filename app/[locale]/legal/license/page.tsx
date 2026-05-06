export default async function LicensePage({
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
          {isEN ? 'License' : 'Licence d\'utilisation'}
        </h1>

        <div className="space-y-10 text-ink-700">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? 'Granted Rights' : 'Droits accordés'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              {isEN
                ? 'Purchasing a photo on photos-garaynico.com grants you a personal, non-exclusive, non-transferable license allowing:'
                : 'L\'achat d\'une photo sur photos-garaynico.com vous accorde une licence personnelle, non-exclusive et non-transférable permettant :'}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg">
              {isEN ? (
                <>
                  <li>Printing and displaying at home</li>
                  <li>Use on personal digital media (wallpaper, etc.)</li>
                  <li>Sharing on social networks with © Nico Garay attribution</li>
                </>
              ) : (
                <>
                  <li>L&apos;impression et l&apos;affichage à domicile</li>
                  <li>L&apos;usage sur support numérique personnel (fond d&apos;écran, etc.)</li>
                  <li>Le partage sur réseaux sociaux avec mention © Nico Garay</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? 'Prohibited Uses' : 'Usages interdits'}
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg">
              {isEN ? (
                <>
                  <li>Resale or redistribution of the file</li>
                  <li>Commercial use without prior written consent</li>
                  <li>Removal of watermark or copyright metadata</li>
                  <li>Substantial modification and republication as original work</li>
                </>
              ) : (
                <>
                  <li>Revente ou redistribution du fichier</li>
                  <li>Usage commercial sans accord écrit préalable</li>
                  <li>Suppression du filigrane ou des métadonnées de copyright</li>
                  <li>Modification substantielle et republication comme oeuvre originale</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? 'Commercial Use' : 'Usage commercial'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'For commercial use (advertising, publishing, etc.), contact contact@photos-garaynico.com for a commercial license quote.'
                : 'Pour une utilisation commerciale (publicité, édition, etc.), contactez contact@photos-garaynico.com pour un devis de licence commerciale.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-ink-900 mb-4">
              {isEN ? 'Traceability' : 'Traçabilité'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Each HD file contains invisible watermarking and metadata linked to your purchase. Unauthorized use is traceable and constitutes counterfeiting.'
                : 'Chaque fichier HD livré contient un filigrane invisible et des métadonnées liés à votre commande. Toute utilisation non autorisée est traçable et constitue une contrefaçon.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

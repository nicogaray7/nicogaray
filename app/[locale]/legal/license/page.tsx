export default async function LicensePage({
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
          {isEN ? 'License' : 'Licence d\'utilisation'}
        </h1>

        <div className="space-y-10 text-foreground-dim">
          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? 'Granted Rights' : 'Droits accordes'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed mb-4">
              {isEN
                ? 'Purchasing a photo on photos.nicogaray.com grants you a personal, non-exclusive, non-transferable license allowing:'
                : 'L\'achat d\'une photo sur photos.nicogaray.com vous accorde une licence personnelle, non-exclusive et non-transferable permettant :'}
            </p>
            <ul className="list-disc pl-6 space-y-2 text-base sm:text-lg">
              {isEN ? (
                <>
                  <li>Printing and displaying at home</li>
                  <li>Use on personal digital media (wallpaper, etc.)</li>
                  <li>Sharing on social networks with &copy; Nico Garay attribution</li>
                </>
              ) : (
                <>
                  <li>L&apos;impression et l&apos;affichage a domicile</li>
                  <li>L&apos;usage sur support numerique personnel (fond d&apos;ecran, etc.)</li>
                  <li>Le partage sur reseaux sociaux avec mention &copy; Nico Garay</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
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
                  <li>Usage commercial sans accord ecrit prealable</li>
                  <li>Suppression du filigrane ou des metadonnees de copyright</li>
                  <li>Modification substantielle et republication comme oeuvre originale</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? 'Commercial Use' : 'Usage commercial'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'For commercial use (advertising, publishing, etc.), contact contact@nicogaray.com for a commercial license quote.'
                : 'Pour une utilisation commerciale (publicite, edition, etc.), contactez contact@nicogaray.com pour un devis de licence commerciale.'}
            </p>
          </div>

          <div>
            <h2 className="font-display text-xl sm:text-2xl text-foreground mb-4">
              {isEN ? 'Traceability' : 'Tracabilite'}
            </h2>
            <p className="text-base sm:text-lg leading-relaxed">
              {isEN
                ? 'Each HD file contains invisible watermarking and metadata linked to your purchase. Unauthorized use is traceable and constitutes counterfeiting.'
                : 'Chaque fichier HD livre contient un filigrane invisible et des metadonnees lies a votre commande. Toute utilisation non autorisee est tracable et constitue une contrefacon.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

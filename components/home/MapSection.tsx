'use client'

import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { useState } from 'react'
import { countries110mTopology } from '@/lib/worldTopology'

// Mapping bilingue (FR + EN) → ISO numeric
const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  // FR
  'France': '250', 'Allemagne': '276', 'Espagne': '724', 'Portugal': '620',
  'Italie': '380', 'Royaume-Uni': '826', 'Pays-Bas': '528', 'Belgique': '056',
  'Suisse': '756', 'Autriche': '040', 'Hongrie': '348', 'Tchéquie': '203',
  'Slovaquie': '703', 'Slovénie': '705', 'Croatie': '191', 'Pologne': '616',
  'Estonie': '233', 'Lettonie': '428', 'Lituanie': '440', 'Roumanie': '642',
  'Grèce': '300', 'Turquie': '792', 'Russie': '643', 'Norvège': '578',
  'Suède': '752', 'Danemark': '208', 'Finlande': '246', 'Islande': '352',
  'Irlande': '372', 'Maroc': '504', 'Tunisie': '788', 'Égypte': '818',
  'Algérie': '012', 'Sénégal': '686', 'Kenya': '404', 'Tanzanie': '834',
  'Afrique du Sud': '710', 'Madagascar': '450', 'Mauritanie': '478',
  'États-Unis': '840', 'Canada': '124', 'Mexique': '484', 'Brésil': '076',
  'Argentine': '032', 'Chili': '152', 'Pérou': '604', 'Colombie': '170',
  'Bolivie': '068', 'Cuba': '192',
  'Inde': '356', 'Népal': '524', 'Sri Lanka': '144', 'Pakistan': '586',
  'Chine': '156', 'Japon': '392', 'Corée du Sud': '410', 'Taiwan': '158',
  'Mongolie': '496', 'Indonésie': '360', 'Malaisie': '458', 'Singapour': '702',
  'Thaïlande': '764', 'Viet Nam': '704', 'Vietnam': '704',
  'Cambodge': '116', 'Laos': '418', 'Myanmar': '104', 'Birmanie': '104',
  'Philippines': '608', 'Australie': '036', 'Nouvelle-Zélande': '554',
  'Émirats arabes unis': '784', 'Israël': '376', 'Jordanie': '400',
  // EN
  'Germany': '276', 'Spain': '724', 'Italy': '380', 'United Kingdom': '826',
  'Netherlands': '528', 'Belgium': '056', 'Switzerland': '756', 'Austria': '040',
  'Hungary': '348', 'Czech Republic': '203', 'Czechia': '203',
  'Slovakia': '703', 'Slovenia': '705', 'Croatia': '191', 'Poland': '616',
  'Estonia': '233', 'Latvia': '428', 'Lithuania': '440', 'Romania': '642',
  'Greece': '300', 'Turkey': '792', 'Russia': '643', 'Norway': '578',
  'Sweden': '752', 'Denmark': '208', 'Finland': '246', 'Iceland': '352',
  'Ireland': '372', 'Morocco': '504', 'Tunisia': '788', 'Egypt': '818',
  'Algeria': '012', 'Senegal': '686', 'Kenya EN': '404', 'Tanzania': '834',
  'South Africa': '710', 'Madagascar EN': '450', 'Mauritania': '478',
  'United States': '840', 'Canada EN': '124', 'Mexico': '484', 'Brazil': '076',
  'Argentina': '032', 'Chile': '152', 'Peru': '604', 'Colombia': '170',
  'Bolivia': '068', 'Cuba EN': '192',
  'India': '356', 'Nepal': '524', 'Sri Lanka EN': '144', 'Pakistan EN': '586',
  'China': '156', 'Japan': '392', 'South Korea': '410', 'Taiwan EN': '158',
  'Mongolia': '496', 'Indonesia': '360', 'Malaysia': '458', 'Singapore': '702',
  'Thailand': '764', 'Cambodia': '116', 'Laos EN': '418', 'Myanmar EN': '104',
  'Philippines EN': '608', 'Australia': '036', 'New Zealand': '554',
}

// Inverse pour récupérer le nom depuis l'ISO
const ISO_TO_FR: Record<string, string> = {}
for (const [name, iso] of Object.entries(COUNTRY_NAME_TO_ISO)) {
  // Préférer la version sans " EN"
  if (!name.endsWith(' EN') && !ISO_TO_FR[iso]) {
    ISO_TO_FR[iso] = name
  }
}

export function MapSection({
  countries,
  locale,
}: {
  countries: string[]
  locale: string
}) {
  const t = useTranslations('home.map')
  const router = useRouter()
  const [hovered, setHovered] = useState<string | null>(null)

  const visitedIsos = new Set(
    countries.map(c => COUNTRY_NAME_TO_ISO[c]).filter(Boolean)
  )

  return (
    <section className="py-20 sm:py-32 bg-ink-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="max-w-2xl mb-12 sm:mb-16">
          <p className="text-[11px] tracking-[0.3em] uppercase text-accent-500 mb-4 font-medium">
            {locale === 'fr' ? 'Carnets de voyage' : 'Travel notebook'}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[0.95] text-balance mb-6">
            {t('title')}
          </h2>
          <p className="text-ink-600 text-base sm:text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Map */}
        <div className="relative">
          <div className="relative aspect-[2/1] sm:aspect-[16/9] bg-white rounded-2xl overflow-hidden border border-ink-200 shadow-[0_20px_80px_-32px_rgba(18,25,38,0.35)]">
            <ComposableMap
              width={800}
              height={420}
              projectionConfig={{ scale: 165 }}
              className="absolute inset-0 h-full w-full max-w-none"
            >
              <Geographies geography={countries110mTopology}>
                {({ geographies }: { geographies: Array<{ id: string; rsmKey: string }> }) =>
                  geographies.map(geo => {
                    const isVisited = visitedIsos.has(geo.id)
                    const countryName = ISO_TO_FR[geo.id]
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => {
                          if (isVisited && countryName) {
                            router.push(`/${locale}/shop?country=${encodeURIComponent(countryName)}`)
                          }
                        }}
                        onMouseEnter={() => isVisited && setHovered(countryName ?? null)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                          default: {
                            fill:        isVisited ? '#315efb' : '#e7eaf2',
                            stroke:      '#ffffff',
                            strokeWidth: 0.5,
                            outline:     'none',
                            cursor:      isVisited ? 'pointer' : 'default',
                            transition:  'fill 0.3s',
                          },
                          hover: {
                            fill:    isVisited ? '#1f45d6' : '#e7eaf2',
                            outline: 'none',
                          },
                          pressed: { outline: 'none' },
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ComposableMap>
          </div>

          {/* Hovered country label */}
          {hovered && (
            <div className="hidden sm:block absolute top-6 right-6 bg-ink-900 text-white text-sm tracking-wide px-4 py-2 rounded-full animate-fade-in font-medium">
              {hovered}
            </div>
          )}
        </div>

        {/* Countries chips */}
        <div className="mt-8 sm:mt-12">
          <p className="text-[11px] tracking-[0.3em] uppercase text-ink-500 mb-4 sm:mb-6">
            {locale === 'fr' ? 'Pays visites' : 'Countries visited'}
          </p>
          <div className="flex flex-wrap gap-2">
            {countries.map(c => (
              <button
                key={c}
                onClick={() => router.push(`/${locale}/shop?country=${encodeURIComponent(c)}`)}
                className="text-xs sm:text-sm bg-white text-ink-700 border border-ink-200 px-3.5 py-2 rounded-full hover:bg-ink-900 hover:text-white hover:border-ink-900 transition-all"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useTranslations, useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { useState } from 'react'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Mapping country name → ISO numeric (world-atlas uses numeric codes)
// This is a simplified lookup; extend as needed for your catalog countries
const COUNTRY_NAME_TO_ISO: Record<string, string> = {
  France: '250',
  Japan: '392',
  Vietnam: '704',
  Thailand: '764',
  'United States': '840',
  Morocco: '504',
  Portugal: '620',
  Italy: '380',
  Spain: '724',
  Germany: '276',
  'United Kingdom': '826',
  Indonesia: '360',
  Myanmar: '104',
  Cambodia: '116',
  Laos: '418',
  India: '356',
  Nepal: '524',
  Peru: '604',
  Bolivia: '068',
  Argentina: '032',
  Brazil: '076',
  Colombia: '170',
  Mexico: '484',
  Turkey: '792',
  Egypt: '818',
  Tanzania: '834',
  Kenya: '404',
  'South Africa': '710',
  Senegal: '686',
  Madagascar: '450',
  Australia: '036',
  'New Zealand': '554',
  China: '156',
  Taiwan: '158',
  'South Korea': '410',
  Malaysia: '458',
  Singapore: '702',
  Philippines: '608',
  'Sri Lanka': '144',
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
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)

  const visitedIsos = new Set(
    countries.map((c) => COUNTRY_NAME_TO_ISO[c]).filter(Boolean),
  )

  return (
    <section className="py-24 bg-beige-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="font-serif text-3xl md:text-4xl text-center text-stone-800 mb-2">
          {t('title')}
        </h2>
        <p className="text-center text-stone-400 text-sm tracking-wide mb-12">
          {t('subtitle')}
        </p>

        <div className="relative rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
          <ComposableMap
            projectionConfig={{ scale: 147 }}
            style={{ width: '100%', height: 'auto' }}
          >
            <ZoomableGroup>
              <Geographies geography={GEO_URL}>
                {({ geographies }: { geographies: any[] }) =>
                  geographies.map((geo: any) => {
                    const isVisited = visitedIsos.has(geo.id)
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        onClick={() => {
                          if (isVisited) {
                            const countryName = Object.entries(COUNTRY_NAME_TO_ISO).find(
                              ([, iso]) => iso === geo.id,
                            )?.[0]
                            if (countryName) {
                              router.push(`/${locale}/shop?country=${encodeURIComponent(countryName)}`)
                            }
                          }
                        }}
                        onMouseEnter={(e: React.MouseEvent) => {
                          if (isVisited) {
                            const countryName = Object.entries(COUNTRY_NAME_TO_ISO).find(
                              ([, iso]) => iso === geo.id,
                            )?.[0]
                            setTooltip({ name: countryName ?? geo.properties.name, x: e.clientX, y: e.clientY })
                          }
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        style={{
                          default: {
                            fill: isVisited ? '#44403c' : '#d6d3d1',
                            stroke: '#fff',
                            strokeWidth: 0.5,
                            outline: 'none',
                            cursor: isVisited ? 'pointer' : 'default',
                          },
                          hover: {
                            fill: isVisited ? '#1c1917' : '#d6d3d1',
                            outline: 'none',
                          },
                          pressed: { outline: 'none' },
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {tooltip && (
          <div
            className="fixed z-50 bg-stone-900 text-white text-xs px-3 py-1.5 rounded shadow-lg pointer-events-none"
            style={{ top: tooltip.y - 40, left: tooltip.x + 8 }}
          >
            {tooltip.name}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {countries.map((c) => (
            <button
              key={c}
              onClick={() => router.push(`/${locale}/shop?country=${encodeURIComponent(c)}`)}
              className="text-xs border border-stone-300 text-stone-600 px-3 py-1 rounded-full hover:bg-stone-800 hover:text-white hover:border-stone-800 transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

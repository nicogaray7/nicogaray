'use client'

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps'
import { getCountryMapCenter } from '@/lib/countryCentroid'
import { countries110mTopology } from '@/lib/worldTopology'

interface Props {
  latitude:  number | null
  longitude: number | null
  country:   string | null
  locale:    string
}

export function PhotoLocationMap({ latitude, longitude, country, locale }: Props) {
  const hasGps = latitude != null && longitude != null
  const fallback = getCountryMapCenter(country)
  if (!hasGps && !fallback) return null

  const lon = hasGps ? longitude! : fallback![0]
  const lat = hasGps ? latitude!  : fallback![1]

  const scale = hasGps ? 120000 : 900

  return (
    <div className="rounded-xl overflow-hidden border border-ink-100 bg-ink-100">
      <p className="text-[10px] tracking-[0.25em] uppercase text-ink-400 px-4 pt-3 pb-1">
        {locale === 'fr' ? 'Localisation' : 'Location'}
      </p>
      <div className="relative w-full aspect-[2/1] max-h-[220px]">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [lon, lat], scale }}
          width={800}
          height={400}
          className="absolute inset-0 h-full w-full max-w-none"
        >
          <Geographies geography={countries110mTopology}>
            {({ geographies }: { geographies: Array<{ rsmKey: string }> }) =>
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: '#e8e6e0', stroke: '#fafaf9', strokeWidth: 0.4, outline: 'none' },
                    hover:   { fill: '#e8e6e0', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          <Marker coordinates={[lon, lat]}>
            <circle r={10} fill="#b8985c" stroke="#fff" strokeWidth={3} />
          </Marker>
        </ComposableMap>
      </div>
      {country && (
        <p className="text-xs text-ink-600 px-4 pb-3 pt-1">{country}</p>
      )}
    </div>
  )
}

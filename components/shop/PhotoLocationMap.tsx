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

  // Keep zoom moderate to avoid rendering a "broken" over-zoomed map.
  const scale = hasGps ? 2600 : 900

  return (
    <div className="rounded-lg overflow-hidden border border-ink-150 bg-white">
      <p className="text-[9px] tracking-[0.2em] uppercase text-ink-500 px-4 pt-3 pb-1">
        {locale === 'fr' ? 'Localisation' : 'Location'}
      </p>
      <div className="relative w-full aspect-[2/1] max-h-[240px]">
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
                    default: { fill: '#EDE8DC', stroke: '#DDD9CF', strokeWidth: 0.4, outline: 'none' },
                    hover:   { fill: '#EDE8DC', outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                />
              ))
            }
          </Geographies>
          <Marker coordinates={[lon, lat]}>
            <circle r={8} fill="#2C2416" stroke="#fff" strokeWidth={2.5} />
          </Marker>
        </ComposableMap>
      </div>
      {country && (
        <p className="text-xs text-ink-700 px-4 pb-3 pt-1">{country}</p>
      )}
    </div>
  )
}

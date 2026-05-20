'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup, Sphere, Graticule } from 'react-simple-maps';
import { numericToAlpha2 } from '@/lib/country-codes';

interface CountryEntry {
  code: string;
  name: string;
  count: number;
}

interface PhotoDot {
  lat: number;
  lng: number;
  countryCode: string;
}

export function WorldMap({
  countries,
  photoDots,
  locale,
}: {
  countries: CountryEntry[];
  photoDots: PhotoDot[];
  locale: string;
}) {
  const router = useRouter();
  const [hovered, setHovered] = React.useState<CountryEntry | null>(null);

  const visited = React.useMemo(() => {
    const m = new Map<string, CountryEntry>();
    for (const c of countries) m.set(c.code, c);
    return m;
  }, [countries]);

  return (
    <div className="relative w-full bg-ink rounded-sm overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 145, center: [10, 25] }}
        width={1200}
        height={620}
        style={{ width: '100%', height: 'auto', background: '#0F0F0F' }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="dotGlow">
            <stop offset="0%" stopColor="#FF3B5C" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FF3B5C" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FF3B5C" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ZoomableGroup center={[10, 25]} zoom={1} minZoom={1} maxZoom={8}>
          <Sphere id="sphere" stroke="transparent" strokeWidth={0} fill="#0F0F0F" />
          <Graticule stroke="#1F1F1F" strokeWidth={0.5} step={[20, 20]} />

          <Geographies geography="/world-110m.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const numId = String(geo.id).padStart(3, '0');
                const alpha2 = numericToAlpha2[numId];
                const entry = alpha2 ? visited.get(alpha2) : undefined;
                const isVisited = !!entry;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => entry && setHovered(entry)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => entry && router.push(`/${locale}/country/${entry.code}`)}
                    style={{
                      default: {
                        fill: isVisited ? '#2A1A1F' : '#1A1A1A',
                        stroke: isVisited ? '#FF3B5C' : '#262626',
                        strokeWidth: isVisited ? 0.5 : 0.3,
                        outline: 'none',
                        cursor: isVisited ? 'pointer' : 'default',
                        transition: 'fill 0.2s ease',
                      },
                      hover: {
                        fill: isVisited ? '#3D1F26' : '#1A1A1A',
                        outline: 'none',
                      },
                      pressed: { fill: '#4A2530', outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {photoDots.map((d, i) => (
            <Marker key={i} coordinates={[d.lng, d.lat]}>
              <circle r={6} fill="url(#dotGlow)" />
              <circle r={1.5} fill="#FF3B5C" stroke="#FFFFFF" strokeWidth={0.4} />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 text-paper">
        <p className="text-xs text-paper/60 mb-1">
          {countries.length} {locale === 'en' ? 'countries' : 'pays'} · {photoDots.length} photos
        </p>
        {hovered && (
          <p className="text-base sm:text-lg font-medium">
            {hovered.name}
            <span className="text-paper/60 text-sm ml-2">
              {hovered.count} {hovered.count === 1 ? 'photo' : 'photos'}
            </span>
          </p>
        )}
      </div>

      <p className="absolute bottom-3 right-4 text-[10px] text-paper/40 pointer-events-none">
        {locale === 'en' ? 'Scroll to zoom · drag to pan · click country' : 'Molette pour zoomer · glisser pour déplacer · cliquer un pays'}
      </p>
    </div>
  );
}

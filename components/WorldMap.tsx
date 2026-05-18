'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps';
import { numericToAlpha2 } from '@/lib/country-codes';

interface CountryEntry {
  code: string;
  name: string;
  count: number;
}

export function WorldMap({
  countries,
  locale,
}: {
  countries: CountryEntry[];
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
    <div className="relative w-full">
      <ComposableMap
        projection="geoEqualEarth"
        projectionConfig={{ scale: 175 }}
        width={980}
        height={500}
        style={{ width: '100%', height: 'auto' }}
      >
        <ZoomableGroup center={[0, 10]} zoom={1} minZoom={1} maxZoom={6}>
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
                        fill: isVisited ? '#FF3B5C' : '#E5E5E5',
                        stroke: '#FFFFFF',
                        strokeWidth: 0.5,
                        outline: 'none',
                        cursor: isVisited ? 'pointer' : 'default',
                      },
                      hover: {
                        fill: isVisited ? '#E0264A' : '#D4D4D4',
                        outline: 'none',
                      },
                      pressed: { fill: '#E0264A', outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>

      <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-ink-muted">
          {hovered ? (
            <>
              <span className="text-ink font-medium">{hovered.name}</span>
              {' — '}
              {hovered.count} {hovered.count === 1 ? 'photo' : 'photos'}
            </>
          ) : (
            <>
              {countries.length} {locale === 'en' ? 'countries visited' : 'pays visités'} ·{' '}
              {countries.reduce((sum, c) => sum + c.count, 0)} photos
            </>
          )}
        </p>
        <p className="text-xs text-ink-dim">
          {locale === 'en' ? 'Click a highlighted country to open its gallery' : 'Cliquez sur un pays surligné pour ouvrir sa galerie'}
        </p>
      </div>
    </div>
  );
}

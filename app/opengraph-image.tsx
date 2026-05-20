import { ImageResponse } from 'next/og';

export const alt = 'Nico Garay · Photographie de voyage';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function loadItaliana(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch('https://fonts.googleapis.com/css2?family=Italiana&display=swap', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Version/13.1 Safari/605.1.15',
      },
    }).then((r) => r.text());
    const match = css.match(/src: url\((https:[^)]+\.ttf)\)/);
    if (!match) return null;
    return await fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const fontData = await loadItaliana();
  const display = fontData ? 'Italiana' : 'serif';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0F0F0F',
          color: '#F5F2EC',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontSize: 28,
            letterSpacing: 10,
            textTransform: 'uppercase',
            color: '#A8A29A',
          }}
        >
          Photographie de voyage
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontFamily: display,
              fontSize: 140,
              lineHeight: 1,
              letterSpacing: 16,
              textTransform: 'uppercase',
              color: '#F5F2EC',
            }}
          >
            Nico Garay
          </div>
          <div style={{ fontSize: 32, color: '#A8A29A', lineHeight: 1.4, maxWidth: 900 }}>
            Voyageur avant photographe. Paysages et sujets qui m'inspirent, en édition numérique haute résolution.
          </div>
        </div>

        <div
          style={{
            fontFamily: display,
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#A8A29A',
          }}
        >
          photos.nicogaray.com
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [{ name: 'Italiana', data: fontData, weight: 400, style: 'normal' }]
        : undefined,
    },
  );
}

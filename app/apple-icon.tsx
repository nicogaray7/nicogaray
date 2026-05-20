import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

async function loadItaliana(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch('https://fonts.googleapis.com/css2?family=Italiana&display=swap', {
      headers: {
        // ask Google for the woff/ttf URL (default UA returns woff2 which @vercel/og can't read)
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

export default async function AppleIcon() {
  const fontData = await loadItaliana();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0F0F0F',
          color: '#F5F2EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: fontData ? 'Italiana' : 'serif',
          fontSize: 110,
          letterSpacing: 12,
          paddingLeft: 12, // optical compensation for letter-spacing pushing text right
        }}
      >
        NG
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

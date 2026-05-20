import { ImageResponse } from 'next/og';

export const alt = 'Nico Garay · Photographie de voyage';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0F0F0F',
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 28, color: '#FF3B5C', letterSpacing: 6, textTransform: 'uppercase' }}>
            Photographie
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 96, lineHeight: 1, letterSpacing: -2, color: '#FFFFFF' }}>
            Nico Garay
          </div>
          <div style={{ fontSize: 36, color: '#AAAAAA', lineHeight: 1.3, maxWidth: 900 }}>
            Voyageur avant photographe. Paysages et sujets qui m'inspirent, en édition numérique haute résolution.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, color: '#888888' }}>photos.nicogaray.com</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 12, height: 12, background: '#FF3B5C', borderRadius: '50%' }} />
            <div style={{ fontSize: 22, color: '#888888', letterSpacing: 4, textTransform: 'uppercase' }}>
              ng
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

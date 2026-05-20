import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0F0F0F',
          color: '#FFFFFF',
          fontFamily: 'Georgia, serif',
          fontSize: 96,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        ng
        <div
          style={{
            position: 'absolute',
            top: 118,
            right: 50,
            width: 10,
            height: 10,
            background: '#FF3B5C',
            borderRadius: '50%',
          }}
        />
      </div>
    ),
    size,
  );
}

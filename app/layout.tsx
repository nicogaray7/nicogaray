import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Nico Garay · Photographie',
    template: '%s · Nico Garay',
  },
  description: 'Photographies de voyage. Éditions numériques haute résolution.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com'),
  openGraph: {
    type: 'website',
    siteName: 'Nico Garay Photography',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={sans.variable}>
      <body>{children}</body>
    </html>
  );
}

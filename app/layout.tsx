import type { Metadata } from 'next';
import Script from 'next/script';
import { Outfit, Italiana } from 'next/font/google';
import './globals.css';

const GA_ID = 'G-TF7WRXVYLC';

const sans = Outfit({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Italiana({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
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
    <html lang="fr" className={`${sans.variable} ${display.variable}`}>
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}

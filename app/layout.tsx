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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos.nicogaray.com';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Nico Garay · Photographie de voyage',
    template: '%s · Nico Garay',
  },
  description:
    "Photographies de voyage en édition numérique haute résolution. Voyageur avant photographe, je capture les paysages et les sujets qui m'inspirent.",
  applicationName: 'Nico Garay Photography',
  authors: [{ name: 'Nico Garay', url: 'https://nicogaray.com' }],
  creator: 'Nico Garay',
  publisher: 'Nico Garay',
  keywords: [
    'photographie de voyage',
    'travel photography',
    'Nico Garay',
    'tirage photo',
    'édition numérique',
    'paysage',
    'photographe',
    'fine art print',
  ],
  category: 'photography',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: '/',
    languages: {
      fr: '/fr',
      en: '/en',
      'x-default': '/fr',
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Nico Garay Photography',
    title: 'Nico Garay · Photographie de voyage',
    description:
      "Photographies de voyage en édition numérique haute résolution. Voyageur avant photographe, je capture les paysages et les sujets qui m'inspirent.",
    url: SITE_URL,
    locale: 'fr_FR',
    alternateLocale: ['en_GB'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nico Garay · Photographie de voyage',
    description: 'Photographies de voyage en édition numérique haute résolution.',
    creator: '@nicogaray',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
    apple: '/apple-icon',
  },
};

export const viewport = {
  themeColor: '#0F0F0F',
  colorScheme: 'dark light' as const,
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
            window.gtag = gtag;
            // Consent Mode v2 - defaults (update via banner if/when added)
            gtag('consent', 'default', {
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
              analytics_storage: 'granted',
              functionality_storage: 'granted',
              security_storage: 'granted',
              wait_for_update: 500,
            });
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              send_page_view: true,
              anonymize_ip: true,
            });
          `}
        </Script>
      </head>
      <body>{children}</body>
    </html>
  );
}

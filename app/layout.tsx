import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nico Garay - Photographie',
  description: 'Photographies contemplatives de voyage. Editions numeriques en haute resolution.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://photos-garaynico.com'),
  openGraph: {
    siteName: 'Nico Garay Photography',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}

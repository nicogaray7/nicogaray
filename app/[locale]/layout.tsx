import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/i18n/config';
import { Suspense } from 'react';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { ToastProvider } from '@/components/ui/toast';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { ConsentBanner } from '@/components/layout/ConsentBanner';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const isEn = params.locale === 'en';
  // Utiliser "absolute" pour bypasser le template root (qui ajouterait "· Nico Garay" en suffixe)
  const title = isEn
    ? { absolute: 'Nico Garay · Travel photography' }
    : { absolute: 'Nico Garay · Photographie de voyage' };
  const description = isEn
    ? "Travel photography in high-resolution digital editions. Traveller before photographer, I capture the landscapes and subjects that inspire me."
    : "Photographies de voyage en édition numérique haute résolution. Voyageur avant photographe, je capture les paysages et les sujets qui m'inspirent.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${params.locale}`,
      languages: { fr: '/fr', en: '/en', 'x-default': '/fr' },
    },
    openGraph: {
      title: isEn ? 'Nico Garay · Travel photography' : 'Nico Garay · Photographie de voyage',
      description,
      locale: isEn ? 'en_GB' : 'fr_FR',
      alternateLocale: isEn ? ['fr_FR'] : ['en_GB'],
    },
    twitter: {
      title: isEn ? 'Nico Garay · Travel photography' : 'Nico Garay · Photographie de voyage',
      description,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as Locale)) notFound();
  setRequestLocale(params.locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={params.locale} messages={messages}>
      <ToastProvider>
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        <Suspense fallback={null}>
          <ConsentBanner />
        </Suspense>
        <Nav />
        <main className="min-h-screen pt-16 sm:pt-20">{children}</main>
        <Footer />
      </ToastProvider>
    </NextIntlClientProvider>
  );
}

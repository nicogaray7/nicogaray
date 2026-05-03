import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'fr' ? 'À propos — Nico Garay' : 'About — Nico Garay',
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('about')

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24">
      <h1 className="font-serif text-5xl text-stone-800 mb-12">{t('title')}</h1>

      <div className="prose prose-stone max-w-none space-y-6 text-stone-600 text-lg leading-relaxed">
        <p>{t('text1')}</p>
        <p>{t('text2')}</p>
      </div>
    </div>
  )
}

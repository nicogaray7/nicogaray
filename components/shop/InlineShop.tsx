'use client'

import { Calendar, MapPin } from 'lucide-react'
import { BuyButton } from './BuyButton'
import { formatFileSize, formatMegapixels } from '@/lib/utils'

interface InlineShopProps {
  photoId: string
  title: string
  country?: string | null
  city?: string | null
  price: number
  description?: string | null
  takenAt?: Date | null
  width: number
  height: number
  fileSize: number
  orientation: string
  locale: string
}

export function InlineShop({
  photoId,
  title,
  country,
  city,
  price,
  description,
  takenAt,
  width,
  height,
  fileSize,
  orientation,
  locale,
}: InlineShopProps) {
  const isEnglish = locale === 'en'
  const licenseText = isEnglish
    ? 'Personal license. Delivered file contains an invisible watermark identifying the buyer.'
    : 'Licence personnelle. Le fichier livre contient un filigrane invisible identifiant l acheteur.'

  return (
    <section className="py-16 sm:py-24 bg-ink-50 border-t border-ink-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl text-ink-900 mb-4 tracking-tight">
                {title}
              </h2>
              {description && (
                <p className="text-lg text-ink-700 leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-ink-600">
              {takenAt && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent-500" />
                  {new Date(takenAt).toLocaleDateString(isEnglish ? 'en-GB' : 'fr-FR', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              )}
              {(country || city) && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent-500" />
                  {[city, country].filter(Boolean).join(', ')}
                </span>
              )}
              <span className="text-ink-600">
                {formatMegapixels(width, height)} · {formatFileSize(fileSize)}
              </span>
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white border-2 border-accent-500 rounded-lg p-8 space-y-6">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-accent-500 mb-2">
                  {isEnglish ? 'Get This Photo' : 'Achetez cette photo'}
                </p>
                <p className="font-display text-4xl text-ink-900 tabular-nums">
                  ${price.toFixed(2)}
                </p>
              </div>

              <div className="border-t border-ink-200 pt-4">
                <p className="text-xs text-ink-600 mb-4">
                  {isEnglish
                    ? 'High-resolution HD file with personal license'
                    : 'Fichier HD haute resolution avec licence personnelle'}
                </p>
              </div>

              <BuyButton photoId={photoId} locale={locale} />

              <div className="text-[10px] text-ink-500 leading-relaxed">
                <p>{licenseText}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

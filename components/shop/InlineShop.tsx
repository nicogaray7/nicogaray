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
  locale,
}: InlineShopProps) {
  const en = locale === 'en'

  return (
    <section className="py-12 sm:py-20 border-t border-line">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl text-foreground mb-4 tracking-tight">
                {title}
              </h2>
              {description && (
                <p className="text-foreground-dim text-lg leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-foreground-dim">
              {takenAt && (
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  {new Date(takenAt).toLocaleDateString(en ? 'en-GB' : 'fr-FR', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </span>
              )}
              {(country || city) && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-accent" />
                  {[city, country].filter(Boolean).join(', ')}
                </span>
              )}
              <span className="text-foreground-muted">
                {formatMegapixels(width, height)} MP / {formatFileSize(fileSize)} MB
              </span>
            </div>
          </div>

          {/* Purchase card */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-surface-card border border-line p-8 space-y-6">
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-accent mb-2">
                  {en ? 'Digital Edition' : 'Edition Numerique'}
                </p>
                <p className="font-display text-4xl text-foreground tabular-nums">
                  {price.toFixed(0)}&euro;
                </p>
              </div>

              <div className="border-t border-line pt-4">
                <p className="text-xs text-foreground-muted mb-4">
                  {en
                    ? 'High-resolution HD file with personal license'
                    : 'Fichier HD haute resolution avec licence personnelle'}
                </p>
              </div>

              <BuyButton photoId={photoId} locale={locale} />

              <p className="text-[10px] text-foreground-muted leading-relaxed">
                {en
                  ? 'Personal license. Delivered file contains an invisible watermark identifying the buyer.'
                  : 'Licence personnelle. Le fichier livre contient un filigrane invisible identifiant l\'acheteur.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

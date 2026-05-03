'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

export function FilterBar({ countries }: { countries: string[] }) {
  const t = useTranslations('shop.filters')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'all' || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams],
  )

  const current = {
    country: searchParams.get('country') ?? '',
    orientation: searchParams.get('orientation') ?? '',
    sort: searchParams.get('sort') ?? '',
  }

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      {/* Pays */}
      <select
        value={current.country}
        onChange={(e) => updateFilter('country', e.target.value)}
        className="text-sm border border-stone-200 rounded px-3 py-2 text-stone-600 bg-white focus:outline-none focus:border-stone-400"
      >
        <option value="">{t('country')}</option>
        {countries.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Orientation */}
      <select
        value={current.orientation}
        onChange={(e) => updateFilter('orientation', e.target.value)}
        className="text-sm border border-stone-200 rounded px-3 py-2 text-stone-600 bg-white focus:outline-none focus:border-stone-400"
      >
        <option value="">{t('orientation')}</option>
        <option value="landscape">{t('landscape')}</option>
        <option value="portrait">{t('portrait')}</option>
        <option value="square">{t('square')}</option>
      </select>

      {/* Tri */}
      <select
        value={current.sort}
        onChange={(e) => updateFilter('sort', e.target.value)}
        className="text-sm border border-stone-200 rounded px-3 py-2 text-stone-600 bg-white focus:outline-none focus:border-stone-400"
      >
        <option value="">{t('sort')}</option>
        <option value="recent">{t('recent')}</option>
        <option value="priceAsc">{t('priceAsc')}</option>
        <option value="priceDesc">{t('priceDesc')}</option>
      </select>

      {/* Reset */}
      {(current.country || current.orientation || current.sort) && (
        <button
          onClick={() => router.push(pathname)}
          className="text-xs text-stone-400 hover:text-stone-700 underline"
        >
          {t('all')}
        </button>
      )}
    </div>
  )
}

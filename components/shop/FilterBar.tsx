'use client'

import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect } from 'react'
import { SlidersHorizontal, X, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function FilterBar({ countries }: { countries: string[] }) {
  const t = useTranslations('shop.filters')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [open, setOpen] = useState(false)

  const current = {
    country:     searchParams.get('country')     ?? '',
    orientation: searchParams.get('orientation') ?? '',
    sort:        searchParams.get('sort')        ?? '',
  }

  const activeCount = [current.country, current.orientation, current.sort].filter(Boolean).length

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === '' || value === current[key as keyof typeof current]) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams, current],
  )

  // Bloquer scroll quand drawer ouvert
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Mobile : bouton qui ouvre un bottom sheet */}
      <div className="sm:hidden flex items-center justify-between gap-3 mb-6">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 text-sm bg-white border border-ink-200 px-4 py-2.5 rounded-full text-ink-700 hover:border-ink-400 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {locale_label(t, 'filter')}
          {activeCount > 0 && (
            <span className="bg-ink-900 text-white text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
        {activeCount > 0 && (
          <button
            onClick={() => router.push(pathname)}
            className="text-xs text-ink-400 hover:text-ink-700 underline"
          >
            {t('all')}
          </button>
        )}
      </div>

      {/* Desktop : filtres inline */}
      <div className="hidden sm:flex items-center gap-2 flex-wrap mb-8">
        <DropdownFilter
          label={t('country')}
          value={current.country}
          options={countries.map(c => ({ value: c, label: c }))}
          onChange={v => updateFilter('country', v)}
        />
        <DropdownFilter
          label={t('orientation')}
          value={current.orientation}
          options={[
            { value: 'landscape', label: t('landscape') },
            { value: 'portrait',  label: t('portrait')  },
            { value: 'square',    label: t('square')    },
          ]}
          onChange={v => updateFilter('orientation', v)}
        />
        <DropdownFilter
          label={t('sort')}
          value={current.sort}
          options={[
            { value: 'recent',    label: t('recent')    },
            { value: 'priceAsc',  label: t('priceAsc')  },
            { value: 'priceDesc', label: t('priceDesc') },
          ]}
          onChange={v => updateFilter('sort', v)}
        />

        {activeCount > 0 && (
          <button
            onClick={() => router.push(pathname)}
            className="ml-2 text-xs tracking-wide uppercase text-ink-400 hover:text-ink-900 transition-colors"
          >
            {t('all')}
          </button>
        )}
      </div>

      {/* Mobile : bottom sheet */}
      <div
        className={cn(
          'sm:hidden fixed inset-0 z-50 transition-opacity duration-300',
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        <div
          className={cn(
            'absolute bottom-0 inset-x-0 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto transition-transform duration-300',
            open ? 'translate-y-0' : 'translate-y-full'
          )}
        >
          <div className="sticky top-0 bg-white px-5 pt-4 pb-3 border-b border-ink-100 flex items-center justify-between">
            <p className="font-display text-xl text-ink-900">{locale_label(t, 'filter')}</p>
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 flex items-center justify-center text-ink-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-5 py-6 space-y-8">
            <FilterGroup
              label={t('country')}
              value={current.country}
              options={countries.map(c => ({ value: c, label: c }))}
              onChange={v => updateFilter('country', v)}
            />
            <FilterGroup
              label={t('orientation')}
              value={current.orientation}
              options={[
                { value: 'landscape', label: t('landscape') },
                { value: 'portrait',  label: t('portrait')  },
                { value: 'square',    label: t('square')    },
              ]}
              onChange={v => updateFilter('orientation', v)}
            />
            <FilterGroup
              label={t('sort')}
              value={current.sort}
              options={[
                { value: 'recent',    label: t('recent')    },
                { value: 'priceAsc',  label: t('priceAsc')  },
                { value: 'priceDesc', label: t('priceDesc') },
              ]}
              onChange={v => updateFilter('sort', v)}
            />
          </div>

          <div className="sticky bottom-0 bg-white border-t border-ink-100 px-5 py-4 flex gap-3">
            {activeCount > 0 && (
              <button
                onClick={() => { router.push(pathname); setOpen(false) }}
                className="flex-1 border border-ink-200 text-ink-700 text-sm py-3 rounded-full"
              >
                {t('all')}
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="flex-1 bg-ink-900 text-white text-sm py-3 rounded-full"
            >
              {locale_label(t, 'apply')}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

/* ─── Dropdown desktop ────────────────────────────────────────────────── */

function DropdownFilter({
  label, value, options, onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const close = () => setOpen(false)
    if (open) {
      window.addEventListener('click', close)
      return () => window.removeEventListener('click', close)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        onClick={e => { e.stopPropagation(); setOpen(!open) }}
        className={cn(
          'flex items-center gap-2 text-sm border px-4 py-2 rounded-full transition-colors',
          selected
            ? 'bg-ink-900 text-white border-ink-900'
            : 'bg-white text-ink-700 border-ink-200 hover:border-ink-400'
        )}
      >
        {selected ? selected.label : label}
        <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div
          onClick={e => e.stopPropagation()}
          className="absolute top-full left-0 mt-2 bg-white border border-ink-100 rounded-2xl shadow-xl py-2 z-30 min-w-[200px] max-h-72 overflow-y-auto"
        >
          {selected && (
            <button
              onClick={() => { onChange(''); setOpen(false) }}
              className="w-full text-left px-4 py-2 text-xs text-ink-400 hover:bg-ink-50 italic"
            >
              {locale_label_t('clear')}
            </button>
          )}
          {options.map(o => (
            <button
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={cn(
                'w-full flex items-center justify-between text-left px-4 py-2 text-sm transition-colors',
                o.value === value ? 'text-ink-900 font-medium bg-ink-50' : 'text-ink-700 hover:bg-ink-50'
              )}
            >
              {o.label}
              {o.value === value && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Groupe de chips (mobile sheet) ─────────────────────────────────── */

function FilterGroup({
  label, value, options, onChange,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <p className="text-[11px] tracking-[0.25em] uppercase text-ink-400 mb-3">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              'text-sm px-4 py-2 rounded-full border transition-colors',
              o.value === value
                ? 'bg-ink-900 text-white border-ink-900'
                : 'bg-white text-ink-700 border-ink-200'
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Helpers de label avec fallback ─────────────────────────────────── */

function locale_label(t: ReturnType<typeof useTranslations>, key: string): string {
  try { return t(key) } catch { return key === 'filter' ? 'Filtres' : 'Appliquer' }
}
function locale_label_t(key: string): string {
  return key === 'clear' ? 'Effacer' : key
}

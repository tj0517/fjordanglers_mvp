"use client"

import { useRouter, useSearchParams } from 'next/navigation'

const COUNTRIES = [
  { code: 'Norway', flag: '🇳🇴' },
  { code: 'Sweden', flag: '🇸🇪' },
  { code: 'Finland', flag: '🇫🇮' },
]

const SPECIES = [
  'Salmon', 'Sea Trout', 'Brown Trout', 'Pike',
  'Perch', 'Grayling', 'Arctic Char', 'Zander',
]

const DIFFICULTIES = [
  { value: 'beginner', label: 'All Levels' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
]

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'duration-asc', label: 'Shortest first' },
]

export default function ExperienceFilters({ count }: { count: number }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const country = searchParams.get('country') ?? ''
  const fish = searchParams.get('fish') ?? ''
  const difficulty = searchParams.get('difficulty') ?? ''
  const sort = searchParams.get('sort') ?? ''

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/experiences?${params.toString()}`)
  }

  const toggle = (key: string, value: string, current: string) => {
    setParam(key, current === value ? '' : value)
  }

  const hasFilters = country !== '' || fish !== '' || difficulty !== ''

  const pillBase = 'flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all f-body cursor-pointer'

  return (
    <div
      className="sticky z-40 py-3.5 px-8"
      style={{
        top: '73px',
        background: '#F3EDE4',
        borderBottom: '1px solid rgba(10,46,77,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">

        {/* Country pills */}
        {COUNTRIES.map(c => {
          const active = country === c.code
          return (
            <button
              key={c.code}
              onClick={() => toggle('country', c.code, country)}
              className={pillBase}
              style={{
                background: active ? '#E67E50' : 'transparent',
                color: active ? 'white' : 'rgba(10,46,77,0.58)',
                border: `1px solid ${active ? '#E67E50' : 'rgba(10,46,77,0.18)'}`,
              }}
            >
              <span>{c.flag}</span>
              <span>{c.code}</span>
            </button>
          )
        })}

        {/* Vertical divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(10,46,77,0.12)' }} />

        {/* Species select */}
        <div className="relative">
          <select
            value={fish}
            onChange={e => setParam('fish', e.target.value)}
            className="text-xs font-semibold pl-3.5 pr-7 py-1.5 rounded-full appearance-none transition-all f-body cursor-pointer"
            style={{
              background: fish ? '#E67E50' : 'transparent',
              color: fish ? 'white' : 'rgba(10,46,77,0.58)',
              border: `1px solid ${fish ? '#E67E50' : 'rgba(10,46,77,0.18)'}`,
            }}
          >
            <option value="">Any species</option>
            {SPECIES.map(s => (
              <option key={s} value={s} style={{ background: '#F3EDE4', color: '#0A2E4D' }}>
                {s}
              </option>
            ))}
          </select>
          <span
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[9px]"
            style={{ color: fish ? 'rgba(255,255,255,0.75)' : 'rgba(10,46,77,0.4)' }}
          >
            ▾
          </span>
        </div>

        {/* Vertical divider */}
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(10,46,77,0.12)' }} />

        {/* Difficulty pills */}
        {DIFFICULTIES.map(d => {
          const active = difficulty === d.value
          return (
            <button
              key={d.value}
              onClick={() => toggle('difficulty', d.value, difficulty)}
              className={pillBase}
              style={{
                background: active ? '#0A2E4D' : 'transparent',
                color: active ? 'white' : 'rgba(10,46,77,0.58)',
                border: `1px solid ${active ? '#0A2E4D' : 'rgba(10,46,77,0.18)'}`,
              }}
            >
              {d.label}
            </button>
          )
        })}

        {/* Right: count · sort · clear */}
        <div className="ml-auto flex items-center gap-4">
          <span className="text-xs f-body" style={{ color: 'rgba(10,46,77,0.35)' }}>
            <span className="font-semibold" style={{ color: 'rgba(10,46,77,0.7)' }}>{count}</span>
            {' '}{count === 1 ? 'trip' : 'trips'}
          </span>

          {/* Sort select */}
          <div className="relative">
            <select
              value={sort}
              onChange={e => setParam('sort', e.target.value)}
              className="text-xs font-medium pl-3.5 pr-7 py-1.5 rounded-full appearance-none transition-all f-body cursor-pointer"
              style={{
                background: 'transparent',
                color: 'rgba(10,46,77,0.55)',
                border: '1px solid rgba(10,46,77,0.16)',
              }}
            >
              <option value="" style={{ background: '#F3EDE4', color: '#0A2E4D' }}>Recommended</option>
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value} style={{ background: '#F3EDE4', color: '#0A2E4D' }}>
                  {o.label}
                </option>
              ))}
            </select>
            <span
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[9px]"
              style={{ color: 'rgba(10,46,77,0.4)' }}
            >
              ▾
            </span>
          </div>

          {hasFilters && (
            <button
              onClick={() => router.push('/experiences')}
              className="text-xs font-medium transition-colors f-body hover:opacity-100"
              style={{ color: 'rgba(10,46,77,0.38)' }}
            >
              Clear all ×
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

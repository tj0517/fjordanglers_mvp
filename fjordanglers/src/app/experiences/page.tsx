import Image from 'next/image'
import Link from 'next/link'
import { Suspense } from 'react'
import { MOCK_EXPERIENCES } from '@/lib/mock-data'
import ExperienceFilters from './filters'

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const COUNTRY_FLAGS: Record<string, string> = {
  Norway: '🇳🇴',
  Sweden: '🇸🇪',
  Finland: '🇫🇮',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'All Levels',
  intermediate: 'Intermediate',
  expert: 'Expert',
}

// ─── MICRO-COMPONENTS ─────────────────────────────────────────────────────────

const GrainOverlay = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: GRAIN_BG,
      backgroundSize: '200px 200px',
      opacity: 0.06,
      mixBlendMode: 'screen',
      zIndex: 2,
    }}
  />
)

// ─── DATA HELPERS ─────────────────────────────────────────────────────────────

type SearchParams = {
  country?: string
  fish?: string
  difficulty?: string
  sort?: string
}

function filterExperiences(params: SearchParams) {
  let results = MOCK_EXPERIENCES.filter(e => e.published)

  if (params.country) {
    results = results.filter(e => e.location_country === params.country)
  }
  if (params.fish) {
    const f = params.fish
    results = results.filter(e => e.fish_types.includes(f))
  }
  if (params.difficulty) {
    results = results.filter(e => e.difficulty === params.difficulty)
  }

  if (params.sort === 'price-asc') {
    results = [...results].sort(
      (a, b) => (a.price_per_person_eur ?? 0) - (b.price_per_person_eur ?? 0)
    )
  } else if (params.sort === 'price-desc') {
    results = [...results].sort(
      (a, b) => (b.price_per_person_eur ?? 0) - (a.price_per_person_eur ?? 0)
    )
  } else if (params.sort === 'duration-asc') {
    results = [...results].sort(
      (a, b) =>
        (a.duration_hours ?? (a.duration_days ?? 0) * 8) -
        (b.duration_hours ?? (b.duration_days ?? 0) * 8)
    )
  }

  return results
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export const metadata = {
  title: 'Browse Fishing Experiences',
  description:
    'Find day trips and multi-day expeditions with verified Scandinavian fishing guides. Filter by country, species, and skill level.',
}

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const experiences = filterExperiences(params)

  return (
    <div className="min-h-screen" style={{ background: '#F3EDE4' }}>

      {/* ─── NAVBAR ──────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5"
        style={{
          background: 'rgba(7, 17, 28, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div className="flex items-center gap-1">
          {[
            { label: 'Experiences', href: '/experiences' },
            { label: 'Guides', href: '/guides' },
            { label: 'License Map', href: '/license-map' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-white/55 hover:text-white/90 text-sm font-medium px-4 py-2 rounded-full transition-colors hover:bg-white/[0.06] f-body"
              style={item.href === '/experiences' ? { color: 'rgba(255,255,255,0.88)' } : undefined}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image
            src="/brand/white-logo.png"
            alt="FjordAnglers"
            width={160}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-white/55 hover:text-white/90 text-sm font-medium px-4 py-2 rounded-full transition-colors hover:bg-white/[0.06] f-body"
          >
            Sign in
          </Link>
          <Link
            href="/guides/apply"
            className="text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] f-body"
            style={{ background: '#E67E50' }}
          >
            Join as Guide →
          </Link>
        </div>
      </nav>

      {/* ─── COMPACT DARK HEADER ─────────────────────────────────── */}
      <header
        className="relative overflow-hidden"
        style={{ background: '#07111C', paddingTop: '73px' }}
      >
        {/* Subtle radial accent */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 70% 110%, rgba(230,126,80,0.14) 0%, transparent 55%)',
          }}
        />
        {/* Bottom fade into page bg */}
        <div
          className="absolute bottom-0 inset-x-0"
          style={{
            height: '80px',
            background: 'linear-gradient(to bottom, transparent 0%, #F3EDE4 100%)',
          }}
        />
        <GrainOverlay />

        <div className="relative max-w-7xl mx-auto px-8 pt-12 pb-16" style={{ zIndex: 3 }}>
          <div className="flex items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-6 h-px" style={{ background: '#E67E50' }} />
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em] f-body"
                  style={{ color: '#E67E50' }}
                >
                  Browse experiences
                </p>
              </div>
              <h1
                className="text-white font-bold f-display"
                style={{ fontSize: '54px', lineHeight: 1.06 }}
              >
                <span style={{ fontStyle: 'italic' }}>Find</span> your next
                <br />
                fishing trip.
              </h1>
            </div>

            {/* Stats — desktop only */}
            <div className="hidden md:flex items-center gap-0 pb-1 flex-shrink-0">
              {[
                { n: '30+', label: 'Experiences' },
                { n: '12', label: 'Guides' },
                { n: '3', label: 'Countries' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-start gap-5">
                  {i > 0 && (
                    <div
                      className="w-px self-stretch mt-1"
                      style={{ background: 'rgba(255,255,255,0.07)' }}
                    />
                  )}
                  <div className={i > 0 ? 'pl-1' : ''}>
                    <p className="text-white text-3xl font-bold tracking-tight f-display">
                      {stat.n}
                    </p>
                    <p
                      className="text-white/35 text-[10px] uppercase tracking-[0.18em] mt-0.5 f-body"
                    >
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ─── STICKY FILTER BAR ───────────────────────────────────── */}
      {/*
        Wrapped in Suspense because ExperienceFilters uses useSearchParams().
        The count prop is computed server-side and passed down.
      */}
      <Suspense
        fallback={
          <div
            className="sticky z-40 h-12"
            style={{
              top: '73px',
              background: '#F3EDE4',
              borderBottom: '1px solid rgba(10,46,77,0.06)',
            }}
          />
        }
      >
        <ExperienceFilters count={experiences.length} />
      </Suspense>

      {/* ─── RESULTS GRID ────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {experiences.length === 0 ? (
          <div className="py-36 flex flex-col items-center">
            <p
              className="font-bold f-display mb-3 text-center"
              style={{
                fontSize: 'clamp(48px, 8vw, 88px)',
                color: 'rgba(10,46,77,0.05)',
                fontStyle: 'italic',
                lineHeight: 1,
              }}
            >
              No trips found
            </p>
            <p className="text-sm mb-8 f-body" style={{ color: 'rgba(10,46,77,0.38)' }}>
              Try broadening your filters or browsing all experiences.
            </p>
            <Link
              href="/experiences"
              className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-full transition-all hover:brightness-110 f-body"
              style={{ background: '#E67E50' }}
            >
              Clear all filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {experiences.map(exp => {
              const coverUrl =
                exp.images.find(i => i.is_cover)?.url ?? exp.images[0]?.url ?? null
              const flag =
                exp.location_country != null
                  ? (COUNTRY_FLAGS[exp.location_country] ?? '')
                  : ''
              const diffLabel =
                exp.difficulty != null
                  ? (DIFFICULTY_LABEL[exp.difficulty] ?? exp.difficulty)
                  : null
              const duration =
                exp.duration_hours != null
                  ? `${exp.duration_hours}h`
                  : exp.duration_days != null
                  ? `${exp.duration_days} days`
                  : null

              return (
                <Link key={exp.id} href={`/experiences/${exp.id}`} className="group block">
                  <article
                    className="overflow-hidden transition-all duration-300 hover:shadow-[0_20px_56px_rgba(10,46,77,0.13)] hover:-translate-y-1"
                    style={{
                      borderRadius: '28px',
                      background: '#FDFAF7',
                      border: '1px solid rgba(10,46,77,0.07)',
                      boxShadow: '0 2px 16px rgba(10,46,77,0.05)',
                    }}
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden" style={{ height: '248px' }}>
                      {coverUrl != null ? (
                        <Image
                          src={coverUrl}
                          alt={exp.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                        />
                      ) : (
                        <div className="w-full h-full" style={{ background: '#EDE6DB' }} />
                      )}

                      {/* Hover CTA overlay */}
                      <div
                        className="absolute inset-0 flex items-end justify-center pb-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: 'rgba(7,17,28,0.28)' }}
                      >
                        <span
                          className="text-white text-sm font-semibold px-6 py-2.5 rounded-full translate-y-3 group-hover:translate-y-0 transition-transform duration-200 f-body"
                          style={{ background: '#E67E50' }}
                        >
                          View Trip →
                        </span>
                      </div>

                      {/* Price badge */}
                      <div
                        className="absolute top-4 right-4 text-white text-sm font-bold px-3.5 py-1.5 rounded-full f-body"
                        style={{
                          background: 'rgba(5,12,22,0.72)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        €{exp.price_per_person_eur}
                        <span className="text-xs font-normal opacity-55">/pp</span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="p-6">
                      {/* Tags row */}
                      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                        <span className="text-xs f-body" style={{ color: 'rgba(10,46,77,0.5)' }}>
                          {flag} {exp.location_country}
                        </span>
                        <span className="text-xs" style={{ color: 'rgba(10,46,77,0.2)' }}>·</span>
                        {exp.fish_types.slice(0, 2).map(fish => (
                          <span
                            key={fish}
                            className="text-xs font-medium px-2.5 py-1 rounded-full f-body"
                            style={{ background: 'rgba(201,107,56,0.09)', color: '#9E4820' }}
                          >
                            {fish}
                          </span>
                        ))}
                        {diffLabel != null && (
                          <span
                            className="text-xs font-medium px-2.5 py-1 rounded-full f-body"
                            style={{ background: 'rgba(10,46,77,0.05)', color: '#0A2E4D' }}
                          >
                            {diffLabel}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3
                        className="font-semibold text-base leading-snug mb-5 line-clamp-2 f-display"
                        style={{ color: '#0A2E4D', minHeight: '2.4em' }}
                      >
                        {exp.title}
                      </h3>

                      {/* Guide + meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                            style={{ border: '2px solid rgba(10,46,77,0.06)' }}
                          >
                            {exp.guide.avatar_url != null ? (
                              <Image
                                src={exp.guide.avatar_url}
                                alt={exp.guide.full_name}
                                width={32}
                                height={32}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#0A2E4D] flex items-center justify-center text-white text-xs f-body">
                                {exp.guide.full_name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-medium f-body" style={{ color: '#0A2E4D' }}>
                              {exp.guide.full_name}
                            </p>
                            {exp.guide.average_rating != null && (
                              <p className="text-xs f-body" style={{ color: 'rgba(10,46,77,0.38)' }}>
                                ★ {exp.guide.average_rating.toFixed(1)}
                              </p>
                            )}
                          </div>
                        </div>

                        {(duration != null || exp.max_guests != null) && (
                          <p className="text-xs f-body" style={{ color: 'rgba(10,46,77,0.35)' }}>
                            {duration}
                            {duration != null && exp.max_guests != null && ' · '}
                            {exp.max_guests != null && `max ${exp.max_guests}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer
        className="py-14 px-8 mt-4"
        style={{ background: '#05101A', borderTop: '1px solid rgba(230,126,80,0.12)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div>
              <Image
                src="/brand/white-logo.png"
                alt="FjordAnglers"
                width={140}
                height={36}
                className="h-7 w-auto mb-4"
                style={{ opacity: 0.55 }}
              />
              <p
                className="text-sm leading-relaxed f-body"
                style={{ color: 'rgba(255,255,255,0.22)', maxWidth: '240px' }}
              >
                Connecting anglers with the best fishing experiences in Scandinavia.
              </p>
            </div>
            <div className="flex items-center gap-8 md:gap-12">
              {[
                { label: 'Experiences', href: '/experiences' },
                { label: 'Guides', href: '/guides' },
                { label: 'License Map', href: '/license-map' },
                { label: 'Join as Guide', href: '/guides/apply' },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm transition-colors f-body hover:text-white/60"
                  style={{ color: 'rgba(255,255,255,0.28)' }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div
            className="mt-10 pt-6 flex items-center justify-between"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            <p className="text-xs f-body" style={{ color: 'rgba(255,255,255,0.18)' }}>
              © 2026 FjordAnglers
            </p>
            <p className="text-xs f-body" style={{ color: 'rgba(255,255,255,0.14)' }}>
              Norway · Sweden · Finland
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { MOCK_EXPERIENCES, MOCK_GUIDES } from '@/lib/mock-data'
import HomeSearchWidget from '@/components/home/search-widget'

// ─── STATIC DATA ─────────────────────────────────────────────────────────────

const COUNTRY_FLAGS: Record<string, string> = {
  Norway: '🇳🇴',
  Sweden: '🇸🇪',
  Finland: '🇫🇮',
  Denmark: '🇩🇰',
  Iceland: '🇮🇸',
}

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: 'All Levels',
  intermediate: 'Intermediate',
  expert: 'Expert',
}

// MVP-realistic species counts
const SPECIES = [
  {
    name: 'Atlantic Salmon',
    slug: 'Salmon',
    count: 8,
    img: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=520&fit=crop',
  },
  {
    name: 'Sea Trout',
    slug: 'Sea Trout',
    count: 6,
    img: 'https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?w=400&h=520&fit=crop',
  },
  {
    name: 'Brown Trout',
    slug: 'Brown Trout',
    count: 5,
    img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=520&fit=crop',
  },
  {
    name: 'Pike',
    slug: 'Pike',
    count: 9,
    img: 'https://images.unsplash.com/photo-1504173010664-32509107de4f?w=400&h=520&fit=crop',
  },
  {
    name: 'Arctic Char',
    slug: 'Arctic Char',
    count: 3,
    img: 'https://images.unsplash.com/photo-1531177071211-ed1b7991958a?w=400&h=520&fit=crop',
  },
  {
    name: 'Grayling',
    slug: 'Grayling',
    count: 2,
    img: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?w=400&h=520&fit=crop',
  },
]

// Trust signals replace reviews (no reviews at MVP stage)
const TRUST_SIGNALS = [
  {
    icon: '✓',
    headline: 'Verified local guides',
    desc: 'Every guide is personally reviewed before joining. We check their licenses, local knowledge, and safety standards.',
  },
  {
    icon: '€',
    headline: 'Price shown is what you pay',
    desc: 'No booking surcharges for anglers. The price is agreed directly with your guide — no platform markup.',
  },
  {
    icon: '⌚',
    headline: 'Book in minutes',
    desc: 'Browse, pick your date, message the guide. Most trips confirmed within 24 hours.',
  },
]

const NORDIC_PHOTOS = [
  {
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
    label: 'Sognefjord, Norway',
  },
  {
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop',
    label: 'Hardangerfjord at dusk',
  },
  {
    url: 'https://images.unsplash.com/photo-1531177071211-ed1b7991958a?w=600&h=400&fit=crop',
    label: 'Remote river expedition',
  },
  {
    url: 'https://images.unsplash.com/photo-1585011664466-b7bbe92f34ef?w=600&h=400&fit=crop',
    label: 'Sea trout season',
  },
  {
    url: 'https://images.unsplash.com/photo-1504173010664-32509107de4f?w=600&h=400&fit=crop',
    label: 'Swedish lake, pike season',
  },
]

// Pre-encoded grain SVG
const GRAIN_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

// ─── SHARED MICRO-COMPONENTS ─────────────────────────────────────────────────

/**
 * Grain texture overlay for dark sections.
 * Must be placed AFTER background image/gradient elements in DOM so it renders above them.
 * Content after this needs position:relative + z-index > 2 to sit above the grain.
 */
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

const SalmonRule = () => (
  <div className="w-10 h-px" style={{ background: '#E67E50' }} />
)

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const featured = MOCK_EXPERIENCES.slice(0, 3)
  const topGuides = MOCK_GUIDES.slice(0, 3)

  return (
    // Outer wrapper: single dark background — hero + discovery share this colour seamlessly
    <div className="min-h-screen" style={{ background: '#07111C' }}>

      {/* ─── NAVBAR ──────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5"
        style={{
          background: 'rgba(7, 17, 28, 0.55)',
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
            >
              {item.label}
            </Link>
          ))}
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image src="/brand/white-logo.png" alt="FjordAnglers" width={160} height={40} className="h-8 w-auto" priority />
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

      {/* ─── HERO ────────────────────────────────────────────────── */}
      {/*
        No rounded bottom, no separate background — hero uses the outer wrapper's
        #07111C so it flows directly into the discovery section below with zero seam.
      */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0">
          <Image src="/brand/hero-fjord.jpg" alt="" fill priority className="object-cover object-center" />
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(105deg, rgba(4,12,22,0.96) 0%, rgba(4,12,22,0.82) 38%, rgba(4,12,22,0.45) 68%, rgba(4,12,22,0.18) 100%)',
            }}
          />
          {/* Bottom fade: blends hero into the discovery grid below */}
          <div
            className="absolute bottom-0 inset-x-0"
            style={{ height: '180px', background: 'linear-gradient(to top, #07111C 0%, transparent 100%)' }}
          />
        </div>

        {/* Grain — after backgrounds, before content */}
        <GrainOverlay />

        {/* Content */}
        <div className="relative w-full max-w-7xl mx-auto px-10 pt-28 pb-28 flex flex-col lg:flex-row items-center gap-16" style={{ zIndex: 3 }}>
          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 mb-8 anim-1">
              <span
                className="text-[11px] font-semibold uppercase tracking-[0.22em] px-4 py-1.5 rounded-full f-body"
                style={{ background: 'rgba(230,126,80,0.14)', color: '#E67E50', border: '1px solid rgba(230,126,80,0.18)' }}
              >
                Norway · Sweden · Finland
              </span>
            </div>

            <h1 className="text-5xl xl:text-[68px] font-bold text-white leading-[1.04] tracking-tight mb-7 anim-2 f-display">
              Fish where others
              <span className="block f-display" style={{ color: '#E67E50', fontStyle: 'italic', fontWeight: 700 }}>
                only dream of going.
              </span>
            </h1>

            <p className="text-white/55 text-[17px] leading-[1.7] mb-10 anim-3 f-body" style={{ maxWidth: '400px' }}>
              Day trips and expeditions with hand-picked Scandinavian guides who know every river, fjord, and lake.
            </p>

            <div className="flex items-center gap-5 anim-4">
              <Link
                href="/experiences"
                className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full text-sm tracking-wide transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] f-body"
                style={{ background: '#E67E50' }}
              >
                Browse Experiences
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center gap-1.5 text-white/45 hover:text-white/80 text-sm font-medium transition-colors f-body"
              >
                Meet the guides →
              </Link>
            </div>

            {/* Stats — MVP-honest numbers */}
            <div
              className="flex items-center gap-10 mt-14 pt-10 anim-5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              {[
                { n: '12', label: 'Verified Guides' },
                { n: '30+', label: 'Experiences' },
                { n: '3', label: 'Countries' },
              ].map((stat, i) => (
                <div key={stat.label} className="flex items-start gap-3">
                  {i > 0 && <div className="w-px self-stretch mt-1" style={{ background: 'rgba(255,255,255,0.07)' }} />}
                  <div className={i > 0 ? 'pl-1' : ''}>
                    <p className="text-white text-2xl font-bold tracking-tight f-display">{stat.n}</p>
                    <p className="text-white/35 text-[10px] uppercase tracking-[0.18em] mt-0.5 f-body">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search card */}
          <div
            className="w-full lg:w-auto lg:flex-shrink-0 anim-3 p-8 flex flex-col gap-1"
            style={{
              background: 'rgba(10, 22, 36, 0.82)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '28px',
              minWidth: '320px',
              boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
            }}
          >
            <p className="text-white/35 text-[11px] uppercase tracking-[0.22em] mb-1 f-body">Plan your adventure</p>
            <h3 className="text-white text-xl font-bold mb-6 f-display">Find your trip</h3>
            <HomeSearchWidget />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 anim-6" style={{ zIndex: 3 }}>
          <div className="w-px h-10 anim-scroll" style={{ background: 'rgba(255,255,255,0.18)' }} />
          <span className="text-white/25 text-[10px] uppercase tracking-[0.22em] f-body">Scroll</span>
        </div>
      </section>

      {/* ─── DISCOVERY ───────────────────────────────────────────── */}
      {/*
        No top padding — sits flush under the hero's bottom gradient fade.
        Same #07111C background as the outer wrapper = invisible seam.
      */}
      <section className="relative overflow-hidden pb-8 px-4" style={{ background: '#07111C' }}>
        {/* Grain — placed after no backgrounds here (solid colour), before content */}
        <GrainOverlay />

        <div className="relative max-w-7xl mx-auto" style={{ zIndex: 3 }}>
          {/* 2-col: tall photo card left | stacked tiles right */}
          <div className="flex gap-4" style={{ height: '520px' }}>

            {/* Left: Trending species */}
            <div className="relative overflow-hidden rounded-3xl flex-shrink-0" style={{ width: '38%' }}>
              <Image
                src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=1000&fit=crop"
                alt="Atlantic Salmon"
                fill
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(3,8,18,0.97) 22%, rgba(3,8,18,0.4) 55%, rgba(3,8,18,0.06) 100%)' }}
              />
              <div className="absolute inset-0 flex flex-col justify-between p-8" style={{ zIndex: 1 }}>
                <span
                  className="self-start text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full f-body"
                  style={{ background: '#E67E50', color: 'white' }}
                >
                  Most popular
                </span>
                <div>
                  <p className="text-white/38 text-[11px] uppercase tracking-[0.22em] mb-2 f-body">Season opens June 2026</p>
                  <h3
                    className="text-white font-bold f-display"
                    style={{ fontSize: '46px', fontStyle: 'italic', lineHeight: 1.06 }}
                  >
                    Atlantic<br />Salmon
                  </h3>
                  <p className="text-white/45 text-sm mt-3 mb-6 f-body">Norway's most requested species</p>
                  <Link
                    href="/experiences?fish=Salmon"
                    className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all f-body"
                    style={{ color: '#E67E50' }}
                  >
                    Browse salmon trips →
                  </Link>
                </div>
              </div>
            </div>

            {/* Right: destinations panel + 2 small tiles */}
            <div className="flex flex-col gap-4 flex-1">

              {/* Destinations */}
              <div
                className="relative overflow-hidden rounded-3xl p-7 flex flex-col justify-between"
                style={{ background: '#0A1F35', flex: '1 1 0%' }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      'radial-gradient(ellipse at 88% 12%, rgba(230,126,80,0.1) 0%, transparent 45%), radial-gradient(ellipse at 12% 88%, rgba(27,79,114,0.45) 0%, transparent 50%)',
                  }}
                />
                <div className="relative" style={{ zIndex: 1 }}>
                  <p className="text-white/35 text-[11px] uppercase tracking-[0.22em] mb-1 f-body">Where to fish</p>
                  <h3 className="text-white text-2xl font-bold f-display" style={{ fontStyle: 'italic' }}>
                    3 countries.<br />Endless water.
                  </h3>
                </div>
                <div className="relative flex gap-3" style={{ zIndex: 1 }}>
                  {[
                    { country: 'Norway', flag: '🇳🇴', count: 12, sub: 'Salmon & Trout' },
                    { country: 'Sweden', flag: '🇸🇪', count: 9, sub: 'Pike & Trout' },
                    { country: 'Finland', flag: '🇫🇮', count: 5, sub: 'Midnight Pike' },
                  ].map(d => (
                    <Link
                      key={d.country}
                      href={`/experiences?country=${d.country}`}
                      className="flex-1 flex flex-col items-center gap-1.5 py-4 px-3 rounded-2xl transition-colors hover:bg-white/[0.07]"
                      style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <span className="text-2xl">{d.flag}</span>
                      <p className="text-white text-xs font-semibold f-body text-center">{d.country}</p>
                      <p className="text-white text-xl font-bold f-display">{d.count}</p>
                      <p className="text-white/30 text-[10px] f-body text-center">{d.sub}</p>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Bottom row: 2 small tiles */}
              <div className="flex gap-4" style={{ height: '172px' }}>

                {/* Founding Guide offer */}
                <div
                  className="flex-1 relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between"
                  style={{ background: 'linear-gradient(145deg, #B55E30 0%, #6F2D0A 100%)' }}
                >
                  <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="relative" style={{ zIndex: 1 }}>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                      style={{ background: 'rgba(255,255,255,0.12)' }}
                    >
                      <span className="text-sm">⭐</span>
                    </div>
                    <h4 className="text-white text-base font-bold leading-tight f-display">
                      Founding Guide<br />Program
                    </h4>
                  </div>
                  <Link
                    href="/guides/apply"
                    className="relative text-xs font-bold px-3 py-1.5 rounded-full self-start f-body transition-colors hover:bg-white/20"
                    style={{ background: 'rgba(255,255,255,0.14)', color: 'white', zIndex: 1 }}
                  >
                    8% forever →
                  </Link>
                </div>

                {/* Active guides */}
                <div
                  className="flex-1 relative overflow-hidden rounded-3xl p-6 flex flex-col justify-between"
                  style={{ background: '#F3EDE4' }}
                >
                  <div>
                    <p className="text-[#0A2E4D]/35 text-[10px] uppercase tracking-[0.18em] mb-1 f-body">Hand-picked</p>
                    <h4 className="text-[#0A2E4D] text-base font-bold leading-tight f-display">
                      12 Verified<br />Guides
                    </h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {topGuides.map(g => (
                        <div
                          key={g.id}
                          className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0"
                          style={{ border: '2px solid #F3EDE4' }}
                        >
                          {g.avatar_url != null ? (
                            <Image src={g.avatar_url} alt={g.full_name} width={28} height={28} className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-[#0A2E4D] flex items-center justify-center text-white text-[10px] f-body">
                              {g.full_name[0]}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Link href="/guides" className="text-xs font-semibold text-[#0A2E4D] hover:text-[#E67E50] transition-colors f-body">
                      Meet →
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SPECIES PICKER ──────────────────────────────────────── */}
      <section className="py-20 px-8" style={{ background: '#F3EDE4' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-11 flex items-end justify-between">
            <div>
              <SalmonRule />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mt-4 mb-3 f-body" style={{ color: '#E67E50' }}>
                Browse by species
              </p>
              <h2 className="text-[#0A2E4D] text-4xl font-bold f-display">
                What are you
                <span style={{ fontStyle: 'italic' }}> after?</span>
              </h2>
            </div>
            <Link
              href="/experiences"
              className="hidden md:block text-sm font-medium hover:text-[#E67E50] transition-colors f-body"
              style={{ color: 'rgba(10,46,77,0.38)' }}
            >
              View all trips →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {SPECIES.map(s => (
              <Link key={s.name} href={`/experiences?fish=${encodeURIComponent(s.slug)}`} className="group block">
                <div className="relative overflow-hidden" style={{ borderRadius: '22px', height: '210px' }}>
                  <Image
                    src={s.img}
                    alt={s.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(5,10,20,0.9) 18%, rgba(5,10,20,0.18) 55%, transparent 100%)' }}
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'rgba(230,126,80,0.12)' }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-bold text-sm leading-tight f-display">{s.name}</p>
                    <p className="text-white/50 text-xs mt-0.5 f-body">{s.count} trips</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED EXPERIENCES ────────────────────────────────── */}
      <section className="pb-24 px-8" style={{ background: '#F3EDE4' }}>
        <div className="max-w-7xl mx-auto">
          <div
            className="mb-14 pt-16 flex items-end justify-between"
            style={{ borderTop: '1px solid rgba(10,46,77,0.09)' }}
          >
            <div>
              <SalmonRule />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mt-4 mb-3 f-body" style={{ color: '#E67E50' }}>
                Handpicked
              </p>
              <h2 className="text-[#0A2E4D] text-4xl font-bold leading-tight f-display">Featured Experiences</h2>
            </div>
            <Link
              href="/experiences"
              className="hidden md:block text-sm font-medium transition-colors hover:text-[#E67E50] f-body"
              style={{ color: 'rgba(10,46,77,0.4)' }}
            >
              View all trips →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(exp => {
              const coverUrl = exp.images.find(i => i.is_cover)?.url ?? exp.images[0]?.url ?? null
              const flag = exp.location_country != null ? (COUNTRY_FLAGS[exp.location_country] ?? '') : ''
              const diffLabel = exp.difficulty != null ? (DIFFICULTY_LABEL[exp.difficulty] ?? exp.difficulty) : null
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
                      <div
                        className="absolute top-4 right-4 text-white text-sm font-bold px-3.5 py-1.5 rounded-full f-body"
                        style={{ background: 'rgba(5,12,22,0.72)', backdropFilter: 'blur(8px)' }}
                      >
                        €{exp.price_per_person_eur}
                        <span className="text-xs font-normal opacity-55">/pp</span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                        <span className="text-xs text-[#0A2E4D]/50 f-body">{flag} {exp.location_country}</span>
                        <span className="text-[#0A2E4D]/20 text-xs">·</span>
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

                      <h3
                        className="text-[#0A2E4D] font-semibold text-base leading-snug mb-5 line-clamp-2 f-display"
                        style={{ minHeight: '2.4em' }}
                      >
                        {exp.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                            style={{ border: '2px solid rgba(10,46,77,0.06)' }}
                          >
                            {exp.guide.avatar_url != null ? (
                              <Image src={exp.guide.avatar_url} alt={exp.guide.full_name} width={32} height={32} className="object-cover" />
                            ) : (
                              <div className="w-full h-full bg-[#0A2E4D] flex items-center justify-center text-white text-xs f-body">
                                {exp.guide.full_name[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[#0A2E4D] text-xs font-medium f-body">{exp.guide.full_name}</p>
                            {exp.guide.average_rating != null && (
                              <p className="text-[#0A2E4D]/38 text-xs f-body">★ {exp.guide.average_rating.toFixed(1)}</p>
                            )}
                          </div>
                        </div>
                        {(duration != null || exp.max_guests != null) && (
                          <p className="text-[#0A2E4D]/35 text-xs f-body">
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
        </div>
      </section>

      {/* ─── HOW IT WORKS — dark editorial band ──────────────────── */}
      <section className="relative overflow-hidden py-24 px-8" style={{ background: '#07111C' }}>
        {/* Grain — solid bg here so place first */}
        <GrainOverlay />

        <div className="relative max-w-7xl mx-auto" style={{ zIndex: 3 }}>
          <div className="mb-16">
            <SalmonRule />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mt-4 mb-3 f-body" style={{ color: '#E67E50' }}>
              Simple as that
            </p>
            <h2 className="text-white text-4xl font-bold f-display">How it works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Find your experience',
                desc: 'Filter by country, species, and dates. Real prices, no hidden fees.',
              },
              {
                step: '02',
                title: 'Book with the guide',
                desc: 'Send a message. Confirm in 24 hours. Pay securely through the platform.',
              },
              {
                step: '03',
                title: 'Show up and fish',
                desc: 'Your guide handles the rest. You just need to show up ready to cast.',
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="relative py-12 overflow-hidden"
                style={{
                  paddingRight: i < 2 ? '3.5rem' : 0,
                  paddingLeft: i > 0 ? '3.5rem' : 0,
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : undefined,
                }}
              >
                {/* Giant editorial watermark number */}
                <span
                  className="absolute font-bold select-none pointer-events-none f-display"
                  style={{
                    top: '-8px',
                    right: i < 2 ? '2rem' : '-0.5rem',
                    fontSize: '120px',
                    lineHeight: 1,
                    color: 'rgba(255,255,255,0.028)',
                    fontStyle: 'italic',
                  }}
                >
                  {item.step}
                </span>

                <div className="relative" style={{ zIndex: 1 }}>
                  <span className="text-[11px] font-bold tracking-[0.22em] uppercase f-body" style={{ color: '#E67E50' }}>
                    {item.step}
                  </span>
                  <div className="w-8 h-px mt-3 mb-6" style={{ background: '#E67E50', opacity: 0.35 }} />
                  <h3 className="text-white text-xl font-bold mb-3 f-display">{item.title}</h3>
                  <p className="text-white/42 text-sm leading-relaxed f-body">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY FJORDANGLERS — trust signals (no fake reviews) ───── */}
      <section className="py-24 px-8" style={{ background: '#F3EDE4' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <SalmonRule />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mt-4 mb-3 f-body" style={{ color: '#E67E50' }}>
              Why FjordAnglers
            </p>
            <h2 className="text-[#0A2E4D] text-4xl font-bold f-display">
              Built by anglers,
              <span style={{ fontStyle: 'italic' }}> for anglers.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TRUST_SIGNALS.map((t, i) => (
              <div
                key={t.headline}
                className="p-8 flex flex-col gap-5"
                style={{
                  background: '#FDFAF7',
                  borderRadius: '28px',
                  border: '1px solid rgba(10,46,77,0.07)',
                  boxShadow: '0 2px 16px rgba(10,46,77,0.05)',
                }}
              >
                {/* Number + line */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold tracking-[0.22em] f-body" style={{ color: '#E67E50' }}>
                    0{i + 1}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'rgba(10,46,77,0.08)' }} />
                </div>
                <div>
                  <h3 className="text-[#0A2E4D] text-lg font-bold mb-2.5 f-display">{t.headline}</h3>
                  <p className="text-[#0A2E4D]/50 text-sm leading-relaxed f-body">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FROM THE WATER ──────────────────────────────────────── */}
      <section className="py-24 px-8" style={{ background: '#F3EDE4' }}>
        <div className="max-w-7xl mx-auto">
          <div
            className="mb-12 pt-16 flex items-end justify-between"
            style={{ borderTop: '1px solid rgba(10,46,77,0.09)' }}
          >
            <div>
              <SalmonRule />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] mt-4 mb-3 f-body" style={{ color: '#E67E50' }}>
                Visual diary
              </p>
              <h2 className="text-[#0A2E4D] text-4xl font-bold leading-tight f-display">From the Water</h2>
            </div>
            <p className="text-[#0A2E4D]/38 text-sm max-w-xs text-right leading-relaxed f-body hidden md:block">
              Real photos and videos<br />from our guides&apos; latest trips.
            </p>
          </div>

          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: '290px 290px' }}
          >
            <div
              className="relative overflow-hidden rounded-3xl group cursor-pointer"
              style={{ gridColumn: '1 / span 7', gridRow: '1 / span 2' }}
            >
              <Image
                src={NORDIC_PHOTOS[0].url}
                alt={NORDIC_PHOTOS[0].label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(5,12,22,0.65) 0%, rgba(5,12,22,0.08) 50%)' }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}
                >
                  <svg width="16" height="18" viewBox="0 0 16 18" fill="white" className="ml-1">
                    <path d="M0 0 L16 9 L0 18 Z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-6 left-6">
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-2 f-body"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'white', backdropFilter: 'blur(4px)' }}
                >
                  ▶ Video story
                </span>
                <p className="text-white font-semibold text-base f-body">{NORDIC_PHOTOS[0].label}</p>
              </div>
            </div>

            {[
              { ...NORDIC_PHOTOS[1], col: '8 / span 3', row: '1' },
              { ...NORDIC_PHOTOS[2], col: '11 / span 2', row: '1' },
              { ...NORDIC_PHOTOS[3], col: '8 / span 2', row: '2' },
              { ...NORDIC_PHOTOS[4], col: '10 / span 3', row: '2' },
            ].map(photo => (
              <div
                key={photo.url}
                className="relative overflow-hidden rounded-2xl group cursor-pointer"
                style={{ gridColumn: photo.col, gridRow: photo.row }}
              >
                <Image
                  src={photo.url}
                  alt={photo.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(5,12,22,0.38)' }}
                />
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium f-body">{photo.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── GUIDE CTA ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '540px' }}>
        {/* Background image + gradient first, grain + content after */}
        <Image
          src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1800&h=900&fit=crop"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(108deg, rgba(4,12,22,0.92) 0%, rgba(4,12,22,0.78) 45%, rgba(4,12,22,0.4) 100%)' }}
        />
        <GrainOverlay />

        <div className="relative flex items-center min-h-[540px] px-12 max-w-7xl mx-auto" style={{ zIndex: 3 }}>
          <div style={{ maxWidth: '520px' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-px" style={{ background: '#E67E50' }} />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] f-body" style={{ color: '#E67E50' }}>
                For guides
              </p>
            </div>
            <h2 className="text-white text-5xl font-bold leading-tight mb-5 f-display">
              Are you a<br />
              <span style={{ fontStyle: 'italic' }}>fishing guide?</span>
            </h2>
            <p className="text-white/55 text-base leading-relaxed mb-3 f-body">
              Join our founding cohort of Scandinavian guides. Reach anglers from Poland, Germany, and across Europe.
            </p>
            <p className="text-white/40 text-sm leading-relaxed mb-8 f-body">
              First 50 guides get 3 months free + <span style={{ color: '#E67E50' }}>8% commission forever</span>.
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/guides/apply"
                className="inline-flex items-center gap-2 text-white font-semibold px-7 py-3.5 rounded-full text-sm tracking-wide transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] f-body"
                style={{ background: '#E67E50' }}
              >
                Apply as Founding Guide →
              </Link>
              <Link href="/guides" className="text-white/42 hover:text-white/75 text-sm font-medium transition-colors f-body">
                Meet the guides
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ──────────────────────────────────────────────── */}
      <footer
        className="py-14 px-8"
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
              <p className="text-white/22 text-sm leading-relaxed f-body" style={{ maxWidth: '240px' }}>
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
                  className="text-white/28 hover:text-white/60 text-sm transition-colors f-body"
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
            <p className="text-white/18 text-xs f-body">© 2026 FjordAnglers</p>
            <p className="text-white/14 text-xs f-body">Norway · Sweden · Finland</p>
          </div>
        </div>
      </footer>

    </div>
  )
}

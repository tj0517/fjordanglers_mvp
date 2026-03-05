/**
 * /guides/apply — Guide onboarding page.
 *
 * Server Component wrapper: renders the navbar, decorative header,
 * and the client-side OnboardingWizard.
 */

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { OnboardingWizard } from '@/components/guides/onboarding-wizard'

// ─── METADATA ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Join as a Guide',
  description:
    'Apply to become a verified FjordAnglers guide. Choose your plan, complete your profile, and start reaching anglers from across Europe.',
}

// ─── SHARED MICRO-COMPONENTS ──────────────────────────────────────────────────

const GRAIN_BG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const GrainOverlay = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: GRAIN_BG,
      backgroundSize: '200px 200px',
      opacity: 0.055,
      mixBlendMode: 'screen',
      zIndex: 2,
    }}
  />
)

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function GuideApplyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#07111C' }}>

      {/* ─── NAVBAR ───────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 py-5"
        style={{
          background: 'rgba(7, 17, 28, 0.58)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Left nav links */}
        <div className="flex items-center gap-1">
          {[
            { label: 'Experiences', href: '/experiences' },
            { label: 'Guides', href: '/guides' },
            { label: 'License Map', href: '/license-map' },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-white/50 hover:text-white/85 text-sm font-medium px-4 py-2 rounded-full transition-colors hover:bg-white/[0.06] f-body"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Centered logo */}
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

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="text-white/50 hover:text-white/85 text-sm font-medium px-4 py-2 rounded-full transition-colors hover:bg-white/[0.06] f-body"
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

      {/* ─── HERO BAND ────────────────────────────────────────────── */}
      <header
        className="relative overflow-hidden"
        style={{ background: '#07111C', paddingTop: '73px' }}
      >
        {/* Radial glow accents */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 15% 50%, rgba(27,79,114,0.35) 0%, transparent 55%), radial-gradient(ellipse at 85% 20%, rgba(230,126,80,0.12) 0%, transparent 45%)',
          }}
        />
        <GrainOverlay />

        <div
          className="relative max-w-5xl mx-auto px-8 pt-14 pb-14 text-center"
          style={{ zIndex: 3 }}
        >
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mb-7">
            <Link
              href="/"
              className="text-white/28 hover:text-white/55 text-xs f-body transition-colors"
            >
              Home
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="text-white/55 text-xs f-body">Join as Guide</span>
          </div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2.5 mb-7">
            <div className="w-6 h-px" style={{ background: '#E67E50' }} />
            <span
              className="text-[11px] font-semibold uppercase tracking-[0.25em] f-body"
              style={{ color: '#E67E50' }}
            >
              For guides
            </span>
            <div className="w-6 h-px" style={{ background: '#E67E50' }} />
          </div>

          {/* Headline */}
          <h1
            className="text-white font-bold f-display"
            style={{ fontSize: 'clamp(38px, 5vw, 58px)', lineHeight: 1.08 }}
          >
            Reach anglers from
            <span className="block" style={{ fontStyle: 'italic', color: '#E67E50' }}>
              across Europe.
            </span>
          </h1>

          <p
            className="text-white/45 text-base leading-relaxed mt-5 mx-auto f-body"
            style={{ maxWidth: '440px' }}
          >
            Join our verified network of Scandinavian fishing guides. Choose a plan, complete your
            profile, and we'll do the rest.
          </p>

          {/* Social proof chips */}
          <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
            {[
              { icon: '✓', text: 'Verified within 48h' },
              { icon: '🇳🇴', text: 'Norway · Sweden · Finland' },
              { icon: '€', text: 'No angler fees' },
            ].map((chip) => (
              <span
                key={chip.text}
                className="inline-flex items-center gap-2 text-xs px-4 py-2 rounded-full f-body"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span>{chip.icon}</span>
                {chip.text}
              </span>
            ))}
          </div>
        </div>

        {/* Subtle bottom separator */}
        <div
          className="absolute bottom-0 inset-x-0"
          style={{
            height: '1px',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(230,126,80,0.15) 50%, transparent 100%)',
          }}
        />
      </header>

      {/* ─── WIZARD ───────────────────────────────────────────────── */}
      <main>
        <OnboardingWizard />
      </main>

      {/* ─── FOOTER ───────────────────────────────────────────────── */}
      <footer
        className="py-12 px-8 mt-8"
        style={{ background: '#05101A', borderTop: '1px solid rgba(230,126,80,0.1)' }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div>
              <Image
                src="/brand/white-logo.png"
                alt="FjordAnglers"
                width={130}
                height={34}
                className="h-7 w-auto mb-4"
                style={{ opacity: 0.45 }}
              />
              <p
                className="text-sm leading-relaxed f-body"
                style={{ color: 'rgba(255,255,255,0.22)', maxWidth: '220px' }}
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
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm transition-colors f-body hover:text-white/60"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
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
            <p className="text-xs f-body" style={{ color: 'rgba(255,255,255,0.16)' }}>
              © 2026 FjordAnglers
            </p>
            <p className="text-xs f-body" style={{ color: 'rgba(255,255,255,0.12)' }}>
              Norway · Sweden · Finland
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}

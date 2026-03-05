-- Migration: 20260301181748_initial_schema.sql
-- Description: Initial FjordAnglers database schema covering all core entities
--              for the fishing guide marketplace (guides, experiences, bookings,
--              payments, leads). Includes enums, indexes, RLS policies and triggers.
-- Affected tables: profiles, guides, experiences, experience_images,
--                  bookings, payments, leads

BEGIN;

-- ─── EXTENSIONS ───────────────────────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── ENUMS ────────────────────────────────────────────────────────────────────

CREATE TYPE public.guide_status AS ENUM (
  'pending',
  'verified',
  'active',
  'suspended'
);

CREATE TYPE public.pricing_model AS ENUM (
  'flat_fee',
  'commission'
);

CREATE TYPE public.booking_status AS ENUM (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'refunded'
);

CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

-- ─── TABLES ───────────────────────────────────────────────────────────────────

-- profiles: extends auth.users with app-level role and display info
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'angler'
                          CHECK (role IN ('guide', 'angler', 'admin')),
  full_name   TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.profiles IS
  'App-level user profiles mirroring auth.users. One row per authenticated user.';

-- guides: full guide profile with business, location and Stripe info
CREATE TABLE IF NOT EXISTS public.guides (
  id                      UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID              NOT NULL UNIQUE
                                            REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name               TEXT              NOT NULL,
  bio                     TEXT,
  avatar_url              TEXT,
  cover_url               TEXT,
  country                 TEXT              NOT NULL,
  city                    TEXT,
  languages               TEXT[]            NOT NULL DEFAULT '{}',
  years_experience        INTEGER           CHECK (years_experience >= 0),
  fish_expertise          TEXT[]            NOT NULL DEFAULT '{}',
  certifications          TEXT,
  instagram_url           TEXT,
  youtube_url             TEXT,
  status                  public.guide_status   NOT NULL DEFAULT 'pending',
  pricing_model           public.pricing_model  NOT NULL DEFAULT 'commission',
  stripe_account_id       TEXT,
  stripe_charges_enabled  BOOLEAN           NOT NULL DEFAULT FALSE,
  stripe_payouts_enabled  BOOLEAN           NOT NULL DEFAULT FALSE,
  verified_at             TIMESTAMPTZ,
  average_rating          NUMERIC(3,2)      CHECK (average_rating >= 0 AND average_rating <= 5),
  total_reviews           INTEGER           NOT NULL DEFAULT 0,
  created_at              TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ       NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.guides IS
  'Guide profiles. status=active means the guide is publicly visible.';
COMMENT ON COLUMN public.guides.pricing_model IS
  'flat_fee = €29/month subscription; commission = 10% per booking, no monthly fee.';

-- experiences: individual fishing trip offerings by a guide
CREATE TABLE IF NOT EXISTS public.experiences (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  guide_id              UUID        NOT NULL REFERENCES public.guides(id) ON DELETE CASCADE,
  title                 TEXT        NOT NULL,
  description           TEXT        NOT NULL,
  fish_types            TEXT[]      NOT NULL DEFAULT '{}',
  duration_days         INTEGER     CHECK (duration_days > 0),
  duration_hours        INTEGER     CHECK (duration_hours > 0),
  max_guests            INTEGER     NOT NULL DEFAULT 6 CHECK (max_guests > 0),
  price_per_person_eur  NUMERIC(10,2) NOT NULL CHECK (price_per_person_eur > 0),
  difficulty            TEXT        CHECK (difficulty IN ('beginner', 'intermediate', 'expert')),
  what_included         TEXT[]      NOT NULL DEFAULT '{}',
  what_excluded         TEXT[]      NOT NULL DEFAULT '{}',
  meeting_point         TEXT,
  location_country      TEXT,
  location_city         TEXT,
  published             BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.experiences IS
  'Fishing trip listings. Only published=TRUE + guide.status=active are visible publicly.';

-- experience_images: photos attached to an experience (up to 8, ordered)
CREATE TABLE IF NOT EXISTS public.experience_images (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id  UUID        NOT NULL REFERENCES public.experiences(id) ON DELETE CASCADE,
  url            TEXT        NOT NULL,
  sort_order     INTEGER     NOT NULL DEFAULT 0,
  is_cover       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.experience_images IS
  'Photos for experiences stored in Supabase Storage; sort_order controls display order.';

-- bookings: reservation records linking anglers to guide experiences
CREATE TABLE IF NOT EXISTS public.bookings (
  id                UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id     UUID                    NOT NULL REFERENCES public.experiences(id),
  angler_id         UUID                    NOT NULL REFERENCES auth.users(id),
  guide_id          UUID                    NOT NULL REFERENCES public.guides(id),
  booking_date      DATE                    NOT NULL,
  guests            INTEGER                 NOT NULL DEFAULT 1 CHECK (guests > 0),
  status            public.booking_status   NOT NULL DEFAULT 'pending',
  -- Financials (denormalised for audit trail; always reflects price at booking time)
  total_eur         NUMERIC(10,2)           NOT NULL,
  platform_fee_eur  NUMERIC(10,2)           NOT NULL DEFAULT 0,
  guide_payout_eur  NUMERIC(10,2)           NOT NULL,
  -- Angler details captured at checkout
  special_requests  TEXT,
  angler_full_name  TEXT,
  angler_phone      TEXT,
  angler_country    TEXT,
  -- Status transitions
  cancelled_reason  TEXT,
  confirmed_at      TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ             NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.bookings IS
  'Core booking record. Financial fields are denormalised for audit trail.';

-- payments: Stripe payment intent records tied to a booking
CREATE TABLE IF NOT EXISTS public.payments (
  id                        UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id                UUID                    NOT NULL REFERENCES public.bookings(id),
  stripe_payment_intent_id  TEXT                    UNIQUE NOT NULL,
  amount_eur                NUMERIC(10,2)           NOT NULL,
  currency                  TEXT                    NOT NULL DEFAULT 'eur',
  status                    public.payment_status   NOT NULL DEFAULT 'pending',
  stripe_transfer_id        TEXT,
  created_at                TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ             NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.payments IS
  'Stripe payment intent records. One per booking attempt.';

-- leads: guide outreach tracking for Tymon & Łukasz Instagram campaigns
CREATE TABLE IF NOT EXISTS public.leads (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  instagram_handle  TEXT,
  name              TEXT,
  country           TEXT,
  fish_types        TEXT[]      NOT NULL DEFAULT '{}',
  status            TEXT        NOT NULL DEFAULT 'new'
                                CHECK (status IN ('new', 'contacted', 'responded', 'onboarded', 'rejected')),
  notes             TEXT,
  contacted_at      TIMESTAMPTZ,
  responded_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.leads IS
  'Instagram outreach pipeline. Admin-only access.';

-- ─── INDEXES ──────────────────────────────────────────────────────────────────

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles(role);

-- guides
CREATE INDEX IF NOT EXISTS idx_guides_user_id
  ON public.guides(user_id);
CREATE INDEX IF NOT EXISTS idx_guides_status
  ON public.guides(status);
CREATE INDEX IF NOT EXISTS idx_guides_country
  ON public.guides(country);
CREATE INDEX IF NOT EXISTS idx_guides_pricing_model
  ON public.guides(pricing_model);
-- Partial index: only active guides matter for listings
CREATE INDEX IF NOT EXISTS idx_guides_active
  ON public.guides(country, average_rating)
  WHERE status = 'active';

-- experiences
CREATE INDEX IF NOT EXISTS idx_experiences_guide_id
  ON public.experiences(guide_id);
CREATE INDEX IF NOT EXISTS idx_experiences_published
  ON public.experiences(guide_id)
  WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_experiences_price
  ON public.experiences(price_per_person_eur)
  WHERE published = TRUE;
CREATE INDEX IF NOT EXISTS idx_experiences_location
  ON public.experiences(location_country)
  WHERE published = TRUE;
-- GIN for array filtering by fish type
CREATE INDEX IF NOT EXISTS idx_experiences_fish_types
  ON public.experiences USING GIN(fish_types)
  WHERE published = TRUE;

-- experience_images
CREATE INDEX IF NOT EXISTS idx_experience_images_experience_id
  ON public.experience_images(experience_id);
CREATE INDEX IF NOT EXISTS idx_experience_images_sort
  ON public.experience_images(experience_id, sort_order);

-- bookings
CREATE INDEX IF NOT EXISTS idx_bookings_experience_id
  ON public.bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_angler_id
  ON public.bookings(angler_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guide_id
  ON public.bookings(guide_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date
  ON public.bookings(booking_date);

-- payments
CREATE INDEX IF NOT EXISTS idx_payments_booking_id
  ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_pi
  ON public.payments(stripe_payment_intent_id);

-- leads
CREATE INDEX IF NOT EXISTS idx_leads_status
  ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_instagram
  ON public.leads(instagram_handle);

-- ─── TRIGGERS ─────────────────────────────────────────────────────────────────

-- Generic updated_at trigger (reused by all tables with that column)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_guides_updated_at
  BEFORE UPDATE ON public.guides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON public.experiences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create a profile row when a new auth.users record is inserted
-- (called from auth trigger, so SECURITY DEFINER is required)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'angler'),
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────

-- ── profiles ─────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads all profiles"
  ON public.profiles FOR SELECT
  USING (TRUE);

CREATE POLICY "User updates own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "User inserts own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ── guides ────────────────────────────────────────────────────────────────────

ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Anyone can browse guides (public marketplace listing)
CREATE POLICY "Public reads all guides"
  ON public.guides FOR SELECT
  USING (TRUE);

CREATE POLICY "Guide inserts own profile"
  ON public.guides FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Guide updates own profile"
  ON public.guides FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role needed for webhook-driven updates (Stripe account.updated, admin actions)
CREATE POLICY "Service role manages all guides"
  ON public.guides FOR ALL
  USING (auth.role() = 'service_role');

-- ── experiences ───────────────────────────────────────────────────────────────

ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- Visitors see published experiences whose guide is active
CREATE POLICY "Public reads published active experiences"
  ON public.experiences FOR SELECT
  USING (
    published = TRUE
    AND EXISTS (
      SELECT 1 FROM public.guides
      WHERE id = guide_id AND status = 'active'
    )
  );

-- Guide reads own experiences (including drafts)
CREATE POLICY "Guide reads own experiences"
  ON public.experiences FOR SELECT
  USING (
    guide_id = (SELECT id FROM public.guides WHERE user_id = auth.uid())
  );

CREATE POLICY "Guide inserts own experiences"
  ON public.experiences FOR INSERT
  WITH CHECK (
    guide_id = (SELECT id FROM public.guides WHERE user_id = auth.uid())
  );

CREATE POLICY "Guide updates own experiences"
  ON public.experiences FOR UPDATE
  USING (
    guide_id = (SELECT id FROM public.guides WHERE user_id = auth.uid())
  );

CREATE POLICY "Guide deletes own experiences"
  ON public.experiences FOR DELETE
  USING (
    guide_id = (SELECT id FROM public.guides WHERE user_id = auth.uid())
  );

-- ── experience_images ─────────────────────────────────────────────────────────

ALTER TABLE public.experience_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reads images for published experiences"
  ON public.experience_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.experiences e
      JOIN public.guides g ON g.id = e.guide_id
      WHERE e.id = experience_id
        AND (
          (e.published = TRUE AND g.status = 'active')  -- public visitor
          OR g.user_id = auth.uid()                      -- or guide viewing own
        )
    )
  );

CREATE POLICY "Guide manages own experience images"
  ON public.experience_images FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.experiences e
      JOIN public.guides g ON g.id = e.guide_id
      WHERE e.id = experience_id AND g.user_id = auth.uid()
    )
  );

-- ── bookings ──────────────────────────────────────────────────────────────────

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Creation is handled by Server Actions via service_role client
CREATE POLICY "Service role inserts bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Angler reads own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = angler_id);

CREATE POLICY "Guide reads own bookings"
  ON public.bookings FOR SELECT
  USING (
    guide_id = (SELECT id FROM public.guides WHERE user_id = auth.uid())
  );

CREATE POLICY "Angler updates own booking"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = angler_id);

CREATE POLICY "Guide updates own booking"
  ON public.bookings FOR UPDATE
  USING (
    guide_id = (SELECT id FROM public.guides WHERE user_id = auth.uid())
  );

CREATE POLICY "Service role manages all bookings"
  ON public.bookings FOR ALL
  USING (auth.role() = 'service_role');

-- ── payments ──────────────────────────────────────────────────────────────────

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Angler reads own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND b.angler_id = auth.uid()
    )
  );

CREATE POLICY "Guide reads own payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.bookings b
      JOIN public.guides g ON g.id = b.guide_id
      WHERE b.id = booking_id AND g.user_id = auth.uid()
    )
  );

-- All writes come through the webhook handler (service_role)
CREATE POLICY "Service role manages all payments"
  ON public.payments FOR ALL
  USING (auth.role() = 'service_role');

-- ── leads ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Admins read via profile role check
CREATE POLICY "Admin reads leads"
  ON public.leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin writes via profile role check or service_role (for imports/automation)
CREATE POLICY "Admin manages leads"
  ON public.leads FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

COMMIT;

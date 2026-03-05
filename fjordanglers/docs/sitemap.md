# FjordAnglers — Site Map

## Public Pages

| Route | Status | Description |
|---|---|---|
| `/` | ✅ Built | Homepage — hero, search widget, species picker, featured experiences, how it works, guide CTA |
| `/experiences` | ✅ Built | Experience listing — sticky filters (country, species, difficulty, sort), 3-col grid |
| `/experiences/[id]` | ✅ Built | Experience detail — hero image, description, included/excluded, booking widget, guide card, related trips |
| `/guides` | 🔲 To build | Guide directory — filter by country, language |
| `/guides/[id]` | 🔲 To build | Guide profile — bio, experience list, contact |
| `/license-map` | 🔲 To build | Interactive map — fishing zones, license info, where to buy (key SEO page) |

## Auth

| Route | Status | Description |
|---|---|---|
| `/login` | 🔲 To build | Sign in (email + password, Supabase Auth) |
| `/register` | 🔲 To build | Angler registration |

## Guide Onboarding & Dashboard

| Route | Status | Description |
|---|---|---|
| `/guides/apply` | 🔲 To build | Guide application form — Stripe Connect Express onboarding |
| `/dashboard` | 🔲 To build | Guide dashboard — bookings overview, earnings |
| `/dashboard/experiences` | 🔲 To build | Guide's experience list |
| `/dashboard/experiences/new` | 🔲 To build | Create new experience |
| `/dashboard/experiences/[id]/edit` | 🔲 To build | Edit experience |
| `/dashboard/profile` | 🔲 To build | Edit guide profile |

## Booking Flow

| Route | Status | Description |
|---|---|---|
| `/book/[id]` | 🔲 To build | Booking form — date, guests, Stripe Checkout |
| `/book/[id]/confirm` | 🔲 To build | Booking confirmation page |

## Admin

| Route | Status | Description |
|---|---|---|
| `/admin` | 🔲 To build | Admin overview (Krzychu) |
| `/admin/guides` | 🔲 To build | Guide management — verify, suspend, edit |
| `/admin/leads` | 🔲 To build | Instagram outreach pipeline |
| `/admin/experiences` | 🔲 To build | Experience moderation |

## API Routes

| Route | Status | Description |
|---|---|---|
| `/api/stripe/webhook` | 🔲 To build | Stripe Connect webhook handler |
| `/api/stripe/connect` | 🔲 To build | Stripe Connect onboarding redirect |

---

## Build Priority

1. **Phase 1 — Public** ✅ `/` · `/experiences` · `/experiences/[id]`
2. **Phase 2 — Guides** `/guides` · `/guides/[id]`
3. **Phase 3 — Auth** `/login` · `/register`
4. **Phase 4 — Onboarding** `/guides/apply` + Stripe Connect
5. **Phase 5 — Dashboard** `/dashboard/*`
6. **Phase 6 — Booking** `/book/[id]`
7. **Phase 7 — Webhooks** `/api/stripe/*`
8. **Phase 8 — Admin** `/admin/*`
9. **Phase 9 — License Map** `/license-map`

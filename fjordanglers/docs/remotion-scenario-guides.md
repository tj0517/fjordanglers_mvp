# FjordAnglers — Remotion Video Scenario
## "For Guides, Camps & Outfitters"

> **Target audience:** Norwegian, Swedish, Finnish fishing guides, fishing camps, outfitters
> **Goal:** Convince them to list on FjordAnglers
> **Format:** 16:9 (1920×1080) primary · 9:16 crop hints noted per scene
> **Duration:** ~75 seconds total
> **FPS:** 30
> **Font:** Inter (all weights)
> **Colors:** `#0A2E4D` Fjord Blue · `#E67E50` Salmon · `#F8FAFB` Ice White

---

## Brand tokens (use in Remotion `<AbsoluteFill>` backgrounds & text)

```ts
export const BRAND = {
  fjordBlue:  "#0A2E4D",
  fjordLight: "#1B4F72",
  salmon:     "#E67E50",
  iceWhite:   "#F8FAFB",
  overlayDark: "rgba(10, 46, 77, 0.72)",   // dark scrim over video
  overlaySoft: "rgba(10, 46, 77, 0.45)",   // lighter scrim
} as const;
```

---

## SCENE OVERVIEW

| # | Scene | Duration | Frames (30fps) | Bg |
|---|-------|----------|-----------------|-----|
| 1 | Cold Open — Hook | 0:00–0:04 | 0–120 | Stock video |
| 2 | The Problem | 0:04–0:14 | 120–420 | Stock video |
| 3 | FjordAnglers Intro | 0:14–0:22 | 420–660 | Dark blue solid |
| 4 | What You Get — Profile | 0:22–0:32 | 660–960 | Stock video |
| 5 | What You Get — Bookings | 0:32–0:42 | 960–1260 | Stock video |
| 6 | What You Get — Anglers | 0:42–0:52 | 1260–1560 | Stock video |
| 7 | Pricing — Two Paths | 0:52–1:02 | 1560–1860 | Dark blue solid |
| 8 | Founding Guide Offer | 1:02–1:10 | 1860–2100 | Salmon solid |
| 9 | CTA — Join Now | 1:10–1:15 | 2100–2250 | Dark blue solid |

---

## SCENE 1 — COLD OPEN "Hook" (0:00–0:04, frames 0–120)

### Stock video
**Search terms:** "norwegian salmon river fjord dawn" / "fly fishing cast morning mist norway"
**Platform:** Artgrid / Storyblocks / Pexels
**Shot type:** Wide establishing — river bend at golden hour, fisherman silhouette mid-cast, mist on water
**Pexels fallback:** `https://www.pexels.com/search/videos/salmon%20fishing%20norway/`
**9:16 crop:** Top third of frame (sky + mountains)

### Scrim
`overlayDark` — full screen, opacity animates from 0 → 0.72 over frames 0–30

### Text overlay
```
Position: center
Animation: slideUp from y+40 + fadeIn, frames 20–80

LINE 1 (Inter 900, 72px, Ice White):
"You catch fish."

— no other text this scene —
```

### Remotion hint
```tsx
<Video src={stockVideo1} startFrom={0} />
<AbsoluteFill style={{ background: overlayDark }} />
<Sequence from={20}>
  <Animated>
    <h1 style={{ color: BRAND.iceWhite, fontSize: 72, fontWeight: 900 }}>
      You catch fish.
    </h1>
  </Animated>
</Sequence>
```

---

## SCENE 2 — THE PROBLEM (0:04–0:14, frames 120–420)

### Stock video
**Search terms:** "fishing guide waiting boat norway" / "empty fishing camp scandinavia" / "man scrolling phone outdoors fishing"
**Shot type:** Medium — guide on dock, looking at phone / empty camp cabins / laptop in rustic cabin
**Energy:** Quiet, slightly frustrated, real — NOT stock-smiling

### Scrim
`overlaySoft` — 0.45 opacity constant

### Text overlay — 3 beats, each ~80 frames apart

**Beat A — frames 140–260** (fadeIn + slideUp)
```
Inter 700, 42px, Ice White, max-width 800px, center:

"Anglers from Poland, Germany, Czech Republic
are searching for guides like you."
```

**Beat B — frames 260–380** (previous text fades, new slides in)
```
Inter 400, 32px, Ice White/80%, center:

"They can't find you.
Language barrier. No platform. Scattered info."
```

**Beat C — frames 380–420** (quick punch, Inter 900, 48px, Salmon)
```
"That changes now."
```

### Animation notes
- Beat A: `translateY(30px → 0)` + `opacity(0 → 1)` over 20 frames
- Beat B: Beat A fades out at frame 240, B animates in at 260
- Beat C: Zoom scale `0.9 → 1.0` + opacity in 15 frames

---

## SCENE 3 — FJORDANGLERS INTRO (0:14–0:22, frames 420–660)

### Background
Solid `#0A2E4D` (Fjord Blue dark)
**No stock video here** — clean branded moment, let logo breathe

### Elements

**Logo** (white-logo.png)
```
Position: center top (y: 35% from top)
Animation: fadeIn + scale 0.85 → 1.0 over frames 430–480
Size: 280px wide
```

**Tagline** (below logo, 40px gap)
```
Inter 400, 24px, Ice White/80%:
"The marketplace for Scandinavian fishing guides."

Animation: fadeIn, frames 480–520
```

**Divider line**
```
1px horizontal line, color: Salmon #E67E50
Width animates 0 → 560px, frames 520–570
```

**Sub-copy** (below divider)
```
Inter 300, 18px, Ice White/60%:
"Norway · Sweden · Finland · Iceland · Denmark"

Animation: fadeIn, frames 570–620
```

### 9:16 note
Stack vertically — logo top 30%, tagline center, countries bottom 65%

---

## SCENE 4 — WHAT YOU GET: Profile (0:22–0:32, frames 660–960)

### Stock video
**Search terms:** "fishing guide profile portrait norway river" / "fly fishing guide instructing client" / "fishing guide close up smile"
**Shot type:** Medium portrait — guide in waders, smile, authentic — NOT posed corporate
**Color grade preference:** Warm, slight desaturate blues

### Scrim
`overlayDark` left half only (gradient: `rgba(10,46,77,0.85) → transparent`) — text sits left, video shows right

### Text overlay — LEFT COLUMN

**Tag chip** (Inter 600, 13px uppercase, Salmon bg `#E67E50`, px-12 py-4, rounded-full)
```
YOUR PROFILE
```
Animation: slideRight from x-40, frames 680–720

**Headline** (Inter 800, 44px, Ice White)
```
"Your own page.
Searchable across Europe."
```
Animation: fadeIn + translateX(-20 → 0), frames 700–760

**Bullet list** (Inter 400, 20px, Ice White/85%, gap 12px)
```
✦  Photos, species, techniques
✦  Booking calendar
✦  Verified badge
✦  Reviews from real clients
✦  SEO-optimized — Google finds you
```
Each bullet animates in sequentially, 25 frames apart, starting frame 760

### Mock UI element (optional Remotion component)
Render a simplified `<GuideCard>` component (from the actual codebase) as a Remotion element, animating in from the right side at frame 820. Scale `0.7` of real size.

---

## SCENE 5 — WHAT YOU GET: Bookings (0:32–0:42, frames 960–1260)

### Stock video
**Search terms:** "fishing booking confirmation phone happy" / "salmon caught norway river celebration" / "fishing camp cabin cozy norway"
**Shot type:** Close-up hands with phone / wide camp exterior at golden hour
**Energy:** Warm, celebratory, real

### Scrim
`overlaySoft` + right-aligned text column

### Text overlay — RIGHT COLUMN

**Tag chip** (same style, Salmon)
```
BOOKINGS & PAYMENTS
```

**Headline** (Inter 800, 44px, Ice White)
```
"Clients pay.
You fish."
```

**Body** (Inter 400, 20px, Ice White/85%, max-width 420px)
```
"We handle the full booking flow —
payments, confirmations, payouts.
No chasing invoices. No WhatsApp chaos."
```
Animation: staggered lines, 20 frames apart, starting frame 1000

**Animated counter** (Inter 900, 64px, Salmon)
```
€0 to set up
```
Count animation: 0 → final value over 40 frames, starting frame 1100
Subtext (16px, Ice White/60%): "for commission-based listing"

---

## SCENE 6 — WHAT YOU GET: Anglers (0:42–0:52, frames 1260–1560)

### Stock video
**Search terms:** "group anglers poland fly fishing" / "fishing tourists europe river" / "men fishing trip scandinavia"
**Shot type:** Wide — group of 2-4 anglers, clearly Central European (non-Scandinavian), mid-cast or landing fish
**Energy:** Excited, group energy, real trip

### Scrim
`overlayDark` bottom two-thirds, text bottom-aligned

### Text overlay — CENTER BOTTOM

**Tag chip** (Salmon)
```
YOUR CLIENTS
```

**Headline** (Inter 800, 52px, Ice White, center)
```
"30,000+ anglers
searching right now."
```
Animation: scale 0.8 → 1.0 + fadeIn, frames 1280–1340

**Three stat pills** (horizontal row, Inter 700, 18px)
```
Pill style: bg Ice White/10%, border 1px Ice White/30%, rounded-full, px-16 py-8

🇵🇱 Poland    🇩🇪 Germany    🇨🇿 Czech Republic
```
Each pill slides up with 30-frame stagger, starting frame 1360

**Body** (Inter 400, 18px, Ice White/75%, center)
```
"These anglers speak English.
They have budget. They're ready to book."
```
fadeIn at frame 1480

---

## SCENE 7 — PRICING: Two Paths (0:52–1:02, frames 1560–1860)

### Background
Solid `#0A2E4D` — clean, no video distractions for pricing moment

### Layout
Two cards side by side (or stacked on 9:16), animate in from left/right

**Card A — Listing** (Inter, Ice White/8% bg, border Ice White/20%, rounded-2xl, padding 32px)
```
TOP LABEL (Ice White/50%, 13px uppercase): LISTING

PRICE (Inter 900, 56px, Ice White):
€20
/month

DESCRIPTION (16px, Ice White/70%):
Public profile + contact form.
You handle booking yourself.

BULLET (14px, Ice White/60%):
✦ Profile page live in 24h
✦ Contact form
✦ Basic analytics
```
Animates in from LEFT, frames 1580–1640

**Card B — Bookable** (highlighted — bg Salmon/15%, border Salmon, rounded-2xl)
```
TOP LABEL (Salmon, 13px uppercase): BOOKABLE ← MOST POPULAR

PRICE (Inter 900, 56px, Ice White):
10%
per booking

DESCRIPTION (16px, Ice White/70%):
Full platform. We handle payments.
You keep 90% of every booking.

BULLET (14px, Ice White/60%):
✦ Full booking management
✦ Stripe payouts
✦ Client messaging
✦ Priority listing
```
Animates in from RIGHT, frames 1600–1660

**Connecting line between cards** (Salmon, 1px, animated width 0 → full, frame 1660–1700)

---

## SCENE 8 — FOUNDING GUIDE OFFER (1:02–1:10, frames 1860–2100)

### Background
Solid Salmon `#E67E50` — ONLY scene with this bg, creates contrast punch

### Text overlay — CENTER

**Eyebrow** (Inter 600, 14px uppercase, `#0A2E4D`/60%)
```
LIMITED — FIRST 50 GUIDES
```
fadeIn frame 1880

**Headline** (Inter 900, 64px, `#0A2E4D`)
```
"Founding Guide."
```
scale 0.85 → 1.0 + fadeIn, frames 1880–1940

**Offer details** (Inter 500, 28px, `#0A2E4D`)
```
3 months free
+
8% commission — for life.
```
Each line slides up with 20-frame stagger, starting frame 1960

**Urgency bar** (progress-style)
```
Label (12px, `#0A2E4D`/60%): "SPOTS REMAINING"
Bar: Ice White/30% bg, #0A2E4D fill, animates fill 0 → ~60%, frames 2040–2080
Counter: "30 / 50 taken" (Inter 700, 16px, `#0A2E4D`)
```

**Note:** Adjust "30/50" to real number as guides sign up. Make it a prop: `<FoundingGuideScene spotsTaken={30} />`

---

## SCENE 9 — CTA (1:10–1:15, frames 2100–2250)

### Background
Solid `#0A2E4D` with subtle animated gradient pulse (keyframe opacity 1.0 ↔ 0.8 on a radial salmon glow behind text)

### Elements

**Logo** (white-logo.png, 200px wide, top center, fadeIn frame 2110)

**CTA text** (Inter 900, 52px, Ice White, center)
```
"List your trips.
Reach Central Europe."
```
Animation: fadeIn + translateY(20 → 0), frames 2120–2180

**URL** (Inter 600, 28px, Salmon)
```
fjordanglers.com/join
```
scale pulse animation (1.0 → 1.03 → 1.0) loop, starts frame 2180

**Subtext** (Inter 400, 16px, Ice White/50%)
```
"Free setup. No contract. Cancel anytime."
```
fadeIn frame 2200

---

## STOCK VIDEO SHOPPING LIST

Use this checklist when sourcing on Artgrid / Storyblocks / Pexels:

| Scene | Keywords | Must-have qualities |
|-------|----------|---------------------|
| 1 | `salmon river norway golden hour silhouette` | Mist, wide shot, dawn light |
| 2 | `fishing guide waiting dock` | Authentic, not posed, phone/solitude |
| 4 | `fly fishing guide portrait river` | Eye contact, waders, genuine smile |
| 5 | `fishing camp cabin norway exterior` | Golden hour, cozy, authentic cabin |
| 6 | `group fishing trip europe anglers` | Multi-person, excitement, real |

**What to avoid in all clips:**
- Actors in gear who clearly don't fish (wrong rod hold)
- Over-saturated "influencer" color grades
- Tropical locations (wrong geography)
- Any shot with visible brands/logos

**Color grading directive for post:**
Apply LUT: cool shadows (slight blue), warm mids, desaturate greens slightly.
Target feel: Scandinavia at 5am, not California.

---

## MUSIC DIRECTION

**Mood:** Nordic · Cinematic · Understated · Builds slowly
**BPM:** 80–95 (no aggressive drops)
**Reference tracks:**
- Epidemic Sound: "Arctic Drift" / "Slow River" tags
- Artlist: search `Scandinavian minimal folk instrumental`
- Avoid: generic "corporate inspire" tracks with elevator build

**Audio structure:**
- Scene 1–2: Sparse, just ambient + minimal melody
- Scene 3 (logo): Brief silence beat → music re-enters
- Scene 4–6: Full melody, building
- Scene 7–8: Music softens (pricing = clarity moment)
- Scene 9: Strong finish, not fading out — cut clean on last frame

---

## REMOTION COMPONENT MAP

```
src/
  remotion/
    compositions/
      GuidePromo.tsx          ← Root composition (75s)
    scenes/
      01-ColdOpen.tsx
      02-Problem.tsx
      03-BrandIntro.tsx
      04-ProfileFeature.tsx
      05-BookingsFeature.tsx
      06-AnglersFeature.tsx
      07-Pricing.tsx
      08-FoundingGuide.tsx
      09-CTA.tsx
    components/
      AnimatedText.tsx        ← reusable fadeIn/slideUp wrapper
      TagChip.tsx             ← salmon pill labels
      FeatureBullet.tsx       ← staggered bullet list
      PricingCard.tsx         ← Scene 7 cards
      VideoScrim.tsx          ← overlay gradient helper
      MockGuideCard.tsx       ← UI mockup for Scene 4
    assets/
      white-logo.png
      stock/                  ← place licensed video clips here
    constants.ts              ← BRAND tokens, TIMING map
    Root.tsx                  ← registerRoot
```

---

## TIMING CONSTANTS (export from `constants.ts`)

```ts
export const FPS = 30;

export const SCENES = {
  coldOpen:      { from: 0,    durationInFrames: 120  },
  problem:       { from: 120,  durationInFrames: 300  },
  brandIntro:    { from: 420,  durationInFrames: 240  },
  profile:       { from: 660,  durationInFrames: 300  },
  bookings:      { from: 960,  durationInFrames: 300  },
  anglers:       { from: 1260, durationInFrames: 300  },
  pricing:       { from: 1560, durationInFrames: 300  },
  foundingGuide: { from: 1860, durationInFrames: 240  },
  cta:           { from: 2100, durationInFrames: 150  },
} as const;

export const TOTAL_FRAMES = 2250; // 75 seconds
```

---

## RENDER TARGETS

| Format | Resolution | Use |
|--------|-----------|-----|
| Main | 1920×1080 · H.264 | YouTube, website embed |
| Square | 1080×1080 | Instagram feed post |
| Vertical | 1080×1920 | Instagram Reels, TikTok |
| Thumbnail | PNG frame 420 | Logo reveal = perfect thumbnail |

**Remotion render command:**
```bash
npx remotion render GuidePromo --codec h264 --width 1920 --height 1080
```

---

## COPY REVIEW — Full text (all scenes in order)

```
[S1] You catch fish.

[S2] Anglers from Poland, Germany, Czech Republic
     are searching for guides like you.
     They can't find you.
     Language barrier. No platform. Scattered info.
     That changes now.

[S3] [Logo]
     The marketplace for Scandinavian fishing guides.
     ————————————————————————
     Norway · Sweden · Finland · Iceland · Denmark

[S4] YOUR PROFILE
     Your own page. Searchable across Europe.
     ✦ Photos, species, techniques
     ✦ Booking calendar
     ✦ Verified badge
     ✦ Reviews from real clients
     ✦ SEO-optimized — Google finds you

[S5] BOOKINGS & PAYMENTS
     Clients pay. You fish.
     We handle the full booking flow —
     payments, confirmations, payouts.
     No chasing invoices. No WhatsApp chaos.
     €0 to set up

[S6] YOUR CLIENTS
     30,000+ anglers searching right now.
     🇵🇱 Poland   🇩🇪 Germany   🇨🇿 Czech Republic
     These anglers speak English.
     They have budget. They're ready to book.

[S7] LISTING           BOOKABLE
     €20/month         10% per booking
     Contact form      Full booking management
     Basic analytics   Stripe payouts

[S8] LIMITED — FIRST 50 GUIDES
     "Founding Guide."
     3 months free
     +
     8% commission — for life.
     ████████░░ 30/50 taken

[S9] [Logo]
     List your trips. Reach Central Europe.
     fjordanglers.com/join
     Free setup. No contract. Cancel anytime.
```

---

*Scenario version 1.0 — March 2026*
*Owner: Łukasz (content) + Tymon (Remotion implementation)*
*Next: source stock videos, confirm real "spots taken" count for Scene 8*

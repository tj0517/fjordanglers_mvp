# FjordAnglers — Claude Code Context

## Projekt
Marketplace łączący skandynawskich przewodników wędkarskich z wędkarzami z Europy Środkowej.
Stack: Next.js 14 (App Router), Supabase, Stripe Connect, TypeScript, Tailwind CSS.
Środowisko: pnpm, Node 20+.

## Architektura
- `src/app/` — Next.js App Router, każda strona = folder z page.tsx
- `src/components/` — reużywalne komponenty (atomic design)
- `src/lib/supabase/` — client/server helpers, typy generowane z DB
- `src/lib/stripe/` — Stripe Connect, webhooks
- `src/actions/` — Server Actions (nie REST API dla mutacji)

## Model biznesowy
Dwa warianty dla przewodników:
1. Flat fee €29/month
2. Komisja bez monthly fee (10% od rezerwacji)

## Styl kodu
- TypeScript strict mode, NO `any`
- Komponenty: functional, named exports
- Server Components domyślnie, `"use client"` tylko gdy konieczne
- Supabase Row Level Security (RLS) zawsze włączone
- Zmienne środowiskowe: tylko przez `src/lib/env.ts` (zod validation)
- Konwencja nazewnictwa: camelCase zmienne, PascalCase komponenty, kebab-case pliki

## Workflow
- Zawsze uruchom `pnpm typecheck` po serii zmian
- Testy jednostkowe: Vitest (`pnpm test`)
- E2E: Playwright (`pnpm test:e2e`)
- Branches: `feature/`, `fix/`, `chore/` → PR do `main`
- Nie modyfikuj bezpośrednio migracji Supabase — twórz nowe

## Colory brandowe
- Fjord Blue: #1B4F72
- Salmon Orange: #E67E22
- Tagline: "Epic Fjord Fishing Experiences"

## Ważne kontakty i role
- Tymon (CEO, dev): Next.js/Supabase/Stripe
- Łukasz: content, Instagram
- Krzychu: fishing knowledge, weryfikacja przewodników

## Co Claude NIE powinien robić
- Nie używaj `require()` — tylko ES modules
- Nie edytuj `.env.local` bezpośrednio — powiedz jakie zmienne dodać
- Nie commituj sekretów
- Nie używaj `pages/` router — tylko `app/`
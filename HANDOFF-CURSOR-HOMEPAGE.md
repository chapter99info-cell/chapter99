# HANDOFF — Homepage from approved prototype

Branch: `codex/homepage-v2`

## What changed

Public homepage rebuilt to match `docs/prototype/chapter99_homepage_mockup_v1.html` (identical to Downloads v1_3).

Section order: Header → Hero → Solutions (5 cards + journey) → **marked Free Toolkit slot (empty)** → How Chapter99 Works (6 steps) → Your Business Stays Yours → Pricing from `config/pricing.ts` → Business Check CTA (not connected) → Footer.

Prices are not hard-coded in components.

## Files touched (this increment)

| File | Role |
| --- | --- |
| `docs/prototype/chapter99_homepage_mockup_v1.html` | Already committed earlier; unchanged |
| `docs/prototype/chapter99_toolkit_mvp_v1.html` | Added in docs commit — **not implemented** |
| `config/pricing.ts` | Canonical Starter / Professional / Business |
| `src/data/solutions.ts` | Five industries + journeys |
| `src/pages/SolutionPage.tsx` | `/solutions/:slug` |
| `src/App.tsx` | Solution route |
| `src/site/HomePage.tsx` | Homepage |
| `src/site/SiteLayout.tsx` | Nav, EN/TH, footer, newsletter UI |
| `src/site/homepage-approved.css` | Mockup tokens/layout |
| `tsconfig.app.json` | Includes `config/` |
| `.gitignore` | `.vercel/`, `supabase/.temp/` |
| `HANDOFF-CURSOR-HOMEPAGE.md` | This file |

## How to run

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## Known gaps / deviations from the HTML mockup

- **Free Toolkit** is in the live nav (`/business-toolkit`) — written homepage brief / Phase 1 plan. The HTML mockup header omits it.
- **`#toolkit-slot`** sits between Solutions and How It Works — written brief. HTML mockup has no toolkit teaser (separate task).
- Solution cards **navigate** to `/solutions/<slug>` instead of only toggling the journey.
- Hero default language follows the app (**TH** stored), not the mockup’s EN default.
- Business Check control is **disabled** and labelled not connected (mockup link is a no-op).
- `/pricing` page is **not** rewritten; it may still show START/GROW/SCALE. Homepage cards use `config/pricing.ts`.
- Cookie/search overlay from existing `SiteUx` still appears.
- No Toolkit product routes in this step.

## Honest labels

- Hero badge: `Placeholder image`
- Phone rating: `SAMPLE`
- Cover: `Photo placeholder`
- Business Check: not connected, no results
- Newsletter: UI only, no email stored

## Checks run

| Command | Result |
| --- | --- |
| `npm run lint` | Exit 0 (existing warnings outside this work) |
| `npm run build` (`tsc -b` + vite) | Exit 0 |
| Unit tests | None in repo |
| Viewports | 375 / 768 / 1024 / 1440 — no horizontal overflow on prior pass |

## Phase — blue / white / navy glass theme + motion

Visual tokens live in `src/site/homepage-approved.css` (`:root`, `.home-approved`, `.site-v2.site-approved`) and are applied by `src/site/theme-blue.css`.

### Tokens

| Token | Value |
| --- | --- |
| `--sky-50` | `#EAF6FF` |
| `--sky-100` | `#D6EEFF` |
| `--sky-300` | `#7CC4F2` |
| `--blue-500` | `#2F9BE6` |
| `--blue-600` | `#1F7FD0` |
| `--navy-800` | `#0B2A4A` |
| `--navy-900` | `#071B33` |
| `--white` | `#FFFFFF` |
| `--ink` | `#0B2A4A` |
| `--muted` | `#4F6F8F` |
| `--grad-hero` | `linear-gradient(180deg, #5DB7F0 0%, #2F9BE6 45%, #1F6FB8 100%)` |
| `--glass-bg` | `rgba(255, 255, 255, 0.16)` |
| `--glass-border` | `rgba(255, 255, 255, 0.38)` |
| `--shadow-soft` | `0 10px 30px rgba(31, 127, 208, 0.15)` |

Glass blur is 14px. When `backdrop-filter` is missing, glass surfaces use a solid blue tint. On small screens, orbs lose blur and glass uses the solid tint.

### Motion

- Hero: slow gradient shift plus three soft light orbs (transform/opacity).
- Sample phone: 8px vertical float, 6s ease-in-out.
- Scroll reveal: IntersectionObserver in `src/site/useSiteMotion.ts` — fade + rise 16px, 60ms stagger, once only.
- Cards: hover lift, glow, brighter border.
- Buttons: hover lift; primary arrow nudges 3px.
- Header: glass over the homepage hero, solid white after 60px scroll.
- Language toggle: pill switch (`TH | EN`). Headings fade 150ms on language change. Choice stored in `localStorage` key `c99-lang` (try/catch). Default remains Thai.
- Professional price card: gradient border shimmer. Coming soon stays muted.
- Optional industry marquee under the hero (CSS only, pauses on hover).

### Reduced motion

`prefers-reduced-motion: reduce` turns off animations and transitions. Reveal targets are shown immediately (`opacity: 1`, no transform). Header still changes colour on scroll without a transition.

The HTML file `docs/prototype/chapter99_blue_theme_mockup_v1.html` was not found in the repo, Downloads, or specs, so this pass follows the written token list rather than a copied mockup.

## Explicit confirmations

- Starter A$199 + A$19/mo; Professional A$499 + A$49/mo; Business no price
- Homepage has no START/GROW/SCALE
- No staff/Back Office/auth/DB work
- No Toolkit implementation
- No push, no deploy

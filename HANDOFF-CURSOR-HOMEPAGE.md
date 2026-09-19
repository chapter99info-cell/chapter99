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

## Explicit confirmations

- Starter A$199 + A$19/mo; Professional A$499 + A$49/mo; Business no price
- Homepage has no START/GROW/SCALE
- No staff/Back Office/auth/DB work
- No Toolkit implementation
- No push, no deploy

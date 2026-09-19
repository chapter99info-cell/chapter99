# HANDOFF — Public homepage rebuild

## 1. Audit findings

- App is Vite 8 + React 19 + React Router 7 (not Next.js).
- Public chrome lives in `src/site/SiteLayout.tsx`; homepage is `src/site/HomePage.tsx`.
- Approved mockup is now `docs/prototype/chapter99_homepage_mockup_v1.html` (36,740 bytes).
- SOP v2 still names START / GROW / SCALE. This increment uses the **approved public prices** on the homepage only: Starter A$199 + A$19/mo, Professional A$499 + A$49/mo, Business Coming Soon (no price).
- No `/chapter99/staff` in this repo. No schema/RLS/auth changes.
- Existing automated tests: **none** in `package.json`.

## 2. Exact files changed

- `.gitignore` — ignore `.vercel/` and `supabase/.temp/`
- `tsconfig.app.json` — include `config/`
- `config/pricing.ts` — canonical public package prices
- `src/data/solutions.ts` — five industries + journeys + IndustryPage content
- `src/pages/SolutionPage.tsx` — `/solutions/:slug`
- `src/App.tsx` — new route
- `src/site/HomePage.tsx` — approved section order
- `src/site/SiteLayout.tsx` — nav, CTA, footer, newsletter stub
- `src/site/homepage-approved.css` — mockup visual system
- `HANDOFF-CURSOR-HOMEPAGE.md` — this file

Previous local commit (separate): `docs: add approved homepage mockup prototype`.

## 3. Routes added / changed

| Route | Change |
| --- | --- |
| `/` | Rebuilt homepage |
| `/solutions/:slug` | New (`massage`, `restaurant`, `cleaning`, `beauty`, `other`) |
| `/massage`, `/restaurants`, `/beauty`, `/cleaning` | Unchanged existing pages |
| `/pricing` | **Not rewritten** (still START/GROW/SCALE) |
| `/business-toolkit` | Unchanged |

## 4. Components reused

- `SiteLayout` / `LanguageProvider` / `SiteUx` (cookie/search overlay)
- `IndustryPage` for all `/solutions/*` pages
- Existing `/contact` for Talk to Chapter99
- `PricePackBar` still only on `/pricing`

## 5. Components created

- Homepage sections in `HomePage.tsx` (hero, solutions, toolkit slot, how, trust, pricing, check)
- `SolutionPage`
- `config/pricing.ts`, `src/data/solutions.ts`
- `homepage-approved.css`

## 6. Mocked / not connected

- Business Check button: **disabled**, labelled not connected — no score, no fake result
- Footer newsletter: **UI only**, no email stored
- Hero phone: **SAMPLE / DEMO** placeholder, not a live shop
- Industry card images: labelled gradients / placeholders, not real client photography
- Free Toolkit teaser: **empty marked slot** (`#toolkit-slot`)

## 7. Tests actually executed

| Command | Result |
| --- | --- |
| `npm run lint` | Exit 0 (existing warnings in vendor/`specs` and older files) |
| `npm run build` (`tsc -b` + vite) | Exit 0 |
| Unit tests | None exist — not run |
| Manual viewports 375 / 430 / 768 | `scrollWidth === clientWidth` (no overflow) |
| 1024 / 1440 | No overflow (browser reported 2× CSS pixels; overflow still false) |
| `/solutions/other` | Loads shared `IndustryPage` |

Hero CTAs present at 375. Industry cards use horizontal snap under 1024px.

## 8. Known issues

- `/pricing` still shows START / GROW / SCALE. Homepage prices are isolated in `config/pricing.ts`.
- Cookie/search overlay from `SiteUx` still appears on first visit.
- Nav at ~1100px may wrap; burger kicks in at existing 1099px breakpoint.
- Old industry URLs and `/solutions/*` are parallel, not redirects.

## 9. Remaining work

- Toolkit teaser in `#toolkit-slot` (separate task)
- Align `/pricing` to the same `config/pricing.ts` when approved
- Wire Business Check when that task ships
- Swap placeholders for real, labelled photography

## 10. Local run

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## 11. Explicit confirmations

- Starter = A$199 setup + A$19/month
- Professional = A$499 setup + A$49/month
- Business has **no price** (Coming Soon / Talk to Us)
- Homepage has **no START / GROW / SCALE**
- No fake testimonials or results
- Hardware is not resold (disclaimer on homepage)
- No tax/legal advice marketing on homepage
- No end-customer PII collection
- `/chapter99/staff` untouched (not in repo)
- No production DB changes
- **No push, no deploy** in this increment

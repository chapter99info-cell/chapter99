# HANDOFF — Toolkit Phase 2 + /pricing

**Branch:** `codex/homepage-v2`  
**Scope:** public site only (`/toolkit`, tools, `/business-check`, `/pricing`). No staff / Back Office / auth / DB / push / deploy.

## Commits (local)

See git log after this file is committed. Expected three logical commits:

1. `feat: add toolkit hub and tools`
2. `feat: add business check`
3. `feat: rebuild pricing page`

## Routes

| Path | Page |
| --- | --- |
| `/toolkit` | Hub (filters + 5 cards including Business Check) |
| `/toolkit/english-message` | English Message Builder |
| `/toolkit/price-list` | Price List Builder |
| `/toolkit/review-reply` | Review Reply Helper |
| `/toolkit/poster-studio` | Poster Studio (QR via `qrcode` MIT, local only) |
| `/business-check` | 8-question check + rings/bars + top-3 + upsell |
| `/pricing` | Starter / Professional / Business from `config/pricing.ts` |
| `/business-toolkit` | Redirect → `/toolkit` |

Homepage `#toolkit-slot` is a teaser that links to `/toolkit`. Homepage `#check` CTA links to `/business-check`.

## Guardrails

`src/lib/toolkit/guards.ts` ports prototype v1_6:

- `PRO_ADVICE` — tax/legal/contracts/privacy/employment
- `SENSITIVE` — compounds (`กินยา|ทานยา|ยารักษา|ยาประจำ`), **not** bare `ยา` (so `อยาก` / `อยากจอง` pass)
- `LEGALISH` — review-mode only
- `INCENTIVE` — review-poster headline / gift-for-review wording

Unit tests: `src/lib/toolkit/guards.test.ts`, `src/lib/toolkit/businessCheck.test.ts`.

## AI / analytics

- `aiGenerate()` stub, `AI.connected = false`. No API keys or network AI.
- `track()` metadata only. Never sends user-entered text.
- Events: `tool_opened`, `tool_completed`, `tool_result_copied`, `tool_result_shared`, `business_check_completed`, `tool_to_contact_clicked`, `tool_to_packages_clicked`.

## Checks run locally

- `npm run lint` — pass (existing warnings in specs vendor + ContactPage / old BusinessToolkitPage; new warning on PosterStudio QR effect)
- `npm run typecheck` — pass
- `npm test` — 9 passed
- `npm run build` — pass

## Deviations from `docs/prototype/chapter99_toolkit_mvp_v1.html`

- React/Vite SPA, not a single HTML file. Same public routes and copy intent, not pixel-identical CSS from the 3k-line prototype.
- QR uses existing MIT `qrcode` npm package (bundled), not a pasted inline generator.
- Poster canvas is a simplified print/export (name, contact, headline, badges, optional photo, QR). Preview DOM is closer to the card/poster layout than the canvas fallback.
- Price-list “PDF export” remains disabled (`soon`) as in later-phase copy; print/copy work.
- Old START/GROW/SCALE page is replaced on `/pricing` only. Leftover cinematic pack data / About copy mentioning START/GROW/SCALE was not rewritten (out of this route scope).
- Old `/business-toolkit` implementation remains in the repo but is no longer routed; URL redirects to `/toolkit`.
- Review-reply “regenerate/shorter” updates local template variants without a live AI call.

## Do not

- Push or deploy until explicit approval.
- Add paid AI, staff routes, or database work.

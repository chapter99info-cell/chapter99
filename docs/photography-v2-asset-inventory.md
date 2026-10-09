# Photography V2 — asset inventory

Audited: `photography-assets/` and `public/portfolio/approved/`. Date: 2026-10-10.

| file | category | permission | usable |
| --- | --- | --- | --- |
| *(none)* | — | missing `rights.txt` rows | no |

`public/portfolio/approved/manifest.json` is `{ "portfolio": [], "beforeAfter": [] }`. Folder contains no image files.

## Gate vs section 3 minimums

| required | have | met |
| --- | --- | --- |
| Hero landscape ≥2400px | 0 | no |
| Hero portrait crop for mobile | 0 | no |
| Portfolio 8 images, ≥2 per category (Food/Restaurant, Product, Lifestyle, Massage) | 0 | no |
| Before/After 2 verified pairs | 0 | no |
| Creative Process 4-step set from one real shoot | 0 | no |
| Each file in rights.txt with permission = yes | 0 | no |

## Exact missing-asset list

1. `hero-landscape.webp` — landscape ≥2400px, REAL PHOTO, own work or named shop with permission yes
2. `hero-portrait.webp` — portrait crop of the same shoot for mobile
3. Food/Restaurant portfolio ×2 (`food-01.webp`, `food-02.webp` or restaurant interiors)
4. Product portfolio ×2
5. Lifestyle portfolio ×2
6. Massage portfolio ×2
7. Before/After pair 1 (`ba-01-before.webp` + `ba-01-after.webp`, same subject)
8. Before/After pair 2
9. Creative process ×4 from one shoot: `process-01-real.webp`, `process-02-edit.webp`, `process-03-ai.webp` (label AI), `process-04-marketing.webp`

**Publishing decision:** minimums not met. Layout preview only (`npm run dev` or `/photography?layout=1` on preview hosts). Do not deploy as a sales page. Production domain must show the unpublished stub, never labelled empty slots.

Never fill gaps with stock, AI-as-real, or unverified client photos.

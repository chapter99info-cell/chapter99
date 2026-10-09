# Photography live check — 2026-10-10

URL: https://www.chapter99info.com/photography  
Source of truth on disk: `public/portfolio/approved/manifest.json` is empty (`portfolio: []`, `beforeAfter: []`).  
Live title: `Photography layout (not for sale) | Chapter99`. Page states it is **not a sales page**. No stock/AI portfolio images rendered (logo only).

**Needs owner approval to deploy** any of the branch SEO/nav changes below. This check did **not** deploy or push.

## Screenshots

- `docs/qa/photography-mobile-390.png`
- `docs/qa/photography-mobile-768.png`

## Findings

| Check | 390px | 768px |
|---|---|---|
| Horizontal scroll | No (`scrollWidth` = 390) | No (`scrollWidth` = 768) |
| Layout | Header gold CTA wraps into a tall stacked gold column next to logo; hero gold headline can feel cramped | Header OK; CTA sits beside logo |
| Text &lt; 16px | Yes — many 14px chips (`LAYOUT PREVIEW`, `REAL PHOTO`, slot captions) | Same chip style |
| Tap targets &lt; 44px | Logo ~40px tall; desktop nav anchors measure 0×0 (hidden) | Primary CTAs ≥ 44px |
| Broken images/videos | None. Only `/mockup/media/web/logo.webp`. No video. Empty portfolio slots (intentional) | Same |
| Console | No CDP error log captured; page loaded | Same |
| robots | **Missing on production** (no `<meta name="robots">`) | Same |

## Lighthouse mobile

Not run in this session (no Lighthouse CLI attached to the Cursor browser). Re-run locally if needed: `npx lighthouse https://www.chapter99info.com/photography --form-factor=mobile --only-categories=performance,accessibility,seo`.

## Business rule

Photography must not be a live sales page until approved REAL PHOTO exists in the manifest. **Live page already withholds sales** (layout + shot list). It is still **indexable** and linked from site nav/footer/sitemap.

### Branch-only changes (not deployed)

- Removed `/photography` from `SiteHeader` nav, `SiteLayout` solutions + footer, `Layout` footer.
- Added `noindex,nofollow` while `canPublishSalesPage` is false.
- Removed `/photography` from `public/sitemap.xml`.
- Route `/photography` still exists (direct URL works). `/` unchanged.

**Owner decision:** hide `/photography` in production until approved images exist? Recommend **yes** (nav + noindex). Do not go live until you say so.

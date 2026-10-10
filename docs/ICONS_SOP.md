# ICONS SOP — Chapter99 / Trip2Talk (read before using any icon)

> Audience: AI coding agents (Cursor, Claude Code, Codex). Read this file fully before adding, downloading, or changing any icon in any Chapter99, Trip2Talk, or client project.
> Owner: Saen (Chapter99). Last updated: 2026-10-10.

---

## 1. License status (facts — do not assume otherwise)

- Icons8 account: **free icon license only**. The paid plan on the account ("AI Light", AI tools only) does **NOT** include icons and is being cancelled (active until 2026-11-09).
- Therefore **every Icons8 icon = free PNG = attribution required**: a visible link `Icons by Icons8` → `https://icons8.com` on every site that uses them (footer is fine).
- Icons8 SVG downloads are **not available** on this account. Do not claim an icon is "paid / no attribution".
- Image editing (background removal, upscaling) is done in Photoshop — do not use Icons8 AI tools.

---

## 2. Which icon source to use (decision order)

Go down this list and stop at the first match:

| # | Source | When | Attribution |
|---|--------|------|-------------|
| 1 | **Master library** (section 4) | Icon already exists in the same style | Follow its row in `_license-log.csv` |
| 2 | **Lucide** (`lucide-react`) | **Default for client sites** (massage shops, restaurants) | None (ISC license) |
| 3 | **Tabler Icons** (`@tabler/icons-react`) | Lucide has no suitable icon | None (MIT) |
| 4 | **Icons8 via `icons8mcp`** (free PNG) | Chapter99's own sites (chapter99info.com, V7), or when 2–3 have nothing suitable | **Required** — footer link |
| 5 | **Brand logos** (WhatsApp, Facebook, Instagram, TikTok, YouTube, X, Gmail) | Social/contact links only | Use as-is, do not recolor or distort; trademark rules apply |

Rules:
- Never mix sources within one visible icon set (e.g. one services grid = one source, one style).
- Client sites should avoid Icons8 unless the owner approves the footer credit.

---

## 3. Design rules

- **One style per site** (e.g. all line, or all filled). Never mix line and filled in the same section.
- Audience includes older Thai shop owners and customers → icons must be bold and readable:
  - Minimum **40px on mobile**, 48px+ for primary feature tiles.
  - Line icons: stroke width **2 or more** (Lucide `strokeWidth={2.25}`). Prefer filled style if line looks thin.
  - Always pair an icon with a **text label** (Thai and/or English, 18px+). No icon-only buttons except universal ones (close, menu, phone).
- Color: icons follow brand tokens via `currentColor` (SVG) or a CSS tint; never hardcode random colors.
  - Chapter99 V7 Hybrid: navy `#0A0F1A`, gold `#E8B54A`, cream. Icons = gold on navy, or navy on cream.
  - Client sites: use the shop's primary/accent colors from its theme.
- Accessibility: decorative icons get `aria-hidden="true"`; meaningful icons get `aria-label` or adjacent visible text; PNG `<img>` needs `alt`.
- Do **not** display Icons8 IDs or file names in the UI (IDs live in data/metadata only).

---

## 4. Master icon library (save here every time)

Path (Windows):
```
E:\ALL AI work 2026\web Mock up 2026\chapter99 solutions 2026\Photos_ supabese\icon\
├── _license-log.csv
├── ios-filled\
├── ios-line\
├── color\
└── brands\
```

Every time an icon is downloaded from Icons8:
1. **Check the library first.** If the same icon + style exists, copy it from there — do not download again.
2. Save the new file into the correct style folder, kebab-case name without prefixes/sizes (e.g. `phone-call.png`, not `icons8-call-50.png`).
3. Append one row to `_license-log.csv`:
   ```
   name,icons8_id,style,format,size,date,license,project
   phone-call,9659,ios-filled,png,96,2026-10-10,free-attribution,chapter99-v7
   ```
4. Copy the file into the current project's `public/icons/<project-or-shop-id>/`.
5. Never hotlink `img.icons8.com` or any CDN icon URL.

Lucide/Tabler icons are npm packages — no need to save them to the library.

After adding icons to the master library, run `npm run backup:icons` (backup only; sites load icons from `public/icons` or npm packages). Never point a website at the Supabase `Photos/Icon/` backup.

---

## 5. Project file conventions

- Static icon files: `public/icons/<shop-id>/` (client) or `public/icons/v7/` (Chapter99 V7).
- Icon metadata: `src/data/<name>Icons.ts` (name, label TH/EN, source, icons8_id if any).
- Reusable component: `<Icon name="..." size={...} />` or `IconTile` (icon + label). Reuse existing ones before creating new components.
- Attribution: if any Icons8 icon is used, the footer must contain `Icons by Icons8` linking to `https://icons8.com`. Do not remove it while any Icons8 file is in use.
- Preview routes for testing (e.g. `/v7/icons-test`, `/icons-preview`) must not be linked from navigation in production.

---

## 6. Hard limits (never do)

- Do not touch booking logic, payments, POS, `src/api/`, middleware, or DB schema when working on icons.
- Do not change routes like `/` or switch homepages as part of an icon task.
- Do not commit or push to `main` without the owner's explicit OK; work on the current feature branch.
- Do not use copyrighted characters, mascots, or other companies' logos as decoration.
- Do not remove the Icons8 credit to "clean up" the footer.

---

## 7. Agent checklist (report this at the end of every icon task)

- [ ] Source chosen per section 2 (and why)
- [ ] Single consistent style; sizes ≥ 40px mobile; labels present
- [ ] Icons8 files saved to master library + logged in `_license-log.csv`
- [ ] Files copied to `public/icons/...`, no hotlinks
- [ ] Footer credit present if any Icons8 icon is used
- [ ] No IDs visible in UI; accessibility attributes set
- [ ] Nothing outside the icon scope changed; not pushed to `main`

Output format for the report: table of icons (name, source, style, file path, icons8_id or "-"), list of files created/changed, attribution status (required / not required).

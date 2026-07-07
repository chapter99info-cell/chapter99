# Supabase Storage Security Audit

**Date:** 2026-07-07  
**Auditor:** Cursor (The Builder)  
**Status:** REPORT ONLY — no policies applied  
**Source:** Agency infra audit v1.5 + live HTTP probes + codebase review

---

## Executive summary

Both Supabase projects have storage buckets configured as **PUBLIC** at the bucket level. Marketing assets (videos, logos, portfolio images) legitimately need public read access. Buckets used for **verification documents, deliverables, and join uploads** must be made **private** with RLS on `storage.objects` before any sensitive files are stored.

**Live verification:** `Chapter 99 web/Photos/Logo/Chapter99_st.png` returns **HTTP 200** without authentication on project `euiwkvozrhnbxtttfuchh` — confirms public bucket access.

---

## Project A: `chapter99info-cell's Project`

| Ref | `euiwkvozrhnbxtttfuchh` |
|-----|-------------------------|
| Used for | Client website assets, agency marketing media |

### Before / after table

| Bucket | Current | Recommended | Reason |
|--------|---------|-------------|--------|
| `Chapter 99 web` | **PUBLIC** | **PUBLIC** | Agency site videos, logos, OG images — hardcoded in `chapter99` repo (`/VDO/`, `/Photos/`) |
| `mira-assets` | **PUBLIC** | **PUBLIC** | Mira Thai Massage public website images |
| `sammythai_shop-004` | **PUBLIC** | **PUBLIC** | Client PWA marketing assets |
| `V2-master Thai massage 2026` | **PUBLIC** | **PUBLIC** | Master template / demo assets for public sites |
| `Jasmine Massage & Spa` | **PUBLIC** | **PUBLIC** | Client demo site assets |
| `koalawellness-demo` | **PUBLIC** | **PUBLIC** | Client demo site assets |
| `thai princess` | **PUBLIC** | **PUBLIC** | Client website assets (theprincessthaimassage.vercel.app) |
| `Zen Wave` | **PUBLIC** | **PUBLIC** | Client website assets |

### Open question (needs your decision)

Client buckets are **public by design** today because PWAs use `/storage/v1/object/public/...` URLs. If you later store **contracts, invoices, or receipts** in these buckets (per agency `Billing` data model), you should either:

1. Create a **separate private bucket** per client (e.g. `mira-documents`) — recommended, or  
2. Add **path-prefix RLS** (e.g. only `/public/*` is world-readable; `/private/*` requires auth)

**No bucket in Project A is named `profile-documents` / `deliverables` / `documents`** — those are on Project B.

---

## Project B: `chapter99-creator-network`

| Ref | `jjbwiriphyxsnrnpoqnn` |
|-----|------------------------|
| Used for | Creator Network marketplace PWA |
| Repo | `chapter99info-cell/chapter99-creator-network` |

### Before / after table

| Bucket | Current | Recommended | Reason |
|--------|---------|-------------|--------|
| `VDO` | **PUBLIC** | **PUBLIC** | Landing hero background video — intentional public marketing |
| `profile-photos` | **PUBLIC** (1 policy) | **PUBLIC** with RLS | Portfolio headshots shown on public photographer profiles — keep readable for verified profiles only |
| `profile-documents` | **PUBLIC** | **PRIVATE** | ABN, insurance, ID verification — sensitive |
| `deliverables` | **PUBLIC** | **PRIVATE** | Client photo deliverables — used in `UploadDeliverables.tsx` via `getPublicUrl()` |
| `documents` | **PUBLIC** | **PRIVATE** | Join flow uploads (`avatars/`, `insurance/` PDFs) — `app/api/join/upload/route.ts` |

---

## Proposed RLS changes (DO NOT APPLY YET)

Full SQL draft: [`proposed-storage-rls.sql`](./proposed-storage-rls.sql)

### Step 0 — Pre-flight (manual, in Dashboard)

1. Inventory files in `profile-documents`, `deliverables`, `documents` — note any URLs already shared with clients.
2. After making buckets private, **update app code** to use `createSignedUrl()` instead of `getPublicUrl()` for deliverables.
3. Apply changes in **staging** first; Creator Network repo will need a follow-up code branch.

### Summary of policy intent

| Bucket | Action | Who can read | Who can write |
|--------|--------|--------------|---------------|
| `profile-documents` | Set `public = false` | Authenticated owner + service role | Authenticated owner + service role |
| `deliverables` | Set `public = false` | Booking client, assigned photographer, admin | Photographer (assigned), service role |
| `documents` | Set `public = false` | File owner (path prefix), admin, service role | Authenticated upload via API (service role already used) |
| `profile-photos` | Keep public OR tighten | Public SELECT for `is_verified` profiles; owner write | Photographer owner |
| `VDO` | No change | Everyone | Service role / admin only |

---

## Cross-client isolation reminder

Agency rule: **no cross-client data**. Each client bucket in Project A is already namespaced by bucket name. When adding private document buckets, **never share one bucket across clients**.

---

## Next steps (awaiting Phee Saen approval)

1. [ ] Approve bucket classifications above  
2. [ ] Run file inventory in Supabase Dashboard → Storage  
3. [ ] Apply `proposed-storage-rls.sql` on **creator-network** project first  
4. [ ] Open follow-up branch on `chapter99-creator-network` to replace `getPublicUrl()` with signed URLs for `deliverables`  
5. [ ] Decide policy for future contract/invoice storage on Project A

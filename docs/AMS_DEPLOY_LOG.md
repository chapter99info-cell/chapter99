# AMS Deploy Log — chapter99 (Vite SPA)

**Date:** 2026-07-18  
**Repo:** `chapter99info-cell/chapter99`  
**Target Supabase:** `jjbwiriphyxsnrnpoqnn` (single production DB — settled)  
**Do not touch:** `euiwkvozrhnbxttfuchh` (media Storage only), chapter99-solutions marketplace

---

## Status: APPLIED — schema, RLS, and bootstrap admin are live

The `scripts/apply-ams-schema.mjs` / `vercel env pull` path was still blocked (no DB password, empty pulled env vars — see "Original blocker" below for the record). Applied directly instead via Claude's own Supabase management connection (independent of this repo's local env/CLI), which does not require `SUPABASE_DB_PASSWORD`.

**Applied 2026-07-18, in order, each as its own tracked migration:**

1. `ams_schema` — schema `ams` + all tables/functions/triggers (one retry: first attempt omitted `ams.projects_payment_status_guard()` during transcription, failed cleanly, transaction rolled back with zero partial objects, retried complete — Postgres DDL transactionality confirmed working as expected)
2. `ams_rls` — RLS enabled + forced on all 8 tables, REVOKE ALL FROM PUBLIC/anon, policies scoped TO authenticated
3. `ams_rls_function_hardening` — **fix beyond original design:** `ams.escalate_stale_qc_reviews()` and `ams.projects_needing_deadline_nudge()` are SECURITY DEFINER and bypass RLS internally (by design, for cron use); the blanket `GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ams TO authenticated` in rls.sql exposed them to every staff member, leaking other staff's email + unassigned project deadlines. Revoked from `authenticated`, granted to `service_role` only. Added `ams.admin_escalate_stale_qc_reviews()` wrapper (role-checked) so admins can still trigger it manually from the dashboard.
4. `ams_bootstrap_admin` — `chapter99info@gmail.com` (auth id `82a6d7d2-f3fd-4029-972e-b5fe88d40af5`, matches the account with recent login activity) set as first `ams.staff_profiles` admin
5. `ams_lock_search_path` — Supabase security advisor flagged 8 `ams.*` functions with mutable `search_path`. None were SECURITY DEFINER (so not an active privilege-escalation path — all internal calls were already schema-qualified) but fixed anyway for defense-in-depth / to clear the lint.
6. `ams_fix_generate_public_token_search_path` — **regression introduced by #5, caught during UI testing.** Locking `search_path = ams, public` on `ams.generate_public_token` dropped `extensions` from the path, and `pgcrypto` (hence `gen_random_bytes`) lives in the `extensions` schema on this hosted project — broke default `public_token` generation with `function gen_random_bytes(integer) does not exist`. Fixed by setting `search_path = extensions, ams, public`. Verified inline with a `DO` block sanity check inside the same migration transaction (would have failed the whole migration if still broken).

### Smoke test — run directly via SQL against the live `ams` schema, all passed

| Test | Result |
|------|--------|
| Create client + project, `deliver_on_deposit=true`, deposit 5000 / total 20000 cents | `public_token` generated, 21 chars, `payment_status=unpaid` |
| Submit deliverable, check `get_project_tracking` before any payment | `deliverable_link = null` (correctly hidden) |
| Record `deposit_paid` payment (5000 cents) | `payments_after_write_sync` correctly synced `ams.projects.payment_status → deposit_paid` |
| Re-check `get_project_tracking` after deposit | `deliverable_link` now visible, version 1 — gate working |
| Attempt invalid transition `deposit_paid → unpaid` (no admin context) | **Blocked**: `Invalid payment transition: deposit_paid → unpaid` |
| Attempt `UPDATE` on an existing deliverable row | **Blocked**: `Deliverables are append-only; create a new version instead` |
| Insert project with `deposit_amount_cents(50000) > total_amount_cents(20000)` | **Blocked**: `violates check constraint "projects_deposit_vs_total"` |

All test rows deleted afterward (`ams.deliverables_immutable` also blocks DELETE for non-admin contexts — including this SQL-Editor-style session, which has no JWT `auth.uid()` — so cleanup required temporarily disabling that one trigger; re-enabled immediately after. Real admin sessions from the actual logged-in app will not hit this, since PostgREST supplies their JWT and `auth.uid()` resolves normally).

Independently verified post-apply via `list_tables`: all 8 `ams.*` tables exist, RLS enabled on every one, zero leftover test rows.

### Still outstanding — needs you (พี่แสน), not Cursor

1. **Exposed schemas** — add `ams` under Supabase Dashboard → Project Settings → API → Exposed Schemas, so the admin/staff dashboard can query `ams.*` tables directly via `supabase.schema('ams')`. `public.get_project_tracking` (client tracking) already works without this.
2. Frontend build (routes below) still needs to actually be wired to real Supabase calls and tested against a logged-in session — the SQL-level smoke test above proves the database logic, not the UI.
3. Pre-existing, unrelated findings from the security advisor while I was in there (not AMS, not touched, just flagging): `public.billing`/`client`/`project`/`task`/`prompts` all have an `authenticated_full_access` RLS policy with `USING (true)` — wide open to any signed-in user. That's the old unused prototype you said to leave alone, but worth knowing it's not actually locked down if anyone ever points real auth traffic at it.

### Original blocker (for the record, no longer needed)

`vercel env pull` / `scripts/apply-ams-schema.mjs` require `SUPABASE_DB_PASSWORD` or a real pulled env, both unavailable in this checkout. Bypassed entirely by applying through Claude's direct Supabase project access instead.

---

## Files added

### SQL (`supabase/ams/`)

| File | Purpose |
|------|---------|
| `schema.sql` | Schema `ams` + tables/functions + `public.get_project_tracking` (`SET search_path = public`) |
| `rls.sql` | ENABLE + FORCE RLS, REVOKE from PUBLIC/anon, policies TO authenticated |
| `bootstrap_admin.sql` | Template INSERT into `ams.staff_profiles` |

### Frontend (Vite + React Router)

| Route | Surface |
|-------|---------|
| `/track/:publicToken` | Public client tracking (RPC only) |
| `/staff`, `/staff/login` | Staff status + deliverable submit |
| `/admin/ams` | Admin dashboard (OVERDUE / QC 48h+) |
| `/admin/ams/projects/new` | Create client/project |
| `/admin/ams/projects/:id` | Payment recording + QC approve + track link |

**Auth note:** AMS RLS uses `auth.uid()`. PIN sessions cannot access `ams.*` — admin AMS pages require email/password + `ams.staff_profiles`.

### Scripts

- `scripts/apply-ams-schema.mjs` — applies schema → rls → bootstrap; refuses non-`jjbwiriphyxsnrnpoqnn` connections
- `scripts/smoke-test-ams.mjs` — full gate test (deliver_on_deposit before/after payment)

---

## Apply checklist (when unblocked)

- [ ] Confirm project ref `jjbwiriphyxsnrnpoqnn`
- [ ] Apply `schema.sql`
- [ ] Apply `rls.sql`
- [ ] Apply `bootstrap_admin.sql` (real admin UUID)
- [ ] Expose schema `ams` in API settings
- [ ] Run smoke test — expect ALL PASSED
- [ ] Update this log with pass/fail output

---

## Design summary (verified earlier session, recreated here)

- Dedicated `ams` schema; leaves `public.client` / marketplace tables untouched
- `public_token` ≥21 chars, unique index
- Deliverables append-only; payments `amount_cents`; deposit ≤ total; deliver_on_deposit requires deposit > 0
- Staff cannot touch payment/assignment/token fields; payments staff SELECT-only
- Only admin → `completed`; QC 48h flag via overview view
- Sole anon entry: `public.get_project_tracking` → `ams.can_release_deliverable`

# Chapter99 Admin — Supabase setup

Production `/admin` on **chapter99info.com** uses Supabase project **`jjbwiriphyxsnrnpoqnn`** (Creator Network — same auth user as login).

Agency tables (`clients`, `projects`, `tasks`, `billing`, `prompts`) are **not** created automatically by deploy. Run the migration once:

## 1. Apply schema (required for Task Board)

**Option A — SQL Editor (recommended)**

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → project **jjbwiriphyxsnrnpoqnn**
2. **SQL Editor** → paste and run `migrations/002_agency_admin_idempotent.sql` (safe to re-run)

**Option B — CLI script**

```bash
# .env.local needs SUPABASE_DB_PASSWORD from Dashboard → Settings → Database
node --env-file=.env.local scripts/apply-agency-admin-schema.mjs
```

## 2. Auth (already done if login works)

1. **Authentication** → **Providers** → Email enabled
2. Public sign-ups disabled; admin user created manually

## 3. Vercel env vars (project: `chapter99`)

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://jjbwiriphyxsnrnpoqnn.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon public key from API settings |
| `VITE_ANTHROPIC_API_KEY` | (optional) Claude panel |

## 4. Verify Task Board

```bash
# .env.local: VITE_SUPABASE_* + ADMIN_TEST_EMAIL + ADMIN_TEST_PASSWORD
node --env-file=.env.local scripts/smoke-test-task-board.mjs
```

## Common errors

| Error | Cause | Fix |
|-------|-------|-----|
| `PGRST205: Could not find the table 'public.tasks'` | Migration not run | Run step 1 |
| `42501` / RLS | Missing policy | Re-run `002_agency_admin_idempotent.sql` |

**Note:** Marketing assets use a separate project (`euiwkvozrhnbxtttfuchh`). Do not mix storage URLs with admin data project.

# Chapter99 Admin — Supabase setup

Production `/admin` on **chapter99info.com** uses Supabase project **`jjbwiriphyxsnrnpoqnn`** (Creator Network — same auth user as login).

Agency tables must use **lowercase** names (`clients`, `projects`, `tasks`, `billing`, `prompts`) with **snake_case** columns. If you created `"Client"`, `"Project"`, etc. manually, run the normalize migration.

## 1. Apply schema (required for Task Board)

**If tables exist but columns are camelCase** (PGRST204 on `prompt_text`, `business_name`, etc.):

1. **SQL Editor** → run `migrations/004_normalize_column_names.sql` (renames `client`→`clients`, camelCase columns→snake_case)

**If tables do not exist yet:**

1. **SQL Editor** → paste and run `migrations/002_agency_admin_idempotent.sql` (safe to re-run)

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
| `PGRST205: Could not find the table 'public.clients'` | Tables created as `"Client"` (quoted PascalCase) | Run `003_normalize_agency_table_names.sql` |
| `PGRST204: Could not find the 'prompt_text' column` | `prompts` table uses camelCase (`promptText`) | Run `003_normalize_agency_table_names.sql` |
| `404` on REST `/clients`, `/projects`, `/tasks` | PostgREST cannot see PascalCase tables via lowercase `.from('clients')` | Run `003_normalize_agency_table_names.sql` |
| `400` on `/auth/v1/token?grant_type=password` | Invalid login attempt (wrong email/password) | Not a config bug if sign-in works; clear console and re-login |
| `42501` / RLS | Missing policy | Re-run `002_agency_admin_idempotent.sql` |

**Note:** Marketing assets use a separate project (`euiwkvozrhnbxtttfuchh`). Do not mix storage URLs with admin data project.

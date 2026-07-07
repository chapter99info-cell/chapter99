# Chapter99 Admin — Supabase setup

1. Open Supabase Dashboard → your project (recommend `chapter99info-cell's Project` or a dedicated agency project).
2. Go to **SQL Editor** → paste and run `migrations/001_agency_admin.sql`.
3. Go to **Authentication** → **Providers** → enable Email.
4. **Disable** public sign-ups: Authentication → Settings → turn off "Enable email signups" (invite-only / manual user creation).
5. Create admin user: Authentication → Users → **Add user** → email + password for Phee Saen.
6. Copy **Project URL** and **anon public** key from Settings → API.

## Vercel env vars (project: `chapter99` only)

| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | Project URL |
| `VITE_SUPABASE_ANON_KEY` | anon public key |
| `VITE_ANTHROPIC_API_KEY` | (optional) Anthropic API key for Claude panel |

Apply to **Preview** branches first; add to **Production** after QA on `chapter99info.com`.

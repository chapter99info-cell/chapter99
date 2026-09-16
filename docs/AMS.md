# Chapter99 Agency Management System (AMS)

Additive agency ops layer. **All AMS objects live in Postgres schema `ams`** so they never collide with marketplace / legacy `public` tables.

## Apply order — target `jjbwiriphyxsnrnpoqnn` only

1. `supabase/ams/schema.sql`
2. `supabase/ams/rls.sql`
3. `supabase/ams/bootstrap_admin.sql`

**Dashboard:** add `ams` to **Exposed schemas** (Project Settings → API) for admin/staff PostgREST access.

See `docs/AMS_DEPLOY_LOG.md` for apply status.

## Routes (Vite SPA)

| Path | Who |
|------|-----|
| `/track/:publicToken` | Public client (RPC only) |
| `/staff` | Staff field portal |
| `/admin/ams` | Admin dashboard |

## Security

| Actor | Access |
|-------|--------|
| Admin | Full CRUD; only role that can set `completed` |
| Staff | Assigned projects; append deliverables; payments SELECT only |
| Client | No Auth — `get_project_tracking(token)` only |

import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_PM_SUPABASE_URL
const anon = process.env.VITE_PM_SUPABASE_ANON_KEY
if (!url || !anon) {
  console.log(JSON.stringify({ ok: false, err: 'missing env' }))
  process.exit(1)
}

const headers = { apikey: anon, Authorization: 'Bearer ' + anon }
const openapi = await fetch(url + '/rest/v1/', { headers })
const text = await openapi.text()
const defs = [...text.matchAll(/"(pm_[a-z0-9_]+)"/gi)].map((m) => m[1])
const unique = [...new Set(defs)].sort()

const sb = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } })
const needs = await sb.rpc('pm_needs_owner')
const pkgs = await sb.from('pm_packages').select('id,name').limit(3)

console.log(
  JSON.stringify(
    {
      restStatus: openapi.status,
      pmObjectsInApi: unique,
      needsOwner: { data: needs.data, error: needs.error?.message ?? null },
      packages: { rows: pkgs.data ?? [], error: pkgs.error?.message ?? null },
    },
    null,
    2,
  ),
)

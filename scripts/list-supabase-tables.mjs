/**
 * List agency + marketplace tables in Supabase (REST probe).
 * Run: node --env-file=.env.local scripts/list-supabase-tables.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL?.trim() || process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  process.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

if (!url || !key) {
  console.error('Need VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (or service role)')
  process.exit(1)
}

const sb = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } })

const expectedByFrontend = ['clients', 'projects', 'tasks', 'billing', 'prompts']
const legacyNames = ['Client', 'client', 'Project', 'project', 'Task', 'task', 'Billing']
const existingMarketplace = ['bookings', 'photographers', 'reviews', 'disputes']

console.log('Project:', url)
console.log('\nFrontend expects (lowercase agency admin):')
for (const table of expectedByFrontend) {
  const { error } = await sb.from(table).select('id').limit(1)
  console.log(`  ${table.padEnd(12)} ${error ? `MISSING (${error.code})` : 'EXISTS'}`)
}

console.log('\nLegacy names (should be absent after 004 migration):')
for (const table of legacyNames) {
  const { error } = await sb.from(table).select('id').limit(1)
  console.log(`  ${table.padEnd(12)} ${error ? `gone (${error.code})` : 'STILL EXISTS — run 003 migration'}`)
}

console.log('\nCreator Network (already present):')
for (const table of existingMarketplace) {
  const { error } = await sb.from(table).select('id').limit(1)
  console.log(`  ${table.padEnd(12)} ${error ? `missing (${error.code})` : 'exists'}`)
}

/**
 * Apply agency admin tables to Supabase (Creator Network project).
 * Run: node --env-file=.env.local scripts/apply-agency-admin-schema.mjs
 *
 * Requires SUPABASE_DB_URL or SUPABASE_DB_PASSWORD (Settings → Database → connection string).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migration = process.env.AGENCY_MIGRATION?.trim() || '005_extend_project_billing_portal'
const sqlPath = path.join(__dirname, `../supabase/migrations/${migration}.sql`)

function getConnectionString() {
  if (process.env.SUPABASE_DB_URL?.trim()) return process.env.SUPABASE_DB_URL.trim()
  const password = process.env.SUPABASE_DB_PASSWORD?.trim()
  const ref = process.env.SUPABASE_PROJECT_REF?.trim() || 'jjbwiriphyxsnrnpoqnn'
  const region = process.env.SUPABASE_DB_REGION?.trim() || 'ap-northeast-2'
  if (!password) return null
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:6543/postgres`
}

const connectionString = getConnectionString()
if (!connectionString) {
  console.error('Missing SUPABASE_DB_URL or SUPABASE_DB_PASSWORD')
  console.error('Get the database password from Supabase Dashboard → Settings → Database')
  process.exit(1)
}

const sql = fs.readFileSync(sqlPath, 'utf8')
const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  if (!fs.existsSync(sqlPath)) {
    console.error(`Migration file not found: ${sqlPath}`)
    process.exit(1)
  }
  console.log(`Connected. Applying ${migration}.sql …`)
  await client.query(sql)
  console.log(`[ok] ${migration} applied`)
} catch (err) {
  console.error('[fail]', err instanceof Error ? err.message : err)
  process.exit(1)
} finally {
  await client.end()
}

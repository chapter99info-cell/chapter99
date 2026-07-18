/**
 * Apply AMS SQL to Supabase project jjbwiriphyxsnrnpoqnn only.
 * Order: schema.sql → rls.sql → bootstrap_admin.sql
 *
 * Run: node --env-file=.env.local scripts/apply-ams-schema.mjs
 * Requires SUPABASE_DB_URL or SUPABASE_DB_PASSWORD
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TARGET_REF = 'jjbwiriphyxsnrnpoqnn'

const files = ['schema.sql', 'rls.sql', 'bootstrap_admin.sql']

function getConnectionString() {
  if (process.env.SUPABASE_DB_URL?.trim()) return process.env.SUPABASE_DB_URL.trim()
  const password = process.env.SUPABASE_DB_PASSWORD?.trim()
  const ref = process.env.SUPABASE_PROJECT_REF?.trim() || TARGET_REF
  const region = process.env.SUPABASE_DB_REGION?.trim() || 'ap-northeast-2'
  if (!password) return null
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:6543/postgres`
}

const connectionString = getConnectionString()
if (!connectionString) {
  console.error('Missing SUPABASE_DB_URL or SUPABASE_DB_PASSWORD')
  console.error('Target project:', TARGET_REF)
  process.exit(1)
}

if (!connectionString.includes(TARGET_REF) && !process.env.SUPABASE_DB_URL?.includes(TARGET_REF)) {
  console.error('Refusing to apply: connection does not mention', TARGET_REF)
  process.exit(1)
}

console.log('Confirm target project ref:', TARGET_REF)

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  const { rows } = await client.query('select current_database() as db, current_user as usr')
  console.log('Connected:', rows[0])

  for (const file of files) {
    const sqlPath = path.join(__dirname, '../supabase/ams', file)
    if (!fs.existsSync(sqlPath)) {
      console.error(`[fail] missing ${sqlPath}`)
      process.exit(1)
    }
    const sql = fs.readFileSync(sqlPath, 'utf8')
    console.log(`Applying ${file} …`)
    await client.query(sql)
    console.log(`[ok] ${file}`)
  }

  console.log('AMS apply complete.')
} catch (err) {
  console.error('[fail]', err instanceof Error ? err.message : err)
  process.exit(1)
} finally {
  await client.end()
}

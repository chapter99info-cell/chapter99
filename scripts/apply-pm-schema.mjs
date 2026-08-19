/**
 * Apply Photo Manager schema to the ISOLATED photography Supabase project.
 * Run: node --env-file=.env.local scripts/apply-pm-schema.mjs
 *
 * Uses PM_SUPABASE_DB_URL or PM_SUPABASE_DB_PASSWORD — never the agency DB.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const sqlFiles = [
  path.join(__dirname, '../photo-manager/supabase/schema.sql'),
  path.join(__dirname, '../photo-manager/supabase/002_go_live.sql'),
  path.join(__dirname, '../photo-manager/supabase/003_brand_logos.sql'),
]
const pmUrl = (process.env.VITE_PM_SUPABASE_URL || '').trim()
const agencyUrl = (process.env.VITE_SUPABASE_URL || '').trim()

if (pmUrl && agencyUrl && pmUrl === agencyUrl) {
  console.error('Refusing to apply: VITE_PM_SUPABASE_URL matches the agency URL.')
  process.exit(1)
}

function getConnectionString() {
  if (process.env.PM_SUPABASE_DB_URL?.trim()) return process.env.PM_SUPABASE_DB_URL.trim()
  const password = process.env.PM_SUPABASE_DB_PASSWORD?.trim()
  const refFromUrl = pmUrl.match(/https:\/\/([a-z0-9]+)\.supabase\.co/i)?.[1]
  const ref = process.env.PM_SUPABASE_PROJECT_REF?.trim() || refFromUrl || ''
  const region = process.env.PM_SUPABASE_DB_REGION?.trim() || 'ap-southeast-2'
  if (!password || !ref) return null
  return `postgresql://postgres.${ref}:${encodeURIComponent(password)}@aws-0-${region}.pooler.supabase.com:6543/postgres`
}

const connectionString = getConnectionString()
if (!connectionString) {
  console.error('Missing PM_SUPABASE_DB_URL or PM_SUPABASE_DB_PASSWORD')
  console.error('Dashboard → Project auidjqalknebeqoxhwex → Settings → Database → Database password')
  process.exit(1)
}

if (connectionString.includes('jjbwiriphyxsnrnpoqnn') || connectionString.includes('ujlwrrzubwgvsiofuywa')) {
  console.error('Refusing to apply Photo Manager schema to an agency/massage project ref.')
  process.exit(1)
}

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } })

try {
  await client.connect()
  for (const sqlPath of sqlFiles) {
    const sql = fs.readFileSync(sqlPath, 'utf8')
    console.log('Applying', path.basename(sqlPath), '…')
    await client.query(sql)
    console.log('[ok]', path.basename(sqlPath))
  }
} catch (err) {
  console.error('[fail]', err instanceof Error ? err.message : err)
  process.exit(1)
} finally {
  await client.end()
}

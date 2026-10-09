/**
 * Backup-only: copy the master icon library to Supabase Storage.
 * Websites must NEVER load icons from this bucket — use public/icons or npm.
 *
 * Usage:
 *   node scripts/backup-icons.mjs --dry-run
 *   npm run backup:icons
 *
 * Reads ICONS_BACKUP_SUPABASE_URL and ICONS_BACKUP_SERVICE_KEY from .env.local.
 * Backup project: trtjcnpipsvaxwenjgva. Never reuse the site SUPABASE_* keys.
 * Never prints secrets.
 */
import { createClient } from '@supabase/supabase-js'
import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, extname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '..')
const LIBRARY =
  'E:\\ALL AI work 2026\\web Mock up 2026\\chapter99 solutions 2026\\Photos_ supabese\\icon'
const BUCKET = 'web solutions 2026'
const PREFIX = 'Photos/Icon'
const DRY = process.argv.includes('--dry-run')

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.csv': 'text/csv',
  '.md': 'text/markdown',
  '.txt': 'text/plain',
}

function parseEnvFile(text) {
  const out = {}
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

async function loadLocalEnv() {
  const candidates = [
    join(process.cwd(), '.env.local'),
    join(REPO_ROOT, '.env.local'),
    join('E:\\ALL AI work 2026\\Chapter 99 webNEW 2026', '.env.local'),
  ]
  for (const file of candidates) {
    try {
      const env = parseEnvFile(await readFile(file, 'utf8'))
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] == null) process.env[k] = v
      }
      return
    } catch {
      // try next path
    }
  }
}

async function walk(dir) {
  const files = []
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name.startsWith('.')) continue
      files.push(...(await walk(full)))
      continue
    }
    if (entry.name.startsWith('.') && entry.name !== '.gitkeep') continue
    files.push(full)
  }
  return files
}

async function listRemoteSizes(supabase, prefix) {
  const sizes = new Map()
  const queue = [prefix]
  while (queue.length) {
    const folder = queue.shift()
    let offset = 0
    for (;;) {
      const { data, error } = await supabase.storage.from(BUCKET).list(folder, {
        limit: 1000,
        offset,
        sortBy: { column: 'name', order: 'asc' },
      })
      if (error) throw new Error(`list ${folder}: ${error.message}`)
      if (!data?.length) break
      for (const item of data) {
        const path = folder ? `${folder}/${item.name}` : item.name
        const isFile = item.metadata && typeof item.metadata.size === 'number'
        if (isFile) sizes.set(path, item.metadata.size)
        else queue.push(path)
      }
      if (data.length < 1000) break
      offset += data.length
    }
  }
  return sizes
}

function remotePath(localFile) {
  const rel = relative(LIBRARY, localFile).replaceAll('\\', '/')
  return `${PREFIX}/${rel}`
}

await loadLocalEnv()

const url = process.env.ICONS_BACKUP_SUPABASE_URL
const key = process.env.ICONS_BACKUP_SERVICE_KEY
if (!url || !key) {
  console.error('Missing ICONS_BACKUP_SUPABASE_URL or ICONS_BACKUP_SERVICE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const locals = (await walk(LIBRARY)).sort()
const remote = DRY ? new Map() : await listRemoteSizes(supabase, PREFIX)

let uploaded = 0
let skipped = 0
let failed = 0
const planned = []

for (const file of locals) {
  const dest = remotePath(file)
  const bytes = (await stat(file)).size
  if (!DRY && remote.get(dest) === bytes) {
    skipped += 1
    continue
  }
  planned.push(`${dest} (${bytes} bytes)`)
  if (DRY) {
    uploaded += 1
    continue
  }
  const type = MIME[extname(file).toLowerCase()] || 'application/octet-stream'
  const body = await readFile(file)
  const { error } = await supabase.storage.from(BUCKET).upload(dest, body, {
    upsert: true,
    contentType: type,
  })
  if (error) {
    failed += 1
    console.error(`fail ${dest}: ${error.message}`)
  } else {
    uploaded += 1
  }
}

if (DRY) {
  console.log('dry-run — would upload:')
  for (const line of planned) console.log(`  ${line}`)
}

console.log(
  JSON.stringify({
    mode: DRY ? 'dry-run' : 'upload',
    uploaded,
    skipped,
    failed,
    libraryFiles: locals.length,
  }),
)

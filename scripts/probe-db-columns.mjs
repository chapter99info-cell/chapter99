/**
 * Probe live PostgREST schema for agency tables (camelCase vs snake_case).
 * Run: node scripts/probe-db-columns.mjs
 * Needs VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in env.
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL?.trim()
const key = process.env.VITE_SUPABASE_ANON_KEY?.trim()
if (!url || !key) {
  console.error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
  process.exit(1)
}

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

const tableVariants = {
  clients: ['clients', 'client', 'Client'],
  projects: ['projects', 'project', 'Project'],
  tasks: ['tasks', 'task', 'Task'],
  billing: ['billing', 'Billing'],
  prompts: ['prompts'],
}

async function resolveTable(names) {
  for (const name of names) {
    const { error } = await sb.from(name).select('id').limit(1)
    if (!error || error.code !== 'PGRST205') return name
  }
  return null
}

async function probeColumn(table, snake, camel) {
  const payload = { [snake]: snake === 'prompt_text' ? 'x' : snake === 'business_name' ? 'x' : undefined }
  // minimal unique payloads per table tested separately below
  const { error: snakeErr } = await sb.from(table).insert({ __probe_snake__: true, [snake]: 'x' })
  const snakeMissing = snakeErr?.code === 'PGRST204' && snakeErr.message.includes(`'${snake}'`)
  const { error: camelErr } = await sb.from(table).insert({ __probe_camel__: true, [camel]: 'x' })
  const camelMissing = camelErr?.code === 'PGRST204' && camelErr.message.includes(`'${camel}'`)

  if (!snakeMissing && snakeErr?.code !== 'PGRST204') {
    return { exists: snake, note: snakeErr?.code ?? 'ok-ish' }
  }
  if (!camelMissing && camelErr?.code !== 'PGRST204') {
    return { exists: camel, note: camelErr?.code ?? 'ok-ish' }
  }
  if (snakeMissing && !camelMissing) return { exists: camel, note: 'snake missing' }
  if (!snakeMissing && camelMissing) return { exists: snake, note: 'camel missing' }
  return { exists: '?', note: `snake:${snakeErr?.message}; camel:${camelErr?.message}` }
}

const columnPairs = {
  clients: [
    ['business_name', 'businessName'],
    ['contact_name', 'contactName'],
    ['created_at', 'createdAt'],
  ],
  projects: [
    ['client_id', 'clientId'],
    ['project_type', 'projectType'],
    ['drive_folder_url', 'driveFolderUrl'],
    ['contract_url', 'contractUrl'],
    ['created_at', 'createdAt'],
    ['updated_at', 'updatedAt'],
  ],
  tasks: [
    ['project_id', 'projectId'],
    ['department_id', 'departmentId'],
    ['prompt_or_spec', 'promptOrSpec'],
    ['created_at', 'createdAt'],
    ['updated_at', 'updatedAt'],
  ],
  billing: [
    ['project_id', 'projectId'],
    ['total_amount', 'totalAmount'],
    ['deposit_paid', 'depositPaid'],
    ['final_paid', 'finalPaid'],
    ['quotation_url', 'quotationUrl'],
    ['invoice_url', 'invoiceUrl'],
    ['receipt_url', 'receiptUrl'],
    ['created_at', 'createdAt'],
  ],
  prompts: [
    ['prompt_text', 'promptText'],
    ['created_at', 'createdAt'],
    ['updated_at', 'updatedAt'],
  ],
}

console.log('Project:', url)
for (const [logical, variants] of Object.entries(tableVariants)) {
  const table = await resolveTable(variants)
  console.log(`\n${logical}: table=${table ?? 'NOT FOUND'}`)
  if (!table) continue
  for (const [snake, camel] of columnPairs[logical]) {
    const { error: e1 } = await sb.from(table).select(snake).limit(0)
    const { error: e2 } = await sb.from(table).select(camel).limit(0)
    const snakeOk = !e1 || e1.code !== 'PGRST204'
    const camelOk = !e2 || e2.code !== 'PGRST204'
    let dbCol = '?'
    if (snakeOk && !camelOk) dbCol = snake
    else if (camelOk && !snakeOk) dbCol = camel
    else if (snakeOk && camelOk) dbCol = 'both?'
    else dbCol = 'neither'
    console.log(`  ${snake.padEnd(22)} db has: ${dbCol}`)
  }
}

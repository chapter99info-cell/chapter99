/**
 * Audit agency table columns via PostgREST (no DB password needed).
 * Run: node scripts/audit-schema-columns.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL?.trim() || 'https://jjbwiriphyxsnrnpoqnn.supabase.co'
const key =
  process.env.VITE_SUPABASE_ANON_KEY?.trim() ||
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYndpcmlwaHl4c25ybnBvcW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNDM3NDQsImV4cCI6MjA5NzkxOTc0NH0.CoZfNEjfUuLxHxHVnb5K77TMe9cZ9J8aQDGXDeV83z0'

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })

const CANDIDATES = {
  client: [
    'id', 'business_name', 'businessName', 'contact_name', 'contactName', 'email', 'phone',
    'created_at', 'createdAt', 'updated_at', 'updatedAt',
  ],
  project: [
    'id', 'client_id', 'clientId', 'project_type', 'projectType', 'status',
    'drive_folder_url', 'driveFolderUrl', 'contract_url', 'contractUrl',
    'live_web_url', 'liveWebUrl', 'gallery_url', 'galleryUrl',
    'google_maps_embed_url', 'googleMapsEmbedUrl', 'google_review_link', 'googleReviewLink',
    'facebook_url', 'facebookUrl', 'line_oa_url', 'lineOaUrl',
    'project_spec', 'projectSpec', 'created_at', 'createdAt', 'updated_at', 'updatedAt',
  ],
  task: [
    'id', 'project_id', 'projectId', 'department_id', 'departmentId',
    'assignee', 'status', 'title', 'prompt_or_spec', 'promptOrSpec', 'notes',
    'created_at', 'createdAt', 'updated_at', 'updatedAt',
  ],
  billing: [
    'id', 'project_id', 'projectId', 'total_amount', 'totalAmount',
    'total_amount_aud', 'totalAmountAud', 'gst_amount_aud', 'gstAmountAud',
    'payment_received_date', 'paymentReceivedDate',
    'deposit_paid', 'depositPaid', 'final_paid', 'finalPaid',
    'quotation_url', 'quotationUrl', 'invoice_url', 'invoiceUrl', 'receipt_url', 'receiptUrl',
    'created_at', 'createdAt',
  ],
  prompts: [
    'id', 'agent', 'department', 'prompt_text', 'promptText',
    'created_at', 'createdAt', 'updated_at', 'updatedAt',
  ],
}

function isSnakeCase(name) {
  return /^[a-z][a-z0-9_]*$/.test(name) && !/[A-Z]/.test(name)
}

async function probeColumn(table, col) {
  const { error } = await sb.from(table).select(col).limit(0)
  if (!error) return 'exists'
  if (error.code === '42703' || error.code === 'PGRST204') return 'missing'
  if (error.code === 'PGRST205') return 'table_missing'
  return `err:${error.code}`
}

const results = {}

for (const [table, cols] of Object.entries(CANDIDATES)) {
  const existing = []
  const missing = []
  for (const col of cols) {
    const r = await probeColumn(table, col)
    if (r === 'exists') existing.push(col)
    else if (r === 'missing') missing.push(col)
    else if (r === 'table_missing') {
      console.error(`Table ${table} not found`)
      break
    }
  }
  results[table] = { existing, missing }
}

console.log('\n=== COLUMN AUDIT ===\n')
for (const [table, { existing }] of Object.entries(results)) {
  const bad = existing.filter((c) => !isSnakeCase(c))
  const good = existing.filter((c) => isSnakeCase(c))
  console.log(`## ${table}`)
  console.log('  snake_case:', good.join(', ') || '(none)')
  if (bad.length) console.log('  NON-SNAKE:', bad.join(', '))
  console.log('')
}

// Also try select * for one row
for (const table of Object.keys(CANDIDATES)) {
  const { data, error } = await sb.from(table).select('*').limit(1)
  if (!error && data?.[0]) {
    console.log(`${table} sample keys:`, Object.keys(data[0]).join(', '))
  }
}

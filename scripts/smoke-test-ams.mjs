/**
 * AMS end-to-end smoke test against jjbwiriphyxsnrnpoqnn.
 *
 * Flow: client → project (deliver_on_deposit) → staff assign → deliverable →
 * deposit payment → get_project_tracking gate before/after → admin completed.
 *
 * Run: node --env-file=.env.local scripts/smoke-test-ams.mjs
 *
 * Requires:
 *   VITE_SUPABASE_URL or SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY
 *   SUPABASE_SERVICE_ROLE_KEY
 *   SUPABASE_DB_URL or SUPABASE_DB_PASSWORD (for direct SQL cleanup / escalate check)
 */
import { createClient } from '@supabase/supabase-js'

const TARGET_REF = 'jjbwiriphyxsnrnpoqnn'
const url = (process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '').trim()
const anon = (process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim()
const service = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

const results = []

function log(step, ok, detail = '') {
  const line = `${ok ? 'PASS' : 'FAIL'} | ${step}${detail ? ` — ${detail}` : ''}`
  results.push(line)
  console.log(line)
}

if (!url.includes(TARGET_REF)) {
  console.error('URL must be project', TARGET_REF, 'got', url || '(empty)')
  process.exit(1)
}
if (!anon || !service) {
  console.error('Need anon + service role keys')
  process.exit(1)
}

const admin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const anonClient = createClient(url, anon, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const stamp = Date.now()
const adminEmail = `ams-smoke-admin-${stamp}@example.com`
const staffEmail = `ams-smoke-staff-${stamp}@example.com`
const password = `SmokeTest!${stamp}Aa`

let adminUserId
let staffUserId
let clientId
let projectId
let publicToken
let deliverableId

try {
  console.log('Target:', TARGET_REF)

  // Create auth users
  const { data: adminUser, error: adminErr } = await admin.auth.admin.createUser({
    email: adminEmail,
    password,
    email_confirm: true,
  })
  assert(!adminErr && adminUser.user, `create admin user: ${adminErr?.message}`)
  adminUserId = adminUser.user.id
  log('create admin auth user', true, adminUserId)

  const { data: staffUser, error: staffErr } = await admin.auth.admin.createUser({
    email: staffEmail,
    password,
    email_confirm: true,
  })
  assert(!staffErr && staffUser.user, `create staff user: ${staffErr?.message}`)
  staffUserId = staffUser.user.id
  log('create staff auth user', true, staffUserId)

  // Bootstrap staff_profiles via service role (bypasses RLS)
  const { error: profErr } = await admin.schema('ams').from('staff_profiles').upsert([
    {
      id: adminUserId,
      full_name: 'Smoke Admin',
      email: adminEmail,
      role: 'admin',
      is_active: true,
    },
    {
      id: staffUserId,
      full_name: 'Smoke Staff',
      email: staffEmail,
      role: 'staff',
      is_active: true,
    },
  ])
  assert(!profErr, `staff_profiles upsert: ${profErr?.message}`)
  log('bootstrap staff_profiles', true)

  // Sign in as admin
  const adminSession = createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error: adminLoginErr } = await adminSession.auth.signInWithPassword({
    email: adminEmail,
    password,
  })
  assert(!adminLoginErr, `admin login: ${adminLoginErr?.message}`)
  const amsAdmin = adminSession.schema('ams')

  // Create client
  const { data: client, error: clientErr } = await amsAdmin
    .from('clients')
    .insert({
      contact_name: `Smoke Client ${stamp}`,
      email: `client-${stamp}@example.com`,
      client_type: 'individual',
      created_by: adminUserId,
    })
    .select('*')
    .single()
  assert(!clientErr && client, `create client: ${clientErr?.message}`)
  clientId = client.id
  log('create client', true, clientId)

  // Create project with deliver_on_deposit
  const { data: project, error: projErr } = await amsAdmin
    .from('projects')
    .insert({
      title: `Smoke Project ${stamp}`,
      client_id: clientId,
      staff_id: staffUserId,
      service_type: 'photography',
      deliver_on_deposit: true,
      deposit_amount_cents: 50000,
      total_amount_cents: 200000,
      status: 'capturing',
      payment_status: 'unpaid',
      created_by: adminUserId,
    })
    .select('*')
    .single()
  assert(!projErr && project, `create project: ${projErr?.message}`)
  projectId = project.id
  publicToken = project.public_token
  assert(publicToken && publicToken.length >= 21, 'public_token too short')
  log('create project + assign staff', true, `token len=${publicToken.length}`)

  // Staff submits deliverable
  const staffSession = createClient(url, anon, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { error: staffLoginErr } = await staffSession.auth.signInWithPassword({
    email: staffEmail,
    password,
  })
  assert(!staffLoginErr, `staff login: ${staffLoginErr?.message}`)

  const { data: delivId, error: delivErr } = await staffSession.schema('ams').rpc('submit_deliverable', {
    p_project_id: projectId,
    p_link: 'https://example.com/delivery/smoke-v1',
    p_notes: 'smoke deliverable',
    p_mark_ready: true,
  })
  assert(!delivErr && delivId, `submit deliverable: ${delivErr?.message}`)
  deliverableId = delivId
  log('staff submit deliverable + ready_for_review', true, String(deliverableId))

  // Tracking BEFORE payment — link must be null
  const { data: beforePay, error: beforeErr } = await anonClient.rpc('get_project_tracking', {
    p_token: publicToken,
  })
  assert(!beforeErr, `tracking before: ${beforeErr?.message}`)
  const beforeRow = Array.isArray(beforePay) ? beforePay[0] : beforePay
  assert(beforeRow, 'tracking before: empty')
  assert(
    beforeRow.deliverable_link == null,
    `expected null link before payment, got ${beforeRow.deliverable_link}`
  )
  log('get_project_tracking gates link before payment', true, beforeRow.payment_status)

  // Admin records deposit
  const { error: payErr } = await amsAdmin.from('payments').insert({
    project_id: projectId,
    amount_cents: 50000,
    status: 'deposit_paid',
    method: 'transfer',
    recorded_by: adminUserId,
  })
  assert(!payErr, `record deposit: ${payErr?.message}`)
  log('admin record deposit_paid', true)

  // Tracking AFTER deposit — link must be present (deliver_on_deposit)
  const { data: afterPay, error: afterErr } = await anonClient.rpc('get_project_tracking', {
    p_token: publicToken,
  })
  assert(!afterErr, `tracking after: ${afterErr?.message}`)
  const afterRow = Array.isArray(afterPay) ? afterPay[0] : afterPay
  assert(afterRow?.deliverable_link === 'https://example.com/delivery/smoke-v1', 'link not released after deposit')
  assert(afterRow.payment_status === 'deposit_paid', 'payment_status not synced')
  log('get_project_tracking releases link after deposit', true)

  // Reject short token
  const { data: shortData } = await anonClient.rpc('get_project_tracking', { p_token: 'tooshort' })
  const shortRow = Array.isArray(shortData) ? shortData[0] : shortData
  assert(!shortRow, 'short token should return empty')
  log('reject token <21 chars', true)

  // Admin marks completed
  const { error: doneErr } = await amsAdmin
    .from('projects')
    .update({ status: 'completed' })
    .eq('id', projectId)
  assert(!doneErr, `mark completed: ${doneErr?.message}`)
  log('admin mark completed', true)

  // Staff cannot mark completed (new project)
  const { data: p2, error: p2Err } = await amsAdmin
    .from('projects')
    .insert({
      title: `Smoke Gate ${stamp}`,
      client_id: clientId,
      staff_id: staffUserId,
      deposit_amount_cents: 1000,
      deliver_on_deposit: true,
      created_by: adminUserId,
    })
    .select('id')
    .single()
  assert(!p2Err && p2, `second project: ${p2Err?.message}`)

  const { error: staffCompleteErr } = await staffSession
    .schema('ams')
    .from('projects')
    .update({ status: 'completed' })
    .eq('id', p2.id)
  assert(staffCompleteErr, 'staff should NOT be able to mark completed')
  log('staff blocked from completed (quality gate)', true, staffCompleteErr.message)

  console.log('\n=== SMOKE SUMMARY ===')
  results.forEach((r) => console.log(r))
  console.log('ALL PASSED')
} catch (err) {
  log('ABORT', false, err instanceof Error ? err.message : String(err))
  console.error(err)
  process.exitCode = 1
} finally {
  // Cleanup smoke users/data via service role
  try {
    if (projectId) {
      await admin.schema('ams').from('projects').delete().eq('id', projectId)
    }
    if (clientId) {
      await admin.schema('ams').from('clients').delete().eq('id', clientId)
    }
    // delete leftover second project by title pattern
    await admin.schema('ams').from('projects').delete().ilike('title', `Smoke%${stamp}%`)
    if (adminUserId) await admin.auth.admin.deleteUser(adminUserId)
    if (staffUserId) await admin.auth.admin.deleteUser(staffUserId)
    if (adminUserId) await admin.schema('ams').from('staff_profiles').delete().eq('id', adminUserId)
    if (staffUserId) await admin.schema('ams').from('staff_profiles').delete().eq('id', staffUserId)
    console.log('Cleanup done')
  } catch (cleanupErr) {
    console.warn('Cleanup warning:', cleanupErr instanceof Error ? cleanupErr.message : cleanupErr)
  }
}

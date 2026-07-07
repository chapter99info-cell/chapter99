/**
 * Smoke test: sign in + list/create/delete a task.
 * Run: node --env-file=.env.local scripts/smoke-test-task-board.mjs
 */
import { createClient } from '@supabase/supabase-js'

const url = process.env.VITE_SUPABASE_URL?.trim()
const anonKey = process.env.VITE_SUPABASE_ANON_KEY?.trim()
const email = process.env.ADMIN_TEST_EMAIL?.trim()
const password = process.env.ADMIN_TEST_PASSWORD?.trim()

if (!url || !anonKey || !email || !password) {
  console.error('Need VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, ADMIN_TEST_EMAIL, ADMIN_TEST_PASSWORD')
  process.exit(1)
}

const sb = createClient(url, anonKey)

const { error: signInErr } = await sb.auth.signInWithPassword({ email, password })
if (signInErr) {
  console.error('[fail] sign in:', signInErr.message)
  process.exit(1)
}
console.log('[ok] signed in')

for (const table of ['clients', 'projects', 'tasks', 'billing', 'prompts']) {
  const { error } = await sb.from(table).select('id').limit(1)
  if (error) {
    console.error(`[fail] ${table}:`, error.code, error.message)
    process.exit(1)
  }
  console.log(`[ok] ${table} readable`)
}

let projectId
const { data: projects } = await sb.from('projects').select('id').limit(1)
if (projects?.[0]?.id) {
  projectId = projects[0].id
} else {
  const { data: client, error: cErr } = await sb
    .from('clients')
    .insert({
      business_name: 'Smoke Test',
      contact_name: 'QA',
      email: 'qa@chapter99info.com',
      phone: '',
    })
    .select()
    .single()
  if (cErr) {
    console.error('[fail] create client:', cErr.message)
    process.exit(1)
  }
  const { data: project, error: pErr } = await sb
    .from('projects')
    .insert({
      client_id: client.id,
      project_type: 'FULL_SERVICE',
      status: 'IN_PROGRESS',
      drive_folder_url: '',
      contract_url: '',
    })
    .select()
    .single()
  if (pErr) {
    console.error('[fail] create project:', pErr.message)
    process.exit(1)
  }
  projectId = project.id
}

const title = `Smoke test ${Date.now()}`
const { data: task, error: tErr } = await sb
  .from('tasks')
  .insert({
    project_id: projectId,
    department_id: 1,
    assignee: 'CLAUDE',
    status: 'TODO',
    title,
    prompt_or_spec: '',
    notes: '',
  })
  .select()
  .single()
if (tErr) {
  console.error('[fail] create task:', tErr.message)
  process.exit(1)
}
console.log('[ok] created task:', task.id)

const { data: listed, error: lErr } = await sb.from('tasks').select('id,title').eq('id', task.id)
if (lErr || !listed?.length) {
  console.error('[fail] list task:', lErr?.message ?? 'not found')
  process.exit(1)
}
console.log('[ok] task listed:', listed[0].title)

await sb.from('tasks').delete().eq('id', task.id)
console.log('[ok] task deleted — smoke test passed')

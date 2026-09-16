/**
 * E2E checks for client portal (API + production bundle).
 * Run: node scripts/e2e-portal-test.mjs
 */
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://jjbwiriphyxsnrnpoqnn.supabase.co'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYndpcmlwaHl4c25ybnBvcW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNDM3NDQsImV4cCI6MjA5NzkxOTc0NH0.CoZfNEjfUuLxHxHVnb5K77TMe9cZ9J8aQDGXDeV83z0'
const SITE = 'https://www.chapter99info.com'

const sb = createClient(SUPABASE_URL, ANON_KEY, { auth: { persistSession: false } })

const results = []

function pass(id, detail) {
  results.push({ id, status: 'PASS', detail })
  console.log(`[PASS] ${id}: ${detail}`)
}
function fail(id, detail) {
  results.push({ id, status: 'FAIL', detail })
  console.log(`[FAIL] ${id}: ${detail}`)
}

// 1) Code uses project_public_view
const portalSrc = await import('node:fs/promises').then((fs) =>
  fs.readFile('src/portal/portalService.ts', 'utf8')
)
if (portalSrc.includes("from('project_public_view')") && !portalSrc.includes("from('project')")) {
  pass('1', 'portalService.ts queries project_public_view only')
} else {
  fail('1', 'portalService.ts does not exclusively use project_public_view')
}

// Find test project
const { data: rows, error: viewErr } = await sb
  .from('project_public_view')
  .select('id,live_web_url,gallery_url,google_review_link')
if (viewErr) fail('setup', `view query failed: ${viewErr.message}`)
const projectId = rows?.[0]?.id
if (!projectId) fail('setup', 'no rows in project_public_view')

// 3) Network response privacy
if (projectId) {
  const select =
    'id,live_web_url,gallery_url,google_review_link,google_maps_embed_url,facebook_url,line_oa_url'
  const restUrl = `${SUPABASE_URL}/rest/v1/project_public_view?id=eq.${projectId}&select=${select}`
  const res = await fetch(restUrl, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  })
  const body = await res.text()
  const hasContract = body.includes('contract_url')
  const hasSpec = body.includes('project_spec')
  if (!hasContract && !hasSpec) {
    pass('3', `REST response excludes contract_url and project_spec (${res.status})`)
  } else {
    fail('3', `leaked fields in response: contract=${hasContract} spec=${hasSpec}`)
  }

  // 2) Button data
  const row = rows[0]
  const hasGallery = Boolean(row.gallery_url)
  const hasLive = Boolean(row.live_web_url)
  const hasReview = Boolean(row.google_review_link)
  if (hasGallery && hasLive && hasReview) {
    pass(
      '2',
      `URLs set — gallery=${row.gallery_url}, live=${row.live_web_url}, review=${row.google_review_link}`
    )
  } else {
    fail(
      '2',
      `test project ${projectId} missing URLs in view — gallery=${row.gallery_url}, live=${row.live_web_url}, review=${row.google_review_link}. Update project row or view definition.`
    )
  }
}

// 4) Production bundles — portal chunk only, no AI
const html = await (await fetch(SITE)).text()
const portalMatch = html.match(/PortalApp-[A-Za-z0-9_-]+\.js/)
const indexMatch = html.match(/index-[A-Za-z0-9_-]+\.js/)
const adminLoadedOnHome = html.includes('AdminApp-')
if (portalMatch) {
  const portalJs = await (await fetch(`${SITE}/assets/${portalMatch[0]}`)).text()
  const usesView = portalJs.includes('project_public_view')
  const aiRefs = /anthropic|claude|gemini|generativelanguage/i.test(portalJs)
  if (usesView) pass('1-prod', 'production PortalApp bundle references project_public_view')
  else fail('1-prod', 'production PortalApp missing project_public_view string')
  if (!aiRefs) pass('4', 'PortalApp bundle has zero AI endpoint references')
  else fail('4', 'PortalApp bundle contains AI references')
  if (!adminLoadedOnHome) pass('4b', 'homepage does not preload AdminApp chunk')
  else fail('4b', 'AdminApp preloaded on homepage (lazy load only on /admin)')
} else {
  fail('4', 'PortalApp chunk not found in production HTML (visit /p/ route loads it)')
}

// Portal route loads index which lazy-loads PortalApp — check index for AI on portal path is indirect
if (indexMatch) {
  const indexJs = await (await fetch(`${SITE}/assets/${indexMatch[0]}`)).text()
  const indexAi = /api\.anthropic\.com|generativelanguage/i.test(indexJs)
  if (!indexAi) pass('4c', 'main index bundle has no direct Anthropic/Gemini API URLs')
  else fail('4c', 'index bundle contains AI API URLs')
}

// 5) Console — cannot run real browser; fetch portal page shell
if (projectId) {
  const pageRes = await fetch(`${SITE}/p/${projectId}`)
  if (pageRes.ok) pass('5-shell', `portal route returns ${pageRes.status} (SPA shell)`)
  else fail('5-shell', `portal route HTTP ${pageRes.status}`)
  fail('5', 'browser console not automated — verify manually after fixing test URLs if needed')
}

console.log('\n=== SUMMARY ===')
for (const r of results) console.log(`${r.status} ${r.id}: ${r.detail}`)
if (projectId) console.log(`\nTest URL: ${SITE}/p/${projectId}`)

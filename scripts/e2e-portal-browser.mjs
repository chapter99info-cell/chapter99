/**
 * Playwright E2E for client portal — run: node scripts/e2e-portal-browser.mjs
 */
import { chromium, devices } from 'playwright'

const SITE = process.env.PORTAL_TEST_URL || 'https://www.chapter99info.com'
const PROJECT_ID =
  process.env.PORTAL_TEST_PROJECT_ID || '5073961b-b869-45a0-948c-e27fbda16867'
const URL = `${SITE}/p/${PROJECT_ID}`

const results = []
const pass = (id, d) => {
  results.push({ id, status: 'PASS', detail: d })
  console.log(`[PASS] ${id}: ${d}`)
}
const fail = (id, d) => {
  results.push({ id, status: 'FAIL', detail: d })
  console.log(`[FAIL] ${id}: ${d}`)
}

const browser = await chromium.launch({ headless: true })
const contexts = [
  { label: 'desktop', ctx: await browser.newContext({ viewport: { width: 1280, height: 800 } }) },
  {
    label: 'mobile',
    ctx: await browser.newContext({ ...devices['iPhone 13'] }),
  },
]

const aiPatterns = [/api\.anthropic\.com/i, /generativelanguage\.googleapis\.com/i, /gemini/i]
const supabaseResponses = []

for (const { label, ctx } of contexts) {
  const page = await ctx.newPage()
  const consoleErrors = []
  const failedRequests = []
  const aiCalls = []
  const loadedScripts = []

  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('requestfailed', (req) => failedRequests.push(`${req.method()} ${req.url()} — ${req.failure()?.errorText}`))
  page.on('request', (req) => {
    const u = req.url()
    if (aiPatterns.some((p) => p.test(u))) aiCalls.push(u)
  })
  page.on('response', async (res) => {
    const u = res.url()
    if (u.includes('project_public_view') || u.includes('/rest/v1/project')) {
      const body = await res.text().catch(() => '')
      supabaseResponses.push({ url: u, status: res.status(), body })
    }
  })
  page.on('response', (res) => {
    if (res.request().resourceType() === 'script') loadedScripts.push(res.url())
  })

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)

  const gallery = page.getByRole('link', { name: /View Photos|แกลเลอรี่/i })
  const launch = page.getByRole('link', { name: /Launch App|เปิดใช้งาน/i })
  const review = page.getByRole('link', { name: /Review|รีวิว/i })

  const galleryVisible = await gallery.isVisible().catch(() => false)
  const launchVisible = await launch.isVisible().catch(() => false)
  const reviewVisible = await review.isVisible().catch(() => false)

  if (label === 'desktop') {
    if (galleryVisible && launchVisible && reviewVisible) {
      const gh = await gallery.getAttribute('href')
      const lh = await launch.getAttribute('href')
      const rh = await review.getAttribute('href')
      if (gh && lh && rh && gh.startsWith('http') && lh.startsWith('http') && rh.startsWith('http')) {
        pass('2', `All 3 buttons visible — gallery=${gh}, live=${lh}, review=${rh}`)
      } else {
        fail('2', `Buttons visible but hrefs invalid: gallery=${gh}, live=${lh}, review=${rh}`)
      }
    } else {
      fail(
        '2',
        `Missing buttons — gallery=${galleryVisible}, launch=${launchVisible}, review=${reviewVisible}`
      )
    }

    for (const r of supabaseResponses) {
      const hasContract = r.body.includes('contract_url')
      const hasSpec = r.body.includes('project_spec')
      if (!hasContract && !hasSpec) {
        pass('3', `Network response excludes contract_url & project_spec (${r.status})`)
      } else {
        fail('3', `Leaked in network: contract=${hasContract} spec=${hasSpec}`)
      }
    }
    if (supabaseResponses.length === 0) fail('3', 'No project_public_view network response captured')

    if (aiCalls.length === 0) pass('4', 'Zero AI API requests on portal route')
    else fail('4', `AI requests detected: ${aiCalls.join(', ')}`)

    const aiScripts = loadedScripts.filter((s) => /anthropic|claude|gemini/i.test(s))
    const portalChunk = loadedScripts.find((s) => /PortalApp/i.test(s))
    const adminChunk = loadedScripts.find((s) => /AdminApp/i.test(s))
    if (!adminChunk) pass('4b', 'AdminApp chunk not loaded on portal route')
    else fail('4b', `AdminApp loaded: ${adminChunk}`)
    if (portalChunk) pass('4c', `PortalApp lazy chunk loaded: ${portalChunk.split('/').pop()}`)
    if (aiScripts.length === 0) pass('4d', 'No AI-related script bundles loaded')
    else fail('4d', `AI scripts: ${aiScripts.join(', ')}`)

    if (consoleErrors.length === 0) pass('5', 'Zero console errors')
    else fail('5', `Console errors (${consoleErrors.length}): ${consoleErrors.slice(0, 3).join(' | ')}`)
  }

  if (label === 'mobile') {
    const btnCount = await page.locator('a[class*="min-h-"]').count()
    const fontSize = await page.locator('h1').evaluate((el) => getComputedStyle(el).fontSize)
    const btnHeight = galleryVisible
      ? await gallery.evaluate((el) => el.getBoundingClientRect().height)
      : 0
    if (btnCount >= 3 && parseFloat(fontSize) >= 24 && btnHeight >= 60) {
      pass('2-mobile', `Mobile layout OK — buttons=${btnCount}, h1=${fontSize}, btnH=${Math.round(btnHeight)}px`)
    } else if (!galleryVisible && !launchVisible && !reviewVisible) {
      fail('2-mobile', `Mobile: no buttons to measure (data issue)`)
    } else {
      fail('2-mobile', `Mobile layout weak — buttons=${btnCount}, h1=${fontSize}, btnH=${btnHeight}`)
    }
  }

  await ctx.close()
}

await browser.close()

console.log('\n=== BROWSER E2E SUMMARY ===')
for (const r of results) console.log(`${r.status} ${r.id}: ${r.detail}`)
const failed = results.filter((r) => r.status === 'FAIL')
process.exit(failed.length ? 1 : 0)

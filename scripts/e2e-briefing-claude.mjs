/**
 * E2E: Live Briefing Claude API call succeeds after model fix.
 * Run: node scripts/e2e-briefing-claude.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.ADMIN_TEST_URL || 'http://localhost:5173'
const STORAGE_KEY = 'sb-jjbwiriphyxsnrnpoqnn-auth-token'

const mockUser = {
  id: 'e2e-briefing-user',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'e2e@chapter99info.com',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {},
  created_at: new Date().toISOString(),
}

const mockSession = {
  access_token: 'e2e-mock-access-token',
  refresh_token: 'e2e-mock-refresh-token',
  expires_in: 3600,
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  token_type: 'bearer',
  user: mockUser,
}

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
page.setDefaultTimeout(120000)

let claudeRequestBody = null
let claudeResponseStatus = null
let claudeResponseBody = null

page.on('request', (req) => {
  if (req.url() !== 'https://api.anthropic.com/v1/messages') return
  claudeRequestBody = req.postDataJSON()
})

page.on('response', async (res) => {
  if (res.url() !== 'https://api.anthropic.com/v1/messages') return
  claudeResponseStatus = res.status()
  claudeResponseBody = await res.text()
})

await page.route('**/auth/v1/token**', async (route) => {
  const grant = new URL(route.request().url()).searchParams.get('grant_type')
  if (grant === 'refresh_token') {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession),
    })
    return
  }
  await route.continue()
})

await page.route('**/auth/v1/user**', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(mockUser),
  })
})

await page.route('**/rest/v1/**', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: '[]',
  })
})

await page.addInitScript(
  ({ storageKey, session }) => {
    localStorage.setItem(storageKey, JSON.stringify(session))
  },
  { storageKey: STORAGE_KEY, session: mockSession }
)

await page.goto(`${BASE}/admin/briefing`, { waitUntil: 'networkidle', timeout: 60000 })

await page.fill('#call-notes', 'Client wants bilingual PWA with HICAPS booking.')
await page.click('button:has-text("Generate Spec by Claude")')

await page.waitForFunction(
  () => {
    const spec = document.querySelector('#project-spec')
    return spec && spec.value && spec.value.length > 10
  },
  { timeout: 120000 }
)

const specText = await page.inputValue('#project-spec')
const consoleErrors = []
page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(m.text())
})

console.log('Claude request model:', claudeRequestBody?.model)
console.log('Claude response status:', claudeResponseStatus)
console.log('Spec preview:', specText.slice(0, 120).replace(/\n/g, ' '))

if (claudeRequestBody?.model !== 'claude-sonnet-4-6') {
  console.error('[FAIL] Wrong model in request:', claudeRequestBody?.model)
  process.exit(1)
}

if (claudeResponseStatus !== 200) {
  console.error('[FAIL] Claude API status:', claudeResponseStatus)
  console.error('Body:', claudeResponseBody)
  process.exit(1)
}

if (!specText || specText === '(No response text)' || specText.length < 10) {
  console.error('[FAIL] Briefing spec empty or too short')
  process.exit(1)
}

console.log('[PASS] Briefing Claude API end-to-end succeeded')
await browser.close()

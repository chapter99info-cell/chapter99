/**
 * Verify admin pages emit zero password-grant auth errors when session is restored.
 * Run: node scripts/e2e-admin-console.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.ADMIN_TEST_URL || 'http://localhost:5173'
const STORAGE_KEY = 'sb-jjbwiriphyxsnrnpoqnn-auth-token'

const ADMIN_PAGES = [
  { path: '/admin', label: 'Projects' },
  { path: '/admin/finance', label: 'Finance' },
  { path: '/admin/tasks', label: 'Tasks' },
  { path: '/admin/briefing', label: 'Briefing' },
  { path: '/admin/workflow', label: 'Workflow' },
]

const mockUser = {
  id: 'e2e-admin-user',
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

const results = []
const pass = (id, detail) => {
  results.push({ id, status: 'PASS', detail })
  console.log(`[PASS] ${id}: ${detail}`)
}
const fail = (id, detail) => {
  results.push({ id, status: 'FAIL', detail })
  console.log(`[FAIL] ${id}: ${detail}`)
}

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()

const passwordGrants = []
const consoleErrors = []

page.on('response', async (res) => {
  const url = res.url()
  if (!url.includes('/auth/v1/token')) return
  const grant = new URL(url).searchParams.get('grant_type')
  if (grant !== 'password') return
  passwordGrants.push({
    status: res.status(),
    body: (res.request().postData() || '').slice(0, 200),
    page: page.url(),
  })
})

page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text())
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

for (const { path, label } of ADMIN_PAGES) {
  passwordGrants.length = 0
  consoleErrors.length = 0

  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)

  if (page.url().includes('/admin/login')) {
    fail(label, `Unexpected redirect to login from ${path}`)
    continue
  }

  if (passwordGrants.length > 0) {
    fail(label, `${passwordGrants.length} password grant request(s): ${JSON.stringify(passwordGrants)}`)
    continue
  }

  const authErrors = consoleErrors.filter((e) => /grant_type=password|auth\/v1\/token/i.test(e))
  if (authErrors.length > 0) {
    fail(label, `Console auth errors: ${authErrors.join(' | ')}`)
    continue
  }

  pass(label, `No password-grant requests or auth console errors on ${path}`)
}

await browser.close()

console.log('\n=== ADMIN CONSOLE E2E SUMMARY ===')
for (const r of results) console.log(`${r.status} ${r.id}: ${r.detail}`)
process.exit(results.some((r) => r.status === 'FAIL') ? 1 : 0)

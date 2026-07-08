/**
 * Verify PWA icon assets and manifest references.
 * Run: node scripts/verify-brand-icons.mjs
 */
import { chromium, devices } from 'playwright'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const BASE = process.env.ICON_TEST_URL || 'http://localhost:4173'
const ROOT = join(import.meta.dirname, '..')

const manifest = JSON.parse(readFileSync(join(ROOT, 'public/manifest.json'), 'utf8'))
const adminManifest = JSON.parse(readFileSync(join(ROOT, 'public/admin/manifest.json'), 'utf8'))
const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf8')

const iconPaths = new Set([
  ...manifest.icons.map((i) => i.src),
  ...adminManifest.icons.map((i) => i.src),
  '/icons/icon-180.png',
  '/icons/favicon-32.png',
])

let failed = 0
for (const src of iconPaths) {
  const file = join(ROOT, 'public', src.replace(/^\//, '').replace(/\//g, '\\'))
  try {
    readFileSync(file)
    console.log(`[PASS] file exists: ${src}`)
  } catch {
    console.log(`[FAIL] missing file: ${src}`)
    failed++
  }
}

if (indexHtml.includes('/icons/icon-180.png') && indexHtml.includes('/icons/favicon-32.png')) {
  console.log('[PASS] index.html icon links updated')
} else {
  console.log('[FAIL] index.html missing new icon links')
  failed++
}

if (!indexHtml.includes('icon-192.svg') && !indexHtml.includes('icon-512.svg')) {
  console.log('[PASS] no old placeholder svg refs in index.html')
} else {
  console.log('[FAIL] old svg refs remain in index.html')
  failed++
}

const browser = await chromium.launch({ headless: true })
for (const { label, path } of [
  { label: 'desktop', path: '/' },
  { label: 'admin', path: '/admin' },
]) {
  const page = await browser.newPage()
  const broken = []
  page.on('response', (res) => {
    const u = new URL(res.url())
    if (u.pathname.startsWith('/icons/') && res.status() !== 200) {
      broken.push(`${res.status()} ${u.pathname}`)
    }
  })
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 60000 })
  const manifestHref =
    label === 'admin' ? '/admin/manifest.json' : '/manifest.json'
  const manifestRes = await page.evaluate(async (href) => {
    const res = await fetch(href)
    const json = await res.json()
    const icons = json.icons || []
    const checks = await Promise.all(
      icons.map(async (icon) => {
        const r = await fetch(icon.src)
        return { src: icon.src, purpose: icon.purpose, ok: r.ok, type: r.headers.get('content-type') }
      })
    )
    return checks
  }, manifestHref)

  for (const check of manifestRes) {
    if (check.ok && check.type?.includes('png')) {
      console.log(`[PASS] ${label} manifest icon ${check.src} (${check.purpose})`)
    } else {
      console.log(`[FAIL] ${label} manifest icon ${check.src}`)
      failed++
    }
  }
  if (broken.length) {
    console.log(`[FAIL] ${label} broken icon requests:`, broken)
    failed += broken.length
  }
  await page.close()
}

const mobile = await chromium.launch({ headless: true })
const mpage = await mobile.newPage({ ...devices['iPhone 13'] })
await mpage.goto(`${BASE}/`, { waitUntil: 'networkidle' })
const apple = await mpage.locator('link[rel="apple-touch-icon"]').getAttribute('href')
if (apple === '/icons/icon-180.png') {
  console.log('[PASS] mobile apple-touch-icon href')
} else {
  console.log(`[FAIL] apple-touch-icon href: ${apple}`)
  failed++
}
await mobile.close()
await browser.close()

process.exit(failed ? 1 : 0)

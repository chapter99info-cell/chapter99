/**
 * Verify production PortalApp bundle (check 1 + 4).
 * Run: node scripts/verify-portal-bundle.mjs
 */
const SITE = 'https://www.chapter99info.com'
const CHUNK = 'PortalApp-Bt11e3Il.js' // from vite manifest / last prod deploy

const js = await (await fetch(`${SITE}/assets/${CHUNK}`)).text()

const checks = [
  ['uses project_public_view', js.includes('project_public_view')],
  ['no direct project table query', !/from\("project"\)|from\('project'\)/.test(js)],
  ['no anthropic API', !/api\.anthropic\.com/i.test(js)],
  ['no gemini API', !/generativelanguage/i.test(js)],
  ['no claude string', !/\bclaude\b/i.test(js)],
]

for (const [name, ok] of checks) console.log(ok ? `PASS ${name}` : `FAIL ${name}`)
process.exit(checks.every(([, ok]) => ok) ? 0 : 1)

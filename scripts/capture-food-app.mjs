import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const out = 'docs/screenshots/food-app-source'
mkdirSync(out, { recursive: true })
const base = 'https://chapter99-restaurant-web.vercel.app'
const shop = 'preview-template-05'
const pages = [
  ['order', `${base}/order?shop=${shop}`],
  ['menu', `${base}/menu?shop=${shop}`],
  ['home', `${base}/?shop=${shop}`],
]

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
for (const [name, url] of pages) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${out}/${name}.png` })
}
await browser.close()
console.log('captured', pages.map((p) => p[0]).join(', '))

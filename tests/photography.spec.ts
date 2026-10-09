import { expect, test, type Page } from '@playwright/test'
import { mkdirSync, readFileSync } from 'node:fs'

const shotDir = 'docs/screenshots'

async function noHScroll(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height })
  const { sw, iw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
  }))
  expect(sw, `horizontal scroll at ${width}`).toBeLessThanOrEqual(iw + 1)
}

test('photography unpublished gate, noindex, layout preview', async ({ page }) => {
  mkdirSync(shotDir, { recursive: true })

  const sitemap = readFileSync('public/sitemap.xml', 'utf8')
  expect(sitemap).not.toMatch(/photography/)

  const robots = readFileSync('public/robots.txt', 'utf8')
  expect(robots).toMatch(/Disallow:\s*\/photography/)

  const res = await page.goto('/photography?layout=1')
  expect(res?.ok()).toBeTruthy()

  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow')
  await expect(page.locator('.notice')).toContainText('LAYOUT PREVIEW ONLY')

  const order = await page.evaluate(() =>
    [...document.querySelectorAll('.photo-v7 section[id]')].map((el) => el.id),
  )
  expect(order.slice(0, 6)).toEqual(['top', 'portfolio', 'before-after', 'process', 'create', 'pricing'])

  const wa = page.locator('a[href*="wa.me/61452044382"]').first()
  await expect(wa).toHaveAttribute('href', /wa.me\/61452044382/)

  await noHScroll(page, 390, 844)
  await page.screenshot({ path: `${shotDir}/photography-v2-390.png`, fullPage: true })
  await noHScroll(page, 1440, 900)
  await page.screenshot({ path: `${shotDir}/photography-v2-1440.png`, fullPage: true })
})

import { expect, test, type Page } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const shotDir = 'docs/screenshots'

async function noHScroll(page: Page, width: number, height: number) {
  await page.setViewportSize({ width, height })
  const { sw, iw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    iw: window.innerWidth,
  }))
  expect(sw, `horizontal scroll at ${width}`).toBeLessThanOrEqual(iw + 1)
}

test('photography page responsive and links', async ({ page }) => {
  mkdirSync(shotDir, { recursive: true })
  const res = await page.goto('/photography')
  expect(res?.ok()).toBeTruthy()

  const bodySize = await page.evaluate(() => {
    const el = document.querySelector('.photo-v7')
    return el ? Number(getComputedStyle(el).fontSize.replace('px', '')) : 0
  })
  expect(bodySize).toBeGreaterThanOrEqual(16)

  const small = await page.evaluate(() =>
    [...document.querySelectorAll('.photo-v7 .btn, .photo-v7 .filters button, .photo-v7 .ba-tabs button')].some((el) => {
      const r = el.getBoundingClientRect()
      return r.width > 0 && r.height > 0 && r.height < 44
    }),
  )
  expect(small, 'tap targets under 44px').toBeFalsy()

  const wa = page.locator('a[href*="wa.me/61452044382"]').first()
  await expect(wa).toHaveAttribute('href', /Photography%20%26%20AI%20Creative|Photography & AI Creative|%E0%B8%AA%E0%B8%A7%E0%B8%B1%E0%B8%AA/)

  await page.keyboard.press('Tab')
  const filters = page.locator('.filters button')
  if (await filters.count()) {
    await filters.first().focus()
    await page.keyboard.press('Enter')
  }

  for (const w of [390, 820, 1440] as const) {
    await noHScroll(page, w, w === 390 ? 844 : 900)
    await page.screenshot({ path: `${shotDir}/photography-${w}.png`, fullPage: true })
  }
})

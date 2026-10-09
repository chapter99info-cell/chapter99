import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'

test('food demo uses real-app screenshots, not marketing photos', async ({ page }) => {
  mkdirSync('docs/screenshots', { recursive: true })
  await page.goto('/v7')
  await page.getByRole('button', { name: 'ลองสั่งอาหาร (เดโม)' }).click()
  await expect(page.locator('.dfood__badge')).toHaveText('DEMO')
  await expect(page.locator('.dfood__note')).toContainText('ไม่มีการสั่งซื้อจริง')
  const img = page.locator('.dfood img')
  await expect(img).toHaveAttribute('src', /app-food-01\.webp/)
  await expect(page.locator('a.dfood__open')).toHaveAttribute(
    'href',
    'https://chapter99-restaurant-web.vercel.app/order?shop=preview-template-05',
  )
  await expect(page.locator('a.dfood__open')).toHaveAttribute('rel', 'noopener')
  await expect(page.locator('.dfood iframe')).toHaveCount(0)

  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: 'docs/screenshots/food-demo-modal-390.png' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.screenshot({ path: 'docs/screenshots/food-demo-modal-1440.png' })
})

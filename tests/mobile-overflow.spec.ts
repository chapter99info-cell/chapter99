import { expect, test } from '@playwright/test'

const widths = [360, 390] as const
const paths = ['/', '/pricing', '/business-toolkit'] as const

function overflowProbe() {
  const vw = document.documentElement.clientWidth
  const offenders: string[] = []
  for (const el of document.querySelectorAll<HTMLElement>('body *')) {
    const r = el.getBoundingClientRect()
    if (r.width > vw + 1 || el.scrollWidth > vw + 1) {
      const cls = el.className && typeof el.className === 'string' ? `.${el.className.trim().split(/\s+/).slice(0, 3).join('.')}` : ''
      offenders.push(`${el.tagName.toLowerCase()}${cls} sw=${el.scrollWidth} w=${Math.round(r.width)}`)
    }
  }
  return {
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    offenders: offenders.slice(0, 20),
  }
}

for (const width of widths) {
  for (const path of paths) {
    test(`no horizontal overflow ${path} @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 })
      await page.goto(path, { waitUntil: 'networkidle' })
      await page.waitForTimeout(400)
      const report = await page.evaluate(overflowProbe)
      if (report.scrollWidth !== report.clientWidth) {
        console.log(path, width, report)
      }
      expect(report.scrollWidth, JSON.stringify(report.offenders)).toBe(report.clientWidth)
    })
  }
}

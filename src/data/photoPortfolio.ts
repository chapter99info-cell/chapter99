export type Badge = 'REAL PHOTO' | 'PHOTO + AI CREATIVE' | 'DESIGN CONCEPT'

export type PhotoCategory = 'foodRestaurant' | 'product' | 'lifestyle' | 'massage'

export type PortfolioItem = {
  id: string
  src: string
  alt: string
  category: PhotoCategory
  badge: Badge
  orientation: 'portrait' | 'landscape'
  permission: { approved: boolean; note: string }
  width?: number
  height?: number
}

export type BeforeAfterItem = {
  id: string
  category: PhotoCategory
  before: { src: string; alt: string; width?: number; height?: number }
  after: { src: string; alt: string; width?: number; height?: number }
  sourceNote: string
}

export type ProcessStep = {
  id: string
  src: string
  alt: string
  label: 'REAL PHOTO' | 'EDITING' | 'AI CREATIVE' | 'MARKETING CONTENT'
  aiNote?: string
  width?: number
  height?: number
}

export type PhotoManifest = {
  portfolio: PortfolioItem[]
  beforeAfter: BeforeAfterItem[]
  process?: ProcessStep[]
  hero?: { landscape?: PortfolioItem; portrait?: PortfolioItem }
}

export type RightsRow = {
  filename: string
  shop: string
  permission: boolean
  mayNameShop: boolean
}

export const emptyManifest: PhotoManifest = { portfolio: [], beforeAfter: [], process: [] }

export function parseRights(raw: string): RightsRow[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const [filename, shop, permission, mayName] = line.split('|').map((p) => p.trim())
      return {
        filename: filename ?? '',
        shop: shop ?? '',
        permission: (permission ?? '').toLowerCase() === 'yes',
        mayNameShop: (mayName ?? '').toLowerCase() === 'yes',
      }
    })
    .filter((row) => row.filename)
}

export function filenameOf(src: string): string {
  return src.split('/').pop() ?? src
}

export function rightsAllow(src: string, rows: RightsRow[]): boolean {
  const name = filenameOf(src)
  const row = rows.find((r) => r.filename === name)
  return Boolean(row?.permission)
}

export function approvedPortfolio(items: PortfolioItem[], rights: RightsRow[]): PortfolioItem[] {
  return items.filter((item) => item.permission.approved === true && rightsAllow(item.src, rights))
}

export function approvedBeforeAfter(items: BeforeAfterItem[], rights: RightsRow[]): BeforeAfterItem[] {
  return items.filter(
    (item) => rightsAllow(item.before.src, rights) && rightsAllow(item.after.src, rights),
  )
}

export function approvedProcess(items: ProcessStep[] | undefined, rights: RightsRow[]): ProcessStep[] {
  return (items ?? []).filter((item) => rightsAllow(item.src, rights))
}

/** Section 3 minimums. Until true, never a live sales page. */
export function canPublishSalesPage(manifest: PhotoManifest, rights: RightsRow[]): boolean {
  const heroL = manifest.hero?.landscape
  const heroP = manifest.hero?.portrait
  const heroOk =
    Boolean(heroL && rightsAllow(heroL.src, rights) && (heroL.width ?? 0) >= 2400) &&
    Boolean(heroP && rightsAllow(heroP.src, rights))

  const pf = approvedPortfolio(manifest.portfolio, rights)
  const cats: PhotoCategory[] = ['foodRestaurant', 'product', 'lifestyle', 'massage']
  const perCat = cats.every((c) => pf.filter((i) => i.category === c).length >= 2)
  const portfolioOk = pf.length >= 8 && perCat

  const baOk = approvedBeforeAfter(manifest.beforeAfter, rights).length >= 2

  const process = approvedProcess(manifest.process, rights)
  const labels = ['REAL PHOTO', 'EDITING', 'AI CREATIVE', 'MARKETING CONTENT'] as const
  const processOk = labels.every((label) => process.some((p) => p.label === label))

  return heroOk && portfolioOk && baOk && processOk
}

/** Labelled empty slots: Vite dev, ?layout=1, or non-production preview hosts. Never chapter99info.com. */
export function allowLayoutPreview(): boolean {
  if (import.meta.env.DEV) return true
  if (import.meta.env.VITE_PHOTO_LAYOUT_PREVIEW === '1') return true
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  if (host === 'www.chapter99info.com' || host === 'chapter99info.com') return false
  const wantLayout = new URLSearchParams(window.location.search).get('layout') === '1'
  const previewHost =
    host === 'localhost' || host === '127.0.0.1' || host.endsWith('.vercel.app')
  return wantLayout && previewHost
}

export const requiredShots: {
  id: string
  section: 'hero' | 'portfolio' | 'beforeAfter' | 'process' | 'services'
  label: string
  category?: PhotoCategory | 'hero'
  why: string
}[] = [
  { id: 'hero-l', section: 'hero', label: 'Hero landscape ≥2400px', why: '70–85% of first viewport' },
  { id: 'hero-p', section: 'hero', label: 'Hero portrait crop (mobile)', why: 'Immersive vertical on phone' },
  { id: 'pf-fr-1', section: 'portfolio', category: 'foodRestaurant', label: 'Food/Restaurant 1', why: '≥2 per category' },
  { id: 'pf-fr-2', section: 'portfolio', category: 'foodRestaurant', label: 'Food/Restaurant 2 (featured 2-col)', why: 'Editorial span' },
  { id: 'pf-pr-1', section: 'portfolio', category: 'product', label: 'Product 1', why: '≥2 per category' },
  { id: 'pf-pr-2', section: 'portfolio', category: 'product', label: 'Product 2', why: '≥2 per category' },
  { id: 'pf-ls-1', section: 'portfolio', category: 'lifestyle', label: 'Lifestyle 1', why: '≥2 per category' },
  { id: 'pf-ls-2', section: 'portfolio', category: 'lifestyle', label: 'Lifestyle 2', why: '≥2 per category' },
  { id: 'pf-ms-1', section: 'portfolio', category: 'massage', label: 'Massage 1', why: '≥2 per category' },
  { id: 'pf-ms-2', section: 'portfolio', category: 'massage', label: 'Massage 2', why: '≥2 per category' },
  { id: 'ba-1', section: 'beforeAfter', label: 'Before/After pair 1', why: 'Verified matching pair' },
  { id: 'ba-2', section: 'beforeAfter', label: 'Before/After pair 2', why: 'Verified matching pair' },
  { id: 'pr-1', section: 'process', label: 'REAL PHOTO', why: 'Same shoot, step 1' },
  { id: 'pr-2', section: 'process', label: 'EDITING', why: 'Same shoot, step 2' },
  { id: 'pr-3', section: 'process', label: 'AI CREATIVE (label AI)', why: 'Same shoot, step 3' },
  { id: 'pr-4', section: 'process', label: 'MARKETING CONTENT', why: 'Same shoot, step 4' },
  { id: 'sv-1', section: 'services', label: 'Service card — Photography', why: 'Real approved image on card' },
  { id: 'sv-2', section: 'services', label: 'Service card — AI Creative', why: 'Real approved image on card' },
  { id: 'sv-3', section: 'services', label: 'Service card — Reels Video', why: 'Real approved image on card' },
  { id: 'sv-4', section: 'services', label: 'Service card — Brand Content', why: 'Real approved image on card' },
]

export async function loadPhotoManifest(): Promise<PhotoManifest> {
  try {
    const res = await fetch('/portfolio/approved/manifest.json', { cache: 'no-store' })
    if (!res.ok) return emptyManifest
    const data = (await res.json()) as PhotoManifest
    return {
      portfolio: Array.isArray(data.portfolio) ? data.portfolio : [],
      beforeAfter: Array.isArray(data.beforeAfter) ? data.beforeAfter : [],
      process: Array.isArray(data.process) ? data.process : [],
      hero: data.hero,
    }
  } catch {
    return emptyManifest
  }
}

export async function loadRights(): Promise<RightsRow[]> {
  try {
    const res = await fetch('/photography-assets/rights.txt', { cache: 'no-store' })
    if (!res.ok) return []
    return parseRights(await res.text())
  } catch {
    return []
  }
}

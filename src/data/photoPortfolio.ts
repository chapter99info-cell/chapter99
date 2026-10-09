export type Badge = 'REAL PHOTO' | 'PHOTO + AI CREATIVE' | 'DESIGN CONCEPT'

export type PhotoCategory = 'food' | 'restaurant' | 'massage' | 'products' | 'reels'

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
  category: 'food' | 'massage' | 'products' | 'restaurant'
  before: { src: string; alt: string; width?: number; height?: number }
  after: { src: string; alt: string; width?: number; height?: number }
  sourceNote: string
}

export type PhotoManifest = {
  portfolio: PortfolioItem[]
  beforeAfter: BeforeAfterItem[]
}

export const emptyManifest: PhotoManifest = { portfolio: [], beforeAfter: [] }

export function approvedPortfolio(items: PortfolioItem[]): PortfolioItem[] {
  return items.filter((item) => item.permission.approved === true)
}

export async function loadPhotoManifest(): Promise<PhotoManifest> {
  try {
    const res = await fetch('/portfolio/approved/manifest.json', { cache: 'no-store' })
    if (!res.ok) return emptyManifest
    const data = (await res.json()) as PhotoManifest
    return {
      portfolio: Array.isArray(data.portfolio) ? data.portfolio : [],
      beforeAfter: Array.isArray(data.beforeAfter) ? data.beforeAfter : [],
    }
  } catch {
    return emptyManifest
  }
}

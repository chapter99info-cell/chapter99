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

/** Do not publish /photography as a sales page until this returns true. */
export function canPublishSalesPage(manifest: PhotoManifest): boolean {
  return approvedPortfolio(manifest.portfolio).some((item) => item.badge === 'REAL PHOTO')
}

export function approvedPortfolio(items: PortfolioItem[]): PortfolioItem[] {
  return items.filter((item) => item.permission.approved === true)
}

export const requiredShots: {
  id: string
  section: 'hero' | 'portfolio' | 'beforeAfter' | 'why'
  label: string
  badge: Badge
  orientation: 'portrait' | 'landscape' | 'pair'
  why: string
}[] = [
  {
    id: 'hero-real',
    section: 'hero',
    label: 'ฮีโร่ — ภาพร้านหรือสินค้าจริง 1 ภาพ',
    badge: 'REAL PHOTO',
    orientation: 'landscape',
    why: 'ลูกค้าต้องเห็นภาพจริงทันที ไม่ใช่ตัวอักษรอย่างเดียว',
  },
  {
    id: 'pf-food-l',
    section: 'portfolio',
    label: 'อาหาร แนวนอน 1 ภาพ',
    badge: 'REAL PHOTO',
    orientation: 'landscape',
    why: 'พิสูจน์งานถ่ายอาหาร',
  },
  {
    id: 'pf-food-p',
    section: 'portfolio',
    label: 'อาหาร แนวตั้ง 1 ภาพ',
    badge: 'REAL PHOTO',
    orientation: 'portrait',
    why: 'ใช้ในกริดโซเชียล',
  },
  {
    id: 'pf-rest',
    section: 'portfolio',
    label: 'ร้านอาหาร / บรรยากาศ 2 ภาพ',
    badge: 'REAL PHOTO',
    orientation: 'landscape',
    why: 'โชว์พื้นที่จริงของร้าน',
  },
  {
    id: 'pf-massage',
    section: 'portfolio',
    label: 'นวด / สปา 2 ภาพ',
    badge: 'REAL PHOTO',
    orientation: 'landscape',
    why: 'โชว์ห้องและบรรยากาศบริการ',
  },
  {
    id: 'pf-products',
    section: 'portfolio',
    label: 'สินค้า 2 ภาพ',
    badge: 'REAL PHOTO',
    orientation: 'portrait',
    why: 'พิสูจน์งานถ่ายสินค้า',
  },
  {
    id: 'pf-reels',
    section: 'portfolio',
    label: 'ภาพนิ่งจาก Reels 2 เฟรม',
    badge: 'REAL PHOTO',
    orientation: 'portrait',
    why: 'เชื่อมไปงานวิดีโอสั้น',
  },
  {
    id: 'ba-food',
    section: 'beforeAfter',
    label: 'Before/After อาหาร 1 คู่',
    badge: 'PHOTO + AI CREATIVE',
    orientation: 'pair',
    why: 'อธิบายว่าต่อยอดจากภาพจริงได้อย่างไร',
  },
  {
    id: 'ba-massage',
    section: 'beforeAfter',
    label: 'Before/After นวด-สปา 1 คู่',
    badge: 'PHOTO + AI CREATIVE',
    orientation: 'pair',
    why: 'แท็บ Massage ต้องมีภาพจริงคู่กัน',
  },
  {
    id: 'ba-products',
    section: 'beforeAfter',
    label: 'Before/After สินค้า 1 คู่',
    badge: 'PHOTO + AI CREATIVE',
    orientation: 'pair',
    why: 'แท็บ Products',
  },
  {
    id: 'ba-rest',
    section: 'beforeAfter',
    label: 'Before/After โปรโมตร้านอาหาร 1 คู่',
    badge: 'PHOTO + AI CREATIVE',
    orientation: 'pair',
    why: 'แท็บ Restaurant Promotion',
  },
  {
    id: 'why-real',
    section: 'why',
    label: 'ภาพจริง 1 ภาพ vs งานออกแบบ 1 ภาพ (ติดป้ายคนละแบบ)',
    badge: 'REAL PHOTO',
    orientation: 'landscape',
    why: 'ท่อน Why Real Photography ต้องพิสูจน์ด้วยภาพ ไม่ใช่ข้อความอย่างเดียว',
  },
]

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

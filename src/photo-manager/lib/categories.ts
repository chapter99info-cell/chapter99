import type { JobType, QuoteProfession, QuoteProjectKind } from '../types'

export type CategoryItem = { id: QuoteProfession; label: string }

/** Photography quote + client categories (single source of truth). */
export const PHOTO_CATEGORIES: CategoryItem[] = [
  { id: 'wedding', label: 'Wedding' },
  { id: 'engagement', label: 'Pre-Wedding / Engagement' },
  { id: 'studio', label: 'Studio Photoshoot' },
  { id: 'event', label: 'Event / Corporate' },
  { id: 'portrait', label: 'Portrait / Personal Branding' },
]

/** Website quote + client business types. */
export const WEB_CATEGORIES: CategoryItem[] = [
  { id: 'massage-spa', label: 'ร้านนวด / สปา' },
  { id: 'food', label: 'ร้านอาหาร' },
  { id: 'hair-beauty', label: 'ร้านเสริมสวย / ความงาม' },
  { id: 'other', label: 'อื่นๆ' },
]

/** Old client/quote ids that must still load. Not offered on new-client forms. */
export const LEGACY_CATEGORIES: { id: string; label: string }[] = [
  { id: 'family', label: 'Family Portrait' },
  { id: 'photographer', label: 'ช่างภาพ' },
  { id: 'tutoring', label: 'สอนพิเศษ' },
  { id: 'fitness', label: 'เทรนเนอร์ฟิตเนส' },
]

const PHOTO_IDS = new Set<string>([...PHOTO_CATEGORIES.map((c) => c.id), 'family', 'photographer'])

export const TYPE_LABEL: Record<string, string> = Object.fromEntries([
  ...PHOTO_CATEGORIES.map((c) => [c.id, c.label] as const),
  ...WEB_CATEGORIES.map((c) => [c.id, c.label] as const),
  ...LEGACY_CATEGORIES.map((c) => [c.id, c.label] as const),
])

export const TYPE_LABEL_EN: Record<string, string> = { ...TYPE_LABEL }

export function typeLabel(type: string | undefined): string {
  if (!type) return ''
  return TYPE_LABEL[type] ?? TYPE_LABEL_EN[type] ?? type
}

export function isPhotoJobType(type: string): boolean {
  return PHOTO_IDS.has(type)
}

export function isWebJobType(type: string): boolean {
  return WEB_CATEGORIES.some((c) => c.id === type)
}

export function projectKindFromJobType(type: string): QuoteProjectKind {
  if (isPhotoJobType(type)) return 'photography'
  if (isWebJobType(type)) return 'website'
  return 'combined'
}

export function isQuoteProfession(id: string): id is QuoteProfession {
  return (
    PHOTO_CATEGORIES.some((c) => c.id === id) ||
    WEB_CATEGORIES.some((c) => c.id === id) ||
    id === 'photographer' ||
    id === 'tutoring' ||
    id === 'fitness' ||
    id === 'other'
  )
}

export function defaultsForJobType(type: JobType): { packageId: string | null; fixedPrice: number | null } {
  if (type === 'wedding') return { packageId: 'w1', fixedPrice: null }
  if (type === 'engagement') return { packageId: 'e1', fixedPrice: null }
  if (type === 'portrait') return { packageId: null, fixedPrice: 650 }
  if (type === 'family') return { packageId: null, fixedPrice: 450 }
  return { packageId: null, fixedPrice: null }
}

export const PHOTO_PROFESSIONS = PHOTO_CATEGORIES
export const WEB_PROFESSIONS = WEB_CATEGORIES
export const QUOTE_PROFESSIONS: CategoryItem[] = [
  ...PHOTO_CATEGORIES,
  ...WEB_CATEGORIES,
  { id: 'photographer', label: 'ช่างภาพ' },
  { id: 'tutoring', label: 'สอนพิเศษ' },
  { id: 'fitness', label: 'เทรนเนอร์ฟิตเนส' },
]

import type { BrandLogo } from '../types'

export const PM_MEDIA_BUCKET = 'Photos media'
export const DEFAULT_JOB_LOGO_PATH = 'photos/wedding.png'

/** Public object URL for photos/wedding.png — not Chapter99_st.png (other business line). */
export function defaultJobLogoUrl(): string {
  const base = (import.meta.env.VITE_PM_SUPABASE_URL as string | undefined)?.replace(/\/$/, '') ?? ''
  if (!base) return ''
  return `${base}/storage/v1/object/public/${encodeURIComponent(PM_MEDIA_BUCKET)}/${DEFAULT_JOB_LOGO_PATH}`
}

export const BRAND_LOGO_TYPES = ['default', 'wedding', 'engagement', 'portrait', 'family'] as const
export type BrandLogoType = (typeof BRAND_LOGO_TYPES)[number]

export function defaultBrandLogos(): BrandLogo[] {
  const url = defaultJobLogoUrl()
  return BRAND_LOGO_TYPES.map((type) => ({ type, logo_url: url }))
}

export function logoUrlForJob(logos: BrandLogo[] | undefined, jobType: string): string {
  const rows = logos ?? []
  const hit = rows.find((r) => r.type === jobType)?.logo_url?.trim()
  if (hit) return hit
  const fallback = rows.find((r) => r.type === 'default')?.logo_url?.trim()
  return fallback || defaultJobLogoUrl()
}

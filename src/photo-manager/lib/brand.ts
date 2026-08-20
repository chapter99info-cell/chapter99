import type { BrandLogo } from '../types'

export const PM_MEDIA_BUCKET = 'Photos media'
export const DEFAULT_JOB_LOGO_PATH = 'photos/wedding.png'
export const PM_ABN = 'ABN 81 951 461 769'
export const PM_ADDRESS_LINE = 'Forestville, Sydney NSW 2087'

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

export function parsePmStorageUrl(logoUrl: string): { bucket: string; objectPath: string } | null {
  try {
    const u = new URL(logoUrl)
    const m = u.pathname.match(/\/storage\/v1\/object\/(?:public|authenticated|sign)\/(.+)$/)
    if (!m?.[1]) return null
    const rest = m[1]
    const slash = rest.indexOf('/')
    if (slash < 0) return null
    return {
      bucket: decodeURIComponent(rest.slice(0, slash)),
      objectPath: decodeURIComponent(rest.slice(slash + 1)),
    }
  } catch {
    return null
  }
}

export async function fileToLogoDataUrl(file: File): Promise<string> {
  if (file.type === 'image/svg+xml' || file.size < 80_000) {
    return readFileDataUrl(file)
  }
  try {
    const bitmap = await createImageBitmap(file)
    const max = 640
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('no canvas')
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()
    return canvas.toDataURL('image/png')
  } catch {
    return readFileDataUrl(file)
  }
}

function readFileDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error ?? new Error('อ่านไฟล์ไม่สำเร็จ'))
    reader.readAsDataURL(file)
  })
}

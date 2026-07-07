import type { CSSProperties } from 'react'
import { AGENCY_CONFIG, agencyCssVars } from '../lib/agency-config'

/** Apply white-label CSS variables to a container */
export function useBrandStyle(): CSSProperties {
  return agencyCssVars() as CSSProperties
}

export function brandColor(key: keyof typeof AGENCY_CONFIG.colors): string {
  return AGENCY_CONFIG.colors[key]
}

export { AGENCY_CONFIG }

/** White-label agency config — single source for brand tokens (admin + client portal) */
export const AGENCY_CONFIG = {
  brandName: 'Chapter99',
  logoUrl:
    'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/Photos/Logo/Chapter99_st.png',
  colors: {
    primary: '#2D5016',
    primaryHover: '#234012',
    secondary: '#C8A84B',
    background: '#F8F5F0',
    surface: '#FFFFFF',
    text: '#1A1A1A',
    textMuted: '#6B7280',
    accent: '#E8A838',
    border: 'rgba(26, 26, 26, 0.15)',
  },
  contact: {
    email: 'admin@chapter99info.com',
    phone: '',
    address: 'Sydney, Australia',
    website: 'https://chapter99info.com',
  },
} as const

export type AgencyConfig = typeof AGENCY_CONFIG

/** CSS custom properties for use in components and inline styles */
export function agencyCssVars(): Record<string, string> {
  const c = AGENCY_CONFIG.colors
  return {
    '--brand-primary': c.primary,
    '--brand-primary-hover': c.primaryHover,
    '--brand-secondary': c.secondary,
    '--brand-bg': c.background,
    '--brand-surface': c.surface,
    '--brand-text': c.text,
    '--brand-text-muted': c.textMuted,
    '--brand-accent': c.accent,
    '--brand-border': c.border,
  }
}

import {
  Bot,
  Camera,
  Car,
  Crown,
  Globe,
  Receipt,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Video,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

export type PricingTier = {
  id: string
  name: string
  nameTh: string
  setup: number | string
  monthly: number
  target: string
  targetTh: string
  features: { label: string; labelTh: string; icon: LucideIcon }[]
  recommended?: boolean
  showcaseGradient: string
  showcaseIcon: LucideIcon
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    nameTh: 'Starter',
    setup: 199,
    monthly: 19,
    target: 'Uber drivers, Tradies, Freelancers',
    targetTh: 'คนขับ Uber, ช่างไฟ/ช่างประปา, ฟรีแลนซ์',
    showcaseGradient: 'linear-gradient(145deg, #1A1A1A 0%, #2D5016 55%, #1A1A1A 100%)',
    showcaseIcon: Car,
    features: [
      { label: 'One-page website', labelTh: 'เว็บหน้าเดียว ใช้งานง่าย', icon: Globe },
      { label: 'Income & expense tracker for ATO', labelTh: 'ระบบบันทึกรายรับ-รายจ่าย ATO', icon: Receipt },
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    nameTh: 'Professional',
    setup: 499,
    monthly: 39,
    target: 'Restaurants, Massage shops',
    targetTh: 'ร้านอาหาร, ร้านนวด',
    recommended: true,
    showcaseGradient: 'linear-gradient(145deg, #0f1410 0%, #2D5016 40%, #C8A84B 100%)',
    showcaseIcon: Sparkles,
    features: [
      { label: 'Full PWA + Booking system', labelTh: 'ระบบจองคิวออนไลน์เต็มรูปแบบ (PWA)', icon: Smartphone },
      { label: 'Google Review CTA', labelTh: 'ปุ่มชวนรีวิว Google', icon: Star },
      { label: 'Client Portal page', labelTh: 'หน้า Client Portal', icon: Users },
    ],
  },
  {
    id: 'ultimate',
    name: 'Ultimate Business',
    nameTh: 'Ultimate Business',
    setup: '999+',
    monthly: 49,
    target: 'Full-service premium clients',
    targetTh: 'ลูกค้า Premium บริการครบวงจร',
    showcaseGradient: 'linear-gradient(145deg, #090B0A 0%, #2D5016 35%, #1A1A1A 70%, #C8A84B 100%)',
    showcaseIcon: Crown,
    features: [
      { label: 'Everything in Professional', labelTh: 'ทุกอย่างในแพ็ก Professional', icon: Sparkles },
      { label: 'Photography add-on', labelTh: 'งานถ่ายภาพเสริม', icon: Camera },
      { label: 'Video production add-on', labelTh: 'งานถ่ายวิดีโอเสริม', icon: Video },
      { label: 'AI chatbot (BYOK or managed)', labelTh: 'AI Chatbot (BYOK หรือดูแลให้)', icon: Bot },
      { label: 'Custom business features', labelTh: 'ฟีเจอร์ที่ออกแบบเฉพาะธุรกิจคุณ', icon: Wrench },
    ],
  },
]

export function formatAud(value: number | string): string {
  if (typeof value === 'string') return `A$${value}`
  return `A$${value.toLocaleString('en-AU')}`
}

/** Speed-ramp: fast punch-in, hard deceleration, slight overshoot */
export const SPEED_RAMP_SPRING = {
  type: 'spring' as const,
  stiffness: 460,
  damping: 22,
  mass: 0.75,
}

export const SPEED_RAMP_TWEEN = {
  duration: 0.28,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
}

export const SPEED_RAMP_EXIT = {
  duration: 0.22,
  ease: [0.4, 0, 0.85, 0.2] as [number, number, number, number],
}

export const CARD_STAGGER_S = 0.07

/** Badge positions for expanded showcase (percent-based) */
export const FEATURE_BADGE_LAYOUTS: { top: string; left: string; rotate: number }[] = [
  { top: '12%', left: '8%', rotate: -4 },
  { top: '22%', left: '58%', rotate: 3 },
  { top: '48%', left: '18%', rotate: -2 },
  { top: '55%', left: '62%', rotate: 5 },
  { top: '72%', left: '10%', rotate: 2 },
  { top: '78%', left: '55%', rotate: -3 },
]

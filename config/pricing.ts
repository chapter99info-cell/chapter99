export type PublicPackageId = 'starter' | 'professional' | 'business'

export type PublicPackage = {
  id: PublicPackageId
  name: string
  setupAud: number | null
  monthlyAud: number | null
  comingSoon: boolean
  featured: boolean
  blurb: { th: string; en: string }
  cta: { th: string; en: string }
}

export const publicPackages: PublicPackage[] = [
  {
    id: 'starter',
    name: 'Starter',
    setupAud: 199,
    monthlyAud: 19,
    comingSoon: false,
    featured: false,
    blurb: {
      th: 'เริ่มต้นนำธุรกิจขึ้นออนไลน์ด้วยพื้นฐานที่จำเป็น',
      en: 'Get your business online with the essential foundation.',
    },
    cta: { th: 'เริ่มเลย', en: 'Get Started' },
  },
  {
    id: 'professional',
    name: 'Professional',
    setupAud: 499,
    monthlyAud: 49,
    comingSoon: false,
    featured: true,
    blurb: {
      th: 'ชุดที่ครบขึ้น สำหรับธุรกิจที่ต้องการความสามารถมากขึ้นและการดูแลต่อเนื่อง',
      en: 'A more complete setup for businesses needing greater capability and ongoing operation.',
    },
    cta: { th: 'คุยกับ Chapter99', en: 'Talk to Chapter99' },
  },
  {
    id: 'business',
    name: 'Business',
    setupAud: null,
    monthlyAud: null,
    comingSoon: true,
    featured: false,
    blurb: {
      th: 'สำหรับธุรกิจขนาดใหญ่หรือซับซ้อนกว่า — คุยกับเรา',
      en: 'For larger or more complex businesses — talk to us.',
    },
    cta: { th: 'คุยกับเรา', en: 'Talk to Us' },
  },
]

export const hardwareNote = {
  th: 'ฮาร์ดแวร์ (เช่น อุปกรณ์รับชำระเงิน) ธุรกิจซื้อตรงจากผู้ให้บริการที่เกี่ยวข้อง Chapter99 ไม่ได้จำหน่ายฮาร์ดแวร์',
  en: 'Any hardware (e.g. payment devices) is purchased directly by the business from the relevant provider. Chapter99 does not resell hardware.',
} as const

export function formatAud(amount: number) {
  return `A$${amount}`
}

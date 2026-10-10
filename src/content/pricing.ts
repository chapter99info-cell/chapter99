export type Segment = 'massage' | 'restaurant'

export type Bilingual = { th: string; en: string }

export type Plan = {
  id: string
  label: string
  setup: number
  monthly: number
  edits: number
  fromPrice?: boolean
  badge?: Bilingual
  bullets: readonly Bilingual[]
}

export function money(n: number) {
  return `A$${n.toLocaleString('en-AU')}`
}

export function setupDisplay(plan: Plan, lang: 'th' | 'en') {
  const amount = money(plan.setup)
  if (!plan.fromPrice) return amount
  return lang === 'th' ? `เริ่มต้น ${amount}` : `From ${amount}`
}

export function monthlyDisplay(plan: Plan, lang: 'th' | 'en') {
  return lang === 'th' ? `+ ${money(plan.monthly)} / เดือน` : `+ ${money(plan.monthly)} / mo`
}

export function editsDisplay(plan: Plan, lang: 'th' | 'en') {
  return lang === 'th' ? `แก้ข้อมูล ${plan.edits} รอบ/เดือน` : `${plan.edits} edit rounds / month`
}

export const pricing = {
  gstInclusive: true,
  massage: {
    starter: {
      id: 'starter',
      label: 'Starter',
      setup: 199,
      monthly: 19,
      edits: 2,
      bullets: [
        { th: 'เว็บไซต์ร้านบนมือถือ', en: 'Mobile shop website' },
        { th: 'บริการ/ราคา', en: 'Services and prices' },
        { th: 'แผนที่+ติดต่อ', en: 'Map + contact' },
        { th: 'ไม่มีระบบจอง', en: 'No booking system' },
      ],
    },
    professional: {
      id: 'professional',
      label: 'Professional',
      setup: 499,
      monthly: 49,
      edits: 4,
      badge: { th: 'แนะนำ', en: 'Recommended' },
      bullets: [
        { th: 'ทุกอย่างใน Starter', en: 'Everything in Starter' },
        { th: 'จองคิวออนไลน์', en: 'Online booking' },
        { th: 'แจ้งเตือนลูกค้า', en: 'Customer alerts' },
        { th: 'สอนใช้งาน', en: 'Hands-on training' },
      ],
    },
    business: {
      id: 'business',
      label: 'Business',
      setup: 999,
      monthly: 89,
      edits: 6,
      fromPrice: true,
      bullets: [
        { th: 'ทุกอย่างใน Professional', en: 'Everything in Professional' },
        { th: 'ระบบคิดเงิน POS', en: 'POS payments' },
        { th: 'Gift Voucher', en: 'Gift voucher' },
        { th: 'ป้ายจอทีวีในร้าน', en: 'In-shop TV display' },
      ],
    },
  },
  restaurant: {
    menu: {
      id: 'menu',
      label: 'Menu',
      setup: 349,
      monthly: 29,
      edits: 2,
      bullets: [
        { th: 'เว็บร้าน + เมนูมือถือ (≤40 รายการ)', en: 'Shop site + mobile menu (≤40 items)' },
        { th: 'QR โค้ดเปิดเมนู', en: 'QR code to the menu' },
        { th: 'ไฟล์พร้อมพิมพ์', en: 'Print-ready file' },
      ],
    },
    order: {
      id: 'order',
      label: 'Order',
      setup: 899,
      monthly: 69,
      edits: 5,
      badge: { th: 'แนะนำ', en: 'Recommended' },
      bullets: [
        { th: 'ทุกอย่างใน Menu', en: 'Everything in Menu' },
        { th: 'สั่งออนไลน์ผ่าน Square ของร้าน', en: 'Online orders via the shop’s Square' },
        { th: 'ถ่ายรูป 10 จานเด่น', en: 'Photos of 10 hero dishes' },
        { th: 'สอนใช้งาน', en: 'Hands-on training' },
      ],
    },
    launch: {
      id: 'launch',
      label: 'Launch',
      setup: 1499,
      monthly: 119,
      edits: 8,
      fromPrice: true,
      bullets: [
        { th: 'ทุกอย่างใน Order', en: 'Everything in Order' },
        { th: 'ถ่ายรูป ≤20 จาน + Reels 1 ตัว', en: '≤20 dish photos + 1 Reel' },
        { th: 'ตั้งเครื่องที่ร้าน ≤2 ชม.', en: 'On-site setup ≤2 hrs' },
      ],
    },
  },
  addons: {
    photography: { name: 'Photography', setup: 349, price: money(349) },
    reels: { name: 'Reels', setup: 349, price: money(349) },
    squareSetup: { name: 'Square Setup', setup: 199, price: money(199) },
  },
} as const

export type Pricing = typeof pricing

export function plansFor(segment: Segment): readonly Plan[] {
  if (segment === 'massage') {
    return [pricing.massage.starter, pricing.massage.professional, pricing.massage.business]
  }
  return [pricing.restaurant.menu, pricing.restaurant.order, pricing.restaurant.launch]
}

export const fromPrices = {
  massage: pricing.massage.starter.setup,
  restaurant: pricing.restaurant.menu.setup,
} as const

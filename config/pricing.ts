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

export type PricingLineId = 'web' | 'photo' | 'square'

export const pricingLines: { id: PricingLineId; hash: string; label: { th: string; en: string } }[] = [
  { id: 'web', hash: 'web', label: { th: 'เว็บและระบบร้าน', en: 'Web & shop setup' } },
  { id: 'photo', hash: 'photo', label: { th: 'ช่างภาพ', en: 'Photography' } },
  { id: 'square', hash: 'square', label: { th: 'Square', en: 'Square' } },
]

export type PhotoOffer = {
  id: string
  name: { th: string; en: string }
  amountAud: number
  unit: { th: string; en: string }
  featured: boolean
  blurb: { th: string; en: string }
  cta: { th: string; en: string }
  rates: { amountAud: number; unit: { th: string; en: string }; label: { th: string; en: string } }[]
}

export const photoPackages: PhotoOffer[] = [
  {
    id: 'photos',
    name: { th: 'ภาพนิ่ง', en: 'Photos' },
    amountAud: 349,
    unit: { th: '/ครั้ง (2 ชม.)', en: '/session (2 hrs)' },
    featured: false,
    blurb: {
      th: 'ถ่ายเต็มที่ตามเวลาที่จ้าง ไม่จำกัดจำนวนภาพ',
      en: 'Shoot for as long as booked, unlimited photos.',
    },
    cta: { th: 'จองคิวถ่ายภาพ', en: 'Book a photo shoot' },
    rates: [
      { amountAud: 199, unit: { th: '/ชม.', en: '/hr' }, label: { th: '1 ชม.', en: '1 hr' } },
      { amountAud: 349, unit: { th: '/ครั้ง', en: '/session' }, label: { th: '2 ชม.', en: '2 hrs' } },
      { amountAud: 590, unit: { th: '/ครั้ง', en: '/session' }, label: { th: 'ครึ่งวัน (4 ชม.)', en: 'Half day (4 hrs)' } },
      { amountAud: 449, unit: { th: '/เดือน', en: '/mo' }, label: { th: 'รายเดือน 2 ชม. + AI top-up', en: 'Monthly 2 hrs + AI top-up' } },
    ],
  },
  {
    id: 'video',
    name: { th: 'วิดีโอ', en: 'Video' },
    amountAud: 349,
    unit: { th: '/ครั้ง (1–2 ชม.)', en: '/session (1–2 hrs)' },
    featured: false,
    blurb: {
      th: 'Reels/Shorts ถ่ายสตูดิโอหรือนอกสถานที่',
      en: 'Reels/Shorts shot in studio or on location.',
    },
    cta: { th: 'จองคิวถ่ายวิดีโอ', en: 'Book a video shoot' },
    rates: [
      { amountAud: 349, unit: { th: '/ครั้ง', en: '/session' }, label: { th: '1–2 ชม. Reels/Shorts', en: '1–2 hrs Reels/Shorts' } },
      { amountAud: 690, unit: { th: '/เดือน', en: '/mo' }, label: { th: 'รายเดือน 2 ชม.', en: 'Monthly 2 hrs' } },
    ],
  },
  {
    id: 'combo',
    name: { th: 'ภาพนิ่ง + วิดีโอ', en: 'Photo + Video' },
    amountAud: 990,
    unit: { th: '/เดือน', en: '/mo' },
    featured: true,
    blurb: {
      th: 'ครึ่งวันครั้งเดียว หรือรายเดือนถ้าใช้บ่อย',
      en: 'One half-day session, or monthly if you shoot often.',
    },
    cta: { th: 'คุยแพ็กนี้', en: 'Talk about this package' },
    rates: [
      { amountAud: 690, unit: { th: '/ครั้ง', en: '/session' }, label: { th: 'ครึ่งวัน ภาพนิ่ง + วิดีโอ', en: 'Half day photo + video' } },
      { amountAud: 990, unit: { th: '/เดือน', en: '/mo' }, label: { th: 'รายเดือน', en: 'Monthly' } },
    ],
  },
]

export const photoNotes = {
  heading: { th: 'ราคาแพ็กเกจช่างภาพ', en: 'Photography package rates' },
  sub: {
    th: 'ถ่ายเต็มที่ตามเวลาที่จ้างและความร่วมมือของร้าน ไม่จำกัดจำนวนภาพในเวลาที่จอง',
    en: 'Shoot for as long as you book, based on the shop’s availability — unlimited photos in the booked time.',
  },
  ai: {
    th: 'AI photo top-up ใช้กับคอนเทนต์โปรโมทและกราฟิกทั่วไปเท่านั้น ไม่ใช้สร้างภาพอาหาร หน้าร้าน หรือพนักงานให้ดูเหมือนถ่ายจริง',
    en: 'AI photo top-up is only for promotional graphics. It is not used to fake real food, storefront or staff photos.',
  },
} as const

export const squareSetupAud = 199

export const squareSetup = {
  title: { th: 'Square Setup', en: 'Square Setup' },
  tag: { th: 'ส่วนเสริม · ไม่ใช่แพ็กเกจที่ 4', en: 'Optional add-on · not a fourth package' },
  subtitle: {
    th: 'ตั้งระบบรับชำระเงินให้พร้อมใช้งาน',
    en: 'Set up payments so the shop can take money.',
  },
  unit: { th: 'ครั้งเดียว · ค่าบริการ Setup ของ Chapter99', en: 'one-time · Chapter99 setup fee' },
  cta: { th: 'คุยเรื่อง Square Setup', en: 'Talk about Square Setup' },
  items: [
    { th: 'แนะนำการเปิดบัญชี / ตั้งค่าธุรกิจบน Square', en: 'Square account / business setup guidance' },
    { th: 'ตั้งค่าบริการ / สินค้า / ราคา', en: 'Services / items / pricing configuration' },
    { th: 'ตั้งค่าใบเสร็จและขั้นตอนรับชำระเงิน', en: 'Receipt and payment workflow setup' },
    { th: 'เชื่อมเว็บไซต์ / การจอง / การชำระเงินตามที่ใช้งานได้', en: 'Website / booking / payment connection where applicable' },
    { th: 'ทดสอบขั้นตอนจ่ายเงินก่อนเปิดใช้งาน', en: 'Payment flow testing before launch' },
    { th: 'ส่งมอบและแนะนำการใช้งานเบื้องต้น', en: 'Basic handover / setup guidance' },
  ],
  ownership: {
    th: 'บัญชี Square การยืนยันตัวตน บัญชีธนาคาร และความสัมพันธ์รับชำระเงินเป็นของร้าน Chapter99 ช่วยตั้งค่าตามที่ตกลง ไม่เก็บข้อมูลบัตรดิบ',
    en: 'The shop owns the Square account, verification, bank account and payment relationship. Chapter99 assists configuration as agreed. We never store raw card data.',
  },
  feeNote: {
    th: 'ตัวเลขนี้คือค่าบริการ Setup ของ Chapter99 ค่าซอฟต์แวร์ ค่าธรรมเนียมรับชำระเงิน และฮาร์ดแวร์ของ Square คิดแยกตามการใช้งานจริง',
    en: 'This figure is Chapter99’s setup fee. Square software, processing fees and hardware are charged separately according to actual use.',
  },
  surcharge: {
    th: 'ตั้งแต่ 1 ตุลาคม 2026 ออสเตรเลียไม่อนุญาต card surcharge ตามมติ RBA ราคาที่ลูกค้าเห็นควรเป็นราคาที่จ่ายจริง',
    en: 'From 1 October 2026, card surcharging is not permitted in Australia under the RBA decision. Customer-facing prices should be the price the customer pays.',
  },
} as const

export const hardwareNote = {
  th: 'ฮาร์ดแวร์ (เช่น อุปกรณ์รับชำระเงิน) ธุรกิจซื้อตรงจากผู้ให้บริการที่เกี่ยวข้อง Chapter99 ไม่ได้จำหน่ายฮาร์ดแวร์',
  en: 'Any hardware (e.g. payment devices) is purchased directly by the business from the relevant provider. Chapter99 does not resell hardware.',
} as const

export function formatAud(amount: number) {
  return `A$${amount}`
}

export function pricingLineFromHash(hash: string): PricingLineId {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (id === 'photo' || id === 'photo-rates' || id === 'photos' || id === 'video' || id === 'combo') return 'photo'
  if (id === 'square' || id === 'square-setup') return 'square'
  return 'web'
}

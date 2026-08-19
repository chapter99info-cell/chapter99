import type { Addon, CatalogPackage } from '../types'

export const WEDDING_PACKAGES: CatalogPackage[] = [
  {
    id: 'w1',
    kind: 'wedding',
    name: 'Small Wedding (2 hrs)',
    price: 1400,
    hours: 2,
    blurb: ['2 ชม. คุ้มครอง', '1 ช่างภาพ', 'ภาพความละเอียดสูงทั้งหมด', 'อัลบั้มออนไลน์ส่วนตัว'],
  },
  {
    id: 'w2',
    kind: 'wedding',
    name: 'Small Wedding (4 hrs)',
    price: 1600,
    hours: 4,
    blurb: ['4 ชม. คุ้มครอง', '1 ช่างภาพ', 'ภาพความละเอียดสูงทั้งหมด', 'อัลบั้มออนไลน์ส่วนตัว'],
  },
  {
    id: 'w3',
    kind: 'wedding',
    name: 'Diamond Package',
    price: 2500,
    hours: 8,
    blurb: ['6-8 ชม. คุ้มครอง', '1 ช่างภาพ, กล้องหลายตัว', 'Photobook ขนาดกลาง', 'อัลบั้มออนไลน์แชร์ได้'],
  },
  {
    id: 'w4',
    kind: 'wedding',
    name: 'Deluxe Package',
    price: 4400,
    hours: 10,
    blurb: ['8-10 ชม. เต็มวัน', '2 ช่างภาพ, กล้องหลายตัว', 'Photobook ขนาดใหญ่', 'อัลบั้มออนไลน์แชร์ครอบครัว/เพื่อน'],
  },
]

export const ENGAGEMENT_PACKAGES: CatalogPackage[] = [
  {
    id: 'e1',
    kind: 'engagement',
    name: 'Package 1',
    price: 950,
    hours: 2,
    blurb: ['ช่วงเวลาพระอาทิตย์ตก 2 ชม.', '1 ช่างภาพ', 'ถ่ายในเมือง ไม่จำกัดจำนวนภาพ', 'รีทัชภาพ + Online Gallery + USB'],
  },
  {
    id: 'e2',
    kind: 'engagement',
    name: 'Package 2',
    price: 1700,
    hours: 4,
    blurb: ['Sunset & After Dark 4 ชม.', '1 ช่างภาพ + ผู้ช่วย', 'พื้นที่ถ่ายซิดนีย์ ไม่จำกัดจำนวนภาพ', 'รีทัชภาพ + Online Gallery ฟรี'],
  },
  {
    id: 'e3',
    kind: 'engagement',
    name: 'Package 3',
    price: 2400,
    hours: 8,
    blurb: ['เต็มวัน 8 ชม.', '1 ช่างภาพ + ผู้ช่วย + รถรับส่ง', 'พื้นที่ถ่ายซิดนีย์ ไม่จำกัดจำนวนภาพ', 'รีทัชภาพ + Wedding guest photobook'],
  },
]

export const ALL_PACKAGES = [...WEDDING_PACKAGES, ...ENGAGEMENT_PACKAGES]

export const ADDONS: Addon[] = [
  { id: 'extra-photographer', name: 'Additional photographer', price: 600 },
  { id: 'saen-video', name: 'Saen shoots video himself (extra)', price: 500 },
  {
    id: 'freelance-video',
    name: 'Hire freelance videographer (extra)',
    price: 800,
    suggestsExpense: {
      category: 'Freelancer / contractor',
      description: 'Freelance videographer hire (typical average cost)',
      typicalAmount: 400,
    },
  },
  { id: 'drone', name: 'Aerial drone', price: 475 },
  { id: 'extra-album', name: 'Extra photo album', price: 1000 },
  { id: 'raw-footage', name: 'Raw/unedited footage', price: 500 },
]

export const EXPENSE_PRESETS = [
  { category: 'Equipment', description: 'Camera / lighting / grip equipment' },
  { category: 'Travel', description: 'Travel to job (fuel, tolls, parking)' },
  { category: 'Software', description: 'Editing / gallery / subscription software' },
  { category: 'Insurance', description: 'Public liability / equipment insurance' },
  { category: 'Marketing', description: 'Ads, website, or promotional costs' },
  { category: 'Studio/workspace rent', description: 'Studio or workspace rent' },
  { category: 'Phone/internet', description: 'Phone and internet for the business' },
  { category: 'Bank & merchant fees', description: 'Bank, Square, or Afterpay merchant fees' },
  { category: 'Training', description: 'Workshops or professional training' },
  { category: 'Accounting/bookkeeping fees', description: 'Accountant or bookkeeping fees' },
] as const

export const VENDOR_ROLES = [
  'Venue',
  'Coordinator',
  'Planner',
  'Caterer',
  'Florist',
  'Beauty (Hair/MU)',
  'DJ / Band',
  'Cake',
]

export const TYPE_LABEL: Record<string, string> = {
  wedding: 'งานแต่งงาน',
  engagement: 'Pre-Wedding / Engagement',
  portrait: 'Portrait/Branding',
  family: 'Family Portrait',
}

export const STATUS_LABEL: Record<string, string> = {
  draft: 'รอเซ็นสัญญา',
  pending: 'รอมัดจำ',
  confirmed: 'ยืนยันแล้ว',
  paid: 'จ่ายครบแล้ว',
}

export const PAYMENT_LABEL: Record<string, string> = {
  bank: 'Bank transfer / PayID (0%)',
  card: 'Credit / debit card (+2%)',
  afterpay: 'Afterpay (+5%)',
}

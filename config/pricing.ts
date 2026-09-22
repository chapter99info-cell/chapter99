// SINGLE SOURCE OF TRUTH for all customer-facing prices on chapter99info.com.
// Every page (pricing, photography, industry pages) must import from here —
// do not hardcode a second price list anywhere else.
// Items marked pending: true are not confirmed for sale yet and must show a
// "TBC in quote" note instead of a hard commitment.

export type Bi = { th: string; en: string }

export type PublicPackageId = 'starter' | 'professional' | 'business'

export type PublicPackage = {
  id: PublicPackageId
  name: string
  setupAud: number | null
  monthlyAud: number | null
  comingSoon: boolean
  featured: boolean
  blurb: Bi
  cta: Bi
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

export const webScopeNote: Bi = {
  th: 'แพ็กเว็บไซต์และระบบยังไม่รวมระบบรับเงิน ระบบสั่งอาหาร หรือระบบจองเฉพาะทาง — บริการเหล่านี้ประเมินและเสนอราคาแยกเป็นรายกรณี',
  en: 'Website plans do not include payment processing, food-ordering systems, or specialised booking systems — these are scoped and quoted separately.',
}

export const squareSetupAud = 199

export const squareSetup = {
  title: { th: 'Square Setup', en: 'Square Setup' },
  tag: { th: 'ส่วนเสริมของแพ็กเว็บ · ไม่ใช่แพ็กเกจแยก', en: 'Add-on to a website plan · not a standalone tier' },
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
} as const

export const hardwareNote: Bi = {
  th: 'ฮาร์ดแวร์ (เช่น อุปกรณ์รับชำระเงิน) ธุรกิจซื้อตรงจากผู้ให้บริการที่เกี่ยวข้อง Chapter99 ไม่ได้จำหน่ายฮาร์ดแวร์',
  en: 'Any hardware (e.g. payment devices) is purchased directly by the business from the relevant provider. Chapter99 does not resell hardware.',
}

// ---------------------------------------------------------------------------
// Category tabs
// ---------------------------------------------------------------------------

export type CategoryId = 'web' | 'brand' | 'profile-family' | 'wedding' | 'bundle'

export const categories: { id: CategoryId; hash: string; label: Bi }[] = [
  { id: 'web', hash: 'web', label: { th: 'เว็บไซต์และระบบ', en: 'Website & systems' } },
  { id: 'brand', hash: 'brand', label: { th: 'ภาพ + วิดีโอธุรกิจ', en: 'Brand photo + video' } },
  { id: 'profile-family', hash: 'profile-family', label: { th: 'โปรไฟล์และครอบครัว', en: 'Profile & family' } },
  { id: 'wedding', hash: 'wedding', label: { th: 'งานแต่ง', en: 'Wedding' } },
  { id: 'bundle', hash: 'bundle', label: { th: 'ภาพ + เว็บ', en: 'Photo + web' } },
]

export function categoryFromHash(hash: string): CategoryId {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (categories.some((c) => c.id === id)) return id as CategoryId
  // deep links straight to one package card
  if (id.startsWith('brand-')) return 'brand'
  if (id.startsWith('profile-') || id.startsWith('family-') || id === 'personal-brand') return 'profile-family'
  if (id.startsWith('wedding-')) return 'wedding'
  if (id.endsWith('-together')) return 'bundle'
  if (id === 'starter' || id === 'professional' || id === 'business' || id === 'square' || id === 'square-setup') return 'web'
  // legacy anchors from the previous 3-line pricing page
  if (id === 'photo' || id === 'photo-rates' || id === 'photos' || id === 'video' || id === 'combo') return 'brand'
  return 'web'
}

// ---------------------------------------------------------------------------
// 2. Brand photo + video (business) — source: chapter99studio.mypixieset.com
// personal-brand-photoshoot-copy-1
// ---------------------------------------------------------------------------

export const brandSourceUrl = 'https://chapter99studio.mypixieset.com/personal-brand-photoshoot-copy-1/'

export type BrandPackage = {
  id: string
  name: Bi
  amountAud: number
  unit: Bi
  featured: boolean
  recommendedFor: Bi
  includes: Bi[]
  notes: Bi[]
}

export const brandPackages: BrandPackage[] = [
  {
    id: 'brand-starter',
    name: { th: 'Brand Starter', en: 'Brand Starter' },
    amountAud: 650,
    unit: { th: '/ครั้ง', en: '/session' },
    featured: false,
    recommendedFor: { th: 'แนะนำสำหรับ: ทดลองถ่ายครั้งแรก หรือคอนเทนต์รอบเปิดตัว', en: 'Recommended for: a first trial shoot or a launch-moment content push.' },
    includes: [
      { th: 'ถ่ายรวมประมาณ 90 นาที (เวลารวมสำหรับภาพและวิดีโอ)', en: 'About 90 minutes total shoot time (combined for photo and video)' },
      { th: '1 สถานที่', en: '1 location' },
      { th: 'ภาพปรับแสงสีแล้วประมาณ 30–50 ภาพ', en: 'Approx. 30–50 colour-graded photos' },
      { th: 'คลิปโซเชียล 1 คลิป ความยาวไม่เกิน 60 วินาที', en: '1 social clip, up to 60 seconds' },
    ],
    notes: [],
  },
  {
    id: 'brand-refresh',
    name: { th: 'Brand Refresh', en: 'Brand Refresh' },
    amountAud: 1250,
    unit: { th: '/ปี', en: '/year' },
    featured: true,
    recommendedFor: { th: 'แนะนำสำหรับ: แบรนด์ที่อยากอัปเดตภาพปีละ 2 ช่วง', en: 'Recommended for: brands that want to refresh visuals twice a year.' },
    includes: [
      { th: 'ถ่าย 2 ครั้งต่อปี ครั้งละประมาณ 90 นาที (เวลารวมภาพและวิดีโอ)', en: '2 sessions per year, about 90 minutes each (combined photo + video time)' },
      { th: '1 สถานที่ต่อครั้ง', en: '1 location per session' },
      { th: 'ภาพประมาณ 30–50 ภาพต่อครั้ง', en: 'Approx. 30–50 photos per session' },
      { th: 'คลิปไม่เกิน 60 วินาที 1 คลิปต่อครั้ง', en: '1 clip up to 60 seconds per session' },
    ],
    notes: [{ th: 'ชื่อแพ็กใหม่นี้ใช้แทนชื่อเดิม “Brand Booster”', en: 'This is the renamed package — previously listed as “Brand Booster”.' }],
  },
  {
    id: 'brand-continuity',
    name: { th: 'Brand Continuity', en: 'Brand Continuity' },
    amountAud: 1650,
    unit: { th: '/ปี', en: '/year' },
    featured: false,
    recommendedFor: { th: 'แนะนำสำหรับ: แบรนด์ที่ต้องการคอนเทนต์ต่อเนื่องตลอดปี', en: 'Recommended for: brands that want continuous content across the year.' },
    includes: [
      { th: 'ถ่าย 3 ครั้งต่อปี ครั้งละประมาณ 90 นาที (เวลารวมภาพและวิดีโอ)', en: '3 sessions per year, about 90 minutes each (combined photo + video time)' },
      { th: 'ภาพรวมประมาณ 90–150 ภาพตลอดทั้งปี', en: 'Approx. 90–150 photos across the year in total' },
      { th: 'คลิปรวม 3 คลิป ความยาวไม่เกิน 60 วินาทีต่อคลิป', en: '3 clips in total, each up to 60 seconds' },
      { th: 'แก้ไขคลิปได้คลิปละ 1 รอบ', en: '1 revision round per clip' },
      { th: 'วางแนวคิดคอนเทนต์ร่วมกันตามช่วงสำคัญของธุรกิจ', en: 'Joint content planning around key moments in the business calendar' },
    ],
    notes: [
      { th: 'ชื่อแพ็กใหม่นี้ใช้แทนชื่อเดิม “Comprehensive Brand Elevation”', en: 'This is the renamed package — previously listed as “Comprehensive Brand Elevation”.' },
      { th: '3 ครั้งต่อปีนี้ไม่ใช่ตารางรายไตรมาส วันถ่ายจริงตกลงตามความสะดวกของทั้งสองฝ่าย', en: 'The 3 sessions per year are not a fixed quarterly schedule — actual shoot dates are agreed between both sides.' },
    ],
  },
]

export const brandCategoryNote: Bi = {
  th: 'รอบชำระเงิน วันส่งงาน และจำนวนรอบแก้ไขที่ยังไม่ระบุในแพ็กจะยืนยันในใบเสนอราคาก่อนเริ่มงานเสมอ',
  en: 'Payment schedule, delivery dates and any revision rounds not listed above are confirmed in the written quote before work begins.',
}

// ---------------------------------------------------------------------------
// 3a. Profile photography — source: mypixieset personal-brand-photoshoot-copy
// ---------------------------------------------------------------------------

export const profileSourceUrl = 'https://chapter99studio.mypixieset.com/personal-brand-photoshoot-copy/'

export type SimplePackage = {
  id: string
  name: Bi
  amountAud: number
  isFrom: boolean
  duration: Bi
  deliverable: Bi
  recommendedFor: Bi
  featured: boolean
}

export const profilePackages: SimplePackage[] = [
  {
    id: 'profile-basic',
    name: { th: 'Basic', en: 'Basic' },
    amountAud: 250,
    isFrom: false,
    duration: { th: '45 นาที', en: '45 minutes' },
    deliverable: { th: '15 ภาพ', en: '15 photos' },
    recommendedFor: { th: 'แนะนำสำหรับ: อัปเดตโปรไฟล์เร็ว ๆ', en: 'Recommended for: a quick profile update.' },
    featured: false,
  },
  {
    id: 'profile-standard',
    name: { th: 'Standard', en: 'Standard' },
    amountAud: 650,
    isFrom: false,
    duration: { th: '2 ชั่วโมง', en: '2 hours' },
    deliverable: { th: '30 ภาพ', en: '30 photos' },
    recommendedFor: { th: 'แนะนำสำหรับ: หลายชุดเสื้อผ้า / หลายมุมใช้งาน', en: 'Recommended for: multiple outfits or use cases.' },
    featured: true,
  },
  {
    id: 'profile-premium',
    name: { th: 'Premium', en: 'Premium' },
    amountAud: 950,
    isFrom: false,
    duration: { th: '4 ชั่วโมง', en: '4 hours' },
    deliverable: { th: '50 ภาพ', en: '50 photos' },
    recommendedFor: { th: 'แนะนำสำหรับ: ชุดภาพครบสำหรับหลายช่องทาง', en: 'Recommended for: a full set covering multiple channels.' },
    featured: false,
  },
]

// ---------------------------------------------------------------------------
// 3b. Family photography — source: mypixieset new-page
// ---------------------------------------------------------------------------

export const familySourceUrl = 'https://chapter99studio.mypixieset.com/new-page/'

export type FamilyPackage = {
  id: string
  name: Bi
  amountAud: number
  duration: Bi
  recommendedFor: Bi
  featured: boolean
  extra?: Bi
}

export const familyPackages: FamilyPackage[] = [
  {
    id: 'family-simply',
    name: { th: 'Simply', en: 'Simply' },
    amountAud: 250,
    duration: { th: '30 นาที', en: '30 minutes' },
    recommendedFor: { th: 'แนะนำสำหรับ: เซสชันสั้น ๆ ธรรมชาติ', en: 'Recommended for: a short, natural session.' },
    featured: false,
  },
  {
    id: 'family-essential',
    name: { th: 'Essential', en: 'Essential' },
    amountAud: 650,
    duration: { th: '60 นาที', en: '60 minutes' },
    recommendedFor: { th: 'แนะนำสำหรับ: ครอบครัวที่อยากได้หลายมุม หลายจุดถ่าย', en: 'Recommended for: families wanting more angles and settings.' },
    featured: true,
  },
  {
    id: 'family-premium',
    name: { th: 'Premium', en: 'Premium' },
    amountAud: 990,
    duration: { th: '2 ชั่วโมง', en: '2 hours' },
    recommendedFor: { th: 'แนะนำสำหรับ: ครอบครัวใหญ่หรืองานที่ต้องการผู้ช่วยถ่าย', en: 'Recommended for: larger families or shoots needing an assistant.' },
    featured: false,
    extra: { th: 'มีผู้ช่วยช่างภาพ', en: 'Includes a photography assistant' },
  },
]

export const familyPriceFromNote: Bi = {
  th: 'ราคาที่แสดงเป็นราคาเริ่มต้น (เริ่ม A$) จำนวนภาพส่งมอบขึ้นกับสถานที่และจำนวนคน ต้องยืนยันจำนวนภาพก่อนจองเสมอ',
  en: 'Prices shown are starting prices (from A$). The number of delivered photos depends on location and group size, and is confirmed before booking.',
}

// ---------------------------------------------------------------------------
// 3c. Personal Brand — link-only, not open for sale yet
// ---------------------------------------------------------------------------

export const personalBrandPending = {
  title: { th: 'Personal Brand', en: 'Personal Brand' },
  body: {
    th: 'แพ็กเกจ Personal Brand แบบเต็มยังไม่เปิดขายบนหน้านี้ จนกว่าจะยืนยันเรื่องช่างแต่งหน้าและจำนวนครั้งถ่ายในแพ็กรายปี ดูตัวอย่างงานและรายละเอียดเบื้องต้นได้ที่ลิงก์ด้านล่าง แล้วทักทีมเพื่อคุยขอบเขต',
    en: 'The full Personal Brand package is not yet listed for sale here — it is pending confirmation on make-up artist availability and the number of shoots in the annual plan. See sample work and early detail via the link below, then talk to the team about scope.',
  },
  clipNote: {
    th: 'หมายเหตุ: คลิปที่ถ่ายด้วย iPhone ในแพ็กนี้เป็นคลิปดิบ/กึ่งตัดต่อ ไม่ใช่ Reels ที่ตัดต่อสำเร็จรูปแบบมืออาชีพ — ขอบเขตงานตัดต่อจะระบุแยกในใบเสนอราคา',
    en: 'Note: iPhone clips in this package are raw / lightly edited footage, not fully produced Reels. Edited-Reels scope is quoted separately.',
  },
  cta: { th: 'ดูตัวอย่างงาน', en: 'See sample work' },
} as const

// ---------------------------------------------------------------------------
// 4. Wedding — source: chapter99.mypixieset.com/wedding
// ---------------------------------------------------------------------------

export const weddingSourceUrl = 'https://chapter99.mypixieset.com/wedding/'

export type WeddingRate = { amountAud: number; unit: Bi }

export type WeddingPackage = {
  id: string
  name: Bi
  rates: WeddingRate[]
  photographers: number
  album: Bi
  recommendedFor: Bi
  featured: boolean
}

export const weddingPackages: WeddingPackage[] = [
  {
    id: 'wedding-small',
    name: { th: 'Small Wedding', en: 'Small Wedding' },
    rates: [
      { amountAud: 1400, unit: { th: '/ 2 ชั่วโมง', en: '/ 2 hours' } },
      { amountAud: 1600, unit: { th: '/ 4 ชั่วโมง', en: '/ 4 hours' } },
    ],
    photographers: 1,
    album: { th: 'ไม่รวมอัลบั้ม', en: 'No album included' },
    recommendedFor: { th: 'แนะนำสำหรับ: งานแต่งขนาดเล็ก พิธีสั้น', en: 'Recommended for: small weddings, short ceremonies.' },
    featured: false,
  },
  {
    id: 'wedding-diamond',
    name: { th: 'Diamond', en: 'Diamond' },
    rates: [{ amountAud: 2500, unit: { th: '/ 6–8 ชั่วโมง', en: '/ 6–8 hours' } }],
    photographers: 1,
    album: { th: 'อัลบั้มขนาดกลาง', en: 'Medium album' },
    recommendedFor: { th: 'แนะนำสำหรับ: งานแต่งเต็มวัน ช่างภาพ 1 คน', en: 'Recommended for: full-day weddings with one photographer.' },
    featured: true,
  },
  {
    id: 'wedding-deluxe',
    name: { th: 'Deluxe', en: 'Deluxe' },
    rates: [{ amountAud: 4400, unit: { th: '/ 8–10 ชั่วโมง', en: '/ 8–10 hours' } }],
    photographers: 2,
    album: { th: 'อัลบั้มขนาดใหญ่', en: 'Large album' },
    recommendedFor: { th: 'แนะนำสำหรับ: งานแต่งใหญ่ ต้องการช่างภาพ 2 คนและอัลบั้มครบ', en: 'Recommended for: large weddings needing two photographers and a full album.' },
    featured: false,
  },
]

export const weddingGstNote: Bi = {
  th: 'ราคาที่แสดงรวม GST แล้ว ตามหน้าอ้างอิงผลงานงานแต่งของ Chapter99',
  en: 'Prices shown are GST-inclusive, matching Chapter99’s published wedding portfolio page.',
}

export const weddingScopeNote: Bi = {
  th: 'เงื่อนไขการส่งภาพและสิทธิ์การใช้งานของแพ็กงานแต่งเป็นคนละเงื่อนไขกับแพ็กภาพธุรกิจ — อ้างอิงตามข้อตกลงงานแต่งงานเท่านั้น',
  en: 'Delivery terms and usage rights for wedding packages are separate from the business/brand packages — governed by the wedding agreement only.',
}

// ---------------------------------------------------------------------------
// 5. Photo + Web bundles
// ---------------------------------------------------------------------------

export type BundlePackage = {
  id: string
  name: Bi
  lineItems: Bi[]
  totalLabel: Bi
  totalAud: number
  monthlyAud: number | null
  shoots: Bi
  featured: boolean
}

export const bundlePackages: BundlePackage[] = [
  {
    id: 'launch-together',
    name: { th: 'Launch Together', en: 'Launch Together' },
    lineItems: [
      { th: 'Professional Website — A$499', en: 'Professional Website — A$499' },
      { th: 'Brand Starter — A$650', en: 'Brand Starter — A$650' },
    ],
    totalLabel: { th: 'รวมค่าตั้งต้นครั้งแรก', en: 'Combined first-time setup' },
    totalAud: 1149,
    monthlyAud: 49,
    shoots: { th: 'รวมถ่าย 1 ครั้ง', en: 'Includes 1 shoot' },
    featured: false,
  },
  {
    id: 'refresh-together',
    name: { th: 'Refresh Together', en: 'Refresh Together' },
    lineItems: [
      { th: 'Professional Website — A$499', en: 'Professional Website — A$499' },
      { th: 'Brand Refresh — A$1,250', en: 'Brand Refresh — A$1,250' },
    ],
    totalLabel: { th: 'รวมค่าตั้งเว็บ + สิทธิ์ถ่าย 2 ครั้งในปีแรก', en: 'Combined web setup + 2 shoots in year one' },
    totalAud: 1749,
    monthlyAud: 49,
    shoots: { th: 'สิทธิ์ถ่าย 2 ครั้งในปีแรก', en: '2 shoots included in year one' },
    featured: true,
  },
  {
    id: 'continuity-together',
    name: { th: 'Continuity Together', en: 'Continuity Together' },
    lineItems: [
      { th: 'Professional Website — A$499', en: 'Professional Website — A$499' },
      { th: 'Brand Continuity — A$1,650', en: 'Brand Continuity — A$1,650' },
    ],
    totalLabel: { th: 'รวมค่าตั้งเว็บ + สิทธิ์ถ่าย 3 ครั้งในปีแรก', en: 'Combined web setup + 3 shoots in year one' },
    totalAud: 2149,
    monthlyAud: 49,
    shoots: { th: 'สิทธิ์ถ่าย 3 ครั้งในปีแรก', en: '3 shoots included in year one' },
    featured: false,
  },
]

export const bundleNotes: Bi[] = [
  { th: 'ตัวเลขรวมนี้คือการรวมราคาสองบริการอย่างโปร่งใส ไม่ใช่ส่วนลดพิเศษ', en: 'These totals are a transparent combination of two services — not a discount offer.' },
  { th: 'ค่าดูแลเว็บรายเดือน A$49 ไม่รวมการออกไปถ่ายใหม่ทุกเดือน', en: 'The A$49/month web care fee does not include a new photo shoot every month.' },
  { th: 'ปีต่อไปไม่คิดค่าตั้งเว็บเดิมซ้ำ หากไม่มีงานสร้างใหม่', en: 'From year two, the original website setup fee is not charged again if no new build work is required.' },
  { th: 'แผนถ่ายภาพต่ออายุปีถัดไปแยกตามข้อตกลงในใบเสนอราคา', en: 'Renewing the photo plan in future years follows the terms in that year’s written agreement.' },
  { th: 'ยอดรวมนี้เป็นตัวเลขร่าง ต้องตรวจฐาน GST ของแต่ละบริการให้ตรงกันก่อนเผยแพร่จริง', en: 'These totals are draft figures — GST treatment for each service must be checked and aligned before publishing live.' },
]

// ---------------------------------------------------------------------------
// 7. Value comparison checklist
// ---------------------------------------------------------------------------

export const valueSectionTitle: Bi = {
  th: 'ก่อนเทียบราคา ลองเทียบสิ่งที่ได้รับ',
  en: 'Before comparing price, compare what you get',
}

export const valueChecklist: Bi[] = [
  { th: 'การคุยบรีฟและวางรายการภาพ', en: 'Brief call and shot-list planning' },
  { th: 'เวลาและสถานที่ถ่าย', en: 'Shoot time and location' },
  { th: 'จำนวนภาพและระดับการแต่งภาพ', en: 'Number of photos and edit level' },
  { th: 'คลิปดิบหรือคลิปตัดต่อ', en: 'Raw footage vs. edited clip' },
  { th: 'เสียง เพลง และคำบรรยาย', en: 'Audio, music and captions' },
  { th: 'ขนาดไฟล์และช่องทางนำไปใช้', en: 'File sizes and delivery formats for each channel' },
  { th: 'รอบแก้ไขและกำหนดส่งงาน', en: 'Revision rounds and delivery timeline' },
  { th: 'สิทธิ์การใช้ภาพ', en: 'Usage rights for the images' },
  { th: 'ค่าเดินทางและค่าใช้จ่ายเพิ่มเติม', en: 'Travel and any additional costs' },
]

export const experienceNote: Bi = {
  th: 'ทุกแพ็กด้านบนวางแผนงานจากประสบการณ์ตรงของพี่แสน ช่างภาพที่ทำงานสายธุรกิจและงานแต่งมากว่า 10 ปี งานถ่ายจริงดำเนินการโดยทีม Chapter99 — ทีมงานที่รับผิดชอบจะยืนยันกับคุณก่อนวันจองเสมอ',
  en: 'Every package above is planned from Saen’s direct experience — a photographer working across business and wedding shoots for over 10 years. Shoots are carried out by the Chapter99 team, and the team member responsible is confirmed with you before the booking date.',
}

// ---------------------------------------------------------------------------
// 8. Budget-fit note
// ---------------------------------------------------------------------------

export const budgetFitNote: Bi = {
  th: 'บอกเป้าหมายและงบประมาณของคุณ เราจะช่วยปรับเวลาถ่าย จำนวนภาพ หรือจำนวนคลิปให้เหมาะสม โดยรักษามาตรฐานการตรวจงานและสิ่งที่ตกลงส่งมอบ',
  en: 'Tell us your goal and budget, and we’ll help adjust shoot time, photo count, or clip count to fit — while keeping our review standard and agreed deliverables intact.',
}

// ---------------------------------------------------------------------------
// 9. Portfolio / contact links
// ---------------------------------------------------------------------------

export const portfolioLinks: Record<CategoryId, { href: Bi | string; external: boolean }> = {
  web: { href: '/work', external: false },
  brand: { href: brandSourceUrl, external: true },
  'profile-family': { href: profileSourceUrl, external: true },
  wedding: { href: weddingSourceUrl, external: true },
  bundle: { href: '/work', external: false },
}

export function formatAud(amount: number) {
  return `A$${amount.toLocaleString('en-AU')}`
}

export function buildContactHref(category: CategoryId, packageName: string) {
  const label = categories.find((c) => c.id === category)?.label.en ?? category
  const plan = `${label} — ${packageName}`
  return `/contact?need=photo&plan=${encodeURIComponent(plan)}`
}

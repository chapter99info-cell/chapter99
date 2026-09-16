export const CONTACT_EMAIL = 'chapter99info@gmail.com'

export const previewNotice =
  'เวอร์ชันพรีวิว · ราคาและความสามารถต้องยืนยันก่อนเปิดขาย'

export const priceDisclaimer =
  'ราคาด้านล่างเป็นราคาทดลองในเวอร์ชันพรีวิว ไม่ใช่ราคาขายที่อนุมัติ และยังไม่มีการรับชำระเงินบนเว็บนี้'

export const currencyNote =
  'สกุลเงิน AUD · ค่าจัดทำครั้งแรก ภาษี (GST) ภาพถ่าย SMS อุปกรณ์ และบริการภายนอก ต้องระบุในใบเสนอราคาแยกให้ครบ'

export const homePriceNote =
  'สกุลเงิน AUD · ค่าจัดทำครั้งแรก ภาษี ภาพถ่าย SMS อุปกรณ์ และบริการภายนอก ต้องระบุในใบเสนอราคาแยกให้ครบ · ยังไม่มีส่วนลดรายปีหรือการรับเงินอัตโนมัติในต้นแบบ'

export type PlanId = 'digital-shop' | 'owner-care' | 'growth'

export type Plan = {
  id: PlanId
  eyebrow: string
  title: string
  monthlyLabel: string
  monthlyNote: string
  setupLabel: string
  featured?: boolean
  includes: string[]
  limits: string[]
  cta: string
}

export const plans: Plan[] = [
  {
    id: 'digital-shop',
    eyebrow: 'DIGITAL SHOP',
    title: 'มีหน้าร้านออนไลน์',
    monthlyLabel: 'A$49',
    monthlyNote: '/เดือน',
    setupLabel: 'ค่าจัดทำครั้งแรก: เสนอในใบเสนอราคา',
    includes: [
      'วางเว็บไซต์และข้อมูลร้าน',
      'วางขั้นตอนการจอง',
      'ช่องทาง Google / Maps',
      'กำหนดข้อมูลลูกค้าที่จำเป็น',
    ],
    limits: [
      'ยังไม่รวมถ่ายภาพ อุปกรณ์ หรือบริการภายนอก',
      'ขอบเขตอัปเดตรายเดือนตกลงเป็นลายลักษณ์อักษร',
    ],
    cta: 'คุยขอบเขต Digital Shop ↗',
  },
  {
    id: 'owner-care',
    eyebrow: 'OWNER CARE',
    title: 'มีคนช่วยดูแลต่อ',
    monthlyLabel: 'A$79',
    monthlyNote: '/เดือน',
    setupLabel: 'ค่าจัดทำครั้งแรก: เสนอในใบเสนอราคา',
    featured: true,
    includes: [
      'แนวทาง Digital Shop',
      'กำหนดงานอัปเดตและซัพพอร์ต',
      'ประเมินข้อความแจ้งเตือน',
      'วางงานเอกสารและงานซ้ำ',
    ],
    limits: [
      'SMS อีเมล และ Health Fund ประเมินเมื่อร้านพร้อมใช้',
      'ไม่รับรองผลการเคลมหรือการส่งข้อความในพรีวิวนี้',
    ],
    cta: 'คุยขอบเขต Owner Care ↗',
  },
  {
    id: 'growth',
    eyebrow: 'GROWTH',
    title: 'เพิ่มงานที่ช่วยร้านเติบโต',
    monthlyLabel: 'A$129+',
    monthlyNote: '/เดือน',
    setupLabel: 'ค่าจัดทำครั้งแรก: เสนอในใบเสนอราคา',
    includes: [
      'แนวทาง Owner Care',
      'วางคอนเทนต์และโปรโมชั่น',
      'ประเมินรายงานธุรกิจ',
      'กำหนดระดับการช่วยเหลือ',
    ],
    limits: [
      'งานโฆษณาและรายงานเชิงลึกคิดตามขอบเขตจริง',
      'ยังไม่มีส่วนลดรายปีในเวอร์ชันพรีวิว',
    ],
    cta: 'คุยแผน Growth ↗',
  },
]

export const photographyOffers = {
  photoOnly: {
    title: 'ถ่ายภาพกับทีม Chapter99',
    price: 'เสนอราคาตามงาน',
    note: 'ค่าถ่ายภาพครั้งเดียว · เวลาถ่ายและขอบเขตภาพแต่งรอยืนยัน',
  },
  photoPlusWeb: {
    title: 'ถ่ายภาพ + ทำเว็บไซต์',
    price: 'จัดแพ็กร่วมกัน',
    note: 'ค่าจัดทำครั้งแรก + ค่าดูแลรายเดือนแยกตามขอบเขต · ยังไม่แสดงยอดประหยัด',
  },
} as const

export const expansionNote =
  'Beauty · Cleaning · Trades เป็นแนวทางขยายในอนาคต ประเมินขั้นตอนก่อนเสนอขอบเขต ไม่ใช่ผลิตภัณฑ์สำเร็จรูปพร้อมใช้'

export type RestaurantPlanId = 'lite-remote' | 'standard-onsite' | 'premium-custom'

export type RestaurantPlan = {
  id: RestaurantPlanId
  eyebrow: string
  title: string
  setupLabel: string
  setupNote: string
  monthlyLabel: string
  monthlyNote: string
  featured?: boolean
  includes: string[]
  limits: string[]
  cta: string
}

export const restaurantPlans: RestaurantPlan[] = [
  {
    id: 'lite-remote',
    eyebrow: 'LITE REMOTE',
    title: 'เริ่มหน้าร้านดิจิทัลทางไกล',
    setupLabel: 'A$330',
    setupNote: 'ติดตั้งครั้งเดียว',
    monthlyLabel: 'A$39',
    monthlyNote: '/เดือน ดูแลระบบ',
    includes: ['เมนู QR + เครื่องพิมพ์ Sunmi', 'รีทัชภาพด้วย AI', 'สลับภาษาไทย/อังกฤษ', 'จ่ายที่เคาน์เตอร์'],
    limits: ['งานหน้างานและถ่ายภาพจริงประเมินตามพื้นที่', 'ไม่รวมค่าตัวเครื่อง Square'],
    cta: 'คุยขอบเขต Lite Remote ↗',
  },
  {
    id: 'standard-onsite',
    eyebrow: 'STANDARD ON-SITE',
    title: 'ถ่ายภาพเมนูและตั้งที่ร้าน',
    setupLabel: 'A$599',
    setupNote: 'ติดตั้งครั้งเดียว',
    monthlyLabel: 'A$55',
    monthlyNote: '/เดือน ดูแลระบบ',
    featured: true,
    includes: [
      'ถ่ายภาพเมนู 10–15 จานที่ร้าน',
      'ปรับสี/โลโก้ตามแบรนด์',
      'แจ้งเตือนเมนูขายดี',
      'อัปเดตเมนูตลอดสัญญา',
    ],
    limits: ['ถ่ายภาพหน้างานรวมสำหรับซิดนีย์และปริมณฑล', 'ร้านนอกพื้นที่ใช้ภาพรีทัชจากรูปที่ร้านส่งมา'],
    cta: 'คุยขอบเขต Standard On-site ↗',
  },
  {
    id: 'premium-custom',
    eyebrow: 'PREMIUM CUSTOM',
    title: 'ปรับตามแบรนด์และเทศกาล',
    setupLabel: 'A$999',
    setupNote: 'ติดตั้งครั้งเดียว',
    monthlyLabel: 'A$95',
    monthlyNote: '/เดือน ดูแลระบบ',
    includes: [
      'ถ่ายภาพระดับพรีเมียมตามขอบเขตที่ตกลง',
      'โดเมนย่อยเฉพาะร้าน',
      'อัปเดตภาพเทศกาล 2 ครั้ง/ปี',
      'จัดคิวดูแลก่อนอันดับแรกตามที่ตกลง',
    ],
    limits: ['จำนวนภาพ รอบแก้ไข และงานเฉพาะร้านระบุในใบเสนอราคา', 'ยังเป็นราคาทดลองจากสื่อแนะนำ ไม่ใช่ข้อเสนอขายที่อนุมัติ'],
    cta: 'คุยแผน Premium Custom ↗',
  },
]

export const restaurantAddons = {
  sydney: [
    { name: 'POS Setup — Basic', price: 'A$149', note: 'ติดตั้งหน้างานอย่างเดียว' },
    { name: 'POS Setup — Plus', price: 'A$249', note: 'ติดตั้ง + สอนใช้งานสด 1 ชม.' },
    { name: 'Follow-up Check-in', price: 'A$79', note: 'ไปเช็คหน้างานอีกครั้ง' },
    { name: 'ถ่ายภาพจริงหน้าร้าน', price: 'รวมในแพ็กเกจ', note: 'ตามระดับแพ็กเกจที่เลือก' },
  ],
  remote: [
    { name: 'POS Setup — Plus (ทางไกล)', price: 'A$199', note: 'ตั้งเครื่องล่วงหน้า + video call สอน' },
    { name: 'Follow-up Check-in (ทางไกล)', price: 'A$49', note: 'เช็คซ้ำผ่าน video call' },
    { name: 'ถ่ายภาพด้วย AI', price: 'รวมในแพ็กเกจ', note: 'ใช้รูปที่ร้านถ่ายเองมารีทัช' },
    { name: 'อยากได้ถ่ายภาพจริงนอกพื้นที่', price: 'A$250–A$700', note: 'ค่าเดินทางตามระยะทางจริง รอยืนยันในใบเสนอราคา' },
  ],
} as const

export const restaurantPriceNote =
  'อ้างอิงแพ็กหน้าร้านอาหารจากสื่อแนะนำ Chapter99 (FB Post 4 หน้า) · สกุลเงิน AUD · จ่ายค่าติดตั้งครั้งเดียวบวกค่าดูแลรายเดือน · ไม่รวมค่าตัวเครื่อง Square · ราคาทดลองในเวอร์ชันพรีวิว ต้องยืนยันก่อนเปิดขาย'

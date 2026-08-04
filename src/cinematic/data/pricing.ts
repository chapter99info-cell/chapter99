import type { Bilingual } from '../i18n/types';

export type PriceFeature = {
  label: Bilingual | string;
  included: boolean;
};

export type PricingTier = {
  id: string;
  eyebrow: Bilingual | string;
  amount: string;
  per?: Bilingual | string;
  original?: string;
  description: Bilingual | string;
  cta: Bilingual;
  ctaHref?: string;
  ctaVariant?: 'primary' | 'secondary';
  badge?: Bilingual | string;
  innerBg?: string;
  features: PriceFeature[];
};

export const photographyTiers: PricingTier[] = [
  {
    id: 'photos',
    eyebrow: { th: 'ภาพนิ่ง', en: 'Photos' },
    amount: 'A$349',
    per: { th: '/ครั้ง (2 ชม.)', en: '/session (2 hrs)' },
    description: {
      th: 'ถ่ายเต็มที่ตามเวลาที่จ้าง ไม่จำกัดจำนวนภาพ',
      en: 'Shoot for as long as booked, unlimited photos',
    },
    cta: { th: 'จองคิวถ่ายภาพ', en: 'Book a photo shoot' },
    ctaVariant: 'secondary',
    features: [
      { label: { th: '1 ชม. — A$199', en: '1 hr — A$199' }, included: true },
      { label: { th: '2 ชม. — A$349', en: '2 hrs — A$349' }, included: true },
      {
        label: { th: 'ครึ่งวัน (4 ชม.) — A$590', en: 'Half day (4 hrs) — A$590' },
        included: true,
      },
      {
        label: {
          th: 'รายเดือน 2 ชม. + AI top-up — A$449/mo',
          en: 'Monthly 2 hrs + AI top-up — A$449/mo',
        },
        included: true,
      },
    ],
  },
  {
    id: 'video',
    eyebrow: { th: 'วิดีโอ', en: 'Video' },
    amount: 'A$349',
    per: { th: '/ครั้ง (1-2 ชม.)', en: '/session (1-2 hrs)' },
    description: {
      th: 'Reels/Shorts ถ่ายสตูดิโอหรือนอกสถานที่',
      en: 'Reels/Shorts shot in studio or on location',
    },
    cta: { th: 'จองคิวถ่ายวิดีโอ', en: 'Book a video shoot' },
    ctaVariant: 'secondary',
    features: [
      {
        label: {
          th: '1-2 ชม. Reels/Shorts — A$349',
          en: '1-2 hrs Reels/Shorts — A$349',
        },
        included: true,
      },
      {
        label: { th: 'รายเดือน 2 ชม. — A$690/mo', en: 'Monthly 2 hrs — A$690/mo' },
        included: true,
      },
      {
        label: {
          th: 'งานใหญ่/Production — <a href="#studio-rate" style="color:inherit;text-decoration:underline;">ดูอัตราค่าจ้างด้านล่าง</a>',
          en: 'Large productions — <a href="#studio-rate" style="color:inherit;text-decoration:underline;">see rate below</a>',
        },
        included: false,
      },
    ],
  },
  {
    id: 'combo',
    eyebrow: { th: 'ภาพนิ่ง + วิดีโอ', en: 'Photo + Video' },
    amount: 'A$990',
    per: '/mo',
    original: 'A$1,139',
    description: {
      th: 'ครึ่งวัน A$690/ครั้ง หรือรายเดือนคุ้มกว่าซื้อแยก',
      en: 'Half day A$690/session, or better value monthly',
    },
    cta: { th: 'เริ่มแพ็กนี้', en: 'Start this package' },
    ctaVariant: 'primary',
    badge: { th: 'คุ้มสุด', en: 'Best Value' },
    innerBg: '#252525',
    features: [
      {
        label: {
          th: 'ครึ่งวัน ภาพนิ่ง+วิดีโอ — A$690',
          en: 'Half day photo + video — A$690',
        },
        included: true,
      },
      {
        label: { th: 'รายเดือน — A$990/mo', en: 'Monthly — A$990/mo' },
        included: true,
      },
      {
        label: {
          th: 'ประหยัดกว่าซื้อแยก ~13%',
          en: '~13% cheaper than buying separately',
        },
        included: true,
      },
    ],
  },
];

export const photographyCopy = {
  label: 'Photography Only',
  heading: { th: 'ราคาแพ็กเกจช่างภาพ', en: 'Photography Package Rates' },
  sub: {
    th: 'ถ่ายเต็มที่ตามเวลาที่จ้างและความร่วมมือของร้าน ไม่จำกัดจำนวนภาพ',
    en: "Shoot for as long as you book, based on the shop's availability — unlimited photos.",
  },
  aiNote: {
    th: '*AI photo top-up ใช้สำหรับคอนเทนต์โปรโมทและกราฟิกทั่วไปเท่านั้น (เช่น โพสต์โปรโมชั่น ป้ายราคา คำคม) ไม่ใช่ภาพจำลองอาหาร หน้าร้าน หรือพนักงานจริงของร้าน เพื่อป้องกันไม่ให้ลูกค้าปลายทางเข้าใจผิดว่าเป็นภาพถ่ายจริง',
    en: "*AI photo top-up is only for promotional content and general graphics (e.g. promo posts, price signs, quote cards) — never AI-generated food, storefront, or staff photos, so end customers are never misled into thinking it's a real photo.",
  },
} as const;

export const productionCopy = {
  eyebrowLarge: { th: 'งานใหญ่', en: 'Large jobs' },
  calloutTitle: { th: 'อยากได้ทีมงานเพิ่ม?', en: 'Want extra crew?' },
  calloutDesc: {
    th: 'เพิ่มผู้ช่วยช่างภาพ + ไฟเสริม สำหรับงานที่ต้องคุมแสงหลายจุดหรือหลายซีน',
    en: 'Add an assistant photographer + extra lighting for jobs needing complex lighting or multiple scenes',
  },
  amountLine: {
    th: 'ขอดูรายละเอียดงานก่อน',
    en: "Let's discuss your job first",
  },
  checks: [
    {
      th: 'มีทีมงาน + สคริปต์ล่วงหน้า',
      en: 'Full crew + pre-written script',
    },
    {
      th: 'หลายซีน/หลายโลเคชันได้',
      en: 'Multiple scenes/locations available',
    },
    {
      th: 'วิดีโอโปรโมทหลัก + behind-the-scenes',
      en: 'Main promo video + behind-the-scenes',
    },
  ] as Bilingual[],
  badge: {
    th: 'เริ่มงานภายใน 3-5 วัน หลังคุยจบ',
    en: 'Starts within 3-5 days after we talk',
  },
  cta: { th: 'เริ่มบรีฟงาน', en: 'Start a brief' },
} as const;

export const webTiers: PricingTier[] = [
  {
    id: 'starter',
    eyebrow: 'Starter',
    amount: 'A$19',
    per: '/mo',
    description: {
      th: 'Setup A$199 · เว็บ PWA ร้าน + แสดงเมนู/บริการ',
      en: 'Setup A$199 · PWA website + menu/services shown',
    },
    cta: { th: 'เริ่มเลย', en: 'Get started' },
    ctaVariant: 'secondary',
    features: [
      {
        label: {
          th: 'Front: เว็บ PWA + เมนู/บริการ',
          en: 'Front: PWA website + menu/services',
        },
        included: true,
      },
      {
        label: { th: 'Front: จองออนไลน์', en: 'Front: online booking' },
        included: false,
      },
      {
        label: {
          th: 'Back: บันทึกยอดขาย / Staff PIN',
          en: 'Back: sales log / Staff PIN',
        },
        included: false,
      },
      {
        label: {
          th: 'AI Photo/Video ระหว่างรอคิวถ่าย',
          en: 'AI Photo/Video while waiting for the real shoot',
        },
        included: true,
      },
    ],
  },
  {
    id: 'professional',
    eyebrow: 'Professional',
    amount: 'A$49',
    per: '/mo',
    description: {
      th: 'Setup A$499 · Restaurants · Massage Shops',
      en: 'Setup A$499 · Restaurants · Massage Shops',
    },
    cta: { th: 'เริ่มเลย', en: 'Get started' },
    ctaVariant: 'primary',
    badge: 'Best Value',
    innerBg: '#252525',
    features: [
      {
        label: {
          th: 'Front: จองออนไลน์ + ใบเสร็จ',
          en: 'Front: online booking + receipts',
        },
        included: true,
      },
      {
        label: {
          th: 'Back: บันทึกยอดขายพื้นฐาน + Intake Form',
          en: 'Back: basic sales log + intake form',
        },
        included: true,
      },
      {
        label: { th: 'Back: Staff/Owner PIN', en: 'Back: Staff/Owner PIN' },
        included: false,
      },
      {
        label: {
          th: 'AI Photo/Video ระหว่างรอคิวถ่าย',
          en: 'AI Photo/Video while waiting for the real shoot',
        },
        included: true,
      },
    ],
  },
  {
    id: 'ultimate',
    eyebrow: { th: 'Ultimate Business', en: 'Ultimate Business' },
    amount: 'A$89',
    per: '/mo',
    description: {
      th: 'Setup A$999+ · Full-service Premium',
      en: 'Setup A$999+ · Full-service Premium',
    },
    cta: { th: 'เริ่มเลย', en: 'Get started' },
    ctaVariant: 'secondary',
    features: [
      {
        label: {
          th: 'ทุกอย่างใน Professional',
          en: 'Everything in Professional',
        },
        included: true,
      },
      {
        label: {
          th: 'Back: บันทึกยอดขายเต็มระบบ + Staff/Owner PIN',
          en: 'Back: full sales log + Staff/Owner PIN',
        },
        included: true,
      },
      {
        label: {
          th: 'Daily Report + ภาพถ่ายจริงในแพ็ก',
          en: 'Daily Report + real photography included',
        },
        included: true,
      },
    ],
  },
];

export const webCopy = {
  label: 'PWA · Booking · POS',
  heading: { th: 'ราคาเว็บ Front+Back', en: 'Web Front+Back Rates' },
  sub: {
    th: 'ระบบเดียว สองฝั่ง — เลือกตามขนาดร้านและฟีเจอร์ที่ต้องใช้',
    en: "One system, two sides — pick what fits your shop's size and needed features.",
  },
  aiNote: {
    th: 'ทุกแพ็กมี AI Photo/Video ระหว่างรอคิวถ่ายจริงให้ตั้งแต่เทียร์ Starter — ดูเงื่อนไขการใช้งานด้านบน',
    en: 'Every package includes AI Photo/Video while waiting for the real shoot, starting from the Starter tier — see usage terms above.',
  },
  moneyNote: {
    th: 'ระบบของเรา<strong style="color:#DEDBC8;">ไม่ยุ่งเกี่ยวกับเงินทุกขั้นตอน</strong> — เป็นเพียงระบบบันทึกยอดขาย/ออกใบเสร็จไว้ดูรายงานเท่านั้น เราไม่รับเงิน ไม่โอนเงิน ไม่เก็บเงินแทนร้าน การรับเงินจริงเป็นเรื่องของร้านทั้งหมด ผ่านเครื่องรูดบัตร/HICAPS terminal ที่ร้านมีอยู่แล้ว Chapter99 ไม่รับผิดชอบต่อธุรกรรมการเงินใดๆ ทั้งสิ้น',
    en: 'Our system <strong style="color:#DEDBC8;">never touches money at any step</strong> — it only logs sales/issues receipts for reporting. We never receive, transfer, or hold money on a shop\'s behalf. Actual payment collection is entirely the shop\'s own, through their existing card terminal/HICAPS terminal. Chapter99 is not responsible for any financial transactions.',
  },
} as const;

export const otherTiers: PricingTier[] = [
  {
    id: 'alacarte',
    eyebrow: 'A La Carte',
    amount: 'A$49',
    per: { th: 'เริ่มต้น', en: 'starting from' },
    description: {
      th: 'เลือกซื้อแยกเป็นชิ้น เหมาะกับร้านที่มีระบบบางส่วนอยู่แล้ว',
      en: 'Buy individually — good for shops with some systems already in place',
    },
    cta: { th: 'เลือกรายการ', en: 'Choose items' },
    ctaVariant: 'secondary',
    features: [
      { label: 'QR Digital Menu — A$149 + A$15/mo', included: true },
      { label: 'AI Finder + Google SEO — A$199', included: true },
      { label: 'Maps + Facebook Setup — A$99', included: true },
      { label: 'Google Review Link — A$49', included: true },
      { label: 'Digital Signage — A$299 + A$29/mo', included: true },
    ],
  },
  {
    id: 'bundle',
    eyebrow: 'Local Starter Bundle',
    amount: 'A$249',
    original: 'A$297',
    description: {
      th: 'QR Menu + Maps/FB Setup + Review Link — ประหยัด ~16%',
      en: 'QR Menu + Maps/FB Setup + Review Link — save ~16%',
    },
    cta: { th: 'เริ่มแพ็กนี้', en: 'Start this package' },
    ctaVariant: 'primary',
    badge: 'Best Value',
    innerBg: '#252525',
    features: [
      {
        label: {
          th: 'QR Digital Menu (+A$15/mo โฮสติ้ง)',
          en: 'QR Digital Menu (+A$15/mo hosting)',
        },
        included: true,
      },
      { label: 'Maps + Facebook Setup', included: true },
      { label: 'Google Review Link', included: true },
      {
        label: {
          th: 'Digital Signage (ซื้อเพิ่มได้)',
          en: 'Digital Signage (available as add-on)',
        },
        included: false,
      },
    ],
  },
];

export const otherCopy = {
  label: 'Other Services',
  heading: { th: 'ราคาบริการอื่นๆ', en: 'Other Services Pricing' },
  sub: {
    th: 'เลือกซื้อแยกเป็นชิ้นได้ (a-la-carte) หรือรวมเป็นแพ็กประหยัดกว่า',
    en: 'Buy individually (a-la-carte) or bundle for extra savings.',
  },
  note: {
    th: 'ราคา A La Carte รวมกันจริงคือ A$149+A$99+A$49 = A$297 — เลือกแพ็ก Bundle แล้วประหยัดทันที A$48',
    en: 'A La Carte total is A$149+A$99+A$49 = A$297 — choose the Bundle and save A$48 instantly',
  },
} as const;

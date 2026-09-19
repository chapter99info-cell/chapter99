export type CheckKey = 'gbp' | 'web' | 'svc' | 'act' | 'pay' | 'pho' | 'con' | 'rev'

export const CHECK_QUESTIONS: {
  k: CheckKey
  q: { en: string; th: string }
  h: { en: string; th: string }
  step: { en: string; th: string }
}[] = [
  {
    k: 'gbp',
    q: { en: 'Google Business Profile', th: 'โปรไฟล์ธุรกิจบน Google' },
    h: { en: 'Do you have a claimed, up-to-date Google Business Profile?', th: 'มีโปรไฟล์ Google ที่ยืนยันแล้วและข้อมูลล่าสุดหรือไม่?' },
    step: {
      en: 'Claim or update your Google Business Profile: name, address, hours, phone and category.',
      th: 'ยืนยันหรืออัปเดตโปรไฟล์ธุรกิจบน Google: ชื่อ ที่อยู่ เวลาเปิด-ปิด เบอร์โทร และหมวดหมู่',
    },
  },
  {
    k: 'web',
    q: { en: 'Mobile-friendly website', th: 'เว็บไซต์ที่ใช้ง่ายบนมือถือ' },
    h: { en: 'Does your website load and read well on a phone?', th: 'เว็บไซต์เปิดและอ่านง่ายบนมือถือหรือไม่?' },
    step: {
      en: 'Open your website on a phone and fix anything hard to read or tap — most customers will see it there first.',
      th: 'เปิดเว็บไซต์บนมือถือและแก้จุดที่อ่านหรือกดยาก — ลูกค้าส่วนใหญ่เห็นบนมือถือก่อน',
    },
  },
  {
    k: 'svc',
    q: { en: 'Clear services / menu', th: 'บริการ / เมนูชัดเจน' },
    h: { en: 'Can a new customer quickly see what you offer?', th: 'ลูกค้าใหม่เห็นสิ่งที่คุณมีให้ได้เร็วหรือไม่?' },
    step: {
      en: 'Put your services or menu in one simple, easy-to-find place (try the Price List Builder).',
      th: 'รวมบริการหรือเมนูไว้ที่เดียวให้หาง่าย (ลองใช้ตัวช่วยจัดรายการราคา)',
    },
  },
  {
    k: 'act',
    q: { en: 'Booking / order / enquiry path', th: 'ช่องทางจอง / สั่ง / สอบถาม' },
    h: { en: 'Is there an obvious way to book, order or enquire?', th: 'มีวิธีจอง สั่ง หรือสอบถามที่เห็นชัดเจนหรือไม่?' },
    step: {
      en: 'Add one clear button — Book, Order or Enquire — near the top of your page and profile.',
      th: 'เพิ่มปุ่มที่ชัดเจนหนึ่งปุ่ม เช่น จอง สั่ง หรือสอบถาม ไว้ด้านบนของหน้าและโปรไฟล์',
    },
  },
  {
    k: 'pay',
    q: { en: 'Payment path', th: 'ช่องทางชำระเงิน' },
    h: { en: 'Can customers pay in a simple, familiar way?', th: 'ลูกค้าชำระเงินได้ง่ายและคุ้นเคยหรือไม่?' },
    step: {
      en: 'Check that paying is simple and clear for customers, whether in person or online.',
      th: 'ตรวจว่าการชำระเงินง่ายและชัดเจนสำหรับลูกค้า ทั้งหน้าร้านและออนไลน์',
    },
  },
  {
    k: 'pho',
    q: { en: 'Real business photography', th: 'รูปถ่ายจริงของธุรกิจ' },
    h: { en: 'Do you show real, current photos of your business?', th: 'มีรูปถ่ายจริงและเป็นปัจจุบันของธุรกิจหรือไม่?' },
    step: {
      en: 'Replace generic or old images with real, current photos of your place, team and work.',
      th: 'เปลี่ยนรูปทั่วไปหรือรูปเก่าเป็นรูปจริงล่าสุดของร้าน ทีม และงานของคุณ',
    },
  },
  {
    k: 'con',
    q: { en: 'Customer contact information', th: 'ข้อมูลติดต่อลูกค้า' },
    h: { en: 'Are phone, address and opening hours easy to find?', th: 'เบอร์โทร ที่อยู่ และเวลาเปิด-ปิด หาง่ายหรือไม่?' },
    step: {
      en: 'Make your phone, address and opening hours visible on every place customers find you.',
      th: 'แสดงเบอร์โทร ที่อยู่ และเวลาเปิด-ปิด ในทุกที่ที่ลูกค้าจะเจอคุณ',
    },
  },
  {
    k: 'rev',
    q: { en: 'Reviews', th: 'รีวิว' },
    h: { en: 'Do you have recent reviews, and do you reply to them?', th: 'มีรีวิวล่าสุดและตอบรีวิวหรือไม่?' },
    step: {
      en: 'Invite happy customers to leave a review and reply to the ones you get (try the Review Reply Helper or the Poster Studio QR poster).',
      th: 'ชวนลูกค้าที่พอใจให้รีวิว และตอบรีวิวที่ได้รับ (ลองใช้ตัวช่วยตอบรีวิว)',
    },
  },
]

export const JOURNEY_GROUPS = [
  { id: 'found', en: 'Get found', th: 'ถูกค้นเจอ', keys: ['gbp', 'rev'] as CheckKey[] },
  { id: 'understood', en: 'Get understood', th: 'ลูกค้าเข้าใจ', keys: ['web', 'svc', 'pho'] as CheckKey[] },
  { id: 'booked', en: 'Get booked & paid', th: 'ถูกจองและรับเงิน', keys: ['act', 'pay', 'con'] as CheckKey[] },
] as const

export function scoreBusinessCheck(answers: number[]) {
  if (answers.length !== 8 || answers.some((n) => n !== 0 && n !== 1 && n !== 2)) {
    throw new Error('Need eight answers of 0, 1 or 2')
  }
  const score = answers.reduce((a, b) => a + b, 0)
  const cat = score >= 13 ? 's' : score >= 8 ? 'o' : 'n'
  const pct = Math.round((score / 16) * 100)
  const order = CHECK_QUESTIONS.map((q, i) => ({ i, s: answers[i], q }))
    .filter((o) => o.s < 2)
    .sort((a, b) => a.s - b.s || a.i - b.i)
    .slice(0, 3)
  const topSteps = order.length
    ? order.map((o) => o.q.step)
    : [
        {
          en: 'Keep your Google profile, photos and reviews fresh — small regular updates matter.',
          th: 'อัปเดตโปรไฟล์ Google รูปภาพ และรีวิวสม่ำเสมอ การปรับเล็ก ๆ อย่างต่อเนื่องสำคัญ',
        },
      ]
  const gaps = CHECK_QUESTIONS.filter((_, i) => answers[i] < 2)
  const groups = JOURNEY_GROUPS.map((g) => {
    const ix = g.keys.map((k) => CHECK_QUESTIONS.findIndex((q) => q.k === k))
    const v = Math.round((ix.reduce((a, i) => a + answers[i], 0) / (ix.length * 2)) * 100)
    return { id: g.id, en: g.en, th: g.th, pct: v }
  })
  return { score, pct, cat, topSteps, gaps, groups, answers }
}

export function bandColor(pct: number) {
  if (pct >= 75) return 'g'
  if (pct >= 45) return 'o'
  return 'n'
}

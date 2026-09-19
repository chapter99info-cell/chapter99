export type MsgTone = 'friendly' | 'professional' | 'short'
export type MsgBiz = 'massage' | 'restaurant' | 'cleaning' | 'beauty' | 'other'

export const SCENARIOS = {
  confirm: {
    kw: /confirm|booking|book |จอง|ยืนยัน/i,
    chip: { en: 'Confirm a booking', th: 'ยืนยันการจอง' },
    th: 'ยืนยันการจอง/นัดหมายของลูกค้า และแจ้งว่าสามารถแจ้งเปลี่ยนแปลงได้',
    en: {
      friendly: '{hi} Just confirming your {item}{d}. We’re looking forward to seeing you!',
      professional: '{hi} This message confirms your {item}{d}. Please let us know if you need to make any changes. Kind regards,',
      short: '{hi} Your {item} is confirmed{d}. See you soon!',
    },
  },
  late: {
    kw: /late|delay|behind|สาย|ช้า|รอ/i,
    chip: { en: 'Running late', th: 'ขออภัยที่ล่าช้า' },
    th: 'ขออภัยลูกค้าที่บริการล่าช้า และขอบคุณที่รอ',
    en: {
      friendly: '{hi} Sorry — we’re running a little behind{d}. Thank you so much for your patience, we’ll be with you very soon!',
      professional: '{hi} We apologise for a short delay{d}. Thank you for your patience and understanding. Kind regards,',
      short: '{hi} Sorry, we’re running a bit late{d}. Thanks for waiting!',
    },
  },
  reschedule: {
    kw: /reschedul|move|change|another time|เลื่อน|เปลี่ยนเวลา|เปลี่ยนนัด/i,
    chip: { en: 'Reschedule', th: 'เลื่อนนัด' },
    th: 'ขอเลื่อนนัดและให้ลูกค้าแจ้งเวลาที่สะดวก',
    en: {
      friendly: '{hi} Would it be okay to move your {item}{d}? Please let us know what time suits you and we’ll sort it out. Thank you!',
      professional: '{hi} We would like to ask whether we could reschedule your {item}{d}. Please advise a time that suits you. Kind regards,',
      short: '{hi} Can we move your {item}{d}? Let us know a time that suits you. Thanks!',
    },
  },
  closed: {
    kw: /closed|holiday|not open|ปิด|วันหยุด|หยุด/i,
    chip: { en: 'Closed for a holiday', th: 'ร้านปิดวันหยุด' },
    th: 'แจ้งลูกค้าว่าร้านปิดในช่วงที่ระบุ',
    en: {
      friendly: '{hi} Just a quick note — we’ll be closed{d}. We’ll be back soon and can’t wait to see you again!',
      professional: '{hi} Please note that we will be closed{d}. We apologise for any inconvenience and look forward to welcoming you again. Kind regards,',
      short: '{hi} We’ll be closed{d}. Back soon!',
    },
  },
  thanks: {
    kw: /thank|ขอบคุณ/i,
    chip: { en: 'Thank a customer', th: 'ขอบคุณลูกค้า' },
    th: 'ขอบคุณลูกค้าที่ใช้บริการ',
    en: {
      friendly: '{hi} Thank you so much for visiting us{d}! It was lovely to see you, and we hope to see you again soon.',
      professional: '{hi} Thank you for choosing us{d}. We appreciate your support and look forward to serving you again. Kind regards,',
      short: '{hi} Thanks for coming in{d}! See you again soon.',
    },
  },
  price: {
    kw: /price|cost|how much|ราคา|เท่าไร|กี่บาท|กี่ดอลลาร์/i,
    chip: { en: 'Answer a price question', th: 'ตอบเรื่องราคา' },
    th: 'ตอบคำถามเรื่องราคา โดยชี้ไปที่รายการราคาของร้าน',
    en: {
      friendly: '{hi} Thanks for asking! Our prices are shown in our price list{d}. Let us know if you’d like help choosing.',
      professional: '{hi} Thank you for your enquiry. Our current prices are listed in our price list{d}. Please contact us if you would like further information. Kind regards,',
      short: '{hi} Our prices are in our price list{d}. Happy to help!',
    },
  },
  payment: {
    kw: /pay|invoice|deposit|จ่าย|ชำระ|มัดจำ|ใบแจ้งหนี้/i,
    chip: { en: 'Payment reminder', th: 'เตือนการชำระเงิน' },
    th: 'เตือนเรื่องการชำระเงินอย่างสุภาพ',
    en: {
      friendly: '{hi} Just a friendly reminder about your payment{d}. Let us know if you have any questions — thank you!',
      professional: '{hi} This is a courteous reminder regarding your payment{d}. Please contact us if you have any questions. Kind regards,',
      short: '{hi} Friendly reminder about your payment{d}. Thanks!',
    },
  },
} as const

const ITEM: Record<MsgBiz, string> = {
  massage: 'appointment',
  restaurant: 'booking',
  cleaning: 'cleaning job',
  beauty: 'appointment',
  other: 'booking',
}

const TH_TONE: Record<MsgTone, string> = {
  friendly: 'น้ำเสียงเป็นกันเอง',
  professional: 'น้ำเสียงเป็นทางการ',
  short: 'สั้นและกระชับ',
}

export function buildCustomerMessage(input: {
  what: string
  details: string
  name: string
  biz: MsgBiz
  tone: MsgTone
}) {
  const { what, details, name, biz, tone } = input
  const key = (Object.keys(SCENARIOS) as (keyof typeof SCENARIOS)[]).find((k) => SCENARIOS[k].kw.test(what))
  const hi = name
    ? tone === 'professional'
      ? `Dear ${name},`
      : `Hi ${name}!`
    : tone === 'professional'
      ? 'Hello,'
      : 'Hi there!'
  const d = details ? ` (${details})` : ''
  if (!key) {
    return {
      scenario: 'free_text' as const,
      english: `${hi} ${what}${details ? ` ${details}` : ''}`,
      thai: 'ระบบยังไม่เชื่อมต่อ AI จึงยังแปลข้อความอิสระไม่ได้ — ข้อความของคุณถูกใส่ตามที่พิมพ์',
      note: true,
    }
  }
  const s = SCENARIOS[key]
  let english = s.en[tone].replace('{hi}', hi).replace('{item}', ITEM[biz]).replace('{d}', d).replace(/\s+\./g, '.')
  if (tone === 'professional') english += '\n[Your business name]'
  return {
    scenario: key,
    english,
    thai: `ความหมาย: ${s.th}${details ? ` (รายละเอียด: ${details})` : ''} — ${TH_TONE[tone]}`,
    note: /[\u0E00-\u0E7F]/.test(details),
  }
}

export function fmtPrice(p: string) {
  const v = String(p).trim()
  if (!v) return ''
  if (/^\d+(\.\d{1,2})?$/.test(v)) return `$${v.includes('.') ? Number(v).toFixed(2) : v}`
  return v
}

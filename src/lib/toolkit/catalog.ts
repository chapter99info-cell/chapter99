export type ToolCat = 'Communication' | 'Pricing' | 'Marketing' | 'Business Setup'

export const TOOLS = [
  {
    id: 'english-message',
    href: '/toolkit/english-message',
    cat: 'Communication' as const,
    icon: '💬',
    name: { en: 'English Message Builder', th: 'ตัวช่วยเขียนข้อความอังกฤษ' },
    desc: {
      en: 'Turn what you want to say into a clear English message, with a Thai explanation.',
      th: 'เปลี่ยนสิ่งที่อยากบอกเป็นข้อความอังกฤษที่ชัดเจน พร้อมคำอธิบายภาษาไทย',
    },
  },
  {
    id: 'price-list',
    href: '/toolkit/price-list',
    cat: 'Pricing' as const,
    icon: '🏷️',
    name: { en: 'Price List Builder', th: 'ตัวช่วยจัดรายการราคา' },
    desc: {
      en: 'Turn your services and prices into a clean list you can copy or print.',
      th: 'จัดบริการและราคาเป็นรายการสวยงาม คัดลอกหรือพิมพ์ได้',
    },
  },
  {
    id: 'review-reply',
    href: '/toolkit/review-reply',
    cat: 'Marketing' as const,
    icon: '⭐',
    name: { en: 'Review Reply Helper', th: 'ตัวช่วยตอบรีวิว' },
    desc: {
      en: 'Draft a polite reply to a Google review in English, Thai or both.',
      th: 'ร่างคำตอบรีวิว Google อย่างสุภาพ เป็นอังกฤษ ไทย หรือทั้งสอง',
    },
  },
  {
    id: 'poster-studio',
    href: '/toolkit/poster-studio',
    cat: 'Marketing' as const,
    icon: '🖨️',
    name: { en: 'Poster Studio', th: 'ตัวช่วยทำการ์ด & โปสเตอร์ QR' },
    desc: {
      en: 'Make a book-online card or Google review QR poster with your own details.',
      th: 'ทำการ์ดจองออนไลน์หรือโปสเตอร์ QR รีวิว Google ด้วยข้อมูลร้านของคุณ',
    },
  },
  {
    id: 'business-check',
    href: '/business-check',
    cat: 'Business Setup' as const,
    icon: '🔍',
    name: { en: 'Business Check', th: 'ตรวจธุรกิจ' },
    desc: {
      en: 'See how ready your digital front door is, with 3 practical next steps.',
      th: 'ดูความพร้อมของประตูหน้าดิจิทัล พร้อม 3 ขั้นตอนถัดไปที่ทำได้จริง',
    },
  },
] as const

export const CATS: { id: 'All' | ToolCat; th: string; en: string }[] = [
  { id: 'All', th: 'ทั้งหมด', en: 'All' },
  { id: 'Communication', th: 'สื่อสาร', en: 'Communication' },
  { id: 'Pricing', th: 'ราคา', en: 'Pricing' },
  { id: 'Marketing', th: 'การตลาด', en: 'Marketing' },
  { id: 'Business Setup', th: 'ตั้งค่าธุรกิจ', en: 'Business Setup' },
]

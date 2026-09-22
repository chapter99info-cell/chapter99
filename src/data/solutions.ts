import type { IndustryContent } from '../site/IndustryPage'
import { siteMedia } from '../site/media'

export type SolutionSlug = 'massage' | 'restaurant' | 'cleaning' | 'beauty' | 'other'

export type Solution = {
  slug: SolutionSlug
  href: `/solutions/${SolutionSlug}`
  icon: string
  imageBg: string
  name: { th: string; en: string }
  desc: { th: string; en: string }
  journey: { th: string; en: string }[]
  page: IndustryContent
}

const placeholderNote = {
  th: 'ภาพตัวอย่าง / จองที่ — ไม่ใช่ภาพถ่ายลูกค้าจริง',
  en: 'Placeholder / SAMPLE — not real client photography.',
}

export const solutions: Solution[] = [
  {
    slug: 'massage',
    href: '/solutions/massage',
    icon: '🕯️',
    imageBg: 'linear-gradient(135deg,#e9dcc0,#b9c9b5)',
    name: { th: 'นวด / เวลเนส', en: 'Massage / Wellness' },
    desc: { th: 'ให้ลูกค้าจองง่ายขึ้น และจัดการตารางได้ชัด', en: 'Get more bookings and manage your schedule.' },
    journey: [
      { th: 'ค้นเจอ', en: 'Find' },
      { th: 'บริการ', en: 'Services' },
      { th: 'จอง', en: 'Book' },
      { th: 'ชำระเงิน', en: 'Pay' },
      { th: 'จองซ้ำ', en: 'Rebook' },
    ],
    page: {
      kind: 'shop',
      photo: siteMedia.massage,
      photoAlt: { th: 'ภาพตัวอย่างร้านนวด ไม่ใช่ภาพลูกค้าจริง', en: 'Sample massage venue image — not a real client photo' },
      photoNote: placeholderNote,
      eyebrow: { th: 'สำหรับร้านนวดในออสเตรเลีย', en: 'For Thai massage businesses in Australia' },
      title: { th: 'ให้ลูกค้าเห็นร้านชัด และจองได้สบายใจ', en: 'Look professional. Get booked with calm.' },
      lead: {
        th: 'ช่วยเรื่องภาพลักษณ์ร้าน การค้นพบบน Google ขั้นตอนจอง การชำระเงิน และคิวประจำวัน หน้านี้เป็นหน้าที่สื่อสารบริการ ไม่ใช่ระบบจองสด',
        en: 'We help with how the shop looks, how customers find you, booking steps, payment, and the daily queue. This is a service page — not a live booking platform.',
      },
      steps: [
        { title: { th: 'ภาพลักษณ์ร้านและบริการ', en: 'Shop look and services' }, body: { th: 'ภาพ เว็บ และข้อความที่สะท้อนบรรยากาศร้าน', en: 'Photos, website and copy that feel like your rooms.' } },
        { title: { th: 'ให้ลูกค้าค้นเจอ', en: 'Be found' }, body: { th: 'ข้อมูลร้านชัดบนเว็บและแผนที่', en: 'Clear shop details on the web and maps.' } },
        { title: { th: 'จองและยืนยัน', en: 'Book and confirm' }, body: { th: 'เลือกบริการ เวลายืนยัน และข้อความที่ทีมใช้จริง', en: 'Service choice, confirmation and messages your team can actually send.' } },
        { title: { th: 'รับชำระเงิน', en: 'Get paid' }, body: { th: 'มัดจำ ใบเสร็จ และขั้นตอนที่ตกลงในขอบเขต', en: 'Deposits, receipts and payment steps scoped to the project.' } },
        { title: { th: 'คิวงานประจำวัน', en: 'Daily queue' }, body: { th: 'ทีมเห็นนัดเดียวกัน', en: 'The team sees the same appointments.' } },
        { title: { th: 'ลูกค้ากลับมา', en: 'Return visits' }, body: { th: 'ดูแลรีวิวและข้อความเชิญกลับอย่างตรงไปตรงมา', en: 'Review care and return messages, without fake claims.' } },
      ],
    },
  },
  {
    slug: 'restaurant',
    href: '/solutions/restaurant',
    icon: '🍜',
    imageBg: 'linear-gradient(135deg,#f0d9b0,#d9a86a)',
    name: { th: 'ร้านอาหาร / คาเฟ่', en: 'Restaurant / Cafe' },
    desc: { th: 'โชว์เมนู รับออเดอร์หรือจองโต๊ะ', en: 'Show your menu, accept orders or bookings.' },
    journey: [
      { th: 'ค้นเจอ', en: 'Find' },
      { th: 'เมนู', en: 'Menu' },
      { th: 'สั่ง / จอง', en: 'Order / Book' },
      { th: 'ชำระเงิน', en: 'Pay' },
      { th: 'กลับมา', en: 'Return' },
    ],
    page: {
      kind: 'restaurant',
      photo: siteMedia.restaurant,
      photoAlt: { th: 'ภาพตัวอย่างร้านอาหาร ไม่ใช่ภาพลูกค้าจริง', en: 'Sample restaurant image — not a real client photo' },
      photoNote: placeholderNote,
      eyebrow: { th: 'สำหรับร้านอาหารไทยในออสเตรเลีย', en: 'For Thai restaurants in Australia' },
      title: { th: 'ให้เมนูถูกเห็น และงานร้านเดินชัดขึ้น', en: 'Show the menu. Make the next step clear.' },
      lead: {
        th: 'ช่วยเรื่องภาพอาหาร เมนู การค้นพบร้าน ช่องทางสั่งหรือจองตามขอบเขต การรับเงิน และงานประจำวัน ไม่ใช่ระบบเดลิเวอรี่ใหม่ทั้งชุด',
        en: 'We help with food photography, menus, discovery, ordering or booking within an agreed scope, payments, and daily operations. This is not a new delivery platform.',
      },
      steps: [
        { title: { th: 'เมนูและภาพอาหาร', en: 'Menu and food photos' }, body: { th: 'จัดภาพ ชื่อ และราคาให้อ่านง่าย', en: 'Make dishes, names and prices easy to choose.' } },
        { title: { th: 'ค้นพบร้าน', en: 'Be found' }, body: { th: 'เว็บและข้อมูลร้านที่ลูกค้าเข้าใจ', en: 'A website and listing details customers understand.' } },
        { title: { th: 'สั่งอาหารหรือจองโต๊ะ', en: 'Orders or tables' }, body: { th: 'เชื่อมช่องทางที่มีอยู่หรือออกแบบตามขอบเขต', en: 'Connect existing channels or design within scope.' } },
        { title: { th: 'รับเงิน', en: 'Get paid' }, body: { th: 'ใบเสร็จและขั้นตอนชำระเงินตามที่ตกลง', en: 'Receipts and payment steps as scoped.' } },
        { title: { th: 'งานร้าน', en: 'Run the floor' }, body: { th: 'คิว ออเดอร์ และหน้าที่ทีมที่เขียนเป็นขั้นตอน', en: 'Queue, orders and team routines written as steps.' } },
      ],
    },
  },
  {
    slug: 'cleaning',
    href: '/solutions/cleaning',
    icon: '🧼',
    imageBg: 'linear-gradient(135deg,#d6e6ea,#9fc3cc)',
    name: { th: 'ธุรกิจทำความสะอาด', en: 'Cleaning Business' },
    desc: { th: 'รับงาน ประเมิน และดูเป็นมืออาชีพ', en: 'Get quotes, manage jobs, look professional.' },
    journey: [
      { th: 'ค้นเจอ', en: 'Find' },
      { th: 'ใบเสนอราคา', en: 'Quote' },
      { th: 'จองงาน', en: 'Book Job' },
      { th: 'ทำงาน', en: 'Run Job' },
      { th: 'แจ้งหนี้ / รับเงิน', en: 'Invoice / Pay' },
    ],
    page: {
      kind: 'cleaning',
      photo: siteMedia.system,
      photoAlt: { th: 'ภาพตัวอย่างธุรกิจทำความสะอาด ไม่ใช่ภาพทีมจริง', en: 'Sample cleaning image — not a real crew photo' },
      photoNote: placeholderNote,
      eyebrow: { th: 'สำหรับธุรกิจทำความสะอาดในออสเตรเลีย', en: 'For Thai cleaning businesses in Australia' },
      title: { th: 'ให้งานชัดตั้งแต่สอบถามจนส่งมอบ', en: 'From quote to finished job, in one path.' },
      lead: {
        th: 'ช่วยเรื่องการนำเสนอบริการ การสอบถามขอบเขตงาน การนัดหมาย และใบเสนอราคาตามความสามารถจริง ไม่สร้างระบบบัญชีใหม่',
        en: 'We help with how the service is presented, quoting the job, appointments, and invoices within current capability. This does not create a new accounting product.',
      },
      steps: [
        { title: { th: 'นำเสนอบริการ', en: 'Present the service' }, body: { th: 'บอกชัดว่าทำบ้าน ออฟฟิศ หรืองานตามที่ตกลง', en: 'Say clearly what homes, offices or jobs you take.' } },
        { title: { th: 'สอบถามและประเมิน', en: 'Enquire and scope' }, body: { th: 'เก็บขนาดงาน เวลา และสิ่งที่ลูกค้าต้องการ', en: 'Capture size, timing and what the customer needs.' } },
        { title: { th: 'นัดหมาย', en: 'Appointments' }, body: { th: 'วัน เวลา และทีมที่ไปทำงาน', en: 'Date, time and who is on the job.' } },
        { title: { th: 'ใบเสนอราคา / ใบแจ้งหนี้', en: 'Quotes and invoices' }, body: { th: 'แม่แบบเอกสาร ไม่ใช่ระบบบัญชีอัตโนมัติ', en: 'Document templates — not an automated accounts system.' } },
        { title: { th: 'เช็กลิสต์งาน', en: 'Job checklists' }, body: { th: 'รายการตรวจก่อนส่งมอบที่ทีมใช้ร่วมกัน', en: 'A shared checklist before handover.' } },
      ],
    },
  },
  {
    slug: 'beauty',
    href: '/solutions/beauty',
    icon: '💄',
    imageBg: 'linear-gradient(135deg,#eadbe6,#cfb2c6)',
    name: { th: 'ความงาม / ซาลอน', en: 'Beauty & Salon' },
    desc: { th: 'ดึงลูกค้าใหม่ และให้การจองง่าย', en: 'Attract clients, make booking easy.' },
    journey: [
      { th: 'ค้นเจอ', en: 'Find' },
      { th: 'ทรีตเมนต์', en: 'Treatments' },
      { th: 'จอง', en: 'Book' },
      { th: 'ชำระเงิน', en: 'Pay' },
      { th: 'จองซ้ำ', en: 'Rebook' },
    ],
    page: {
      kind: 'beauty',
      photo: siteMedia.booking,
      photoAlt: { th: 'ภาพตัวอย่างร้านความงาม ไม่ใช่ภาพลูกค้าจริง', en: 'Sample beauty salon image — not a real client photo' },
      photoNote: placeholderNote,
      eyebrow: { th: 'สำหรับร้านความงามในออสเตรเลีย', en: 'For Thai beauty businesses in Australia' },
      title: { th: 'ให้ผลงานดูชัด และนัดไม่หลุด', en: 'Show the work. Make the booking simple.' },
      lead: {
        th: 'ช่วยเรื่องภาพผลงาน การจอง และการสื่อสารก่อนและหลังบริการ หน้านี้ยังเป็นหน้าที่สื่อสาร ไม่ใช่ระบบร้านความงามสำเร็จรูป',
        en: 'We help with work photos, booking steps, and before-and-after messages. This is a service page, not a finished salon platform.',
      },
      steps: [
        { title: { th: 'ภาพผลงานและบริการ', en: 'Work and services' }, body: { th: 'โชว์สไตล์งานและราคาให้อ่านง่าย', en: 'Show style, duration and price clearly.' } },
        { title: { th: 'การจอง', en: 'Bookings' }, body: { th: 'เลือกบริการ เวลา และยืนยันนัด', en: 'Choose a service, time and confirmation.' } },
        { title: { th: 'ก่อนและหลังบริการ', en: 'Before and after care' }, body: { th: 'ข้อความเตรียมตัวและดูแลหลังทำ', en: 'Prep and aftercare messages the salon can send.' } },
        { title: { th: 'รับชำระเงิน', en: 'Get paid' }, body: { th: 'มัดจำและใบเสร็จตามวิธีที่ร้านใช้', en: 'Deposits and receipts matching how the salon already takes payment.' } },
        { title: { th: 'ลูกค้ากลับมา', en: 'Return visits' }, body: { th: 'เตือนนัดเติมและดูแลรีวิวอย่างตรงไปตรงมา', en: 'Refill reminders and review care, without fake ratings.' } },
      ],
    },
  },
  {
    slug: 'other',
    href: '/solutions/other',
    icon: '🏪',
    imageBg: 'linear-gradient(135deg,#e3dac6,#c7b98f)',
    name: { th: 'ธุรกิจอื่น ๆ', en: 'Other Businesses' },
    desc: { th: 'ปรับให้เข้ากับธุรกิจของคุณ', en: 'Flexible solutions for your unique needs.' },
    journey: [
      { th: 'ค้นเจอ', en: 'Find' },
      { th: 'เข้าใจบริการ', en: 'Understand' },
      { th: 'สอบถาม', en: 'Enquire' },
      { th: 'ติดตาม', en: 'Follow Up' },
    ],
    page: {
      kind: 'shop',
      photo: siteMedia.hero,
      photoAlt: { th: 'ภาพตัวอย่างธุรกิจทั่วไป ไม่ใช่ภาพลูกค้าจริง', en: 'Sample business image — not a real client photo' },
      photoNote: placeholderNote,
      eyebrow: { th: 'สำหรับธุรกิจไทยอื่นในออสเตรเลีย', en: 'For other Thai businesses in Australia' },
      title: { th: 'ให้ลูกค้าเข้าใจธุรกิจ และติดต่อได้ชัด', en: 'Help people understand you, then enquire.' },
      lead: {
        th: 'ช่วยเรื่องหน้าตาออนไลน์ ข้อมูลบริการ ช่องทางสอบถาม และการติดตาม โดยไม่สัญญาแพ็กเกจสำเร็จรูปถ้ายังไม่ได้คุยขอบเขต',
        en: 'We help with how you look online, what you offer, how people enquire, and how you follow up — without promising a finished product before scope is agreed.',
      },
      steps: [
        { title: { th: 'ให้ลูกค้าค้นเจอ', en: 'Be found' }, body: { th: 'ชื่อ ที่อยู่ และช่องทางที่ตรวจแล้ว', en: 'A checked name, address and contact path.' } },
        { title: { th: 'ให้เข้าใจบริการ', en: 'Be understood' }, body: { th: 'อธิบายงานที่ทำจริง ไม่ใช้ภาพหลอก', en: 'Describe the real work. Do not use misleading photos.' } },
        { title: { th: 'ช่องทางสอบถาม', en: 'Enquire' }, body: { th: 'ปุ่มติดต่อที่เห็นชัด', en: 'One obvious way to get in touch.' } },
        { title: { th: 'ติดตามต่อ', en: 'Follow up' }, body: { th: 'ข้อความตอบกลับที่ร้านส่งเอง', en: 'A reply the shop sends itself.' } },
      ],
    },
  },
]

export function getSolution(slug: string | undefined) {
  return solutions.find((item) => item.slug === slug)
}

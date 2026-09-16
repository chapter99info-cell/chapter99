export const toolkitDisclaimer =
  'ชุดเครื่องมือฟรีนี้ทำงานในเบราว์เซอร์ของคุณ ไม่ส่ง SMS อัตโนมัติ ไม่เก็บเบอร์หรืออีเมลลูกค้า และไม่ใช่คำปรึกษากฎหมาย'

export const legalTemplateNote =
  'เอกสารด้านล่างเป็นแม่แบบธุรกิจทั่วไป ไม่ใช่คำปรึกษากฎหมาย ร้านควรให้ผู้เชี่ยวชาญตรวจก่อนใช้จริง'

export const surchargeNotice =
  'ตั้งแต่ 1 ตุลาคม 2026 ร้านค้าควรตรวจสอบวิธีแสดงราคาเมื่อรับบัตร และการคิด Card Surcharge ตามกฎที่ใช้กับร้านของคุณ นี่เป็นเครื่องเตือนให้ตรวจข้อมูล ไม่ใช่คำปรึกษากฎหมาย'

export const messagePurposes = [
  { id: 'confirm', th: 'ยืนยันนัดหมาย', en: 'Appointment confirmation' },
  { id: 'reminder', th: 'เตือนนัด', en: 'Appointment reminder' },
  { id: 'thanks', th: 'ขอบคุณลูกค้า', en: 'Thank you' },
  { id: 'review', th: 'ขอรีวิว', en: 'Review request' },
] as const

export const documentTemplates = [
  {
    id: 'cancel',
    th: 'นโยบายยกเลิก',
    en: 'Cancellation Policy',
    whyTh: 'ใช้ติดหน้าร้านหรือตอนจอง เพื่อบอกว่าเลิกนัดเมื่อไหร่ยังถือว่าคิวนั้นใช้ได้',
    whyEn: 'Use on the shop wall or at booking to say when a cancelled slot still counts.',
  },
  {
    id: 'booking',
    th: 'ข้อตกลงการจอง',
    en: 'Booking Terms',
    whyTh: 'ใช้ตอนรับจอง อธิบายว่าคิวถูกถือให้ใคร จ่ายที่ไหน และมาสายแล้วอย่างไร',
    whyEn: 'Use when taking a booking: whose name holds the slot, where to pay, and late arrival.',
  },
  {
    id: 'refund',
    th: 'นโยบายคืนเงิน',
    en: 'Refund Policy',
    whyTh: 'ใช้เมื่อร้านเลื่อนคิวเอง หรือลูกค้าถามว่าเงินคืนได้เมื่อไหร่',
    whyEn: 'Use when the shop moves a booking, or a guest asks when money can be returned.',
  },
  {
    id: 'ack',
    th: 'ใบรับทราบของลูกค้า',
    en: 'Client Acknowledgement',
    whyTh: 'ให้ลูกค้าอ่านก่อนรับบริการ ยืนยันว่าแจ้งเรื่องสุขภาพแล้ว',
    whyEn: 'Give this to a guest before treatment so they confirm health notes were shared.',
  },
  {
    id: 'photo',
    th: 'ข้อตกลงงานถ่ายภาพ',
    en: 'Photography Terms',
    whyTh: 'ใช้ตอนจ้างถ่ายภาพร้าน ว่ารูปไปขึ้นเว็บได้อย่างไร และห้ามใช้รูปลูกค้าโดยไม่ขอ',
    whyEn: 'Use when hiring shop photos: website use, and no guest photos without permission.',
  },
  {
    id: 'privacy',
    th: 'ประกาศความเป็นส่วนตัว',
    en: 'Privacy Notice',
    whyTh: 'ติดเว็บหรือหน้าร้าน บอกว่าเก็บข้อมูลร้านอะไรบ้าง เครื่องมือนี้ไม่เก็บเบอร์ลูกค้า',
    whyEn: 'Put on the website or counter: what shop details you keep. This toolkit does not store guest numbers.',
  },
  {
    id: 'web',
    th: 'ข้อกำหนดเว็บไซต์',
    en: 'Website Terms',
    whyTh: 'ใส่ท้ายเว็บ ว่าราคาและเวลาให้ยืนกับร้าน ไม่ใช่สัญญาขายออนไลน์',
    whyEn: 'Add at the foot of the website: prices and times should be confirmed with the shop.',
  },
] as const

export const tipPool = [
  {
    th: 'ขอรีวิวหลังนัดที่จบแล้วด้วยข้อความที่คัดลอกไปส่งเอง ไม่ต้องเก็บเบอร์ลูกค้าในเครื่องมือนี้',
    en: 'Ask for a review after a completed visit using copy-and-send. Do not store customer numbers here.',
  },
]

export const navItems = [
  { id: 'home', to: '/business-toolkit', th: 'หน้าหลัก', en: 'Home' },
  { id: 'tools', to: '/business-toolkit#tools', th: 'เครื่องมือธุรกิจฟรี', en: 'Free toolkit' },
  { id: 'queue', to: '/business-toolkit#queue', th: 'คิววันนี้', en: "Today's queue" },
  { id: 'guests', to: '/business-toolkit#guests', th: 'ลูกค้าของฉัน', en: 'My customers' },
  { id: 'reminders', to: '/business-toolkit#reminders', th: 'ตัวช่วยแจ้งเตือน', en: 'Reminders' },
  { id: 'reviews', to: '/business-toolkit#reviews', th: 'ดูแลรีวิว', en: 'Review care' },
  { id: 'docs', to: '/business-toolkit#docs', th: 'เอกสารและเทมเพลต', en: 'Documents' },
  { id: 'settings', to: '/business-toolkit#settings', th: 'การตั้งค่า', en: 'Settings' },
  { id: 'help', to: '/contact?need=toolkit', th: 'ช่วยเหลือ', en: 'Help' },
] as const

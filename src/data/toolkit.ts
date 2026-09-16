export const toolkitDisclaimer =
  'ชุดเครื่องมือฟรีนี้ทำงานในเบราว์เซอร์ของคุณ ไม่ส่ง SMS อัตโนมัติ ไม่เก็บรายชื่อหรือเบอร์ลูกค้า และไม่ใช่คำปรึกษากฎหมาย'

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

export const photoSlots = [
  { id: 'main', th: 'รูปหน้าหลัก', en: 'Main website photo', shortTh: 'หน้าหลัก', shortEn: 'Main' },
  { id: 'service', th: 'รูปบริการ', en: 'Service photo', shortTh: 'บริการ', shortEn: 'Service' },
  { id: 'venue', th: 'รูปสถานที่', en: 'Venue photo', shortTh: 'สถานที่', shortEn: 'Venue' },
  { id: 'team', th: 'รูปทีมงาน', en: 'Team photo', shortTh: 'ทีมงาน', shortEn: 'Team' },
  { id: 'gallery', th: 'Gallery', en: 'Gallery', shortTh: 'แกลเลอรี', shortEn: 'Gallery' },
  { id: 'promo', th: 'รูปโปรโมชัน', en: 'Promo photo', shortTh: 'โปรโมชัน', shortEn: 'Promo' },
  { id: 'social', th: 'รูป Facebook / Google', en: 'Social / Maps photo', shortTh: 'โซเชียล', shortEn: 'Social' },
] as const

export type PhotoSlot = (typeof photoSlots)[number]['id']

export const checklistItems = [
  { id: 'profile', th: 'ข้อมูลร้าน', en: 'Business details' },
  { id: 'services', th: 'บริการและราคา', en: 'Services and prices' },
  { id: 'hours', th: 'เวลาเปิดร้าน', en: 'Opening hours' },
  { id: 'photos', th: 'รูปภาพ', en: 'Photos' },
  { id: 'policy', th: 'นโยบายร้าน', en: 'Shop policies' },
  { id: 'website', th: 'เว็บไซต์', en: 'Website content' },
  { id: 'contact', th: 'ช่องทางติดต่อร้าน', en: 'Shop contact' },
  { id: 'pay', th: 'การรับชำระเงิน', en: 'Payment notes' },
] as const

export const tipPool = [
  {
    th: 'อัปโหลดรูปหน้าร้านและรูปบริการที่ชัด จะช่วยให้ลูกค้าเข้าใจบริการได้ง่ายขึ้น',
    en: 'Clear shopfront and service photos help customers understand what you offer.',
  },
  {
    th: 'เขียนชื่อบริการเป็นภาษาอังกฤษสั้น ๆ คู่กับภาษาไทย เพื่อลูกค้าที่ค้นจากมือถือ',
    en: 'Keep service names short in English next to Thai for phone searches.',
  },
  {
    th: 'ขอรีวิวหลังนัดที่จบแล้วด้วยข้อความที่คัดลอกไปส่งเอง ไม่ต้องเก็บเบอร์ลูกค้าในเครื่องมือนี้',
    en: 'Ask for a review after a completed visit using copy-and-send. Do not store customer numbers here.',
  },
]

export const navItems = [
  { id: 'home', to: '/business-toolkit', th: 'หน้าหลัก', en: 'Home' },
  { id: 'tools', to: '/business-toolkit#tools', th: 'เครื่องมือธุรกิจฟรี', en: 'Free toolkit' },
  { id: 'services', to: '/business-toolkit#services', th: 'บริการของฉัน', en: 'My services' },
  { id: 'website', to: '/business-toolkit#website', th: 'เว็บไซต์ของฉัน', en: 'My website' },
  { id: 'docs', to: '/business-toolkit#docs', th: 'เอกสารและเทมเพลต', en: 'Documents' },
  { id: 'photos', to: '/business-toolkit#photos', th: 'คลังรูปภาพ', en: 'Photo library' },
  { id: 'settings', to: '/business-toolkit#settings', th: 'การตั้งค่า', en: 'Settings' },
  { id: 'help', to: '/contact?need=toolkit', th: 'ช่วยเหลือ', en: 'Help' },
] as const

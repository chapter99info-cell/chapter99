import { documentTemplates, messagePurposes } from '../data/toolkit'
import type { ToolkitProfile } from './toolkitStore'

type MsgId = (typeof messagePurposes)[number]['id']
type DocId = (typeof documentTemplates)[number]['id']

function shop(profile: ToolkitProfile) {
  return profile.name.trim() || 'our shop'
}

export function generateCustomerMessage(purpose: MsgId, profile: ToolkitProfile, extra: string) {
  const name = shop(profile)
  const phone = profile.phone.trim()
  const note = extra.trim()
  const lines: Record<MsgId, string> = {
    confirm: `Hello, this is ${name}. Your appointment is confirmed. Please arrive a few minutes early. If you need to change the time, reply to this message${phone ? ` or call ${phone}` : ''}.`,
    reminder: `Hello from ${name}. Friendly reminder of your appointment. We look forward to seeing you. Reply if you need to reschedule.`,
    thanks: `Thank you for visiting ${name}. We hope you feel relaxed. You are welcome back anytime.`,
    review: `Thank you for visiting ${name}. If you were happy with your treatment, a short Google review would help other guests find us. Thank you.`,
  }
  const extraLine = note ? `\n\nNote from the shop: ${note}` : ''
  return `${lines[purpose]}${extraLine}\n\n(Generated on this device. Copy and send it yourself. No customer list is stored.)`
}

export function generateDocument(id: DocId, profile: ToolkitProfile) {
  const name = shop(profile)
  const address = profile.address.trim() || '[shop address]'
  const bodies: Record<DocId, string> = {
    cancel: `${name} — Cancellation Policy\n\nPlease tell us as soon as you cannot attend. Same-day cancellations may be treated as a missed booking. This template is general information, not legal advice.`,
    booking: `${name} — Booking Terms\n\nBookings are held for the named guest. Please arrive on time. Payment is completed at the shop unless we agree otherwise. This template is not legal advice.`,
    refund: `${name} — Refund Policy\n\nIf a session cannot go ahead because of the shop, we will offer another time. Refunds for completed services are considered case by case. This template is not legal advice.`,
    ack: `${name} — Client Acknowledgement\n\nI have read the shop information provided to me and will tell the therapist about any health concerns before treatment. This template is not legal advice.`,
    photo: `${name} — Photography Terms\n\nPhotos taken for the shop website remain for business use as agreed. Personal images of guests are not used without permission. This template is not legal advice.`,
    privacy: `${name} — Privacy Notice\n\nWe collect only the business details needed to run this shop. This free toolkit does not store customer emails or phone numbers. Address: ${address}. This template is not legal advice.`,
    web: `${name} — Website Terms\n\nContent on this preview is for information. Prices and times should be confirmed with the shop. This template is not legal advice.`,
  }
  return bodies[id]
}

export function generateReminder(profile: ToolkitProfile, firstName: string, time: string, service: string) {
  const shopName = shop(profile)
  const who = firstName.trim() || 'there'
  const when = time.trim() ? ` at ${time.trim()}` : ''
  const what = service.trim() ? ` for ${service.trim()}` : ''
  return `Hello ${who}, this is ${shopName}. Friendly reminder of your appointment${when}${what}. Please message the shop if you need to change the time.\n\n(Generated on this device. Copy and send it yourself. No phone number is stored.)`
}

export function generateReviewReply(kind: 'positive' | 'negative', profile: ToolkitProfile) {
  const shopName = shop(profile)
  if (kind === 'positive') {
    return `ขอบคุณที่รีวิวค่ะ ทาง ${shopName} ดีใจที่คุณรู้สึกผ่อนคลาย ยินดีต้อนรับอีกครั้งค่ะ\n\nThank you for the review. ${shopName} is glad you felt looked after. You are welcome back anytime.\n\n(ร่างบนเครื่องนี้ ไม่ใช่คำตอบอัตโนมัติจาก Google)`
  }
  return `ขอบคุณที่แจ้งให้ทราบค่ะ ทาง ${shopName} รับฟังและยินดีให้ติดต่อร้านโดยตรงเพื่อช่วยเหลือค่ะ\n\nThank you for telling us. ${shopName} will listen and is happy to help if you contact the shop directly.\n\n(ร่างบนเครื่องนี้ ไม่ใช่คำตอบอัตโนมัติ และไม่ใช่คำปรึกษากฎหมาย)`
}

export function generateReviewInvite(profile: ToolkitProfile) {
  const shopName = shop(profile)
  const link = profile.reviewLink.trim() || '[paste your Google review link]'
  return `ถ้าคุณพอใจกับบริการวันนี้ ช่วยรีวิวสั้น ๆ ให้ ${shopName} ได้ที่\n${link}\n\nพิมพ์บรรทัดลิงก์นี้ติดหน้าร้าน หรือนำไปทำ QR ด้วยแอปของคุณ เครื่องมือนี้ไม่ส่งข้อความแทนคุณ และไม่เก็บเบอร์ลูกค้า`
}

export function generateTip(profile: ToolkitProfile, index: number) {
  const name = shop(profile)
  const tips = [
    `Write a one-sentence welcome in English on the homepage so guests know ${name} is open to book.`,
    'Describe each service in one short sentence plus duration and price in AUD.',
    'Ask for a Google review after a completed visit using copy-and-send. Do not save the customer’s number in this toolkit.',
    'Use a clear shopfront photo as the main image, then one photo per service.',
  ]
  return tips[index % tips.length]
}

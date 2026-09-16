import { documentTemplates, messagePurposes, surchargeNotice } from '../data/toolkit'
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
    intake: `${name}
แบบฟอร์มซักประวัติก่อนนวด / Pre-Massage Health Intake

วันที่ / Date: __________    ชื่อเล่นลูกค้า / Guest first name: __________
บริการ / Service: __________    นักนวด / Therapist: __________

กรุณาทำเครื่องหมายถ้าใช่ และเขียนรายละเอียดสั้น ๆ
Please tick if yes and add a short note. Do not write a phone number on this copy if you will leave it in the shop folder.

[ ] บาดเจ็บหรือผ่าตัดเร็ว ๆ นี้ / Recent injury or surgery
รายละเอียด / Details: ________________________________

[ ] แพ้น้ำมัน โลชั่น ถั่ว หรือกลิ่นหอม / Allergy to oils, lotions, nuts or fragrance
รายละเอียด / Details: ________________________________

[ ] ตั้งครรภ์ / Pregnancy
[ ] โรคผิวหนัง / Skin condition
[ ] โรคหัวใจ / Heart condition
[ ] ความดันสูง / High blood pressure
[ ] เบาหวาน / Diabetes
จุดที่ไม่ให้นวด / Areas to avoid: ________________________________

ข้าพเจ้ายืนยันว่าข้อมูลข้างต้นถูกต้องตามที่ทราบในวันนี้ และร้านนวดไม่ใช่สถานพยาบาล
I confirm this information is accurate as far as I know today. This shop is not a medical clinic.

ลายมือชื่อลูกค้า / Guest signature: __________    วันที่ / Date: __________
ร้านเก็บแผ่นนี้ที่เคาน์เตอร์ ไม่ส่งเข้าระบบออนไลน์ของเครื่องมือฟรี
Keep this paper at the shop. This free toolkit does not store the form online.

แม่แบบทั่วไป ไม่ใช่คำปรึกษากฎหมายหรือคำแนะนำทางการแพทย์`,
    surcharge: `${name}
ประกาศ Card Surcharge / Card surcharge notice

${surchargeNotice}

ค่าธรรมเนียมบัตรของร้านนี้ (ถ้ามี) / This shop’s card surcharge (if any): ______ %
ราคาก่อนคิดบัตร / Price before any card fee: shown at the counter
วันที่มีผลตามที่ร้านตรวจแล้ว / Effective date after the shop checks the rule: 1 October 2026

พิมพ์ติดเคาน์เตอร์ให้ลูกค้าเห็นก่อนจ่าย
Print and display at the counter before payment.

แม่แบบนี้ใช้ข้อความชุดเดียวกับประกาศสำคัญในเครื่องมือฟรี ไม่ใช่คำปรึกษากฎหมาย`,
    cancel: `${name} — Cancellation Policy / นโยบายยกเลิก

Please tell us as soon as you cannot attend. Same-day cancellations may be treated as a missed booking.
กรุณาบอกทันทีถ้ามาไม่ได้ การยกเลิกวันเดียวกันอาจถือว่าคิวนั้นใช้แล้ว

This template is general information, not legal advice.
แม่แบบทั่วไป ไม่ใช่คำปรึกษากฎหมาย`,
    booking: `${name} — Booking Terms / ข้อตกลงการจอง

Bookings are held for the named guest. Please arrive on time. Payment is completed at the shop unless we agree otherwise.
คิวถูกถือให้ชื่อที่จอง กรุณามาตามเวลา จ่ายที่ร้าน เว้นแต่ตกลงเป็นอย่างอื่น

This template is not legal advice.
แม่แบบนี้ไม่ใช่คำปรึกษากฎหมาย`,
    refund: `${name} — Refund Policy / นโยบายคืนเงิน

If a session cannot go ahead because of the shop, we will offer another time. Refunds for completed services are considered case by case.
ถ้าร้านทำให้คิวไม่ได้ ร้านจะเสนอเวลาใหม่ การคืนเงินหลังบริการจบแล้วพิจารณาเป็นรายกรณี

This template is not legal advice.
แม่แบบนี้ไม่ใช่คำปรึกษากฎหมาย`,
    ack: `${name}
ใบรับทราบของลูกค้า / Client acknowledgement

ข้าพเจ้าได้อ่านข้อมูลร้าน และจะบอกนักนวดก่อนเริ่มนวด หากมีอาการบาดเจ็บ ภูมิแพ้น้ำมัน ตั้งครรภ์ ความดัน เบาหวาน หรือจุดที่ไม่ให้นวด
I have read the shop information and will tell the therapist before treatment about injury, oil allergy, pregnancy, blood pressure, diabetes, or areas to avoid.

ข้าพเจ้าเข้าใจว่าร้านนวดไม่ใช่สถานพยาบาล และบริการนี้ไม่ใช่การรักษาโรค
I understand this is a massage shop, not a medical clinic, and this is not medical treatment.

ลายมือชื่อลูกค้า / Guest signature: __________    วันที่ / Date: __________

แม่แบบพร้อมใช้งาน ไม่ใช่คำปรึกษากฎหมาย
This template is ready to use. It is not legal advice.`,
    privacy: `${name} — Privacy Notice / ประกาศความเป็นส่วนตัว

We collect only the business details needed to run this shop. This free toolkit does not store customer emails or phone numbers. Address: ${address}.
เราเก็บเท่าที่จำเป็นต่อการเปิดร้าน เครื่องมือฟรีนี้ไม่เก็บอีเมลหรือเบอร์ลูกค้า ที่อยู่ร้าน: ${address}

This template is not legal advice.
แม่แบบนี้ไม่ใช่คำปรึกษากฎหมาย`,
    web: `${name} — Website Terms / ข้อกำหนดเว็บไซต์

Content on a shop website is for information. Prices and times should be confirmed with the shop.
เนื้อหาบนเว็บเป็นข้อมูลทั่วไป ราคาและเวลาให้ยืนกับร้าน

This template is not legal advice.
แม่แบบนี้ไม่ใช่คำปรึกษากฎหมาย`,
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

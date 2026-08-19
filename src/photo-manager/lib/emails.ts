import type { Client } from '../types'

export type EmailKind =
  | 'confirm'
  | 'invoice'
  | 'preshoot'
  | 'thanks'
  | 'delivery'
  | 'review'
  | 'remind'

export const EMAIL_KIND_LABEL: Record<EmailKind, string> = {
  confirm: 'ยืนยันคิวงาน / Confirm booking',
  invoice: 'ส่งใบแจ้งหนี้ / ขอมัดจำ',
  preshoot: 'เตือนก่อนถ่าย 3 วัน / Pre-shoot reminder',
  thanks: 'ขอบคุณหลังงาน / Thank-you',
  delivery: 'นโยบายส่งมอบภาพ / Delivery policy',
  review: 'ขอรีวิว / Review request',
  remind: 'ทวงยอดคงเหลือ / Balance reminder',
}

export function emailCopy(kind: EmailKind, c: Client, lang: 'th' | 'en', extras?: { gallery?: string; reviewUrl?: string }): { subject: string; body: string } {
  if (lang === 'en') return en(kind, c, extras)
  return th(kind, c, extras)
}

function th(kind: EmailKind, c: Client, extras?: { gallery?: string; reviewUrl?: string }) {
  switch (kind) {
    case 'confirm':
      return {
        subject: `ยืนยันคิวงานถ่ายภาพ — ${c.date}`,
        body: `สวัสดีค่ะ/ครับ คุณ${c.name}

Chapter99 Photography ขอยืนยันคิวงาน${c.typeLabel} วันที่ ${c.date} ณ ${c.location} ค่ะ
เวลานัดหมาย / พิธีเริ่ม: ${c.ceremonyTime} น.

ขอบคุณค่ะ
Chapter99 Photography (Saen)`,
      }
    case 'invoice':
      return {
        subject: `ใบแจ้งหนี้และมัดจำ — ${c.name}`,
        body: `สวัสดีค่ะ/ครับ คุณ${c.name}

ส่งใบแจ้งหนี้พร้อมยอดมัดจำสำหรับงาน${c.typeLabel} วันที่ ${c.date} ค่ะ กรุณาโอนเพื่อยืนยันคิวงาน (มัดจำไม่สามารถคืนได้เมื่อจองวันที่แล้ว)

โอน Bank / PayID ไม่มีค่าธรรมเนียมเพิ่ม
บัตรเครดิต/เดบิต +2% · Afterpay +5% (ยอดตามใบแจ้งหนี้)

ขอบคุณค่ะ
Chapter99 Photography`,
      }
    case 'preshoot':
      return {
        subject: `เตือนก่อนวันถ่าย 3 วัน — ${c.date}`,
        body: `สวัสดีค่ะ/ครับ คุณ${c.name}

อีก 3 วันจะถึงงาน${c.typeLabel} วันที่ ${c.date} ณ ${c.location} ค่ะ

กรุณาเตรียม:
• แผนสำรองหากอากาศไม่เอื้อ (ที่ร่มใกล้เคียง)
• เวลามาถึงของคู่บ่าวสาว / ครอบครัว — ทีมงานจะถึงก่อนพิธี
• Event guide: ช่วยชี้คนสำคัญให้ช่างภาพในวันงาน
• ไม่อนุญาตให้แขกใช้แฟลชระหว่างพิธีและภาพทางการ
• ยอดคงเหลือชำระภายในวันงานหรือก่อนหน้านั้น

ขอบคุณค่ะ
Chapter99 Photography`,
      }
    case 'thanks':
      return {
        subject: `ขอบคุณสำหรับความไว้วางใจ — ${c.name}`,
        body: `สวัสดีค่ะ/ครับ คุณ${c.name}

ขอบคุณที่ไว้วางใจ Chapter99 Photography ดูแลงาน${c.typeLabel}ค่ะ ภาพชุดคัดสรรจะทยอยส่งให้ตามกำหนด (ตัดต่อประมาณ 6–8 สัปดาห์ ส่งมอบ 8–10 สัปดาห์)

ขอบคุณค่ะ
Chapter99 Photography (Saen)`,
      }
    case 'delivery':
      return {
        subject: `นโยบายส่งมอบภาพ — ${c.name}`,
        body: `สวัสดีค่ะ/ครับ คุณ${c.name}

นโยบายส่งมอบภาพ Chapter99 Photography:
• ตัดต่อประมาณ 6–8 สัปดาห์ นับจากวันงาน
• ส่งมอบแกลเลอรีภายใน 8–10 สัปดาห์
• ลิงก์แกลเลอรีมีกำหนดหมดอายุ — ดาวน์โหลดไว้เมื่อได้รับ
• ลิขสิทธิ์ภาพเป็นของ Chapter99 Photography — ลูกค้าใช้ส่วนตัวได้ ห้ามใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาต
• รีทัชเพิ่มเติมฟรีสูงสุด 10 ภาพ (extended retouch)
• ไฟล์เก็บไว้ 1 ปี หลังจากนั้นอาจถูกลบ

${extras?.gallery ? `ลิงก์แกลเลอรี: ${extras.gallery}` : ''}

ขอบคุณค่ะ
Chapter99 Photography`,
      }
    case 'review':
      return {
        subject: `รบกวนรีวิวร้าน — ${c.name}`,
        body: `สวัสดีค่ะ/ครับ คุณ${c.name}

หากพอใจงาน${c.typeLabel} รบกวนช่วยรีวิว Google ให้ Chapter99 Photography สักเล็กน้อยค่ะ จะช่วยร้านเล็กๆ ของเราได้มาก

${extras?.reviewUrl ?? 'https://g.page/r/chapter99photography'}

ขอบคุณค่ะ
Chapter99 Photography (Saen)`,
      }
    case 'remind':
      return {
        subject: `แจ้งเตือนยอดคงเหลือ — ${c.date}`,
        body: `สวัสดีค่ะ/ครับ คุณ${c.name}

รบกวนแจ้งเตือนยอดคงเหลือสำหรับงาน${c.typeLabel} วันที่ ${c.date} ค่ะ กรุณาชำระก่อนหรือในวันงาน

ขอบคุณค่ะ
Chapter99 Photography`,
      }
  }
}

function en(kind: EmailKind, c: Client, extras?: { gallery?: string; reviewUrl?: string }) {
  switch (kind) {
    case 'confirm':
      return {
        subject: `Booking confirmation — ${c.date}`,
        body: `Hello ${c.name},

Chapter99 Photography confirms your ${c.typeLabel} on ${c.date} at ${c.location}.
Call time / ceremony start: ${c.ceremonyTime}.

Thank you,
Chapter99 Photography (Saen)`,
      }
    case 'invoice':
      return {
        subject: `Invoice and deposit — ${c.name}`,
        body: `Hello ${c.name},

Please find your invoice and deposit request for the ${c.typeLabel} on ${c.date}. The date is reserved once the non-refundable deposit is received.

Bank transfer / PayID: no surcharge.
Card +2% · Afterpay +5% (amount shown on the invoice).

Thank you,
Chapter99 Photography`,
      }
    case 'preshoot':
      return {
        subject: `3-day pre-shoot reminder — ${c.date}`,
        body: `Hello ${c.name},

Your ${c.typeLabel} is in 3 days (${c.date} at ${c.location}).

Please confirm:
• Weather backup plan (nearby covered area)
• Arrival time — the team arrives before ceremony start
• Event guide: someone to point out key people on the day
• No guest flash photography during the ceremony or formals
• Remaining balance due on or before the event date

Thank you,
Chapter99 Photography`,
      }
    case 'thanks':
      return {
        subject: `Thank you — ${c.name}`,
        body: `Hello ${c.name},

Thank you for trusting Chapter99 Photography with your ${c.typeLabel}. Selected images follow our usual timeline (editing about 6–8 weeks, final delivery 8–10 weeks).

Thank you,
Chapter99 Photography (Saen)`,
      }
    case 'delivery':
      return {
        subject: `Delivery policy — ${c.name}`,
        body: `Hello ${c.name},

Chapter99 Photography delivery policy:
• Editing approximately 6–8 weeks from the event
• Final gallery within 8–10 weeks
• Gallery links expire — please download when you receive them
• Copyright remains with Chapter99 Photography; personal-use licence for the client
• Up to 10 complimentary extended retouches
• Files retained for 1 year

${extras?.gallery ? `Gallery: ${extras.gallery}` : ''}

Thank you,
Chapter99 Photography`,
      }
    case 'review':
      return {
        subject: `A quick Google review — ${c.name}`,
        body: `Hello ${c.name},

If you were happy with your ${c.typeLabel}, a short Google review would mean a lot to our small studio.

${extras?.reviewUrl ?? 'https://g.page/r/chapter99photography'}

Thank you,
Chapter99 Photography (Saen)`,
      }
    case 'remind':
      return {
        subject: `Balance reminder — ${c.date}`,
        body: `Hello ${c.name},

A reminder that the remaining balance for your ${c.typeLabel} on ${c.date} is due on or before the event.

Thank you,
Chapter99 Photography`,
      }
  }
}

export function mailtoHref(to: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

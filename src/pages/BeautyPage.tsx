import { IndustryPage } from '../site/IndustryPage'
import { siteMedia } from '../site/media'

export function BeautyPage() {
  return (
    <IndustryPage
      content={{
        kind: 'beauty',
        photo: siteMedia.booking,
        photoAlt: { th: 'ภาพแนวคิดร้านความงาม', en: 'Concept beauty salon photo' },
        photoNote: { th: 'ภาพแนวคิด ไม่ใช่ผลงานลูกค้าร้านความงามจริง', en: 'Concept photo — not a proven beauty client case.' },
        eyebrow: { th: 'สำหรับร้านขนตาและความงามในออสเตรเลีย', en: 'For Thai eyelash and beauty businesses in Australia' },
        title: { th: 'ให้ผลงานดูชัด และนัดไม่หลุด', en: 'Make your beauty business shine online.' },
        lead: {
          th: 'ช่วยเรื่องภาพผลงาน การจอง การสื่อสารก่อนและหลังบริการ และลูกค้าที่กลับมาใช้บริการ หน้านี้ยังเป็นหน้าที่สื่อสาร ไม่ใช่ระบบร้านความงามสำเร็จรูป',
          en: 'We help with work photos, booking steps, before-and-after messages, and return visits. This is a service page, not a finished salon platform.',
        },
        steps: [
          { title: { th: 'ภาพผลงานและบริการ', en: 'Work and services' }, body: { th: 'โชว์สไตล์งานและราคาให้อ่านง่าย', en: 'Show style, duration and price clearly.' } },
          { title: { th: 'การจอง', en: 'Bookings' }, body: { th: 'เลือกบริการ เวลา และยืนยันนัด', en: 'Choose a service, time and confirmation.' } },
          { title: { th: 'ก่อนและหลังบริการ', en: 'Before and after care' }, body: { th: 'ข้อความเตรียมตัวและดูแลหลังทำ', en: 'Prep and aftercare messages the salon can send.' } },
          { title: { th: 'งานลูกค้า', en: 'Client notes' }, body: { th: 'บันทึกสไตล์ที่ลูกค้าชอบในขอบเขตที่ตกลง', en: 'Keep preferred styles within the agreed scope.' } },
          { title: { th: 'รับชำระเงิน', en: 'Get paid' }, body: { th: 'มัดจำและใบเสร็จตามวิธีที่ร้านใช้', en: 'Deposits and receipts matching how the salon already takes payment.' } },
          { title: { th: 'ลูกค้ากลับมา', en: 'Return visits' }, body: { th: 'เตือนเติมขนตาและดูแลรีวิวอย่างตรงไปตรงมา', en: 'Refill reminders and review care, without fake ratings.' } },
        ],
      }}
    />
  )
}

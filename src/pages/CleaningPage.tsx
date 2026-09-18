import { IndustryPage } from '../site/IndustryPage'
import { siteMedia } from '../site/media'

export function CleaningPage() {
  return (
    <IndustryPage
      content={{
        kind: 'cleaning',
        photo: siteMedia.mix,
        photoAlt: { th: 'ภาพแนวคิดธุรกิจทำความสะอาด', en: 'Concept cleaning business photo' },
        photoNote: { th: 'ภาพแนวคิด ไม่ใช่หลักฐานทีมทำความสะอาดของ Chapter99', en: 'Concept photo — not a Chapter99 cleaning crew photo.' },
        eyebrow: { th: 'สำหรับธุรกิจทำความสะอาดในออสเตรเลีย', en: 'For Thai cleaning businesses in Australia' },
        title: { th: 'ให้งานชัดตั้งแต่สอบถามจนส่งมอบ', en: 'Run your cleaning business with confidence.' },
        lead: {
          th: 'ช่วยเรื่องการนำเสนอบริการ การสอบถามขอบเขตงาน การนัดหมาย ใบเสนอราคาหรือใบแจ้งหนี้ตามความสามารถจริง และเช็กลิสต์งานประจำ ไม่สร้างระบบบัญชีใหม่',
          en: 'We help with how the service is presented, quoting the job, appointments, invoices within current capability, and checklists. This does not create a new accounting product.',
        },
        steps: [
          { title: { th: 'นำเสนอบริการ', en: 'Present the service' }, body: { th: 'บอกชัดว่าทำบ้าน ออฟฟิศ หรืองานตามที่ตกลง', en: 'Say clearly what homes, offices or jobs you take.' } },
          { title: { th: 'สอบถามและประเมิน', en: 'Enquire and scope' }, body: { th: 'เก็บขนาดงาน เวลา และสิ่งที่ลูกค้าต้องการ', en: 'Capture size, timing and what the customer needs.' } },
          { title: { th: 'นัดหมาย', en: 'Appointments' }, body: { th: 'วัน เวลา และทีมที่ไปทำงาน', en: 'Date, time and who is on the job.' } },
          { title: { th: 'ใบเสนอราคา / ใบแจ้งหนี้', en: 'Quotes and invoices' }, body: { th: 'ใช้แม่แบบเอกสารใน Toolkit ไม่ใช่ระบบบัญชีอัตโนมัติ', en: 'Use Toolkit document templates — not an automated accounts system.' } },
          { title: { th: 'เช็กลิสต์งาน', en: 'Job checklists' }, body: { th: 'รายการตรวจก่อนส่งมอบที่ทีมใช้ร่วมกัน', en: 'A shared checklist before handover.' } },
          { title: { th: 'ลูกค้าประจำ', en: 'Regular clients' }, body: { th: 'รอบทำความสะอาดที่กลับมาได้โดยไม่พึ่งคนคนเดียวจำ', en: 'Repeat visits that do not live only in one person’s head.' } },
        ],
      }}
    />
  )
}

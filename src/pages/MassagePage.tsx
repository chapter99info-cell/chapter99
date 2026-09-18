import { Link } from 'react-router-dom'
import { IndustryPage } from '../site/IndustryPage'
import { siteMedia } from '../site/media'

export function MassagePage() {
  return (
    <IndustryPage
      content={{
        kind: 'shop',
        photo: siteMedia.massage,
        photoAlt: { th: 'ภาพร้านนวดแนวคิด', en: 'Concept massage venue photo' },
        photoNote: { th: 'ภาพแนวคิด ไม่ใช่หลักฐานลูกค้าจริง', en: 'Concept photo — not a proven client case.' },
        eyebrow: { th: 'สำหรับร้านนวดในออสเตรเลีย', en: 'For Thai massage businesses in Australia' },
        title: { th: 'ให้ลูกค้าเห็นร้านชัด และจองได้สบายใจ', en: 'Look professional. Get booked with calm.' },
        lead: {
          th: 'ช่วยเรื่องภาพลักษณ์ร้าน การค้นพบบน Google ขั้นตอนจอง การชำระเงิน และคิวประจำวัน โดยยังเป็นหน้าที่สื่อสารบริการ ไม่ใช่ระบบจองสด',
          en: 'We help with how the shop looks, how customers find you, booking steps, payment, and the daily queue. This is a service page — not a live booking platform.',
        },
        steps: [
          { title: { th: 'ภาพลักษณ์ร้านและบริการ', en: 'Shop look and services' }, body: { th: 'ภาพ เว็บ และข้อความที่สะท้อนบรรยากาศร้าน', en: 'Photos, website and copy that feel like your rooms.' } },
          { title: { th: 'ให้ลูกค้าค้นเจอ', en: 'Be found' }, body: { th: 'ข้อมูลร้านชัดบนเว็บและแผนที่', en: 'Clear shop details on the web and maps.' } },
          { title: { th: 'จองและยืนยัน', en: 'Book and confirm' }, body: { th: 'เลือกบริการ เวลายืนยัน และข้อความที่ทีมใช้จริง', en: 'Service choice, confirmation and messages your team can actually send.' } },
          { title: { th: 'รับชำระเงิน', en: 'Get paid' }, body: { th: 'มัดจำ ใบเสร็จ และขั้นตอนที่ตกลงในขอบเขต', en: 'Deposits, receipts and payment steps scoped to the project.' } },
          { title: { th: 'คิวงานประจำวัน', en: 'Daily queue' }, body: { th: 'ทีมเห็นนัดเดียวกัน ลองได้ในเดโมร้านนวด', en: 'The team sees the same appointments. Try the massage demo.' } },
          { title: { th: 'ลูกค้ากลับมา', en: 'Return visits' }, body: { th: 'ดูแลรีวิวและข้อความเชิญกลับอย่างตรงไปตรงมา', en: 'Review care and return messages, without fake claims.' } },
        ],
        extra: (
          <section className="v2-section">
            <div className="v2-wrap">
              <p className="v2-eyebrow">DEMO</p>
              <h2>ลองมุมลูกค้า เจ้าของ และพนักงาน</h2>
              <p>ข้อมูลสมมติ ไม่ส่งข้อความและไม่รับจองจริง</p>
              <Link className="v2-btn primary" to="/demo/massage">
                เปิดเดโมสามมุมมอง
              </Link>
            </div>
          </section>
        ),
      }}
    />
  )
}

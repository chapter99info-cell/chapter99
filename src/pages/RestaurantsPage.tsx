import { RestaurantCast } from '../components/RestaurantCast'
import { IndustryPage } from '../site/IndustryPage'
import { siteMedia } from '../site/media'

export function RestaurantsPage() {
  return (
    <IndustryPage
      content={{
        kind: 'restaurant',
        photo: siteMedia.restaurant,
        photoAlt: { th: 'ภาพร้านอาหารแนวคิด', en: 'Concept restaurant photo' },
        photoNote: { th: 'ภาพแนวคิด ไม่ใช่หลักฐานร้านที่เปิดใช้ระบบแล้ว', en: 'Concept photo — not a live restaurant case study.' },
        eyebrow: { th: 'สำหรับร้านอาหารไทยในออสเตรเลีย', en: 'For Thai restaurants in Australia' },
        title: { th: 'ให้เมนูถูกเห็น และงานร้านเดินชัดขึ้น', en: 'Run your restaurant. Grow your business.' },
        lead: {
          th: 'ช่วยเรื่องภาพอาหาร เมนู การค้นพบร้าน ช่องทางสั่งหรือจองตามขอบเขตที่ตกลง การรับเงิน และงานประจำวัน ไม่ใช่ระบบเดลิเวอรี่ใหม่ทั้งชุด',
          en: 'We help with food photography, menus, discovery, ordering or booking within an agreed scope, payments, and daily operations. This is not a new delivery platform.',
        },
        steps: [
          { title: { th: 'เมนูและภาพอาหาร', en: 'Menu and food photos' }, body: { th: 'จัดภาพ ชื่อ และราคาให้อ่านง่าย', en: 'Make dishes, names and prices easy to choose.' } },
          { title: { th: 'ค้นพบร้าน', en: 'Be found' }, body: { th: 'เว็บและข้อมูลร้านที่ลูกค้าเข้าใจ', en: 'A website and listing details customers understand.' } },
          { title: { th: 'สั่งอาหารหรือจองโต๊ะ', en: 'Orders or tables' }, body: { th: 'เชื่อมช่องทางที่มีอยู่หรือออกแบบตามขอบเขต ไม่สัญญาแอปสั่งอาหารครบชุดถ้ายังไม่ได้ทำ', en: 'Connect existing channels or design within scope. We do not claim a full ordering app unless it is built.' } },
          { title: { th: 'รับเงิน', en: 'Get paid' }, body: { th: 'ใบเสร็จและขั้นตอนชำระเงินตามที่ตกลง', en: 'Receipts and payment steps as scoped.' } },
          { title: { th: 'งานร้าน', en: 'Run the floor' }, body: { th: 'คิว ออเดอร์ และหน้าที่ทีมที่เขียนเป็นขั้นตอน', en: 'Queue, orders and team routines written as steps.' } },
          { title: { th: 'รักษาลูกค้า', en: 'Keep guests' }, body: { th: 'ข้อความและโปรโมชันที่ร้านควบคุมเอง', en: 'Messages and offers the shop still owns.' } },
        ],
        extra: (
          <section className="v2-section">
            <div className="v2-wrap">
              <RestaurantCast />
            </div>
          </section>
        ),
      }}
    />
  )
}

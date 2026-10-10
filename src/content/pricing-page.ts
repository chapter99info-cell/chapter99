export const pricingPage = {
  eyebrow: { th: '06 / PACKAGES', en: '06 / PACKAGES' },
  h1: { th: 'ราคาตามประเภทธุรกิจ', en: 'Prices by shop type' },
  sub: {
    th: 'ค่าตั้งค่าครั้งแรก + รายเดือน · ตกลงขอบเขตก่อนเริ่ม',
    en: 'One-time setup + monthly · scope agreed first',
  },
  massage: { th: 'ร้านนวด', en: 'Massage' },
  restaurant: { th: 'ร้านอาหาร', en: 'Restaurant' },
  demo: { th: 'DEMO', en: 'DEMO' },
  system: {
    massage: { th: 'ระบบจองคิว', en: 'booking system' },
    restaurant: { th: 'ระบบสั่งอาหาร', en: 'ordering system' },
  },
  recommended: { th: 'แนะนำ', en: 'Recommended' },
  ctaFb: { th: 'ทักแชท Facebook', en: 'Facebook chat' },
  optional: { th: 'ไม่บังคับ', en: 'Optional' },
  photo: { th: 'ถ่ายภาพร้าน', en: 'Shop photos' },
  reels: { th: 'วิดีโอ Reels', en: 'Reels video' },
  square: { th: 'Square Setup', en: 'Square Setup' },
  once: { th: 'ครั้งเดียว', en: 'one-time' },
  gstLine: {
    th: 'ราคารวม GST แล้ว · ค่าเครื่อง/Square/SMS ร้านจ่ายเอง · งานนอกขอบเขตแจ้งราคาก่อน · ถ่ายภาพในซิดนีย์ (ต่างเมืองคิดค่าเดินทาง)',
    en: 'GST included · shop pays hardware/Square/SMS · extra scope priced first · photos in Sydney (travel extra)',
  },
  addonNote: {
    th: 'ไม่คิดซ้ำถ้ารวมในแพ็กแล้ว',
    en: 'Not charged twice if already in the package',
  },
  include: {
    th: 'รวม: โฮสติ้ง ดูแลเว็บ ตามรอบแก้ที่ระบุ',
    en: 'Includes: hosting, site care, listed edit rounds',
  },
  exclude: {
    th: 'ไม่รวม: ค่าโดเมน งานนอกขอบเขต — แจ้งราคาก่อนทำ',
    en: 'Not included: domain, extra scope — priced first',
  },
  squareLine: {
    th: 'ค่าธรรมเนียม Square/อุปกรณ์ จ่ายให้ Square โดยตรงตามการใช้จริง · ร้านเป็นเจ้าของบัญชี · เราไม่เก็บข้อมูลบัตร',
    en: 'Square fees/hardware are paid to Square as used · shop owns the account · we never store card data',
  },
  details: { th: 'ดูรายละเอียด', en: 'See details' },
  faqKicker: { th: '08 / FAQ', en: '08 / FAQ' },
  faqTitle: { th: 'คำถาม', en: 'FAQ' },
  faqs: [
    {
      q: { th: 'ต้องเก่งคอมไหม?', en: 'Do I need to be techy?' },
      a: { th: 'ไม่ต้อง เราตั้งค่าให้และสอนใช้งาน', en: 'No. We set it up and train you.' },
    },
    {
      q: { th: 'ค่ารายเดือนจ่ายเพื่ออะไร?', en: 'What is the monthly for?' },
      a: {
        th: 'โฮสติ้ง ดูแลเว็บ และแก้ข้อมูลเล็กน้อยตามขอบเขต',
        en: 'Hosting, site care, and small scoped edits',
      },
    },
    {
      q: { th: 'เลิกใช้แล้วข้อมูลไปไหน?', en: 'If I stop, where does data go?' },
      a: { th: 'ข้อมูลเป็นของร้าน ส่งออกและย้ายได้', en: 'The shop owns it. Export and move it.' },
    },
  ],
  close: { th: 'คุยภาษาไทย ตอบไว', en: 'Thai support. Fast replies.' },
  sms: { th: 'ส่ง SMS', en: 'Send SMS' },
} as const

export const demoHref = {
  massage: '/mockup/v7/demo-booking.html',
  restaurant: '/mockup/v7/demo-order.html',
} as const

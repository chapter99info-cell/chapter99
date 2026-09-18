/**
 * Manual search index for the public marketing site.
 * This is not generated from headings. If you rename a section id, heading,
 * or route, update the matching `href` / copy here or that result will 404
 * or jump to a missing hash.
 */
export type SiteEntry = {
  href: string
  title: { th: string; en: string }
  blurb: { th: string; en: string }
}

export const siteCatalog: SiteEntry[] = [
  {
    href: '/',
    title: { th: 'หน้าแรก', en: 'Home' },
    blurb: {
      th: 'ระบบดิจิทัลร้านค้า ภาพ เว็บ จองคิว และการชำระเงิน',
      en: 'Digital shop systems: photos, website, booking and payments',
    },
  },
  {
    href: '/pricing',
    title: { th: 'แพ็กเกจและราคา', en: 'Packages & Pricing' },
    blurb: {
      th: 'START Presence · GROW Operations · SCALE Infrastructure และ Square Setup เป็น add-on',
      en: 'START Presence, GROW Operations, SCALE Infrastructure, plus Square Setup as an add-on',
    },
  },
  {
    href: '/#solutions',
    title: { th: 'Solutions', en: 'Solutions' },
    blurb: { th: 'LOOK BE FOUND GET BOOKED GET PAID RUN GROW', en: 'LOOK BE FOUND GET BOOKED GET PAID RUN GROW' },
  },
  {
    href: '/#toolkit',
    title: { th: 'ชุดเครื่องมือร้านนวดฟรี', en: 'Free Massage Shop Toolkit' },
    blurb: {
      th: 'ลิงก์รีวิว GST ราคาตามนาที แบบฟอร์มลูกค้าใหม่',
      en: 'Review link, GST helper, duration prices, intake form',
    },
  },
  {
    href: '/#proof',
    title: { th: 'หลักฐานงานจริง', en: 'Proof / case studies' },
    blurb: { th: 'เว็บร้านนวด จองคิว และร้านอาหาร', en: 'Massage, booking and restaurant screens' },
  },
  {
    href: 'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit',
    title: { th: 'Business Audit', en: 'Business Audit' },
    blurb: { th: 'ส่งอีเมล chapter99solutions@gmail.com เพื่อคุยขอบเขตงาน', en: 'Email chapter99solutions@gmail.com to talk through scope' },
  },
  {
    href: '/#faq',
    title: { th: 'คำถามที่พบบ่อย', en: 'FAQ' },
    blurb: { th: 'ขอบเขตงาน ราคา บัญชีร้าน และชุดเครื่องมือฟรี', en: 'Scope, pricing, shop accounts and the free toolkit' },
  },
]

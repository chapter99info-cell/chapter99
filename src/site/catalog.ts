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
      th: 'Starter Growth Premium และแพ็กถ่ายภาพ + เว็บ',
      en: 'Starter, Growth, Premium and photo + web packages',
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
    href: '/#audit',
    title: { th: 'Business Audit', en: 'Business Audit' },
    blurb: { th: 'นัดดูร้านและแนะนำสิ่งที่ควรเริ่มก่อน', en: 'A look at your shop and what to start first' },
  },
  {
    href: '/#faq',
    title: { th: 'คำถามที่พบบ่อย', en: 'FAQ' },
    blurb: { th: 'สัญญา โดเมน HICAPS และการยกเลิก', en: 'Contracts, domain, HICAPS and cancelling' },
  },
]

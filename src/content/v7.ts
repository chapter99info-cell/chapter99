export const v7Copy = {
  th: {
    heroKicker: 'THAI BUSINESS · AUSTRALIA',
    heroHeadline: 'WE BUILD SHOPS THAT SELL.',
    heroSub: 'ให้ร้านไทยในออสฯ ดูดีและขายได้จริง',
    heroLine: 'เว็บไซต์ จองคิว และภาพลักษณ์ร้าน — ตั้งค่าให้ครบ',
    ctaTalk: 'ทักแชท Facebook →',
    ctaPackages: 'ดูแพ็กเกจ →',
    ctaSms: 'ส่ง SMS',
    ctaFacebook: 'ทัก Facebook',
    starterNoBooking: 'ไม่มีระบบจองคิว',
  },
  cover: {
    kicker: 'THAI BUSINESS · AUSTRALIA',
    lines: ['WE BUILD', 'SHOPS', 'THAT SELL.'] as const,
    outline: 'THAT SELL.',
  },
  clients: ['THAI GARLIC', 'PRINCESS THAI MASSAGE', 'JASMINE MASSAGE & SPA', 'MIRA THAI MASSAGE'] as const,
  works: [
    {
      title: 'Princess Thai Massage',
      tag: 'นวด · เว็บไซต์ Riverwood',
      src: '/mockup/media/web/work-princess.webp',
      alt: 'หน้าเว็บร้าน Princess Thai Massage',
    },
    {
      title: 'Thai Sabey Sydney',
      tag: 'สปา · เว็บไซต์',
      src: '/mockup/media/web/work-thaisabey.webp',
      alt: 'หน้าเว็บร้าน Thai Sabey Sydney',
    },
    {
      title: 'Thai-Aus Verified',
      tag: 'แอป · ระบบชุมชน',
      src: '/mockup/media/web/work-thaiaus.webp',
      alt: 'หน้าจอแอป Thai-Aus Verified',
    },
    {
      title: 'Food Photography',
      tag: 'ถ่ายภาพอาหาร · เมนู',
      src: '/mockup/media/web/work-food.webp',
      alt: 'ถ่ายภาพอาหารไทย',
    },
  ],
  stats: {
    enabled: false,
    headline: 'เกือบ 10 ปี ช่วยธุรกิจไทยในซิดนีย์ให้เติบโต',
    items: [
      { num: '10', label: 'ปี ประสบการณ์ถ่ายภาพ' },
      { num: '10', label: 'ปี ในชุมชนไทยซิดนีย์' },
      { num: '5', label: 'บริการ ครบในที่เดียว' },
    ],
  },
  en: {
    heroKicker: 'For Thai businesses in Australia',
  },
  contact: {
    email: 'chapter99solutions@gmail.com',
    phoneDisplay: '0452 044 382',
    phoneHref: 'tel:+61452044382',
    sms: 'sms:+61452044382',
    facebookInbox: 'https://m.me/61586534972406',
    facebook: 'https://www.facebook.com/profile.php?id=61586534972406',
  },
  seo: {
    title: 'Chapter99 — งานหลังร้านน้อยลง มีเวลาดูแลลูกค้ามากขึ้น',
    description:
      'เว็บไซต์ ระบบจองคิว และเครื่องมือร้านสำหรับธุรกิจไทยในออสเตรเลีย คุยภาษาไทย ตั้งค่าให้ครบ',
  },
} as const

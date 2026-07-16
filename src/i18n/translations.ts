export type Lang = 'th' | 'en'

export const translations = {
  th: {
    'nav.services': 'บริการ',
    'nav.portfolio': 'ผลงาน',
    'nav.pricing': 'ราคา',
    'nav.contact': 'ติดต่อ',
    'nav.getDemo': 'ขอดูเดโม',

    'hero.pill.demo': 'นัด Demo ฟรี',
    'hero.pill.portfolio': 'ดูผลงาน',
    'hero.pill.facebook': 'ทัก Facebook',
    'hero.pill.pricing': 'ดู Pricing',
    'hero.reachUs': 'ติดต่อเรา:',

    'services.headingLine1': 'สิ่งที่',
    'services.headingLine2': 'เราทำ',
    'services.viewPortfolio': 'ดูผลงาน',
    'services.intro':
      'Chapter99 คือทีม Digital Agency ที่เข้าใจธุรกิจไทยในออสเตรเลียจริงๆ เราสร้างระบบที่ทำงานให้คุณ ตั้งแต่ภาพถ่าย F&B ไปจนถึง PWA Booking System และ POS ครบวงจร',
    'services.card1.desc':
      'ภาพถ่ายอาหารและสปาระดับมืออาชีพ ดึงดูดลูกค้าฝรั่งได้จริง — AI Gen ที่เหลือ match style ไม่ต้องทำอาหารพิเศษ',
    'services.card1.cta': 'ดูผลงานถ่ายภาพ',
    'services.card2.desc': 'ระบบจองออนไลน์ + POS + HICAPS Health Fund + GST Invoice พร้อมใช้ใน 7 วัน',
    'services.card2.cta': 'ดูแพ็กเกจราคา',
    'services.card3.desc': 'QR scan บนโต๊ะ เมนูขึ้น browser ทันที อัพเดทราคาได้เองผ่าน Google Sheet',
    'services.card3.cta': 'ขอดูเดโม',

    'clients.trustLine': 'ธุรกิจไทยในออสเตรเลียที่ไว้วางใจเรา',

    'live.badge': 'ผลงานจริง',
    'live.heading': 'เว็บไซต์ตัวอย่างที่เราทำจริง',
    'live.viewSite': 'ดูเว็บไซต์',
    'live.project1.desc': 'เว็บร้านนวดพร้อมระบบจองคิวและเมนูดิจิทัล ใช้งานจริงกับลูกค้าหน้าร้าน.',
    'live.project2.desc': 'ระบบหลังบ้านจัดการร้าน คิวพนักงาน ใบเสร็จ และตั้งค่าหลายสาขาในที่เดียว.',
    'live.project3.desc': 'เว็บไซต์แบรนด์เต็มรูปแบบ พร้อมภาพและวิดีโอโปรดักชันจริง.',

    'why.eyebrow': 'ทำไมต้อง Chapter99',
    'why.body':
      'ช่างภาพ F&B 10+ ปี + AI Developer + เข้าใจธุรกิจไทยในออส — combination ที่หาไม่ได้ในตลาด เจ้าของร้านไม่ต้องรู้โค้ด ไม่ต้องรอ IT ระบบดูแลตัวเองได้',
    'why.charcoalBody':
      'ออกแบบ digital presence ให้ธุรกิจไทยในออสดูน่าเชื่อถือ สะอาด และ professional — ในแบบที่เจ้าของร้านไว้วางใจได้',
    'why.viewPortfolio': 'ดูผลงาน',

    'pricing.heading': 'แพ็กเกจเรียบง่าย สำหรับธุรกิจไทยในต่างแดน',
    'pricing.subheading': 'เลือกแพ็กที่เหมาะกับธุรกิจของคุณ — แตะการ์ดเพื่อดูรายละเอียด',
    'pricing.viewDetails': 'ดูรายละเอียด →',
    'pricing.selectPackage': 'เลือกแพ็กเกจนี้ · นัด Demo ฟรี',
    'pricing.paySquareHeading': 'ชำระผ่าน Square',
    'pricing.paySquareBody': 'เลือกลิงก์ให้ตรงกับประเภทการชำระ — setup ครั้งเดียว หรือค่าบริการรายเดือน',

    'wellness.caseStudyLabel': 'ตัวอย่างผลงาน · Case Study',
    'wellness.disclaimer': 'ตัวอย่างแพ็กเกจราคาที่เราออกแบบให้ลูกค้าร้านสปา — ไม่ใช่ราคาบริการของ Chapter99',
    'wellness.footNote': 'มีระบบจองคิวเดิมอยู่แล้ว? ไม่ต้องเปลี่ยน — เราแปะลิงก์ต่อจากหน้าเว็บใหม่ให้ได้เลย',
    'wellness.startUsing': 'เริ่มต้นใช้งาน',
    'wellness.tier1.target': 'เว็บ + AI Content + SEO ครบชุด เหมาะร้านเริ่มต้น ไม่มีระบบจองคิว',
    'wellness.tier1.f1': 'เว็บร้าน PWA',
    'wellness.tier1.f2': 'AI สร้างภาพและวิดีโอโปรโมทร้าน',
    'wellness.tier1.f3': 'Google SEO พื้นฐาน (AI-optimized)',
    'wellness.tier1.f4': 'AI Finder ให้ลูกค้าค้นเจอร้านผ่าน AI search',
    'wellness.tier1.f5': 'ตั้งค่า Google Maps ปักหมุดร้าน',
    'wellness.tier1.f6': 'ตั้งค่า Facebook Page',
    'wellness.tier1.f7': 'ลิงก์ Google Review ให้ลูกค้ากดรีวิวง่าย',
    'wellness.tier2.target': 'เพิ่มระบบจองคิว ใบเสร็จ และฟอร์มลูกค้าใหม่ เหมาะร้านที่กำลังโต',
    'wellness.tier2.f1': 'ทุกอย่างในแพ็ก Smart Relax',
    'wellness.tier2.f2': 'ระบบจองคิวออนไลน์ (ลูกค้าจองเวลาเองได้)',
    'wellness.tier2.f3': 'Email ยืนยันการจองอัตโนมัติ',
    'wellness.tier2.f4': 'ระบบใบเสร็จ/Invoice',
    'wellness.tier2.f5': 'แบบฟอร์ม Intake ลูกค้าใหม่',
    'wellness.tier3.target': 'ครบทุกฟังก์ชัน จบในราคาเดียว',
    'wellness.tier3.f1': 'ทุกอย่างในแพ็ก Pro Vibe',
    'wellness.tier3.f2': 'ระบบ Staff / Cashier / Owner PIN แยกสิทธิ์',
    'wellness.tier3.f3': 'ถ่ายภาพและวิดีโอจริงหน้าร้าน (รวมในแพ็กนี้)',

    'contact.headingLine1': 'พร้อมยกระดับ',
    'contact.headingLine2': 'ธุรกิจของคุณ?',
    'contact.subheading': 'Demo ฟรี 30 นาที · ไม่มีข้อผูกมัด · คุยภาษาไทยได้เลย',
    'contact.messageFb': '📘 ทักข้อความ Facebook',
    'contact.sendEmail': '✉️ ส่ง Email',

    'footer.questionHeading': 'มีคำถาม?',
    'footer.questionSub': 'ทักอีเมลหาเราได้เลย.',
    'footer.sendEmail': 'ส่งอีเมล',
  },
  en: {
    'nav.services': 'Services',
    'nav.portfolio': 'Portfolio',
    'nav.pricing': 'Pricing',
    'nav.contact': 'Contact',
    'nav.getDemo': 'Get Demo',

    'hero.pill.demo': 'Book Free Demo',
    'hero.pill.portfolio': 'View Portfolio',
    'hero.pill.facebook': 'Message on Facebook',
    'hero.pill.pricing': 'View Pricing',
    'hero.reachUs': 'Reach us:',

    'services.headingLine1': 'What We',
    'services.headingLine2': 'Do.',
    'services.viewPortfolio': 'View Portfolio',
    'services.intro':
      'Chapter99 is a digital agency that truly understands Thai businesses in Australia. We build systems that work for you — from F&B photography to a full PWA booking system and POS.',
    'services.card1.desc':
      'Professional F&B and spa photography that genuinely attracts Western customers — AI-generated shots that match your style, no need to prepare special dishes.',
    'services.card1.cta': 'View Photography Work',
    'services.card2.desc': 'Online booking + POS + HICAPS Health Fund + GST invoicing, ready to use in 7 days.',
    'services.card2.cta': 'View Pricing Packages',
    'services.card3.desc': 'Scan a QR code at the table, the menu opens instantly in-browser — update prices yourself via Google Sheets.',
    'services.card3.cta': 'Request a Demo',

    'clients.trustLine': 'Trusted by Thai businesses across Australia',

    'live.badge': 'Live Projects',
    'live.heading': 'Real websites we’ve built',
    'live.viewSite': 'View Website',
    'live.project1.desc': 'A massage shop website with an online booking system and digital menu, in real use with walk-in customers.',
    'live.project2.desc': 'A back-office system for managing staff shifts, receipts, and multiple branch settings in one place.',
    'live.project3.desc': 'A full brand website with real production photography and video.',

    'why.eyebrow': 'Why Chapter99',
    'why.body':
      '10+ years of F&B photography experience + an AI developer + real understanding of Thai businesses in Australia — a combination you won’t find elsewhere. No coding knowledge needed, no waiting on IT — the system looks after itself.',
    'why.charcoalBody':
      'We design a digital presence that makes Thai businesses in Australia look trustworthy, clean, and professional — in a way owners can rely on.',
    'why.viewPortfolio': 'View Portfolio',

    'pricing.heading': 'Simple plans for Thai businesses abroad',
    'pricing.subheading': 'Pick the plan that fits your business — tap a card to see details',
    'pricing.viewDetails': 'View details →',
    'pricing.selectPackage': 'Choose this package · Book Free Demo',
    'pricing.paySquareHeading': 'Pay via Square',
    'pricing.paySquareBody': 'Choose the link that matches your payment type — one-time setup or monthly fee.',

    'wellness.caseStudyLabel': 'Portfolio Example · Case Study',
    'wellness.disclaimer': 'Example client pricing layout (wellness spa) — not Chapter99 agency rates.',
    'wellness.footNote': 'Already have a booking system? No need to switch — we can link it straight from your new website.',
    'wellness.startUsing': 'Get Started',
    'wellness.tier1.target': 'Website + AI content + full SEO — ideal for shops just starting out, no booking system needed.',
    'wellness.tier1.f1': 'PWA shop website',
    'wellness.tier1.f2': 'AI-generated photos and videos to promote your shop',
    'wellness.tier1.f3': 'Basic Google SEO (AI-optimized)',
    'wellness.tier1.f4': 'AI Finder so customers discover your shop via AI search',
    'wellness.tier1.f5': 'Google Maps pin setup',
    'wellness.tier1.f6': 'Facebook Page setup',
    'wellness.tier1.f7': 'Google Review link so customers can leave reviews easily',
    'wellness.tier2.target': 'Adds a booking system, receipts, and a new-client form — ideal for a growing shop.',
    'wellness.tier2.f1': 'Everything in Smart Relax',
    'wellness.tier2.f2': 'Online booking system (customers book their own time slot)',
    'wellness.tier2.f3': 'Automatic booking confirmation email',
    'wellness.tier2.f4': 'Receipt / invoice system',
    'wellness.tier2.f5': 'New-client intake form',
    'wellness.tier3.target': 'Every feature included, for one flat price.',
    'wellness.tier3.f1': 'Everything in Pro Vibe',
    'wellness.tier3.f2': 'Staff / Cashier / Owner PIN system with separate permissions',
    'wellness.tier3.f3': 'Real in-store photography and video (included in this package)',

    'contact.headingLine1': 'Ready to elevate',
    'contact.headingLine2': 'your business?',
    'contact.subheading': 'Free 30-minute demo · No obligation · Available in Thai or English',
    'contact.messageFb': '📘 Message us on Facebook',
    'contact.sendEmail': '✉️ Send Email',

    'footer.questionHeading': 'Got questions?',
    'footer.questionSub': 'Send us an email.',
    'footer.sendEmail': 'Send',
  },
} as const

export type TranslationKey = keyof (typeof translations)['th']

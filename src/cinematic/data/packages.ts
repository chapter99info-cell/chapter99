import type { Bilingual } from '../i18n/types';
import type { PricingTier } from './pricing';

export const PACKAGE_SCOPE_PRICE: Bilingual = {
  th: 'Scoped · ราคาตาม Product Catalog',
  en: 'Scoped · priced from Product Catalog',
};

export const SQUARE_SETUP_FEE = 'A$199';
export const SQUARE_SETUP_HEADING = 'Square Setup — A$199';

export const packagesCopy = {
  eyebrow: { th: 'แพ็กเกจ & ราคา', en: 'Packages & Pricing' },
  heading: {
    th: 'Bring Your Business to Life Online',
    en: 'Bring Your Business to Life Online',
  },
  lead: {
    th: 'จากภาพลักษณ์ของร้าน ไปถึงวิธีที่ร้านทำงาน',
    en: 'From the way your business looks, to the way it works.',
  },
  copy: {
    th: 'Chapter99 เชื่อมภาพ เว็บไซต์ การจอง การชำระเงิน และงานประจำวันเป็นเส้นทางเดียว ไม่ได้ขายเว็บราคาเดียวที่รวมทุกอย่าง',
    en: 'Chapter99 connects presence, website, booking, payment and daily operations into one journey — not a single cheap website price that hides the rest.',
  },
  summaryTitle: 'START → GROW → SCALE',
  summaryNote: {
    th: 'ราคาเสนอจริงมาจาก Product Catalog และขอบเขตงานของแต่ละร้าน ไม่ใช้ราคาเดียวกับทุกร้าน',
    en: 'Final quotes come from the Product Catalog and each shop’s scope. There is no one-price-fits-all figure on this page.',
  },
  sectionKicker: { th: 'สามแพ็กเกจหลัก', en: 'Three core packages' },
  sectionTitle: {
    th: 'Presence → Operations → Infrastructure',
    en: 'Presence → Operations → Infrastructure',
  },
  sectionSub: {
    th: 'ขายผลลัพธ์การทำงานของธุรกิจ ไม่ใช่ชั่วโมงเขียนโค้ด',
    en: 'We sell the operating outcome, not hours of development.',
  },
  priceNote: {
    th: 'ข้อเสนอสุดท้ายอาจรวม: ค่าติดตั้งครั้งเดียว, งานภาพ/วิดีโอ/คอนเทนต์, ค่าซอฟต์แวร์/แพลตฟอร์มภายนอก, การเชื่อมระบบเพิ่ม, Monthly care / support, และ add-ons เช่น สาขา พนักงาน บริการ หรือคอนเทนต์เพิ่ม',
    en: 'A final proposal may combine one-time implementation, photography/video/content, software/third-party platform costs, optional integrations, monthly care/support, and add-ons such as extra locations, staff, services or content.',
  },
  industriesKicker: { th: 'ตามประเภทธุรกิจ', en: 'Built for real businesses' },
  industriesTitle: { th: 'เลือกดูตามธุรกิจของคุณ', en: 'Start from your type of shop' },
  industriesSub: {
    th: 'ใช้โครงแพ็กเกจเดียวกัน แต่ปรับ workflow ให้เข้ากับวิธีทำงานของแต่ละธุรกิจ',
    en: 'Same package architecture, with workflow adjusted to how each business actually runs.',
  },
  howKicker: { th: 'โครงสร้างราคา', en: 'How the price works' },
  howTitle: { th: 'ราคาไม่ได้มีแค่ค่าเว็บ', en: 'The price is more than a website fee' },
  howSub: {
    th: 'แยกค่า Chapter99 จากค่าบุคคลที่สาม และอ้างอิง Product Catalog เป็นแหล่งราคา',
    en: 'Chapter99 fees stay separate from third-party costs. The Product Catalog is the pricing source of truth.',
  },
  journeyKicker: { th: 'เส้นทางลูกค้า', en: 'Customer journey' },
  journeyTitle: {
    th: 'LOOK → BE FOUND → GET BOOKED → GET PAID → RUN → GROW',
    en: 'LOOK → BE FOUND → GET BOOKED → GET PAID → RUN → GROW',
  },
  auditKicker: { th: 'Business Audit', en: 'Business Audit' },
  auditTitle: {
    th: 'ยังไม่แน่ใจว่า START, GROW หรือ SCALE เหมาะกับร้าน?',
    en: 'Not sure whether START, GROW or SCALE fits the shop?',
  },
  auditBody: {
    th: 'ก่อนสร้างอะไร เราดูว่าร้านทำงานอย่างไรวันนี้ ลูกค้าหา/จองยังไง อะไรเสียเวลา และอยากเริ่มจากจุดไหน',
    en: 'Before we build anything, we look at how the shop runs today — how customers find and book, what takes time, and what should come first.',
  },
  auditCta: { th: 'Book a Business Audit', en: 'Book a Business Audit' },
  homeCta: { th: 'กลับหน้าแรก', en: 'Back to home' },
} as const;

export const packageTiers: PricingTier[] = [
  {
    id: 'start',
    eyebrow: '01 · START · Presence',
    amount: '',
    priceLine: PACKAGE_SCOPE_PRICE,
    description: {
      th: 'Get Your Business Online — บ้านออนไลน์ที่เป็นมืออาชีพ ให้ลูกค้าหาเจอและติดต่อได้',
      en: 'Get Your Business Online — a professional online home so customers can find and contact you.',
    },
    cta: { th: 'Start Your Business Setup', en: 'Start Your Business Setup' },
    ctaHref:
      'mailto:chapter99solutions@gmail.com?subject=Chapter99%20START%20Business%20Setup',
    ctaVariant: 'secondary',
    features: [
      { label: { th: 'สำรวจธุรกิจและทบทวนการตั้งค่าระบบดิจิทัล', en: 'Business discovery and digital setup review' }, included: true },
      { label: { th: 'เว็บไซต์ธุรกิจ', en: 'Professional business website' }, included: true },
      { label: { th: 'ออกแบบให้ใช้บนมือถือ', en: 'Mobile-friendly design' }, included: true },
      { label: { th: 'ข้อมูลธุรกิจ บริการ และช่องทางติดต่อ', en: 'Business information, services and contact details' }, included: true },
      { label: { th: 'แนวทางตั้งค่า Google / การมีตัวตนออนไลน์', en: 'Google / online presence setup guidance' }, included: true },
      { label: { th: 'ทิศทางภาพถ่าย / คอนเทนต์', en: 'Professional photography/content direction' }, included: true },
      { label: { th: 'ช่องทางสอบถาม / ติดต่อพื้นฐาน', en: 'Basic enquiry / contact flow' }, included: true },
      { label: { th: 'เปิดใช้งานและทดสอบก่อน launch', en: 'Launch setup and testing' }, included: true },
    ],
    footnotes: [
      {
        th: 'เหมาะกับ: ร้านใหม่ ร้านเจ้าของทำเอง และร้านที่ยังพึ่ง Facebook / Instagram / ปากต่อปากเป็นหลัก',
        en: 'Best for: new businesses, owner-operated shops, and businesses still relying mainly on Facebook, Instagram or word of mouth.',
      },
      {
        th: 'ผลลัพธ์: บ้านออนไลน์ที่เป็นมืออาชีพ หาเจอง่าย และน่าเชื่อถือกว่า',
        en: 'Outcome: a professional online home that makes the business easier to discover and trust.',
      },
    ],
  },
  {
    id: 'grow',
    eyebrow: '02 · GROW · Operations',
    amount: '',
    priceLine: PACKAGE_SCOPE_PRICE,
    description: {
      th: 'Get Found. Get Booked. Get Paid. — จากแค่มีเว็บ ไปสู่เส้นทางลูกค้าที่จอง จ่าย และดูแลได้',
      en: 'Get Found. Get Booked. Get Paid. — from being online to running more of the customer journey digitally.',
    },
    cta: { th: 'Book a Business Audit', en: 'Book a Business Audit' },
    ctaHref: '#audit',
    ctaVariant: 'primary',
    innerBg: '#07162c',
    features: [
      { label: { th: 'ทุกอย่างใน START', en: 'Everything in START' }, included: true },
      { label: { th: 'ตั้งระบบจองออนไลน์', en: 'Online booking setup' }, included: true },
      { label: { th: 'บริการ / พนักงาน / เวลาว่าง', en: 'Services, staff and availability configuration' }, included: true },
      { label: { th: 'แจ้งเตือนการจองถึงลูกค้า', en: 'Customer booking notifications' }, included: true },
      { label: { th: 'เวิร์กโฟลว์ SMS ตามที่ใช้งานได้', en: 'SMS workflow where applicable' }, included: true },
      { label: { th: 'ตั้งค่าการชำระเงิน / Square ตามที่ใช้งานได้', en: 'Payment setup / Square integration where applicable' }, included: true },
      { label: { th: 'ใบเสร็จ และข้อมูลลูกค้า / CRM พื้นฐาน', en: 'Receipt workflow and customer record / basic CRM' }, included: true },
      { label: { th: 'เวิร์กโฟลว์การทำงานของร้าน + รายงานพื้นฐาน', en: 'Business operating workflow and basic reporting' }, included: true },
      { label: { th: 'อบรมเจ้าของ/พนักงาน + ซัพพอร์ตตอน launch', en: 'Staff / owner training and launch support' }, included: true },
    ],
    footnotes: [
      {
        th: 'เหมาะกับ: ร้านที่เดินแล้ว อยากลดงานมือ และให้จองถึงจ่ายลื่นขึ้น',
        en: 'Best for: established businesses that want fewer manual steps and a smoother booking-to-payment experience.',
      },
      {
        th: 'ผลลัพธ์: GET FOUND → GET BOOKED → GET PAID → RUN',
        en: 'Outcome: GET FOUND → GET BOOKED → GET PAID → RUN',
      },
    ],
  },
  {
    id: 'scale',
    eyebrow: '03 · SCALE · Infrastructure',
    amount: '',
    priceLine: PACKAGE_SCOPE_PRICE,
    description: {
      th: 'Build the Business Infrastructure — ระบบที่ลึกขึ้น รองรับทีม หลายจุด และการดูแลต่อเนื่อง',
      en: 'Build the Business Infrastructure — a fuller digital operating system with ongoing support.',
    },
    cta: { th: 'Build My Business System', en: 'Build My Business System' },
    ctaHref:
      'mailto:chapter99solutions@gmail.com?subject=Chapter99%20SCALE%20Business%20System',
    ctaVariant: 'secondary',
    features: [
      { label: { th: 'ทุกอย่างใน GROW', en: 'Everything in GROW' }, included: true },
      { label: { th: 'แผนผังกระบวนการทำงานที่ลึกขึ้น', en: 'Deeper business process mapping' }, included: true },
      { label: { th: 'โครงสร้างเว็บไซต์และเนื้อหาขั้นสูง', en: 'Advanced website/content structure' }, included: true },
      { label: { th: 'ตั้งค่าหลายพนักงาน', en: 'Multi-staff configuration' }, included: true },
      { label: { th: 'พร้อมรองรับหลายสาขา', en: 'Multi-location readiness' }, included: true },
      { label: { th: 'เวิร์กโฟลว์จอง/จ่ายขั้นสูงตามที่รองรับ', en: 'Advanced booking/payment workflows where supported' }, included: true },
      { label: { th: 'รายงานและทบทวนธุรกิจ', en: 'Reporting and business review setup' }, included: true },
      { label: { th: 'โอกาส automation + แผนปรับปรุงต่อเนื่อง', en: 'Automation opportunities and continuous improvement roadmap' }, included: true },
      { label: { th: 'Monthly care และ priority support ตามขอบเขต', en: 'Ongoing monthly care and priority support according to scope' }, included: true },
    ],
    footnotes: [
      {
        th: 'เหมาะกับ: ร้านที่กำลังขยาย มีหลายพนักงาน หรือเตรียมหลายสาขา / ทำงานเป็นระบบมากขึ้น',
        en: 'Best for: growing, multi-staff businesses, and shops preparing for more locations or a more systemised operation.',
      },
      {
        th: 'ผลลัพธ์: โครงสร้างดิจิทัลที่ขยายตามธุรกิจได้',
        en: 'Outcome: digital infrastructure designed to grow with the business.',
      },
    ],
  },
];

export const journeySteps: { key: string; title: Bilingual; body: Bilingual }[] = [
  {
    key: 'look',
    title: { th: 'LOOK', en: 'LOOK' },
    body: { th: 'ภาพ วิดีโอ และคอนเทนต์ที่โชว์ร้านจริง', en: 'Photography, video and content that show the real business.' },
  },
  {
    key: 'found',
    title: { th: 'BE FOUND', en: 'BE FOUND' },
    body: { th: 'เว็บไซต์ Google และการมีตัวตนออนไลน์', en: 'Website, Google and online presence so customers can discover you.' },
  },
  {
    key: 'booked',
    title: { th: 'GET BOOKED', en: 'GET BOOKED' },
    body: { th: 'เลือกบริการและเวลาแล้วจองได้', en: 'Choose a service and time, then book.' },
  },
  {
    key: 'paid',
    title: { th: 'GET PAID', en: 'GET PAID' },
    body: { th: 'ตั้งค่าการชำระเงิน รวม Square เมื่อเหมาะสม', en: 'Payment setup and integrations, including Square where appropriate.' },
  },
  {
    key: 'run',
    title: { th: 'RUN', en: 'RUN' },
    body: { th: 'ลูกค้า ใบเสร็จ เวิร์กโฟลว์ รายงาน และการดูแล', en: 'Records, receipts, workflows, reporting and ongoing support.' },
  },
  {
    key: 'grow',
    title: { th: 'GROW', en: 'GROW' },
    body: { th: 'ปรับปรุงต่อเนื่องและโครงสร้างที่รองรับขั้นถัดไป', en: 'Improvement, automation and infrastructure for the next stage.' },
  },
];

export const squareSetup = {
  tag: { th: '4 · Square Setup', en: '4 · Square Setup' },
  title: SQUARE_SETUP_HEADING,
  subtitle: {
    th: 'ตั้งระบบ Square ให้พร้อมใช้งาน — Square เป็นแพลตฟอร์มภายนอก ไม่ใช่ตัวตนของ Chapter99',
    en: 'Set Square up so it is ready to use. Square is a third-party payment/POS platform, not Chapter99’s identity.',
  },
  amount: SQUARE_SETUP_FEE,
  per: { th: 'ครั้งเดียว · ค่าบริการ Setup ของ Chapter99', en: 'one-time · Chapter99 setup/service fee' },
  cta: { th: 'เพิ่ม Square Setup', en: 'Add Square Setup' },
  items: [
    { th: 'แนะนำการเปิดบัญชี / ตั้งค่าธุรกิจบน Square', en: 'Square account / business setup guidance' },
    { th: 'ตั้งค่าบริการ / สินค้า / ราคา', en: 'Services / items / pricing configuration' },
    { th: 'ตั้งค่าใบเสร็จและขั้นตอนรับชำระเงิน', en: 'Receipt and payment workflow setup' },
    { th: 'เชื่อมเว็บไซต์ / การจอง / การชำระเงินตามที่ใช้งานได้', en: 'Website / booking / payment connection where applicable' },
    { th: 'ทดสอบขั้นตอนจ่ายเงินก่อนเปิดใช้งาน', en: 'Payment flow testing before launch' },
    { th: 'ส่งมอบและแนะนำการใช้งานเบื้องต้น', en: 'Basic handover / setup guidance' },
  ] as Bilingual[],
  ownership: {
    th: 'บัญชี Square, การยืนยันตัวตน, บัญชีธนาคาร และความสัมพันธ์รับชำระเงินเป็นของร้าน Chapter99 ช่วยตั้งค่าตามที่ตกลง ไม่เก็บข้อมูลบัตรดิบ',
    en: 'The shop owns the Square account, verification, bank account and payment relationship. Chapter99 assists configuration as agreed. We never store raw card data.',
  },
  note: {
    th: 'A$199 คือค่าบริการ Setup ของ Chapter99\nค่าซอฟต์แวร์ ค่าธรรมเนียมการรับชำระเงิน และ Hardware ของ Square จ่ายให้ Square ตามการใช้งานจริง',
    en: 'A$199 is Chapter99’s setup/service fee.\nSquare software, processing fees and hardware are paid to Square according to actual use.',
  },
  surcharge: {
    th: 'ตั้งแต่ 1 ตุลาคม 2026 ออสเตรเลียไม่อนุญาต card surcharge ตามมติ RBA ราคาที่ลูกค้าเห็นในเว็บ/การจองควรเป็นราคาที่จ่ายจริง โดยไม่บวกค่าธรรมเนียมบัตรแยก',
    en: 'From 1 October 2026, card surcharging is no longer permitted in Australia under the RBA decision. Customer-facing prices on website and booking/payment flows should be the price the customer pays, without a separate card surcharge.',
  },
  checked: {
    th: 'ข้อมูล Square ออสเตรเลียอ้างอิง 16 กันยายน 2026 — ตรวจหน้า Square Australia อีกครั้งก่อนเสนอราคาหรือขึ้นเว็บจริง',
    en: 'Square Australia figures referenced 16 September 2026. Re-check Square Australia before quoting or changing live copy.',
  },
  sources: [
    { label: 'Square Australia pricing', href: 'https://squareup.com/au/en/pricing' },
    { label: 'Square Australia fees', href: 'https://squareup.com/help/au/en/article/5068-what-are-square-s-fees' },
    { label: 'End of card surcharging', href: 'https://squareup.com/help/au/en/article/8680-preparing-your-business-for-end-of-card-surcharging' },
  ],
} as const;

export const squarePlans: { plan: string; monthly: Bilingual; processing: Bilingual }[] = [
  {
    plan: 'Square Free',
    monthly: { th: 'A$0 / เดือน', en: 'A$0 / month' },
    processing: { th: 'มีค่าธรรมเนียมรับชำระเงิน', en: 'Processing fees apply' },
  },
  {
    plan: 'Square Plus',
    monthly: { th: 'เริ่มต้น A$40 / เดือน', en: 'From A$40 / month' },
    processing: { th: 'มีค่าธรรมเนียมรับชำระเงิน', en: 'Processing fees apply' },
  },
  {
    plan: 'Square Premium',
    monthly: { th: 'กำหนดตามร้าน', en: 'Custom' },
    processing: { th: 'อาจมีราคาแบบกำหนดเอง', en: 'Custom pricing may be available' },
  },
];

export const squareFees: { label: Bilingual; value: string }[] = [
  { label: { th: 'รูดบัตรหน้าร้าน', en: 'In-person card payments' }, value: '1.6% / transaction' },
  { label: { th: 'จ่ายออนไลน์', en: 'Online payments' }, value: '2.2% / transaction' },
  { label: { th: 'คีย์บัตร / MOTO', en: 'Manually entered / MOTO' }, value: '2.2% / transaction' },
  { label: { th: 'Afterpay (สินค้าที่เข้าเงื่อนไข)', en: 'Afterpay (applicable products)' }, value: '6% + A$0.30 excl. GST' },
];

export const squareHardware: { item: string; price: string }[] = [
  { item: 'Square Reader', price: 'from A$65' },
  { item: 'Square Terminal', price: 'A$329' },
  { item: 'Square Handheld', price: 'A$349' },
  { item: 'Square Stand', price: 'from A$149' },
  { item: 'Square Register', price: 'A$1,099' },
  { item: 'Square Kiosk', price: 'A$149' },
  { item: 'Square Register Kit', price: 'A$1,749' },
];

export const businessStages: { stage: string; body: Bilingual }[] = [
  {
    stage: 'STARTER',
    body: { th: 'ต้องการบ้านออนไลน์ที่เป็นมืออาชีพ', en: 'Need a professional online presence.' },
  },
  {
    stage: 'GROWING',
    body: { th: 'ต้องการจอง จ่าย และงานร้านที่ลื่นขึ้น', en: 'Need booking, payment and smoother operations.' },
  },
  {
    stage: 'ESTABLISHED',
    body: { th: 'ต้องการระบบ รายงาน และการดูแลดิจิทัลต่อเนื่อง', en: 'Need systems, reporting and ongoing digital support.' },
  },
  {
    stage: 'MULTI-LOCATION',
    body: { th: 'ต้องการโครงสร้างเดียวกันหลายสาขา', en: 'Need consistent infrastructure across locations.' },
  },
  {
    stage: 'ADVANCED',
    body: { th: 'ต้องการ automation, integrations และข้อมูลธุรกิจที่ลึกขึ้น', en: 'Need deeper automation, integrations and business intelligence.' },
  },
];

export const industries = [
  {
    num: '01 · MASSAGE',
    title: { th: 'ร้านนวด', en: 'Massage shops' },
    body: {
      th: 'โฟกัส: จอง → แจ้งเตือน → เจ้าของร้านใช้งาน → ชำระเงิน / ใบเสร็จ',
      en: 'Focus: booking → notification → owner operation → payment / receipt.',
    },
    href: '/pricing#pack-massage',
    cta: { th: 'ดูราคาแพ็กร้านนวด', en: 'See massage packages' },
  },
  {
    num: '02 · RESTAURANT',
    title: { th: 'ร้านอาหาร', en: 'Restaurants' },
    body: {
      th: 'โฟกัส: ค้นหา → เมนู / บริการ → จองหรือสั่ง → ชำระเงิน → งานประจำวัน',
      en: 'Focus: find → menu / services → booking or order → payment → daily operation.',
    },
    href: '/pricing#pack-restaurant',
    cta: { th: 'ดูราคาแพ็กร้านอาหาร', en: 'See restaurant packages' },
  },
  {
    num: '03 · PHOTOGRAPHY',
    title: { th: 'ช่างภาพ', en: 'Photography' },
    body: {
      th: 'โฟกัส: งานภาพ → สินทรัพย์ธุรกิจ → เว็บ / Google / พอร์ตโฟลิโอ → สอบถาม / จอง',
      en: 'Focus: photography → business assets → website / Google / portfolio → enquiry / booking.',
    },
    href: '/pricing#pack-photo',
    cta: { th: 'ดูราคาแพ็กช่างภาพ', en: 'See photography packages' },
  },
] as const;

export const priceArchitecture = [
  {
    title: { th: '01 · ค่าติดตั้งครั้งเดียวของ Chapter99', en: '01 · One-time Chapter99 implementation' },
    body: { th: 'วางโครง สร้าง ตั้งค่า ทดสอบ และเปิดใช้งานตามแพ็กเกจ', en: 'Structure, build, configure, test and launch according to the package' },
  },
  {
    title: { th: '02 · งานภาพ / วิดีโอ / คอนเทนต์', en: '02 · Photography / video / content' },
    body: { th: 'คิดแยกตามงานผลิต ไม่รวมปนในค่าเว็บโดยอัตโนมัติ', en: 'Quoted as production work — not automatically bundled into a website fee' },
  },
  {
    title: { th: '03 · ค่าซอฟต์แวร์ / แพลตฟอร์มภายนอก', en: '03 · Software / third-party platform costs' },
    body: { th: 'เช่น Square — จ่ายให้ผู้ให้บริการตามการใช้งานจริง', en: 'For example Square — paid to the provider according to actual use' },
  },
  {
    title: { th: '04 · การเชื่อมระบบเพิ่ม (optional)', en: '04 · Optional integrations' },
    body: { th: 'เลือกตามขอบเขต ไม่ใช่แพ็กเกจหลัก', en: 'Selected by scope — not a core package' },
  },
  {
    title: { th: '05 · Monthly care / support', en: '05 · Monthly care / support' },
    body: { th: 'ดูแลตามแผนที่ตกลง ไม่สัญญาซัพพอร์ตไม่จำกัด', en: 'Care within the agreed plan. Unlimited support is not promised.' },
  },
  {
    title: { th: '06 · Add-ons', en: '06 · Add-ons' },
    body: { th: 'สาขา พนักงาน บริการ คอนเทนต์ หรืองานพิเศษ จาก Product Catalog', en: 'Locations, staff, services, content or specialist work from the Product Catalog' },
  },
] as const;

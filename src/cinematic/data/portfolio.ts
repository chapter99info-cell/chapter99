import type { Bilingual } from '../i18n/types';

export type PortfolioItem = {
  name: string;
  category: string;
  year: string;
  gradient: string;
};

export const portfolioItems: PortfolioItem[] = [
  {
    name: 'Mira Thai Massage',
    category: 'Photography + Web Rebrand',
    year: '2026',
    gradient: 'linear-gradient(160deg,#E3D2A6,#C8AF74)',
  },
  {
    name: 'Thai Garlic Restaurant',
    category: 'QR Digital Menu + Booking',
    year: '2025',
    gradient: 'linear-gradient(160deg,#E9C6AC,#CE9868)',
  },
  {
    name: 'Princess Thai Massage',
    category: 'PWA Booking + Digital Menu',
    year: '2025',
    gradient: 'linear-gradient(160deg,#CBDABF,#9FB68D)',
  },
  {
    name: 'Jasmine Massage & Spa',
    category: 'Brand Photography + PWA',
    year: '2024',
    gradient: 'linear-gradient(160deg,#D9C2D8,#A987AC)',
  },
];

export const portfolioMarquee = [
  'Mira Thai Massage',
  'Thai Garlic Restaurant',
  'Princess Thai Massage',
  'Jasmine Massage & Spa',
  'Koala Wellness',
];

export const portfolioCopy = {
  badge: { th: 'ผลงาน', en: 'Portfolio' },
  heading: {
    th: "ผลงานจริง ที่ลูกค้า<br><span class='muted'>เลือกใช้งานอยู่ทุกวัน</span>",
    en: "Real work our clients<br><span class='muted'>use every single day</span>",
  },
  blurb: {
    th: 'เราร่วมงานกับธุรกิจไทยที่อยากได้มากกว่าเว็บสวยๆ — อยากได้ระบบที่ใช้งานจริง ตั้งแต่ภาพถ่าย เว็บไซต์ จนถึงข้อความที่สื่อสารตรงกลุ่มเป้าหมาย รวมเป็นเครื่องมือเดียวที่ขับเคลื่อนธุรกิจได้จริง',
    en: 'We partner with Thai businesses who want more than a pretty website — a system that actually works, from photography to your website to messaging that speaks to your audience, combined into one engine that drives real growth.',
  },
  cta: { th: 'เริ่มงานกับเรา', en: "Let's work together" },
} as const satisfies Record<string, Bilingual>;

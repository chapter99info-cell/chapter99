import type { Bilingual } from '../i18n/types';

export const navLinks: { href: string; label: Bilingual }[] = [
  { href: '#about', label: { th: 'เรื่องของเรา', en: 'Our Story' } },
  { href: '#portfolio', label: { th: 'ผลงาน', en: 'Portfolio' } },
  { href: '#photo', label: { th: 'ช่างภาพ', en: 'Photography' } },
  { href: '#web', label: { th: 'เว็บ Front+Back', en: 'Web Front+Back' } },
  { href: '#other', label: { th: 'บริการอื่นๆ', en: 'Other Services' } },
  { href: '#pricing', label: { th: 'ราคา', en: 'Pricing' } },
];

export const heroCopy = {
  desc: {
    th: 'เครือข่ายช่างภาพและนักพัฒนาที่เข้าใจธุรกิจไทยในออสเตรเลีย ตั้งแต่ภาพนิ่งที่ทำให้ลูกค้าหยุดดู จนถึงระบบหลังบ้านที่ทำงานแทนคุณทุกวินาที',
    en: 'A network of photographers and developers who understand Thai businesses in Australia — from photos that stop the scroll to back-office systems that work for you every second.',
  },
  cta: {
    th: 'จองคิวถ่ายภาพฟรี',
    en: 'Book a free photo shoot',
  },
} as const satisfies Record<string, Bilingual>;

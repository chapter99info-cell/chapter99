import type { Bilingual } from '../i18n/types';

export type FooterLink = {
  href: string;
  label: Bilingual | string;
  external?: boolean;
};

export const footerNavPrimary: FooterLink[] = [
  { href: '#photo', label: { th: 'ช่างภาพ', en: 'Photography' } },
  { href: '#web', label: { th: 'เว็บ Front+Back', en: 'Web Front+Back' } },
  { href: '#other', label: { th: 'บริการอื่นๆ', en: 'Other Services' } },
  { href: '#pricing', label: { th: 'ราคา', en: 'Pricing' } },
];

export const footerNavCompany: FooterLink[] = [
  { href: '#about', label: { th: 'เรื่องของเรา', en: 'Our Story' } },
  { href: '#portfolio', label: { th: 'ผลงาน', en: 'Portfolio' } },
  { href: '#', label: { th: 'เงื่อนไขการใช้งาน', en: 'Terms of Use' } },
  {
    href: 'mailto:chapter99solutions@gmail.com',
    label: { th: 'ติดต่อเรา', en: 'Contact Us' },
  },
];

export const footerNavSocial: FooterLink[] = [
  {
    href: 'https://www.facebook.com/profile.php?id=61586534972406',
    label: 'Facebook',
    external: true,
  },
  {
    href: 'https://m.me/61586534972406',
    label: { th: 'ทัก Messenger', en: 'Message on Messenger' },
    external: true,
  },
  {
    href: 'https://wa.me/61452044382',
    label: { th: 'ทัก WhatsApp', en: 'Message us on WhatsApp' },
    external: true,
  },
];

export const footerCopy = {
  headline: {
    th: 'จากภาพถ่าย สู่ระบบที่ใช้งานได้จริง สำหรับธุรกิจไทยในออสเตรเลีย',
    en: 'From photography to systems that actually work, for Thai businesses in Australia',
  },
  copyright: {
    th: '© 2026 Chapter99 Solutions. สงวนลิขสิทธิ์ทุกประการ',
    en: '&copy; 2026 Chapter99 Solutions. All rights reserved.',
  },
  privacy: { th: 'นโยบายความเป็นส่วนตัว', en: 'Privacy Policy' },
  terms: { th: 'เงื่อนไขการใช้งาน', en: 'Terms of Use' },
} as const satisfies Record<string, Bilingual>;

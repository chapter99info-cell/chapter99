import type { Bilingual } from '../i18n/types';

export type GalleryItem = {
  name: string;
  title: Bilingual;
  sub: Bilingual;
  grad: string;
};

export const galleryItems: GalleryItem[] = [
  {
    name: 'Mira Thai Massage',
    title: { th: 'F&B & Spa Photography', en: 'F&B & Spa Photography' },
    sub: {
      th: 'ภาพชุดโปรโมทร้านนวด',
      en: 'Promo photo set for a massage shop',
    },
    grad: 'linear-gradient(160deg,#3a2c1e,#14100a)',
  },
  {
    name: 'Thai Garlic Restaurant',
    title: { th: 'Reels สั้นสำหรับโซเชียล', en: 'Short Reels for social' },
    sub: {
      th: 'ถ่ายภายในร้าน + วิดีโอ 15 วิ',
      en: 'In-store shoot + 15s video',
    },
    grad: 'linear-gradient(160deg,#2c3a1e,#10140a)',
  },
  {
    name: 'Princess Thai Massage',
    title: { th: 'Before / After ร้าน', en: 'Shop Before / After' },
    sub: {
      th: 'เทียบภาพก่อน-หลังรีโนเวท',
      en: 'Before-and-after renovation comparison',
    },
    grad: 'linear-gradient(160deg,#1e2c3a,#0a1014)',
  },
  {
    name: 'Jasmine Massage & Spa',
    title: { th: 'Behind the Scenes', en: 'Behind the Scenes' },
    sub: {
      th: 'บรรยากาศเบื้องหลังกองถ่าย',
      en: 'Behind-the-scenes atmosphere on set',
    },
    grad: 'linear-gradient(160deg,#3a1e34,#140a12)',
  },
  {
    name: 'Koala Wellness',
    title: { th: 'Digital Signage Loop', en: 'Digital Signage Loop' },
    sub: {
      th: 'วิดีโอวนลูปสำหรับจอหน้าร้าน',
      en: 'Looping video for the storefront screen',
    },
    grad: 'linear-gradient(160deg,#1e3a2e,#0a1410)',
  },
];

export const galleryTabs: { id: string; label: Bilingual }[] = [
  { id: 'photos', label: { th: 'ภาพนิ่ง', en: 'Photos' } },
  { id: 'video', label: { th: 'วิดีโอ', en: 'Video' } },
  { id: 'reels', label: { th: 'Reels/Shorts', en: 'Reels/Shorts' } },
  { id: 'before-after', label: { th: 'Before-After', en: 'Before-After' } },
];

export const galleryCopy = {
  crumb: { th: '&larr; ผลงานช่างภาพ', en: '&larr; Photography' },
  title: {
    th: 'อัลบั้มภาพและวิดีโอ ที่เราถ่ายให้ลูกค้าจริง',
    en: "Photo and video albums we've shot for real clients",
  },
  desc: {
    th: 'เลื่อนดูตัวอย่างงานแต่ละร้าน ก่อนเลือกแพ็กเกจที่เหมาะกับธุรกิจของคุณ',
    en: 'Browse work from each shop before choosing the package that suits your business.',
  },
} as const satisfies Record<string, Bilingual>;

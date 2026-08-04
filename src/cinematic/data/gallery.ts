import type { Bilingual } from '../i18n/types';

const SUPABASE_VDO =
  'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/VDO';

export type GalleryCategory = 'massage-spa' | 'food' | 'cinematic';

export type GalleryItem = {
  name: string;
  title: Bilingual;
  sub: Bilingual;
  /** Fallback when no still photo / when photos tab is active */
  grad: string;
  /** Public Supabase (or CDN) MP4 for video / reels tabs */
  videoSrc?: string;
  category?: GalleryCategory;
};

export const galleryCategoryLabel: Record<GalleryCategory, Bilingual> = {
  'massage-spa': { th: 'นวด / สปา', en: 'Massage / Spa' },
  food: { th: 'อาหาร', en: 'Food' },
  cinematic: { th: 'ซินีมาติก', en: 'Cinematic' },
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
    videoSrc: `${SUPABASE_VDO}/Thai_mass.mp4`,
    category: 'massage-spa',
  },
  {
    name: 'Thai Garlic Restaurant',
    title: { th: 'Reels สั้นสำหรับโซเชียล', en: 'Short Reels for social' },
    sub: {
      th: 'ถ่ายภายในร้าน + วิดีโอ 15 วิ',
      en: 'In-store shoot + 15s video',
    },
    grad: 'linear-gradient(160deg,#2c3a1e,#10140a)',
    videoSrc: `${SUPABASE_VDO}/foodshot.mp4`,
    category: 'food',
  },
  {
    name: 'Princess Thai Massage',
    title: { th: 'Before / After ร้าน', en: 'Shop Before / After' },
    sub: {
      th: 'เทียบภาพก่อน-หลังรีโนเวท',
      en: 'Before-and-after renovation comparison',
    },
    grad: 'linear-gradient(160deg,#1e2c3a,#0a1014)',
    videoSrc: `${SUPABASE_VDO}/01luxurious.mp4`,
    category: 'massage-spa',
  },
  {
    name: 'Jasmine Massage & Spa',
    title: { th: 'Behind the Scenes', en: 'Behind the Scenes' },
    sub: {
      th: 'บรรยากาศเบื้องหลังกองถ่าย',
      en: 'Behind-the-scenes atmosphere on set',
    },
    grad: 'linear-gradient(160deg,#3a1e34,#140a12)',
    videoSrc: `${SUPABASE_VDO}/chapter99hero.mp4`,
    category: 'cinematic',
  },
  {
    name: 'Koala Wellness',
    title: { th: 'Digital Signage Loop', en: 'Digital Signage Loop' },
    sub: {
      th: 'วิดีโอวนลูปสำหรับจอหน้าร้าน',
      en: 'Looping video for the storefront screen',
    },
    grad: 'linear-gradient(160deg,#1e3a2e,#0a1410)',
    // Reuse cinematic hero loop for signage-style showcase until a dedicated asset exists
    videoSrc: `${SUPABASE_VDO}/chapter99hero.mp4`,
    category: 'cinematic',
  },
];

export const galleryTabs: { id: string; label: Bilingual }[] = [
  { id: 'photos', label: { th: 'ภาพนิ่ง', en: 'Photos' } },
  { id: 'video', label: { th: 'วิดีโอ', en: 'Video' } },
  { id: 'reels', label: { th: 'Reels/Shorts', en: 'Reels/Shorts' } },
  { id: 'before-after', label: { th: 'Before-After', en: 'Before-After' } },
];

/** Tabs that show the wired MP4 instead of the gradient placeholder */
export const galleryVideoTabs = new Set(['video', 'reels']);

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

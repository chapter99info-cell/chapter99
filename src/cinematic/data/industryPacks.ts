import type { Bilingual } from '../i18n/types';
import { photographyCopy, photographyTiers, webTiers, type PricingTier } from './pricing';
import { SQUARE_SETUP_FEE, squareSetup } from './packages';

export type PricePackId = 'massage' | 'restaurant' | 'photo' | 'square';

const AUDIT =
  'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit';

function withCta(tiers: PricingTier[]): PricingTier[] {
  return tiers.map((tier) => ({
    ...tier,
    innerBg: undefined,
    ctaHref: AUDIT,
  }));
}

const massageTiers: PricingTier[] = withCta(
  webTiers.map((tier) => {
    if (tier.id === 'starter') {
      return {
        ...tier,
        description: {
          th: 'Setup A$199 · เว็บ PWA ร้านนวด + รายการบริการ',
          en: 'Setup A$199 · Massage PWA website + service list',
        },
      };
    }
    if (tier.id === 'professional') {
      return {
        ...tier,
        description: {
          th: 'Setup A$499 · ร้านนวด — จองคิว ใบเสร็จ HICAPS / บันทึกร้าน',
          en: 'Setup A$499 · Massage shops — booking, receipts, shop records',
        },
      };
    }
    return {
      ...tier,
      description: {
        th: 'Setup A$999+ · ร้านนวดเต็มระบบ รายงานรายวัน + ภาพถ่ายจริงคิดแยกตามงาน',
        en: 'Setup A$999+ · Full massage operations, daily report + photography quoted separately',
      },
    };
  }),
);

const restaurantTiers: PricingTier[] = withCta(
  webTiers.map((tier) => {
    if (tier.id === 'starter') {
      return {
        ...tier,
        description: {
          th: 'Setup A$199 · เว็บ PWA ร้านอาหาร + เมนูดิจิทัล',
          en: 'Setup A$199 · Restaurant PWA website + digital menu',
        },
      };
    }
    if (tier.id === 'professional') {
      return {
        ...tier,
        description: {
          th: 'Setup A$499 · ร้านอาหาร — จองโต๊ะ/สั่ง ใบเสร็จ งานประจำวัน',
          en: 'Setup A$499 · Restaurants — booking/order, receipts, daily ops',
        },
      };
    }
    return {
      ...tier,
      description: {
        th: 'Setup A$999+ · ร้านอาหารเต็มระบบ รายงานรายวัน + งานภาพอาหารคิดแยกตามงาน',
        en: 'Setup A$999+ · Full restaurant operations, daily report + food photography quoted separately',
      },
    };
  }),
);

const photoTiers = withCta(photographyTiers);

const squareTiers: PricingTier[] = [
  {
    id: 'square-setup',
    eyebrow: { th: 'Chapter99 Square Setup', en: 'Chapter99 Square Setup' },
    amount: SQUARE_SETUP_FEE,
    per: squareSetup.per,
    description: squareSetup.subtitle,
    cta: squareSetup.cta,
    ctaHref: AUDIT,
    ctaVariant: 'primary',
    badge: { th: '4 · Add-on', en: '4 · Add-on' },
    features: squareSetup.items.map((item) => ({ label: item, included: true })),
    footnotes: [squareSetup.note, squareSetup.ownership],
  },
];

export const pricePacks: {
  id: PricePackId;
  hash: string;
  href: string;
  label: Bilingual;
  short: Bilingual;
  kicker: Bilingual;
  heading: Bilingual;
  sub: Bilingual;
  note: Bilingual;
  tiers: PricingTier[];
}[] = [
  {
    id: 'massage',
    hash: 'pack-massage',
    href: '/pricing#pack-massage',
    label: { th: '1. ร้านนวด', en: '1. Massage' },
    short: { th: 'นวด', en: 'Spa' },
    kicker: { th: 'แพ็กเกจร้านนวด', en: 'Massage shop packages' },
    heading: {
      th: 'ราคาแพ็กเกจร้านนวด',
      en: 'Massage shop package rates',
    },
    sub: {
      th: 'เว็บ Front+Back สำหรับร้านนวด — จองคิว บริการ หลังบ้าน และการดูแลต่อเดือน',
      en: 'Web Front+Back for massage shops — booking, services, back office and monthly care.',
    },
    note: {
      th: 'งานถ่ายภาพร้านนวดคิดแยกตามเวลาที่จ้าง ดูแท็บช่างภาพ — ไม่รวมปนในค่าเว็บอัตโนมัติ',
      en: 'Massage photography is quoted separately by booked time. Use the Photography tab — it is not bundled into the website fee.',
    },
    tiers: massageTiers,
  },
  {
    id: 'restaurant',
    hash: 'pack-restaurant',
    href: '/pricing#pack-restaurant',
    label: { th: '2. ร้านอาหาร', en: '2. Restaurant' },
    short: { th: 'อาหาร', en: 'Food' },
    kicker: { th: 'แพ็กเกจร้านอาหาร', en: 'Restaurant packages' },
    heading: {
      th: 'ราคาแพ็กเกจร้านอาหาร',
      en: 'Restaurant package rates',
    },
    sub: {
      th: 'เว็บ Front+Back สำหรับร้านอาหาร — เมนู จองหรือสั่ง ใบเสร็จ และงานประจำวัน',
      en: 'Web Front+Back for restaurants — menu, booking or order, receipts and daily operations.',
    },
    note: {
      th: 'งานถ่ายอาหารคิดแยกตามเวลาที่จ้าง ดูแท็บช่างภาพ — ไม่รวมปนในค่าเว็บอัตโนมัติ',
      en: 'Food photography is quoted separately by booked time. Use the Photography tab — it is not bundled into the website fee.',
    },
    tiers: restaurantTiers,
  },
  {
    id: 'photo',
    hash: 'pack-photo',
    href: '/pricing#pack-photo',
    label: { th: '3. ช่างภาพ', en: '3. Photography' },
    short: { th: 'ภาพ', en: 'Photo' },
    kicker: { th: 'Photography Only', en: 'Photography Only' },
    heading: photographyCopy.heading,
    sub: photographyCopy.sub,
    note: photographyCopy.aiNote,
    tiers: photoTiers,
  },
  {
    id: 'square',
    hash: 'pack-square',
    href: '/pricing#pack-square',
    label: { th: '4. Square Setup', en: '4. Square Setup' },
    short: { th: 'จ่าย', en: 'Pay' },
    kicker: { th: 'Add-on · รับชำระเงิน', en: 'Add-on · payments' },
    heading: {
      th: 'Square Setup — A$199',
      en: 'Square Setup — A$199',
    },
    sub: squareSetup.subtitle,
    note: squareSetup.note,
    tiers: squareTiers,
  },
];

export function hashToPack(hash: string): PricePackId | null {
  const id = hash.replace(/^#/, '');
  if (id === 'pack-massage') return 'massage';
  if (id === 'pack-restaurant') return 'restaurant';
  if (id === 'pack-photo' || id === 'photo-rates') return 'photo';
  if (id === 'pack-square' || id === 'square-setup') return 'square';
  return null;
}

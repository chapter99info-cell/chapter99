/** Icons8 IDs stay here for license tracking — do not show on tiles. */
export const v7Icons = [
  {
    file: 'website.png',
    label: 'เว็บไซต์',
    line: { id: '1349', slug: 'domain' },
    filled: { id: '9918', slug: 'domain' },
  },
  {
    file: 'online-booking.png',
    label: 'จองคิวออนไลน์',
    line: { id: '23', slug: 'calendar' },
    filled: { id: '10053', slug: 'calendar' },
  },
  {
    file: 'food-ordering.png',
    label: 'สั่งอาหาร',
    line: { id: '611', slug: 'restaurant' },
    filled: { id: '8694', slug: 'restaurant' },
  },
  {
    file: 'photography.png',
    label: 'ถ่ายภาพ',
    line: { id: '5376', slug: 'camera' },
    filled: { id: '7211', slug: 'camera' },
  },
  {
    file: 'video-reels.png',
    label: 'วิดีโอ Reels',
    line: { id: '35090', slug: 'video' },
    filled: { id: '106753', slug: 'video' },
  },
  {
    file: 'payment-square.png',
    label: 'รับเงิน / Square',
    line: { id: '22128', slug: 'bank-card-back-side' },
    filled: { id: '22185', slug: 'bank-card-back-side' },
  },
  {
    file: 'support-chat.png',
    label: 'แชทช่วยเหลือ',
    line: { id: '3726', slug: 'chat' },
    filled: { id: '7859', slug: 'chat' },
  },
  {
    file: 'mobile-phone.png',
    label: 'มือถือ',
    line: { id: '11409', slug: 'smartphone' },
    filled: { id: '11474', slug: 'smartphone' },
  },
] as const

export type V7IconStyle = 'line' | 'filled' | 'both'

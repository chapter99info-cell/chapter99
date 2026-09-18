const LEGACY_PHOTO =
  'https://euiwkvozrhnbxttfuchh.supabase.co/storage/v1/object/public/Chapter%2099%20web/Photos';

const RAW =
  'https://ycwrieebokcbhqqetjak.supabase.co/storage/v1/object/public/Chapter99%20web%202026/Raw';
const PHOTO = `${RAW}/Photos`;
const ICON = `${RAW}/Icon`;

const gemini = (n: number) => `${PHOTO}/Gemini_Generated_Image_%20(${n}).png`;

export const siteMedia = {
  logo: `${LEGACY_PHOTO}/Logo/Chapter99_st.png`,
  hero: `${PHOTO}/massa01.png`,
  massage: gemini(24),
  restaurant: `${PHOTO}/food01.jpg`,
  photography: gemini(8),
  booking: gemini(21),
  system: gemini(20),
  demo: gemini(22),
  review: gemini(19),
  mix: `${PHOTO}/food01.jpg`,
  shopVideo: `${RAW}/VDO/Mix01.mp4`,
  shootVideo: `${RAW}/VDO/hf_20260730_092659_2c5aedaf-77ae-4038-8978-440a30610ee9.mp4`,
} as const;

/** Icons8 files from Raw/Icon in Chapter99 web 2026. */
export const siteIcons = {
  address: `${ICON}/icons8-address-50.png`,
  call: `${ICON}/icons8-call-50.png`,
  chat: `${ICON}/icons8-chat-bubble-50.png`,
  chicken: `${ICON}/icons8-chicken-50.png`,
  chili: `${ICON}/icons8-chili-pepper-50.png`,
  beef: `${ICON}/icons8-cuts-of-beef-50.png`,
  email: `${ICON}/icons8-email-50.png`,
  gmail: `${ICON}/icons8-gmail-logo-50.png`,
  instagram: `${ICON}/icons8-instagram-50.png`,
  kid: `${ICON}/icons8-kid-50.png`,
  location: `${ICON}/icons8-location-50.png`,
  logout: `${ICON}/icons8-logout-50.png`,
  menu: `${ICON}/icons8-menu-50.png`,
  monitor: `${ICON}/icons8-monitor-50.png`,
  noGluten: `${ICON}/icons8-no-gluten-50.png`,
  notification: `${ICON}/icons8-notification-50.png`,
  pork: `${ICON}/icons8-pork-50.png`,
  profile: `${ICON}/icons8-profile-50.png`,
  search: `${ICON}/icons8-search-50.png`,
  settings: `${ICON}/icons8-settings-50.png`,
  smartphone: `${ICON}/icons8-smartphone-50.png`,
  soup: `${ICON}/icons8-soup-50.png`,
  tiktok: `${ICON}/icons8-tiktok-50.png`,
  vegetable: `${ICON}/icons8-vegetable-50.png`,
  whatsapp: `${ICON}/icons8-whatsapp-50.png`,
  youtube: `${ICON}/icons8-youtube-50.png`,
  vkey: `${ICON}/icons8-v-key-50.png`,
  x: `${ICON}/icons8-x-50.png`,
  kid2: `${ICON}/icons8-kid-50%20(1).png`,
  family: `${ICON}/icons8-kid-50%20(2).png`,
} as const;

export const siteContact = {
  mail: 'mailto:chapter99solutions@gmail.com?subject=Chapter99%20Business%20Audit',
  email: 'chapter99solutions@gmail.com',
} as const;

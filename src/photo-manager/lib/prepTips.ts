import type { Client, JobType } from '../types'

const COUPLE = `ชุด / Outfit
• ถ้ายังไม่แน่ใจเรื่องชุด เตรียมสำรองมา 2 ชุด — จะได้เลือกตามแสงและโลเคชันหน้างาน
• หลีกเลี่ยงลายชุลมุน โลโก้ใหญ่ และผ้าที่สะท้อนแสงจัด รูปจะดูสะอาดกว่า
• จับโทนสีคู่กันได้ แต่ไม่ต้องใส่ชุดเหมือนกันเป๊ะ จะได้ไม่กลืนกันในเฟรม

ผิวและผม / Skin & hair
• เมคอัพโทนธรรมชาติ ผิวมีมิติ ติดทนในรูปดีกว่าแมตต์หนา
• เข้าใจสายเทศ — ควรมีทัชอัพระหว่างงาน โดยเฉพาะถ่ายหลายชั่วโมง (กระดาษซับมัน, ลิป, หวี)

เวลา / Timing
• พร้อมก่อนเวลานัดประมาณ 15 นาที จะได้ไม่เสียแสงช่วงต้น และทีมจัดเฟรมได้ทันที

อากาศ / Weather
• งานกลางแจ้งมีแผนสำรองถ้าฝน — ทีมงานจะคุยจุดหลบฝนหรือร่มเงาไว้ล่วงหน้า ไม่ต้องเครียดเรื่องฟ้า

Golden hour
• บล็อกแสงทองบนไทม์ไลน์สำคัญมาก แสงนุ่ม สีผิวสวย ต่างจากแสงกลางวันชัดเจน — ตรงเวลาช่วงนี้คุ้มที่สุดในวันถ่าย`

const PORTRAIT = `ชุด / Outfit
• สีพื้นหรือโทนสุภาพถ่ายออกมาดีกว่าลายชุลมุน
• จับโทนสีกันได้ แต่ไม่ต้องแมตช์ชุดกันทั้งครอบครัวเป๊ะ

เวลามาถึง
• มาถึงก่อนนัดสักไม่กี่นาที จะได้ตั้งสติ จัดผม/เสื้อ ก่อนเริ่มถ่าย`

const FAMILY = `ชุด / Outfit
• สีพื้นหรือโทนสุภาพถ่ายออกมาดีกว่าลายชุลมุน
• จับโทนสีเป็นครอบครัวได้ แต่ไม่ต้องใส่ชุดเหมือนกันทั้งบ้าน

เด็ก / Kids
• เตรียมขนมหรือของเล่นเล็ก ๆ สำหรับพักระหว่างช็อต จะร่วมมือง่ายขึ้น
• เลือกช่วงที่ลูกยังมีพลัง — เช้าหรือหลังงีบ มักดีกว่าตอนง่วงหรือหิว

เวลามาถึง
• มาถึงก่อนนัดสักไม่กี่นาที ให้เด็กได้คุ้นกล้องก่อนเริ่มถ่ายจริง`

const COUPLE_EN = `Outfit
• If you are unsure about outfits, bring a second option — we can pick what suits the light and location on the day
• Avoid busy prints, large logos, and highly reflective fabric; cleaner looks photograph better
• Complementary colours work well; you do not need matching outfits so you stay distinct in frame

Skin & hair
• Natural makeup with a little dimension holds up better in photos than a heavy matte finish
• For long sessions, pack a small touch-up kit (blotting paper, lip colour, comb)

Timing
• Please be ready about 15 minutes before call time so we do not lose the first light and can set frames straight away

Weather
• Outdoor jobs have a rain backup — we will agree shade or cover in advance so you do not need to stress about the sky

Golden hour
• We protect golden hour on the timeline; the soft light and skin tone are worth being on time for`

const PORTRAIT_EN = `Outfit
• Solid or quiet tones photograph better than busy prints
• Complementary colours work well; you do not need matching outfits

Arrival
• Arrive a few minutes early so you can settle, fix hair or collars, then start shooting`

const FAMILY_EN = `Outfit
• Solid or quiet tones photograph better than busy prints
• Complementary family colours work well; nobody needs identical outfits

Kids
• Bring a small snack or toy for breaks between shots
• Choose a time when children still have energy — morning or after a nap usually beats tired or hungry

Arrival
• Arrive a few minutes early so kids can get used to the camera before we start`

export function defaultPrepTips(type: JobType | string): string {
  if (type === 'portrait') return PORTRAIT
  if (type === 'family') return FAMILY
  return COUPLE
}

export function defaultPrepTipsEn(type: JobType | string): string {
  if (type === 'portrait') return PORTRAIT_EN
  if (type === 'family') return FAMILY_EN
  return COUPLE_EN
}

export function resolvedPrepTips(client: Pick<Client, 'type' | 'prepTips'>): string {
  const custom = client.prepTips?.trim()
  return custom || defaultPrepTips(client.type)
}

export function isDefaultPrepTips(text: string, type: JobType | string): boolean {
  return !text.trim() || text.trim() === defaultPrepTips(type).trim()
}

export type PrepTipSection = { heading: string; items: string[] }

export function parsePrepTips(raw: string): PrepTipSection[] {
  const sections: PrepTipSection[] = []
  let current: PrepTipSection = { heading: '', items: [] }
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t) continue
    if (/^[•\-*]/.test(t)) {
      current.items.push(t.replace(/^[•\-*]\s*/, ''))
    } else {
      if (current.heading || current.items.length) sections.push(current)
      current = { heading: t, items: [] }
    }
  }
  if (current.heading || current.items.length) sections.push(current)
  return sections
}

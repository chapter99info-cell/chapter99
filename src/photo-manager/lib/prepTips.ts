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

export function defaultPrepTips(type: JobType | string): string {
  if (type === 'portrait') return PORTRAIT
  if (type === 'family') return FAMILY
  return COUPLE
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

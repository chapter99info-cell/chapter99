import type { JobType } from '../types'

export type TimelineRow = { off: number; photo: string; video: string }

/** Wedding-day script, offsets from ceremony start. */
export const WEDDING_TIMELINE: TimelineRow[] = [
  { off: -390, photo: 'ทีมงานมาถึงเวนิว เก็บภาพบรรยากาศก่อนแขกมาถึง', video: 'ถ่าย establishing shot รอบเวนิว เตรียมโดรน (ถ้ามี)' },
  { off: -345, photo: 'เข้าห้องเจ้าสาว เก็บรายละเอียด: ชุด, แหวน, รองเท้า, ช่อดอกไม้', video: 'เข้าห้องเจ้าสาว บันทึกภาพรายละเอียดคู่กัน' },
  { off: -270, photo: 'เก็บภาพแต่งหน้าทำผม บรรยากาศเพื่อนเจ้าสาว', video: 'บันทึกเสียง (mic เจ้าสาว) เผื่ออ่าน vows' },
  { off: -190, photo: 'เข้าห้องเจ้าบ่าว เก็บรายละเอียด: รองเท้า, เข็มขัด, นาฬิกา', video: 'เข้าห้องเจ้าบ่าว บันทึกภาพรายละเอียดคู่กัน' },
  { off: -105, photo: 'ถ่ายภาพเจ้าสาวเดี่ยว/คู่เพื่อนเจ้าสาว', video: 'กลับมาห้องเจ้าสาว บันทึกช่วงใส่จิวเวลรี่/รูดซิป' },
  { off: -70, photo: 'First Look (ถ้ามี) — จัดตำแหน่งเจ้าบ่าว', video: 'ติดไมค์ทั้งคู่ บันทึกเสียง first look' },
  { off: -45, photo: 'เก็บภาพรายละเอียดพิธี: ที่นั่ง, อาร์ช, ของตกแต่ง', video: 'เก็บภาพรายละเอียดพิธีเช่นกัน' },
  { off: 0, photo: 'พิธีเริ่ม — เก็บภาพ processional, แขก, พ่อส่งตัว', video: 'กล้อง static บนขาตั้ง + กล้อง stabilizer ลอยจับมุม' },
  { off: 20, photo: 'พิธีจบ — จับภาพจูบ เดินกลับ, ความยินดีของแขก', video: 'จับภาพจูบ เดินกลับ เช่นกัน' },
  { off: 30, photo: 'ถ่ายภาพครอบครัว', video: 'ถ่ายข้ามไหล่ช่างภาพ' },
  { off: 50, photo: 'ถ่ายภาพคู่บ่าวสาว + เพื่อนเจ้าบ่าวเจ้าสาว', video: 'ถ่ายข้ามไหล่ช่างภาพ, จับ mannequin challenge (ถ้ามี)' },
  { off: 150, photo: 'Grand entrance + First dance', video: 'ลอยรอบฟลอร์เก็บ first dance' },
  { off: 225, photo: 'ตัดเค้ก + จูบ', video: 'ตัดเค้ก + จูบ' },
  { off: 260, photo: 'Sunset romantics', video: 'Sunset romantics คู่กัน' },
  { off: 300, photo: 'จบงาน / Wrapped', video: 'จบงาน / Wrapped' },
]

/** Pre-wedding / engagement shoot — no ceremony, cake, or first dance. Offsets from call time. */
export const ENGAGEMENT_TIMELINE: TimelineRow[] = [
  { off: 0, photo: 'ถึงโลเคชัน / เซ็ตอัพ แสงและพื้นหลัง', video: 'เซ็ตอัพกล้อง + ตรวจแสง เตรียมโดรน (ถ้ามี)' },
  { off: 20, photo: 'ชุดที่ 1 — ถ่ายคู่ / ภาพเดี่ยว ช่วงเช้าหรือบล็อกหลัก', video: 'บันทึกบ-roll การเดินเข้าฉาก + คลิปคู่' },
  { off: 70, photo: 'ชุดที่ 1 ต่อ — รายละเอียดมือ แหวน ช็อตใกล้', video: 'จับรายละเอียดชุดและโลเคชัน' },
  { off: 100, photo: 'เปลี่ยนชุด / พักสั้น', video: 'พักกล้อง เช็คแบตและการ์ด' },
  { off: 120, photo: 'ชุดที่ 2 — บล็อกถ่ายหลัก', video: 'ตามช็อตคู่ ชุดที่ 2' },
  { off: 170, photo: 'ชุดที่ 2 ต่อ — ภาพวอร์ค / โพสอิสระ', video: 'บ-roll เดินและปฏิสัมพันธ์' },
  { off: 200, photo: 'Golden hour / แสงพระอาทิตย์ตก', video: 'โทนแสงอุ่น + ช็อตซิลูเอ็ต (ถ้าแสงเอื้อ)' },
  { off: 250, photo: 'เก็บของ / แรปงาน', video: 'แรปงาน' },
]

/** Portrait / family — short session. Offsets from call time. */
export const SESSION_TIMELINE: TimelineRow[] = [
  { off: 0, photo: 'ถึงโลเคชัน / เซ็ตอัพ', video: 'เซ็ตอัพกล้องและแสง' },
  { off: 15, photo: 'ถ่ายหลัก — กลุ่ม / เดี่ยว / คู่', video: 'บันทึกบ-roll ช่วงถ่าย (ถ้าจ้างวิดีโอ)' },
  { off: 75, photo: 'เก็บของ / แรปงาน', video: 'แรปงาน' },
]

/** @deprecated Use timelineForJob — kept as the wedding script. */
export const TIMELINE_OFFSETS = WEDDING_TIMELINE

export function timelineForJob(type: JobType | string): TimelineRow[] {
  if (type === 'wedding') return WEDDING_TIMELINE
  if (type === 'engagement') return ENGAGEMENT_TIMELINE
  return SESSION_TIMELINE
}

export function callTimeForJob(type: JobType | string, ceremonyTime?: string): string {
  const t = ceremonyTime?.trim()
  if (t) return t
  return type === 'wedding' ? '16:00' : '09:00'
}

export function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(2000, 0, 1, h || 0, m || 0)
  d.setMinutes(d.getMinutes() + mins)
  return d.toTimeString().slice(0, 5)
}

function formatDurationTh(mins: number): string {
  const abs = Math.max(0, Math.round(mins))
  const h = Math.floor(abs / 60)
  const m = abs % 60
  if (h === 0) return `${m} นาที`
  if (m === 0) return `${h} ชม.`
  return `${h} ชม. ${m} นาที`
}

/** Client-facing day plan from the crew timeline — no shot-list detail. */
export function autoDaySummary(type: JobType | string, ceremonyTime?: string): string {
  const rows = timelineForJob(type)
  if (!rows.length) return ''
  const t0 = callTimeForJob(type, ceremonyTime)
  const start = addMinutes(t0, rows[0].off)
  const end = addMinutes(t0, rows[rows.length - 1].off)
  const duration = formatDurationTh(rows[rows.length - 1].off - rows[0].off)
  const parts = [`งานวันนี้ประมาณ ${duration} (${start}–${end})`]
  const outfitChanges = rows.filter((r) => /เปลี่ยนชุด/.test(`${r.photo} ${r.video}`)).length
  if (outfitChanges > 0) parts.push(`มีเปลี่ยนชุด ${outfitChanges} รอบ`)
  const golden = rows.some((r) => /golden\s*hour|พระอาทิตย์ตก|sunset/i.test(`${r.photo} ${r.video}`))
  if (golden) parts.push('ปิดท้ายด้วยช่วง Golden Hour พระอาทิตย์ตก 🌇')
  return parts.join(' ')
}

export function daySummaryText(client: { type: JobType | string; ceremonyTime?: string; daySummary?: string }): string {
  const custom = client.daySummary?.trim()
  if (custom) return custom
  return autoDaySummary(client.type, client.ceremonyTime)
}

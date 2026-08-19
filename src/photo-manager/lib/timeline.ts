export const TIMELINE_OFFSETS = [
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

export function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(':').map(Number)
  const d = new Date(2000, 0, 1, h, m)
  d.setMinutes(d.getMinutes() + mins)
  return d.toTimeString().slice(0, 5)
}

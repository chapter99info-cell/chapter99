const TH_MONTHS = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

export function toBuddhistISOParts(iso: string) {
  const d = new Date(iso + 'T12:00:00')
  return {
    day: d.getDate(),
    month: d.getMonth(),
    yearCE: d.getFullYear(),
    yearBE: d.getFullYear() + 543,
  }
}

export function formatThaiDate(iso: string): string {
  const { day, month, yearBE } = toBuddhistISOParts(iso)
  return `${day} ${TH_MONTHS[month]} ${yearBE}`
}

/** Client-facing Gregorian date, e.g. "29 August 2026". */
export function formatClientDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00')
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function daysUntil(iso: string, from = new Date()): number {
  const a = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const b = new Date(iso + 'T12:00:00')
  const bb = new Date(b.getFullYear(), b.getMonth(), b.getDate())
  return Math.round((bb.getTime() - a.getTime()) / 86400000)
}

export function isSameMonth(iso: string, year: number, month0: number): boolean {
  const d = new Date(iso + 'T12:00:00')
  return d.getFullYear() === year && d.getMonth() === month0
}

export function monthGrid(year: number, month0: number): (Date | null)[] {
  const first = new Date(year, month0, 1)
  const startPad = first.getDay()
  const days = new Date(year, month0 + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < startPad; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(new Date(year, month0, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export function isoFromDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

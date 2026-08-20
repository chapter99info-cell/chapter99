import type { Expense, ExpenseFrequency } from '../types'

export const FREQ_LABEL: Record<ExpenseFrequency, string> = {
  once: 'ครั้งเดียว',
  monthly: 'รายเดือน',
  yearly: 'รายปี',
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}

function iso(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function clampDay(year: number, month: number, day: number): Date {
  const last = new Date(year, month + 1, 0).getDate()
  return new Date(year, month, Math.min(day, last))
}

function inWindow(date: Date, start: Date, ended: Date | null): boolean {
  if (date < start) return false
  if (ended && date > ended) return false
  return true
}

/** One stored expense can cover many months. Yearly items hit their due month; monthly hits every month from start until ended. */
export function occurrencesInYear(e: Expense, year: number): { dateISO: string; month: number; amount: number }[] {
  const start = parseISO(e.dateISO)
  const ended = e.endedISO ? parseISO(e.endedISO) : null
  const freq = e.frequency ?? 'once'
  const out: { dateISO: string; month: number; amount: number }[] = []

  if (freq === 'once') {
    if (start.getFullYear() === year && inWindow(start, start, ended)) {
      out.push({ dateISO: e.dateISO, month: start.getMonth(), amount: e.amount })
    }
    return out
  }

  if (freq === 'yearly') {
    const due = clampDay(year, start.getMonth(), start.getDate())
    if (inWindow(due, start, ended)) out.push({ dateISO: iso(due), month: due.getMonth(), amount: e.amount })
    return out
  }

  for (let month = 0; month < 12; month++) {
    const due = clampDay(year, month, start.getDate())
    if (inWindow(due, start, ended)) out.push({ dateISO: iso(due), month, amount: e.amount })
  }
  return out
}

export function expenseOverlapsYear(e: Expense, year: number): boolean {
  return occurrencesInYear(e, year).length > 0
}

export function yearExpenseTotal(expenses: Expense[], year: number): number {
  return expenses.reduce((s, e) => s + occurrencesInYear(e, year).reduce((a, o) => a + o.amount, 0), 0)
}

export function monthExpenseTotal(expenses: Expense[], year: number, month: number): number {
  return expenses.reduce(
    (s, e) => s + occurrencesInYear(e, year).filter((o) => o.month === month).reduce((a, o) => a + o.amount, 0),
    0,
  )
}

export function categoryTotals(expenses: Expense[], year: number): { label: string; value: number }[] {
  const map = new Map<string, number>()
  for (const e of expenses) {
    const sum = occurrencesInYear(e, year).reduce((s, o) => s + o.amount, 0)
    if (sum) map.set(e.category, (map.get(e.category) ?? 0) + sum)
  }
  return [...map.entries()].map(([label, value]) => ({ label, value }))
}

export function addDaysISO(isoDate: string, days: number): string {
  const d = parseISO(isoDate)
  d.setDate(d.getDate() + days)
  return iso(d)
}

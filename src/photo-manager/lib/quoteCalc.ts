import type { Client, QuoteCalcDraft, QuoteCalcScope, QuoteProfession, QuoteProjectKind, QuoteRate } from '../types'
import {
  PHOTO_PROFESSIONS,
  QUOTE_PROFESSIONS,
  WEB_PROFESSIONS,
  isPhotoJobType,
  isQuoteProfession,
  projectKindFromJobType,
} from './categories'

export { PHOTO_PROFESSIONS, QUOTE_PROFESSIONS, WEB_PROFESSIONS }

export function hasPhotoScope(scope: Pick<QuoteCalcScope, 'photoHours'>): boolean {
  return Number(scope.photoHours) > 0
}

export function hasWebScope(
  scope: Pick<QuoteCalcScope, 'webPages' | 'webBooking' | 'webGallery' | 'webBilingual' | 'modules'>,
): boolean {
  return (
    Number(scope.webPages) > 0 ||
    Boolean(scope.webBooking) ||
    Boolean(scope.webGallery) ||
    Boolean(scope.webBilingual) ||
    (scope.modules?.length ?? 0) > 0
  )
}

export function resolveProjectKind(scope: Pick<QuoteCalcScope, 'projectKind' | 'profession' | 'photoHours' | 'webPages' | 'webBooking' | 'webGallery' | 'webBilingual' | 'modules'>): QuoteProjectKind {
  if (scope.projectKind === 'photography' || scope.projectKind === 'website' || scope.projectKind === 'combined') {
    return scope.projectKind
  }
  const photo = hasPhotoScope(scope)
  const web = hasWebScope(scope)
  if (photo && web) return 'combined'
  if (isPhotoJobType(scope.profession)) return 'photography'
  return 'website'
}

/** Price only the visible project type. Combined keeps photo + web + backend. */
export function activeQuoteScope(scope: QuoteCalcScope): QuoteCalcScope {
  const projectKind = resolveProjectKind(scope)
  if (projectKind === 'photography') {
    return {
      ...scope,
      projectKind,
      webPages: 0,
      webBooking: false,
      webGallery: false,
      webBilingual: false,
      modules: [],
    }
  }
  if (projectKind === 'website') {
    return {
      ...scope,
      projectKind,
      photoHours: 0,
      photoCount: 0,
    }
  }
  return { ...scope, projectKind: 'combined' }
}

export const BACKEND_MODULES: { id: string; label: string; rateId: string }[] = [
  { id: 'queue_calendar', label: 'คิว / ปฏิทินจอง', rateId: 'backend_queue_calendar' },
  { id: 'invoicing', label: 'ใบแจ้งหนี้ / ใบเสนอราคา', rateId: 'backend_invoicing' },
  { id: 'reminders', label: 'เตือนลูกค้าอัตโนมัติ', rateId: 'backend_reminders' },
  { id: 'tax_expense', label: 'ภาษี / รายจ่าย', rateId: 'backend_tax_expense' },
  { id: 'multi_staff', label: 'สิทธิ์พนักงานหลายคน', rateId: 'backend_multi_staff' },
]

export const RATE_META: { id: string; label: string; unit: string }[] = [
  { id: 'photo_hourly', label: 'ถ่ายภาพ — ต่อชั่วโมง', unit: 'AUD/ชม.' },
  { id: 'web_per_page', label: 'เว็บ — ต่อหน้า', unit: 'AUD/หน้า' },
  { id: 'web_booking', label: 'เว็บ — ฟอร์มจองคิว', unit: 'AUD ครั้งเดียว' },
  { id: 'web_gallery', label: 'เว็บ — แกลเลอรี', unit: 'AUD ครั้งเดียว' },
  { id: 'web_bilingual', label: 'เว็บ — สองภาษา (ไทย+อังกฤษ)', unit: 'AUD ครั้งเดียว' },
  { id: 'backend_queue_calendar', label: 'หลังบ้าน — คิว/ปฏิทิน', unit: 'AUD/เดือน' },
  { id: 'backend_invoicing', label: 'หลังบ้าน — ใบแจ้งหนี้', unit: 'AUD/เดือน' },
  { id: 'backend_reminders', label: 'หลังบ้าน — เตือนลูกค้า', unit: 'AUD/เดือน' },
  { id: 'backend_tax_expense', label: 'หลังบ้าน — ภาษี/รายจ่าย', unit: 'AUD/เดือน' },
  { id: 'backend_multi_staff', label: 'หลังบ้าน — หลายพนักงาน', unit: 'AUD/เดือน' },
  { id: 'intro_factor', label: 'ตัวคูณราคาเริ่มต้น (เช่น 0.7 = ลด 30%)', unit: 'เท่า' },
]

const DEFAULT_AMOUNTS: Record<string, number> = {
  photo_hourly: 80,
  web_per_page: 150,
  web_booking: 180,
  web_gallery: 120,
  web_bilingual: 150,
  backend_queue_calendar: 15,
  backend_invoicing: 15,
  backend_reminders: 15,
  backend_tax_expense: 15,
  backend_multi_staff: 15,
  intro_factor: 0.7,
}

export function defaultQuoteRates(): QuoteRate[] {
  return RATE_META.map((m) => ({ id: m.id, amount: DEFAULT_AMOUNTS[m.id] ?? 0, label: m.label }))
}

export function mergeQuoteRates(rows: QuoteRate[] | undefined): QuoteRate[] {
  const map = new Map((rows ?? []).map((r) => [r.id, r]))
  return RATE_META.map((m) => {
    const hit = map.get(m.id)
    return { id: m.id, amount: hit?.amount ?? DEFAULT_AMOUNTS[m.id] ?? 0, label: hit?.label || m.label }
  })
}

export function rateMap(rates: QuoteRate[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const r of mergeQuoteRates(rates)) out[r.id] = Number(r.amount) || 0
  return out
}

export function emptyQuoteScope(): QuoteCalcScope {
  return {
    projectKind: 'combined',
    profession: 'massage-spa',
    professionOther: '',
    photoHours: 2,
    photoCount: 40,
    webPages: 1,
    webBooking: false,
    webGallery: false,
    webBilingual: false,
    modules: [],
  }
}

export type QuoteCalcResult = {
  photo: number
  webPages: number
  webFlats: { id: string; label: string; amount: number }[]
  setupFull: number
  setupIntro: number
  monthlyFull: number
  monthlyIntro: number
  selectedModules: { id: string; label: string; amount: number }[]
  laterModules: { id: string; label: string; amount: number }[]
  factor: number
  lines: { label: string; amount: number; kind: 'setup' | 'monthly' }[]
}

export function calculateQuote(scope: QuoteCalcScope, rates: QuoteRate[]): QuoteCalcResult {
  const r = rateMap(rates)
  const factor = r.intro_factor > 0 && r.intro_factor <= 1 ? r.intro_factor : 0.7
  const photo = Math.max(0, scope.photoHours) * (r.photo_hourly || 0)
  const webPages = Math.max(0, scope.webPages) * (r.web_per_page || 0)
  const webFlats: QuoteCalcResult['webFlats'] = []
  if (scope.webBooking) webFlats.push({ id: 'web_booking', label: 'ฟอร์มจองคิว', amount: r.web_booking || 0 })
  if (scope.webGallery) webFlats.push({ id: 'web_gallery', label: 'แกลเลอรีบนเว็บ', amount: r.web_gallery || 0 })
  if (scope.webBilingual) webFlats.push({ id: 'web_bilingual', label: 'สองภาษา ไทย+อังกฤษ', amount: r.web_bilingual || 0 })
  const flatsSum = webFlats.reduce((s, x) => s + x.amount, 0)
  const setupFull = photo + webPages + flatsSum
  const selected = new Set(scope.modules)
  const selectedModules = BACKEND_MODULES.filter((m) => selected.has(m.id)).map((m) => ({
    id: m.id,
    label: m.label,
    amount: r[m.rateId] || 0,
  }))
  const laterModules = BACKEND_MODULES.filter((m) => !selected.has(m.id)).map((m) => ({
    id: m.id,
    label: m.label,
    amount: r[m.rateId] || 0,
  }))
  const monthlyFull = selectedModules.reduce((s, m) => s + m.amount, 0)
  const lines: QuoteCalcResult['lines'] = []
  if (photo) lines.push({ label: `ถ่ายภาพ ${scope.photoHours} ชม. (${scope.photoCount} ภาพส่งมอบ)`, amount: photo, kind: 'setup' })
  if (webPages) lines.push({ label: `เว็บไซต์ ${scope.webPages} หน้า`, amount: webPages, kind: 'setup' })
  for (const f of webFlats) lines.push({ label: `เว็บ — ${f.label}`, amount: f.amount, kind: 'setup' })
  for (const m of selectedModules) lines.push({ label: `หลังบ้าน — ${m.label}`, amount: m.amount, kind: 'monthly' })
  return {
    photo,
    webPages,
    webFlats,
    setupFull,
    setupIntro: roundMoney(setupFull * factor),
    monthlyFull,
    monthlyIntro: roundMoney(monthlyFull * factor),
    selectedModules,
    laterModules,
    factor,
    lines,
  }
}

function roundMoney(n: number) {
  return Math.round(n * 100) / 100
}

export function professionLabel(scope: QuoteCalcScope): string {
  if (scope.profession === 'other' && scope.professionOther.trim()) return scope.professionOther.trim()
  return QUOTE_PROFESSIONS.find((p) => p.id === scope.profession)?.label ?? scope.profession
}

export function professionOptionsForKind(
  kind: QuoteProjectKind,
  current: QuoteProfession,
): { id: QuoteProfession; label: string }[] {
  const list =
    kind === 'photography' ? PHOTO_PROFESSIONS : kind === 'website' ? WEB_PROFESSIONS : [...PHOTO_PROFESSIONS, ...WEB_PROFESSIONS]
  if (list.some((p) => p.id === current)) return list
  const extra = QUOTE_PROFESSIONS.find((p) => p.id === current)
  return extra ? [...list, extra] : list
}

export function toQuoteDraft(scope: QuoteCalcScope, rates: QuoteRate[]): QuoteCalcDraft {
  const active = activeQuoteScope(scope)
  const calc = calculateQuote(active, rates)
  return {
    ...scope,
    projectKind: active.projectKind,
    ratesSnapshot: rateMap(rates),
    setupFull: calc.setupFull,
    setupIntro: calc.setupIntro,
    monthlyFull: calc.monthlyFull,
    monthlyIntro: calc.monthlyIntro,
    savedAt: new Date().toISOString().slice(0, 10),
  }
}

export function scopeFromClient(client: Pick<Client, 'type' | 'quote'> | undefined): QuoteCalcScope {
  if (!client) return emptyQuoteScope()
  if (client.quote.calculator) return scopeFromDraft(client.quote.calculator)
  const empty = emptyQuoteScope()
  if (!isQuoteProfession(client.type)) return empty
  return {
    ...empty,
    profession: client.type,
    projectKind: projectKindFromJobType(client.type),
  }
}

export function scopeFromDraft(d: QuoteCalcDraft | undefined): QuoteCalcScope {
  if (!d) return emptyQuoteScope()
  const base: QuoteCalcScope = {
    projectKind: d.projectKind,
    profession: d.profession,
    professionOther: d.professionOther ?? '',
    photoHours: d.photoHours,
    photoCount: d.photoCount,
    webPages: d.webPages,
    webGallery: d.webGallery,
    webBooking: d.webBooking,
    webBilingual: d.webBilingual,
    modules: d.modules ?? [],
  }
  return { ...base, projectKind: resolveProjectKind(base) }
}

/** Nichaphan & Kampanat — 2hr photo, 40 images, 1 web page, booking+gallery, 4 backend modules. */
export function nichaphanQuoteScope(): QuoteCalcScope {
  return {
    projectKind: 'combined',
    profession: 'hair-beauty',
    professionOther: '',
    photoHours: 2,
    photoCount: 40,
    webPages: 1,
    webBooking: true,
    webGallery: true,
    webBilingual: false,
    modules: ['queue_calendar', 'invoicing', 'reminders', 'tax_expense'],
  }
}

/** Rebuild line items from a saved draft (frozen rates). */
export function resultFromDraft(d: QuoteCalcDraft): QuoteCalcResult {
  const rates: QuoteRate[] = Object.entries(d.ratesSnapshot).map(([id, amount]) => ({ id, amount, label: id }))
  return calculateQuote(activeQuoteScope(d), rates)
}

import { defaultBrandLogos } from './brand'
import { defaultQuoteRates } from './quoteCalc'
import { defaultPrepTips } from './prepTips'
import { ADDONS, ALL_PACKAGES, STATUS_LABEL, TYPE_LABEL, VENDOR_ROLES } from '../data/catalog'
import { formatThaiDate } from './dates'
import type { Client, DbSnapshot, Expense, Profile, VendorSheet } from '../types'

function token() {
  return Math.random().toString(36).slice(2, 10)
}

const blankChecklist = () => ({ preshoot: false, balance: false, gallery: false, review: false })

function client(partial: Omit<Client, 'typeLabel' | 'statusLabel' | 'gallery' | 'payment' | 'quote' | 'addonIds' | 'checklist' | 'briefConfirmed' | 'contractConfirmed' | 'confirmToken' | 'customPrice' | 'prepTips'> & Partial<Client>): Client {
  return {
    customPrice: null,
    addonIds: [],
    checklist: blankChecklist(),
    briefConfirmed: false,
    contractConfirmed: false,
    confirmToken: token(),
    gallery: { pictime: '', drive: '', password: '' },
    payment: { method: 'bank', reference: '', paidAt: null },
    quote: { expiryISO: '', issued: false },
    prepTips: defaultPrepTips(partial.type),
    typeLabel: TYPE_LABEL[partial.type],
    statusLabel: STATUS_LABEL[partial.status],
    ...partial,
  }
}

export const SEED_CLIENTS: Client[] = [
  client({
    id: 'c1',
    name: 'คุณกิ๊บซี่ & คุณต้น',
    type: 'wedding',
    packageId: 'w3',
    fixedPrice: null,
    dateISO: '2027-02-14',
    date: formatThaiDate('2027-02-14'),
    ceremonyTime: '16:00',
    location: 'The Vintage Barn เชียงใหม่',
    deposit: 500,
    status: 'confirmed',
    phone: '081-234-5678',
    email: 'gibsy.ton@email.com',
  }),
  client({
    id: 'c2',
    name: 'คุณมิ้น & คุณปีเตอร์',
    type: 'engagement',
    packageId: 'e1',
    fixedPrice: null,
    dateISO: '2026-09-02',
    date: formatThaiDate('2026-09-02'),
    ceremonyTime: '15:00',
    location: 'Sydney Harbour Bridge',
    deposit: 950,
    status: 'paid',
    phone: '089-111-2222',
    email: 'min.peter@email.com',
    checklist: { preshoot: true, balance: true, gallery: false, review: false },
    payment: { method: 'bank', reference: 'PayID-MIN', paidAt: '2026-08-01' },
  }),
  client({
    id: 'c3',
    name: 'Nova Portraits',
    type: 'portrait',
    packageId: null,
    fixedPrice: 650,
    dateISO: '2026-09-20',
    date: formatThaiDate('2026-09-20'),
    ceremonyTime: '11:00',
    location: 'สตูดิโอ Chapter99',
    deposit: 0,
    status: 'pending',
    phone: '02-555-1234',
    email: 'contact@novaportraits.co',
  }),
  client({
    id: 'c4',
    name: 'ครอบครัวสมิทธิ์',
    type: 'family',
    packageId: null,
    fixedPrice: 450,
    dateISO: '2026-10-05',
    date: formatThaiDate('2026-10-05'),
    ceremonyTime: '09:00',
    location: 'Sydney Opera House',
    deposit: 450,
    status: 'confirmed',
    phone: '086-777-8899',
    email: 'smith.family@email.com',
  }),
  client({
    id: 'c5',
    name: 'คุณเอิร์ธ & คุณฟ้า',
    type: 'wedding',
    packageId: 'w4',
    fixedPrice: null,
    dateISO: '2028-01-03',
    date: formatThaiDate('2028-01-03'),
    ceremonyTime: '17:00',
    location: 'Kempinski Hotel Sydney',
    deposit: 0,
    status: 'draft',
    phone: '090-333-4455',
    email: 'earth.fah@email.com',
  }),
]

export const SEED_EXPENSES: Expense[] = [
  {
    id: 'x1',
    dateISO: '2026-07-12',
    category: 'Insurance',
    description: 'Public liability insurance',
    amount: 380,
    linkedClientId: null,
    frequency: 'yearly',
    endedISO: null,
  },
  {
    id: 'x2',
    dateISO: '2026-08-03',
    category: 'Software',
    description: 'Pic-Time gallery subscription',
    amount: 29,
    linkedClientId: null,
    frequency: 'monthly',
    endedISO: null,
  },
]

export function emptyVendorSheet(clientId: string): VendorSheet {
  return {
    clientId,
    vendors: VENDOR_ROLES.map((role) => ({ role, name: '', phone: '', email: '' })),
  }
}

/** Local-only demo hashes are created at first run; seed profiles use placeholders replaced by Auth. */
export const SEED_PROFILES: Profile[] = []

export function seedSnapshot(): DbSnapshot {
  return {
    clients: [],
    expenses: [],
    vendorSheets: [],
    packages: ALL_PACKAGES,
    addons: ADDONS,
    profiles: SEED_PROFILES,
    brandLogos: defaultBrandLogos(),
    quoteRates: defaultQuoteRates(),
  }
}

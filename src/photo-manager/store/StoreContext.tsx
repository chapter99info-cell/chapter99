import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Addon, BrandLogo, CatalogPackage, Client, DbSnapshot, Expense, PaymentMethod, QuoteRate, Role, Session, VendorSheet } from '../types'
import { localAdapter } from './adapters/local'
import { supabaseAdapter, isPmSupabaseConfigured } from './adapters/supabase'
import { emptyVendorSheet } from '../lib/seed'
import { formatThaiDate } from '../lib/dates'
import { STATUS_LABEL, TYPE_LABEL } from '../data/catalog'
import { invoiceTotals } from '../lib/money'
import { newId, staffSafeExpenses } from './adapters/types'
import type { DataAdapter } from './adapters/types'
import { setPmAccountPin, verifyPmAccountPin } from '../lib/pmPinApi'

const SESSION_KEY = 'chapter99-pm-session'
const IDLE_LOCK_MS = 8 * 60 * 1000

function activeAdapter(): DataAdapter {
  if (isPmSupabaseConfigured) return supabaseAdapter
  return localAdapter
}

type Store = {
  ready: boolean
  session: Session | null
  adapterId: DataAdapter['id']
  supabaseReady: boolean
  needsOwner: boolean
  error: string | null
  data: DbSnapshot
  isOwner: boolean
  clients: Client[]
  expenses: Expense[]
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  bootstrapOwner: (email: string, password: string, name: string) => Promise<void>
  registerStaff: (email: string, password: string, name: string) => Promise<void>
  addStaff: (email: string, password: string, name: string) => Promise<string | void>
  upsertClient: (c: Client) => Promise<void>
  deleteClient: (id: string) => Promise<void>
  patchClient: (id: string, patch: Partial<Client>) => Promise<void>
  addExpense: (e: Omit<Expense, 'id'>) => Promise<void>
  updateExpense: (e: Expense) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  saveVendors: (sheet: VendorSheet) => Promise<void>
  vendorsFor: (clientId: string) => VendorSheet
  markPaid: (id: string, method: PaymentMethod, reference: string) => Promise<void>
  confirmByToken: (token: string, kind: 'brief' | 'contract') => Promise<Client | null>
  fetchConfirm: (token: string) => Promise<Client | null>
  requestPasswordReset: (email: string) => Promise<void>
  saveCatalog: (packages: CatalogPackage[], addons: Addon[]) => Promise<void>
  saveBrandLogos: (logos: BrandLogo[]) => Promise<void>
  saveQuoteRates: (rates: QuoteRate[]) => Promise<void>
  pinOffer: { email: string } | null
  devicePinEmail: string | null
  dismissPinOffer: () => void
  savePinForDevice: (pin: string) => Promise<void>
  enableDevicePin: (password: string, pin: string) => Promise<void>
  unlockWithPin: (pin: string) => Promise<void>
  forgetDevicePin: () => void
  appUnlocked: boolean
  pinLocked: boolean
}

const Ctx = createContext<Store | null>(null)

export function PhotoStoreProvider({ children }: { children: ReactNode }) {
  const adapter = useMemo(() => activeAdapter(), [])
  const [ready, setReady] = useState(false)
  const [data, setData] = useState<DbSnapshot>({
    clients: [],
    expenses: [],
    vendorSheets: [],
    packages: [],
    addons: [],
    profiles: [],
    brandLogos: [],
    quoteRates: [],
  })
  const [session, setSession] = useState<Session | null>(null)
  const [needsOwner, setNeedsOwner] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pinOffer, setPinOffer] = useState<{ email: string } | null>(null)
  const [devicePinEmail, setDevicePinEmail] = useState<string | null>(null)
  const [appUnlocked, setAppUnlocked] = useState(false)
  const heldSession = useRef<Session | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [restored, ownerNeeded] = await Promise.all([adapter.restoreSession(), adapter.needsOwner()])
        if (cancelled) return
        setNeedsOwner(ownerNeeded)
        if (ownerNeeded) {
          setAppUnlocked(true)
        } else if (restored) {
          heldSession.current = restored
          setAppUnlocked(false)
        } else {
          setAppUnlocked(false)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Load failed')
      } finally {
        if (!cancelled) setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [adapter])

  useEffect(() => {
    if (!session || !appUnlocked || !adapter.subscribe) return
    return adapter.subscribe(() => {
      void adapter.load().then(setData)
    })
  }, [adapter, session, appUnlocked])

  useEffect(() => {
    if (!appUnlocked || !session) return
    let timer = 0
    const lock = () => setAppUnlocked(false)
    const bump = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(lock, IDLE_LOCK_MS)
    }
    bump()
    const opts: AddEventListenerOptions = { capture: true, passive: true }
    const events = ['pointerdown', 'keydown', 'touchstart', 'mousemove', 'scroll', 'wheel'] as const
    events.forEach((e) => window.addEventListener(e, bump, opts))
    return () => {
      window.clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, bump, opts))
    }
  }, [appUnlocked, session])

  const applySession = useCallback(async (s: Session, offerPinSetup = false) => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
    heldSession.current = s
    setSession(s)
    setAppUnlocked(true)
    setData(await adapter.load())
    setDevicePinEmail(s.pinSet ? s.email : null)
    setPinOffer(offerPinSetup && !s.pinSet ? { email: s.email } : null)
  }, [adapter])

  const persist = useCallback(
    async (next: DbSnapshot) => {
      setData(next)
      await adapter.save(next)
    },
    [adapter],
  )

  const login = async (email: string, password: string) => {
    const s = await adapter.login(email, password)
    await applySession(s, true)
  }

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY)
    heldSession.current = null
    setSession(null)
    setPinOffer(null)
    setAppUnlocked(false)
    void adapter.logout()
  }

  const bootstrapOwner = async (email: string, password: string, name: string) => {
    const s = await adapter.bootstrapOwner(email, password, name)
    setNeedsOwner(false)
    await applySession(s, true)
  }

  const registerStaff = async (email: string, password: string, name: string) => {
    if (!adapter.registerStaff) throw new Error('ลงทะเบียนพนักงานใช้ได้เมื่อเชื่อม Supabase')
    const s = await adapter.registerStaff(email, password, name)
    await applySession(s, true)
  }

  const dismissPinOffer = () => setPinOffer(null)

  const savePinForDevice = async (pin: string) => {
    const token = (await adapter.currentAccessToken?.()) ?? null
    if (!token) throw new Error('ต้องเข้าสู่ระบบก่อนตั้ง PIN')
    await setPmAccountPin(pin, token)
    setDevicePinEmail(session?.email ?? pinOffer?.email ?? null)
    if (session) setSession({ ...session, pinSet: true })
    setPinOffer(null)
    setAppUnlocked(true)
  }

  const enableDevicePin = async (_password: string, pin: string) => {
    await savePinForDevice(pin)
  }

  const unlockWithPin = async (pin: string) => {
    const result = await verifyPmAccountPin(pin)
    const email = result.email.trim().toLowerCase()
    if (session && session.email.trim().toLowerCase() === email) {
      setAppUnlocked(true)
      return
    }
    const held = heldSession.current
    if (held && held.email.trim().toLowerCase() === email) {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(held))
      setSession(held)
      setData(await adapter.load())
      setAppUnlocked(true)
      setDevicePinEmail(held.email)
      setPinOffer(null)
      return
    }
    if (!adapter.completePinLogin) throw new Error('โหมดนี้ยังไม่รองรับ PIN')
    const s = await adapter.completePinLogin(result.token_hash)
    await applySession(s, false)
  }

  const forgetDevicePin = () => {
    setPinOffer(session ? { email: session.email } : null)
  }

  const addStaff = async (email: string, password: string, name: string) => {
    const msg = await adapter.addStaff(email, password, name)
    setData(await adapter.load())
    return msg
  }

  const upsertClient = async (c: Client) => {
    const clients = [...data.clients]
    const i = clients.findIndex((x) => x.id === c.id)
    const row: Client = {
      ...c,
      date: formatThaiDate(c.dateISO),
      typeLabel: TYPE_LABEL[c.type] ?? c.typeLabel ?? c.type,
      statusLabel: STATUS_LABEL[c.status],
    }
    const vendorSheets = [...data.vendorSheets]
    if (i >= 0) clients[i] = row
    else {
      clients.push(row)
      if (!vendorSheets.some((v) => v.clientId === row.id)) {
        vendorSheets.push(emptyVendorSheet(row.id))
      }
    }
    await persist({ ...data, clients, vendorSheets })
  }

  const deleteClient = async (id: string) => {
    await adapter.deleteClient(id)
    await persist({ ...data, clients: data.clients.filter((c) => c.id !== id) })
  }

  const patchClient = async (id: string, patch: Partial<Client>) => {
    const next = { ...data, clients: data.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)) }
    const c = next.clients.find((x) => x.id === id)
    if (c) {
      c.date = formatThaiDate(c.dateISO)
      c.typeLabel = TYPE_LABEL[c.type] ?? c.typeLabel ?? c.type
      c.statusLabel = STATUS_LABEL[c.status]
    }
    await persist(next)
  }

  const addExpense = async (e: Omit<Expense, 'id'>) => {
    await persist({ ...data, expenses: [...data.expenses, { ...e, id: newId('x') }] })
  }
  const updateExpense = async (e: Expense) => {
    await persist({ ...data, expenses: data.expenses.map((x) => (x.id === e.id ? e : x)) })
  }
  const deleteExpense = async (id: string) => {
    await persist({ ...data, expenses: data.expenses.filter((x) => x.id !== id) })
  }

  const saveVendors = async (sheet: VendorSheet) => {
    const others = data.vendorSheets.filter((v) => v.clientId !== sheet.clientId)
    await persist({ ...data, vendorSheets: [...others, sheet] })
  }

  const vendorsFor = (clientId: string) =>
    data.vendorSheets.find((v) => v.clientId === clientId) ?? emptyVendorSheet(clientId)

  const markPaid = async (id: string, method: PaymentMethod, reference: string) => {
    const c = data.clients.find((x) => x.id === id)
    if (!c) return
    const due = invoiceTotals(c, data.packages, data.addons).gstInclusive
    await patchClient(id, {
      status: 'paid',
      deposit: due,
      checklist: { ...c.checklist, balance: true },
      payment: { method, reference, paidAt: new Date().toISOString().slice(0, 10) },
    })
  }

  const fetchConfirm = async (token: string) => adapter.fetchByToken(token)

  const requestPasswordReset = async (email: string) => {
    if (!adapter.requestPasswordReset) throw new Error('รีเซ็ตรหัสผ่านใช้ได้เมื่อเชื่อม Supabase')
    await adapter.requestPasswordReset(email)
  }

  const saveCatalog = async (packages: CatalogPackage[], addons: Addon[]) => {
    await persist({ ...data, packages, addons })
  }

  const saveBrandLogos = async (logos: BrandLogo[]) => {
    await persist({ ...data, brandLogos: logos })
  }

  const saveQuoteRates = async (rates: QuoteRate[]) => {
    await persist({ ...data, quoteRates: rates })
  }

  const confirmByToken = async (token: string, kind: 'brief' | 'contract') => {
    const ok = await adapter.confirmToken(token, kind)
    if (!ok) return null
    const c = await adapter.fetchByToken(token)
    if (session) setData(await adapter.load())
    return c
  }

  const role: Role = session?.role ?? 'staff'
  const clients = data.clients
  const expenses = staffSafeExpenses(data.expenses, role)

  const value: Store = {
    ready,
    session,
    adapterId: adapter.id,
    supabaseReady: isPmSupabaseConfigured,
    needsOwner,
    error,
    data,
    isOwner: session?.role === 'owner',
    clients,
    expenses,
    login,
    logout,
    bootstrapOwner,
    registerStaff,
    addStaff,
    upsertClient,
    deleteClient,
    patchClient,
    addExpense,
    updateExpense,
    deleteExpense,
    saveVendors,
    vendorsFor,
    markPaid,
    confirmByToken,
    fetchConfirm,
    requestPasswordReset,
    saveCatalog,
    saveBrandLogos,
    saveQuoteRates,
    pinOffer,
    devicePinEmail,
    dismissPinOffer,
    savePinForDevice,
    enableDevicePin,
    unlockWithPin,
    forgetDevicePin,
    appUnlocked,
    pinLocked: !appUnlocked && !needsOwner,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePhotoStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('PhotoStore missing')
  return ctx
}

export function blankClient(): Client {
  const today = new Date()
  const iso = today.toISOString().slice(0, 10)
  return {
    id: newId('c'),
    name: '',
    type: 'wedding',
    typeLabel: TYPE_LABEL.wedding,
    packageId: 'w1',
    fixedPrice: null,
    customPrice: null,
    date: formatThaiDate(iso),
    dateISO: iso,
    preWeddingDateISO: null,
    ceremonyTime: '16:00',
    location: '',
    deposit: 0,
    status: 'draft',
    statusLabel: STATUS_LABEL.draft,
    phone: '',
    email: '',
    addonIds: [],
    addonPrices: {},
    checklist: { preshoot: false, balance: false, gallery: false, review: false },
    briefConfirmed: false,
    contractConfirmed: false,
    confirmToken: newId('t'),
    gallery: { pictime: '', drive: '', password: '' },
    payment: { method: 'bank', reference: '', paidAt: null },
    quote: { expiryISO: iso, issued: false },
    prepTips: '',
    daySummary: '',
  }
}

export type { Addon }

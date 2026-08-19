import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { ADDONS, ALL_PACKAGES } from '../../data/catalog'
import { defaultBrandLogos } from '../../lib/brand'
import { seedSnapshot } from '../../lib/seed'
import type { Addon, BrandLogo, CatalogPackage, Client, DbSnapshot, Expense, Session, VendorSheet } from '../../types'
import type { DataAdapter } from './types'

const url = import.meta.env.VITE_PM_SUPABASE_URL
const anon = import.meta.env.VITE_PM_SUPABASE_ANON_KEY

export const isPmSupabaseConfigured = Boolean(url && anon)

let cached: SupabaseClient | null = null

export function pmClient(): SupabaseClient {
  if (!url || !anon) throw new Error('Photo Manager Supabase is not configured')
  if (!cached) {
    cached = createClient(url, anon, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
        storageKey: 'chapter99-pm-auth',
      },
    })
  }
  return cached
}

function num(v: unknown): number | null {
  if (v == null || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function num0(v: unknown): number {
  return num(v) ?? 0
}

type ClientRow = Record<string, unknown>

const CLIENT_OPS =
  'id,name,type,type_label,package_id,date_display,date_iso,ceremony_time,location,status,status_label,phone,email,addon_ids,checklist,brief_confirmed,contract_confirmed,confirm_token,gallery,quote'

function financeBlank() {
  return {
    fixedPrice: null as number | null,
    customPrice: null as number | null,
    deposit: 0,
    payment: { method: 'bank' as const, reference: '', paidAt: null as string | null },
  }
}

export function rowToClient(r: ClientRow, finance?: ClientRow | null): Client {
  const gallery = (r.gallery as Client['gallery']) ?? { pictime: '', drive: '', password: '' }
  const quote = (r.quote as Client['quote']) ?? { expiryISO: '', issued: false }
  const checklist = (r.checklist as Client['checklist']) ?? {
    preshoot: false,
    balance: false,
    gallery: false,
    review: false,
  }
  const pay =
    (finance?.payment as Client['payment']) ??
    (r.payment as Client['payment']) ??
    financeBlank().payment
  return {
    id: String(r.id),
    name: String(r.name ?? ''),
    type: r.type as Client['type'],
    typeLabel: String(r.type_label ?? r.typeLabel ?? ''),
    packageId: (r.package_id as string | null) ?? (r.packageId as string | null) ?? null,
    fixedPrice: num(finance?.fixed_price ?? finance?.fixedPrice ?? r.fixedPrice),
    customPrice: num(finance?.custom_price ?? finance?.customPrice ?? r.customPrice),
    date: String(r.date_display ?? r.date ?? ''),
    dateISO: String(r.date_iso ?? r.dateISO ?? ''),
    ceremonyTime: String(r.ceremony_time ?? r.ceremonyTime ?? ''),
    location: String(r.location ?? ''),
    deposit: num0(finance?.deposit ?? r.deposit),
    status: r.status as Client['status'],
    statusLabel: String(r.status_label ?? r.statusLabel ?? ''),
    phone: String(r.phone ?? ''),
    email: String(r.email ?? ''),
    addonIds: Array.isArray(r.addon_ids) ? (r.addon_ids as string[]) : Array.isArray(r.addonIds) ? (r.addonIds as string[]) : [],
    checklist,
    briefConfirmed: Boolean(r.brief_confirmed ?? r.briefConfirmed),
    contractConfirmed: Boolean(r.contract_confirmed ?? r.contractConfirmed),
    confirmToken: (r.confirm_token as string | null) ?? (r.confirmToken as string | null),
    gallery,
    payment: pay,
    quote,
  }
}

function clientOpsRow(c: Client) {
  return {
    id: c.id,
    name: c.name,
    type: c.type,
    type_label: c.typeLabel,
    package_id: c.packageId,
    date_display: c.date,
    date_iso: c.dateISO,
    ceremony_time: c.ceremonyTime,
    location: c.location,
    status: c.status,
    status_label: c.statusLabel,
    phone: c.phone,
    email: c.email,
    addon_ids: c.addonIds,
    checklist: c.checklist,
    brief_confirmed: c.briefConfirmed,
    contract_confirmed: c.contractConfirmed,
    confirm_token: c.confirmToken,
    gallery: c.gallery,
    quote: c.quote,
  }
}

function clientFinanceRow(c: Client) {
  return {
    client_id: c.id,
    deposit: c.deposit,
    custom_price: c.customPrice,
    fixed_price: c.fixedPrice,
    payment: c.payment,
  }
}

function rowToPackage(r: Record<string, unknown>): CatalogPackage {
  return {
    id: String(r.id),
    kind: r.kind as CatalogPackage['kind'],
    name: String(r.name),
    price: num0(r.price),
    hours: num0(r.hours),
    blurb: Array.isArray(r.blurb) ? (r.blurb as string[]) : [],
  }
}

function rowToAddon(r: Record<string, unknown>): Addon {
  return {
    id: String(r.id),
    name: String(r.name),
    price: num0(r.price),
    suggestsExpense: (r.suggests_expense as Addon['suggestsExpense']) ?? undefined,
  }
}

function rowToExpense(r: Record<string, unknown>): Expense {
  return {
    id: String(r.id),
    dateISO: String(r.date_iso),
    category: String(r.category),
    description: String(r.description),
    amount: num0(r.amount),
    linkedClientId: (r.linked_client_id as string | null) ?? null,
  }
}

async function sessionFromUser(sb: SupabaseClient, userId: string, email: string, fallbackName: string): Promise<Session> {
  const { data } = await sb.from('pm_profiles').select('id,email,name,role').eq('id', userId).maybeSingle()
  const role = data?.role === 'owner' ? 'owner' : 'staff'
  if (data?.role === 'blocked') throw new Error('บัญชีนี้ยังไม่ได้รับเชิญ')
  return {
    profileId: userId,
    role,
    email: data?.email ?? email,
    name: data?.name ?? fallbackName,
  }
}

async function loadBrandLogos(sb: SupabaseClient): Promise<BrandLogo[]> {
  const { data, error } = await sb.from('pm_brand_logos').select('type,logo_url')
  if (error || !data?.length) return defaultBrandLogos()
  return (data as BrandLogo[]).map((r) => ({ type: String(r.type), logo_url: String(r.logo_url ?? '') }))
}

async function loadSnapshot(sb: SupabaseClient, isOwner: boolean): Promise<DbSnapshot> {
  const ops = sb.from('pm_clients').select(CLIENT_OPS)
  const pkgs = sb.from('pm_packages').select('*')
  const adds = sb.from('pm_addons').select('*')
  const vendors = sb.from('pm_vendor_sheets').select('*')
  const financeQ = isOwner ? sb.from('pm_client_finance').select('*') : Promise.resolve({ data: [] as ClientRow[], error: null })
  const expensesQ = isOwner ? sb.from('pm_expenses').select('*') : Promise.resolve({ data: [] as Record<string, unknown>[], error: null })
  const logosQ = loadBrandLogos(sb)
  const [clients, expenses, vendorSheets, packages, addons, finance, brandLogos] = await Promise.all([
    ops,
    expensesQ,
    vendors,
    pkgs,
    adds,
    financeQ,
    logosQ,
  ])
  if (clients.error) throw clients.error
  const finMap = new Map<string, ClientRow>()
  for (const row of finance.data ?? []) {
    finMap.set(String((row as ClientRow).client_id), row as ClientRow)
  }
  return {
    clients: (clients.data ?? []).map((r) => rowToClient(r as ClientRow, finMap.get(String((r as ClientRow).id)) ?? null)),
    expenses: isOwner ? (expenses.data ?? []).map((r) => rowToExpense(r as Record<string, unknown>)) : [],
    vendorSheets: (vendorSheets.data ?? []).map((r) => ({
      clientId: String((r as { client_id: string }).client_id),
      vendors: ((r as { vendors: VendorSheet['vendors'] }).vendors ?? []) as VendorSheet['vendors'],
    })),
    packages: (packages.data ?? []).length ? (packages.data ?? []).map((r) => rowToPackage(r as Record<string, unknown>)) : ALL_PACKAGES,
    addons: (addons.data ?? []).length ? (addons.data ?? []).map((r) => rowToAddon(r as Record<string, unknown>)) : ADDONS,
    profiles: [],
    brandLogos,
  }
}

async function seedCatalogIfEmpty(sb: SupabaseClient) {
  const { count } = await sb.from('pm_packages').select('id', { count: 'exact', head: true })
  if ((count ?? 0) > 0) return
  const { error: pkgErr } = await sb.from('pm_packages').upsert(
    ALL_PACKAGES.map((p) => ({
      id: p.id,
      kind: p.kind,
      name: p.name,
      price: p.price,
      hours: p.hours,
      blurb: p.blurb,
    })),
  )
  if (pkgErr) throw pkgErr
  await sb.from('pm_addons').upsert(
    ADDONS.map((a) => ({
      id: a.id,
      name: a.name,
      price: a.price,
      suggests_expense: a.suggestsExpense ?? null,
    })),
  )
}

export const supabaseAdapter: DataAdapter = {
  id: 'supabase',
  async restoreSession() {
    const sb = pmClient()
    const { data } = await sb.auth.getSession()
    if (!data.session?.user) return null
    try {
      return await sessionFromUser(
        sb,
        data.session.user.id,
        data.session.user.email ?? '',
        (data.session.user.user_metadata?.name as string) || 'Saen',
      )
    } catch {
      return null
    }
  },
  async needsOwner() {
    const sb = pmClient()
    const { data, error } = await sb.rpc('pm_needs_owner')
    if (error) return true
    return Boolean(data)
  },
  async load() {
    const sb = pmClient()
    const { data } = await sb.auth.getSession()
    if (!data.session) {
      const brandLogos = await loadBrandLogos(sb)
      return { ...seedSnapshot(), clients: [], expenses: [], vendorSheets: [], packages: ALL_PACKAGES, addons: ADDONS, profiles: [], brandLogos }
    }
    const session = await sessionFromUser(sb, data.session.user.id, data.session.user.email ?? '', 'Saen')
    return loadSnapshot(sb, session.role === 'owner')
  },
  async save(data) {
    const sb = pmClient()
    const { error: cErr } = await sb.from('pm_clients').upsert(data.clients.map(clientOpsRow))
    if (cErr) throw cErr
    const { error: vErr } = await sb.from('pm_vendor_sheets').upsert(
      data.vendorSheets.map((s) => ({ client_id: s.clientId, vendors: s.vendors })),
    )
    if (vErr) throw vErr
    const { data: userData } = await sb.auth.getUser()
    if (!userData.user) return
    const { data: prof } = await sb.from('pm_profiles').select('role').eq('id', userData.user.id).maybeSingle()
    if (prof?.role !== 'owner') return
    const { error: fErr } = await sb.from('pm_client_finance').upsert(data.clients.map(clientFinanceRow))
    if (fErr) throw fErr
    const { error: eErr } = await sb.from('pm_expenses').upsert(
      data.expenses.map((e) => ({
        id: e.id,
        date_iso: e.dateISO,
        category: e.category,
        description: e.description,
        amount: e.amount,
        linked_client_id: e.linkedClientId,
      })),
    )
    if (eErr) throw eErr
    const { error: pErr } = await sb.from('pm_packages').upsert(
      data.packages.map((p) => ({
        id: p.id,
        kind: p.kind,
        name: p.name,
        price: p.price,
        hours: p.hours,
        blurb: p.blurb,
      })),
    )
    if (pErr) throw pErr
    await sb.from('pm_addons').upsert(
      data.addons.map((a) => ({
        id: a.id,
        name: a.name,
        price: a.price,
        suggests_expense: a.suggestsExpense ?? null,
      })),
    )
    if (data.brandLogos?.length) {
      const { error: logoErr } = await sb.from('pm_brand_logos').upsert(
        data.brandLogos.map((r) => ({ type: r.type, logo_url: r.logo_url })),
      )
      if (logoErr && logoErr.code !== 'PGRST205') throw logoErr
    }
  },
  async login(email, password) {
    const sb = pmClient()
    const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password })
    if (error || !data.user) throw new Error(error?.message ?? 'เข้าสู่ระบบไม่สำเร็จ')
    return sessionFromUser(sb, data.user.id, data.user.email ?? email, (data.user.user_metadata?.name as string) || 'Saen')
  },
  async logout() {
    await pmClient().auth.signOut()
  },
  async bootstrapOwner(email, password, name) {
    const sb = pmClient()
    const { data, error } = await sb.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name } },
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('สมัครไม่สำเร็จ')
    if (!data.session) {
      throw new Error(
        'สร้างบัญชีแล้ว แต่ต้องยืนยันอีเมลก่อน — ปิด Confirm email ที่ Auth → Providers ในโปรเจกต์ Photo Manager แล้วลองเข้าสู่ระบบ',
      )
    }
    try {
      await seedCatalogIfEmpty(sb)
    } catch (e) {
      throw new Error(
        `บัญชีสร้างแล้ว แต่ยังใส่ข้อมูลเริ่มต้นไม่ได้ — ต้องรัน schema บนโปรเจกต์ Photo Manager ก่อน (${e instanceof Error ? e.message : e})`,
      )
    }
    return sessionFromUser(sb, data.user.id, data.user.email ?? email, name)
  },
  async addStaff(email, password, name) {
    const sb = pmClient()
    const code = crypto.randomUUID().slice(0, 8)
    const { error } = await sb.from('pm_staff_invites').upsert({
      email: email.trim().toLowerCase(),
      code,
      used_at: null,
    })
    if (error) throw error
    return `เชิญ ${name} แล้ว — ให้สมัครที่หน้าเข้าสู่ระบบด้วยอีเมล ${email.trim()}${
      password ? ' (พนักงานตั้งรหัสผ่านเองตอนสมัคร)' : ''
    }`
  },
  async registerStaff(email, password, name) {
    const sb = pmClient()
    const { data, error } = await sb.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name } },
    })
    if (error) throw new Error(error.message)
    if (!data.user) throw new Error('สมัครไม่สำเร็จ')
    if (!data.session) {
      throw new Error('สมัครแล้ว — ยืนยันอีเมลก่อนเข้าสู่ระบบ หรือปิด Confirm email ในโปรเจกต์นี้')
    }
    return sessionFromUser(sb, data.user.id, data.user.email ?? email, name)
  },
  async fetchByToken(token) {
    const sb = pmClient()
    const { data, error } = await sb.rpc('pm_fetch_confirm', { p_token: token })
    if (error || !data) return null
    return rowToClient(data as ClientRow, data as ClientRow)
  },
  async confirmToken(token, kind) {
    const sb = pmClient()
    const { data, error } = await sb.rpc('pm_submit_confirm', { p_token: token, p_kind: kind })
    if (error) throw error
    return Boolean(data)
  },
  subscribe(onChange) {
    const sb = pmClient()
    const ch = sb
      .channel('pm-clients-live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pm_clients' }, () => onChange())
      .subscribe()
    return () => {
      void sb.removeChannel(ch)
    }
  },
  async requestPasswordReset(email) {
    const sb = pmClient()
    const redirectTo = `${window.location.origin}/pm/login`
    const { error } = await sb.auth.resetPasswordForEmail(email.trim(), { redirectTo })
    if (error) throw error
  },
}

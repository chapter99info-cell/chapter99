import type { Client, DbSnapshot, Expense, Profile, Role, Session, VendorSheet } from '../../types'

export type DataAdapter = {
  id: 'local' | 'supabase' | 'sheets'
  restoreSession(): Promise<Session | null>
  needsOwner(): Promise<boolean>
  load(): Promise<DbSnapshot>
  save(data: DbSnapshot): Promise<void>
  login(email: string, password: string): Promise<Session>
  completePinLogin?(tokenHash: string): Promise<Session>
  currentAccessToken?(): Promise<string | null>
  logout(): Promise<void>
  bootstrapOwner(email: string, password: string, name: string): Promise<Session>
  addStaff(email: string, password: string, name: string): Promise<string | void>
  registerStaff?(email: string, password: string, name: string): Promise<Session>
  fetchByToken(token: string): Promise<Client | null>
  confirmToken(token: string, kind: 'brief' | 'contract'): Promise<boolean>
  subscribe?(onChange: () => void): () => void
  requestPasswordReset?(email: string): Promise<void>
}

export function staffSafeExpenses(expenses: Expense[], role: Role): Expense[] {
  return role === 'owner' ? expenses : []
}

export function newId(prefix: string) {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`
}

export type { Profile, Session, VendorSheet }

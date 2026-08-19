import { defaultBrandLogos } from '../../lib/brand'
import { seedSnapshot } from '../../lib/seed'
import { hashPassword, packHash, verifyPassword } from '../../lib/crypto'
import type { DataAdapter } from './types'
import type { DbSnapshot, Profile, Session } from '../../types'

const KEY = 'chapter99-photo-manager-v1'

function read(): DbSnapshot | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as DbSnapshot
  } catch {
    return null
  }
}

function write(data: DbSnapshot) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

async function makeProfile(email: string, password: string, name: string, role: Profile['role']): Promise<Profile> {
  const { hash, salt } = await hashPassword(password)
  return {
    id: `u-${crypto.randomUUID().slice(0, 8)}`,
    email: email.trim().toLowerCase(),
    name,
    role,
    passwordHash: packHash(salt, hash),
  }
}

export const localAdapter: DataAdapter = {
  id: 'local',
  async restoreSession() {
    try {
      const raw = sessionStorage.getItem('chapter99-pm-session')
      return raw ? (JSON.parse(raw) as Session) : null
    } catch {
      return null
    }
  },
  async needsOwner() {
    const data = await this.load()
    return !data.profiles.some((p) => p.role === 'owner')
  },
  async load() {
    const existing = read()
    if (existing) {
      return {
        ...existing,
        brandLogos: existing.brandLogos?.length ? existing.brandLogos : defaultBrandLogos(),
      }
    }
    const seed = seedSnapshot()
    write(seed)
    return seed
  },
  async save(data) {
    write(data)
  },
  async login(email, password) {
    const data = (await this.load()) as DbSnapshot
    const profile = data.profiles.find((p) => p.email === email.trim().toLowerCase())
    if (!profile || !(await verifyPassword(password, profile.passwordHash))) {
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    }
    return toSession(profile)
  },
  async logout() {},
  async bootstrapOwner(email, password, name) {
    const data = await this.load()
    if (data.profiles.some((p) => p.role === 'owner')) {
      throw new Error('มีบัญชีเจ้าของอยู่แล้ว')
    }
    const profile = await makeProfile(email, password, name, 'owner')
    data.profiles.push(profile)
    write(data)
    return toSession(profile)
  },
  async addStaff(email, password, name) {
    const data = await this.load()
    if (data.profiles.some((p) => p.email === email.trim().toLowerCase())) {
      throw new Error('อีเมลนี้มีอยู่แล้ว')
    }
    data.profiles.push(await makeProfile(email, password, name, 'staff'))
    write(data)
  },
  async fetchByToken(token) {
    const data = await this.load()
    return data.clients.find((c) => c.confirmToken === token) ?? null
  },
  async confirmToken(token, kind) {
    const data = await this.load()
    const c = data.clients.find((x) => x.confirmToken === token)
    if (!c) return false
    if (kind === 'brief') {
      c.briefConfirmed = true
      if (c.status === 'draft') {
        c.status = 'pending'
        c.statusLabel = 'รอมัดจำ'
      }
    } else c.contractConfirmed = true
    write(data)
    return true
  },
  subscribe() {
    return () => {}
  },
}

function toSession(p: Profile): Session {
  return { profileId: p.id, role: p.role, email: p.email, name: p.name }
}

export function resetLocalDb() {
  localStorage.removeItem(KEY)
}

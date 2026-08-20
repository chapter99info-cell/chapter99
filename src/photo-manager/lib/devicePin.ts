/** Per-browser PIN vault. Encrypts that user's login so this device can re-auth without a shared PIN. */

const STORAGE_KEY = 'chapter99-pm-device-pin'
const FAIL_KEY = 'chapter99-pm-device-pin-fails'
const MAX_FAILS = 5

export type DevicePinMeta = {
  email: string
  deviceId: string
}

type VaultRecord = {
  v: 1
  deviceId: string
  email: string
  salt: string
  iv: string
  cipher: string
}

function bytesToB64(bytes: Uint8Array) {
  let s = ''
  bytes.forEach((b) => {
    s += String.fromCharCode(b)
  })
  return btoa(s)
}

function b64ToBytes(b64: string) {
  const s = atob(b64)
  const out = new Uint8Array(s.length)
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

export function isValidPin(pin: string) {
  return /^\d{4,6}$/.test(pin)
}

function readVault(): VaultRecord | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as VaultRecord
    if (parsed?.v !== 1 || !parsed.cipher || !parsed.salt || !parsed.email) return null
    return parsed
  } catch {
    return null
  }
}

export function getDevicePinMeta(): DevicePinMeta | null {
  const v = readVault()
  if (!v) return null
  return { email: v.email, deviceId: v.deviceId }
}

export function clearDevicePin() {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(FAIL_KEY)
}

export function pinFailCount() {
  return Number(sessionStorage.getItem(FAIL_KEY) || '0') || 0
}

function bumpFails() {
  const n = pinFailCount() + 1
  sessionStorage.setItem(FAIL_KEY, String(n))
  if (n >= MAX_FAILS) clearDevicePin()
  return n
}

function asAb(bytes: Uint8Array): Uint8Array<ArrayBuffer> {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy
}

async function deriveKey(pin: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(pin), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: asAb(salt), iterations: 160000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function saveDevicePin(email: string, password: string, pin: string) {
  if (!isValidPin(pin)) throw new Error('PIN ต้องเป็นตัวเลข 4–6 หลัก')
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(pin, salt)
  const payload = JSON.stringify({ email: email.trim().toLowerCase(), password })
  const cipherBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: asAb(iv) }, key, new TextEncoder().encode(payload))
  const record: VaultRecord = {
    v: 1,
    deviceId: crypto.randomUUID(),
    email: email.trim().toLowerCase(),
    salt: bytesToB64(salt),
    iv: bytesToB64(iv),
    cipher: bytesToB64(new Uint8Array(cipherBuf)),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(record))
  sessionStorage.removeItem(FAIL_KEY)
}

export async function unlockDevicePin(pin: string): Promise<{ email: string; password: string }> {
  const vault = readVault()
  if (!vault) throw new Error('เครื่องนี้ยังไม่ได้ตั้ง PIN')
  if (!isValidPin(pin)) throw new Error('PIN ต้องเป็นตัวเลข 4–6 หลัก')
  try {
    const key = await deriveKey(pin, b64ToBytes(vault.salt))
    const plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: asAb(b64ToBytes(vault.iv)) },
      key,
      asAb(b64ToBytes(vault.cipher)),
    )
    const parsed = JSON.parse(new TextDecoder().decode(plain)) as { email?: string; password?: string }
    if (!parsed.email || !parsed.password) throw new Error('invalid')
    sessionStorage.removeItem(FAIL_KEY)
    return { email: parsed.email, password: parsed.password }
  } catch {
    const n = bumpFails()
    if (n >= MAX_FAILS) {
      throw new Error('PIN ผิดหลายครั้ง — ลบ PIN เครื่องนี้แล้ว กรุณาเข้าสู่ระบบด้วยอีเมลและรหัสผ่าน')
    }
    throw new Error(`PIN ไม่ถูกต้อง (เหลือ ${MAX_FAILS - n} ครั้ง)`)
  }
}

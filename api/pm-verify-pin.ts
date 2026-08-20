import { createHash, pbkdf2Sync } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15
const PBKDF2_ITERS = 120000

function clientKey(req: VercelRequest): string {
  const forwarded = String(req.headers['x-forwarded-for'] ?? 'unknown').split(',')[0]?.trim() ?? 'unknown'
  const ua = String(req.headers['user-agent'] ?? '')
  return createHash('sha256').update(`${forwarded}|${ua}`).digest('hex')
}

function getPmAdmin() {
  const url = process.env.VITE_PM_SUPABASE_URL ?? ''
  const key = process.env.PM_SUPABASE_SERVICE_ROLE_KEY ?? ''
  const pepper = process.env.PM_PIN_PEPPER ?? ''
  const anon = process.env.VITE_PM_SUPABASE_ANON_KEY ?? ''
  if (!url || !key || !pepper) return null
  return {
    admin: createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }),
    anon: createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } }),
    pepper,
  }
}

function pinHashHex(pin: string, pepper: string): string {
  return pbkdf2Sync(pin, `pm-pin-v1|${pepper}`, PBKDF2_ITERS, 32, 'sha256').toString('hex')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ ok: false, message: 'Method not allowed' })

  const ctx = getPmAdmin()
  if (!ctx) {
    return res.status(500).json({ ok: false, message: 'PIN server is not configured (PM_SUPABASE_SERVICE_ROLE_KEY / PM_PIN_PEPPER)' })
  }

  const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as Record<string, unknown>
  const action = typeof body.action === 'string' ? body.action : 'verify'
  const pin = typeof body.pin === 'string' ? body.pin.trim() : ''

  if (action === 'set') {
    if (!/^\d{4}$/.test(pin)) return res.status(400).json({ ok: false, message: 'PIN ต้องเป็นตัวเลข 4 หลัก' })
    const header = String(req.headers.authorization ?? '')
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ ok: false, message: 'ต้องเข้าสู่ระบบก่อนตั้ง PIN' })

    const { data: userData, error: userErr } = await ctx.anon.auth.getUser(token)
    if (userErr || !userData.user) return res.status(401).json({ ok: false, message: 'เซสชันไม่ถูกต้อง' })

    const hash = pinHashHex(pin, ctx.pepper)
    const { data: clash } = await ctx.admin.from('pm_pin_secrets').select('user_id').eq('pin_hash', hash).maybeSingle()
    if (clash && String(clash.user_id) !== userData.user.id) {
      return res.status(409).json({ ok: false, message: 'PIN นี้ถูกใช้แล้ว — เลือกเลขอื่น' })
    }

    const { error: upErr } = await ctx.admin.from('pm_pin_secrets').upsert({
      user_id: userData.user.id,
      pin_hash: hash,
      updated_at: new Date().toISOString(),
    })
    if (upErr) return res.status(500).json({ ok: false, message: 'บันทึก PIN ไม่ได้' })

    await ctx.admin.from('pm_profiles').update({ pin_set_at: new Date().toISOString() }).eq('id', userData.user.id)
    return res.status(200).json({ ok: true })
  }

  if (!/^\d{4}$/.test(pin)) {
    return res.status(400).json({ ok: false, message: 'PIN ต้องเป็นตัวเลข 4 หลัก' })
  }

  const key = clientKey(req)
  const now = new Date()
  const { data: attemptRow } = await ctx.admin
    .from('pm_pin_attempts')
    .select('failed_count, locked_until')
    .eq('client_key', key)
    .maybeSingle()

  if (attemptRow?.locked_until) {
    const lockedUntil = new Date(attemptRow.locked_until as string)
    if (lockedUntil.getTime() > now.getTime()) {
      const minutesLeft = Math.ceil((lockedUntil.getTime() - now.getTime()) / 60000)
      return res.status(429).json({
        ok: false,
        message: `ลองผิดหลายครั้ง — รออีก ${minutesLeft} นาที`,
        locked_until: attemptRow.locked_until,
      })
    }
  }

  const hash = pinHashHex(pin, ctx.pepper)
  const { data: secret } = await ctx.admin.from('pm_pin_secrets').select('user_id').eq('pin_hash', hash).maybeSingle()
  const matchedId = secret ? String(secret.user_id) : null

  if (!matchedId) {
    const failedCount = (attemptRow?.failed_count ?? 0) + 1
    const lockedUntil =
      failedCount >= MAX_ATTEMPTS ? new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000).toISOString() : null
    await ctx.admin.from('pm_pin_attempts').upsert({
      client_key: key,
      failed_count: lockedUntil ? 0 : failedCount,
      locked_until: lockedUntil,
      updated_at: now.toISOString(),
    })
    return res.status(lockedUntil ? 429 : 401).json({
      ok: false,
      message: lockedUntil
        ? `ล็อก ${LOCKOUT_MINUTES} นาที หลังผิด ${MAX_ATTEMPTS} ครั้ง`
        : `PIN ไม่ถูกต้อง (เหลือ ${MAX_ATTEMPTS - failedCount} ครั้ง)`,
      locked_until: lockedUntil,
    })
  }

  const { data: prof } = await ctx.admin.from('pm_profiles').select('id,email,role').eq('id', matchedId).maybeSingle()
  if (!prof?.email || prof.role === 'blocked') {
    return res.status(401).json({ ok: false, message: 'บัญชีนี้ใช้ไม่ได้' })
  }

  await ctx.admin.from('pm_pin_attempts').upsert({
    client_key: key,
    failed_count: 0,
    locked_until: null,
    updated_at: now.toISOString(),
  })

  const { data: link, error: linkErr } = await ctx.admin.auth.admin.generateLink({
    type: 'magiclink',
    email: String(prof.email),
  })
  const hashedToken = (link?.properties as { hashed_token?: string } | undefined)?.hashed_token
  if (linkErr || !hashedToken) {
    return res.status(500).json({ ok: false, message: 'สร้างเซสชันไม่ได้' })
  }

  return res.status(200).json({
    ok: true,
    email: prof.email,
    token_hash: hashedToken,
  })
}

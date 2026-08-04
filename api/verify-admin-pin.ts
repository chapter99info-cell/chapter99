import { createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15
const SESSION_HOURS = 8

function clientKey(req: VercelRequest): string {
  const forwarded = String(req.headers['x-forwarded-for'] ?? 'unknown').split(',')[0]?.trim() ?? 'unknown'
  const ua = String(req.headers['user-agent'] ?? '')
  return createHash('sha256').update(`${forwarded}|${ua}`).digest('hex')
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!url || !key) return null
  return createClient(url, key)
}

/** Optional: after PIN ok, mint a real Supabase session for AMS RLS (auth.uid()). */
async function exchangePinForSupabaseSession(): Promise<{
  access_token: string
  refresh_token: string
} | null> {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? ''
  const anon = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY ?? ''
  const email =
    process.env.AMS_ADMIN_EMAIL || process.env.ADMIN_SUPABASE_EMAIL || ''
  const password =
    process.env.AMS_ADMIN_PASSWORD || process.env.ADMIN_SUPABASE_PASSWORD || ''

  if (!url || !anon || !email || !password) return null

  const client = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await client.auth.signInWithPassword({ email, password })
  if (error || !data.session) return null

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  }
}

function resolveAdminPin(): string {
  return (
    process.env.ADMIN_PIN ||
    process.env.ADMIN_PIN_SERVER ||
    process.env.VITE_ADMIN_PIN ||
    ''
  )
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' })
  }

  const adminPin = resolveAdminPin()
  const supabase = getSupabaseAdmin()

  if (!supabase) {
    return res.status(500).json({ ok: false, message: 'Server configuration error' })
  }

  if (!adminPin) {
    return res.status(503).json({ ok: false, message: 'PIN login not configured' })
  }

  const body = (typeof req.body === 'object' && req.body !== null ? req.body : {}) as Record<
    string,
    unknown
  >
  const action = typeof body.action === 'string' ? body.action : 'verify'

  if (action === 'validate') {
    const token = typeof body.token === 'string' ? body.token : ''
    if (!token) return res.status(400).json({ ok: false, message: 'Missing token' })

    const { data, error } = await supabase
      .from('admin_pin_sessions')
      .select('expires_at')
      .eq('session_token', token)
      .maybeSingle()

    if (error || !data) return res.status(401).json({ ok: false, message: 'Invalid session' })

    const expiresAt = new Date(data.expires_at as string)
    if (expiresAt.getTime() <= Date.now()) {
      await supabase.from('admin_pin_sessions').delete().eq('session_token', token)
      return res.status(401).json({ ok: false, message: 'Session expired' })
    }

    return res.status(200).json({ ok: true, expires_at: data.expires_at })
  }

  const pin = typeof body.pin === 'string' ? body.pin.trim() : ''
  if (!/^\d{4}$/.test(pin)) {
    return res.status(400).json({ ok: false, message: 'PIN must be 4 digits' })
  }

  const key = clientKey(req)
  const now = new Date()

  const { data: attemptRow } = await supabase
    .from('admin_pin_attempts')
    .select('failed_count, locked_until')
    .eq('client_key', key)
    .maybeSingle()

  if (attemptRow?.locked_until) {
    const lockedUntil = new Date(attemptRow.locked_until as string)
    if (lockedUntil.getTime() > now.getTime()) {
      const minutesLeft = Math.ceil((lockedUntil.getTime() - now.getTime()) / 60000)
      return res.status(429).json({
        ok: false,
        message: `Too many attempts. Try again in ${minutesLeft} minute(s).`,
        locked_until: attemptRow.locked_until,
      })
    }
  }

  if (pin !== adminPin) {
    const failedCount = (attemptRow?.failed_count ?? 0) + 1
    const lockedUntil =
      failedCount >= MAX_ATTEMPTS
        ? new Date(now.getTime() + LOCKOUT_MINUTES * 60 * 1000).toISOString()
        : null

    await supabase.from('admin_pin_attempts').upsert({
      client_key: key,
      failed_count: lockedUntil ? 0 : failedCount,
      locked_until: lockedUntil,
      updated_at: now.toISOString(),
    })

    const remaining = lockedUntil ? 0 : MAX_ATTEMPTS - failedCount
    return res.status(lockedUntil ? 429 : 401).json({
      ok: false,
      message: lockedUntil
        ? `Locked for ${LOCKOUT_MINUTES} minutes after ${MAX_ATTEMPTS} wrong attempts.`
        : `Incorrect PIN. ${remaining} attempt(s) remaining.`,
      locked_until: lockedUntil,
    })
  }

  await supabase.from('admin_pin_attempts').upsert({
    client_key: key,
    failed_count: 0,
    locked_until: null,
    updated_at: now.toISOString(),
  })

  const expiresAt = new Date(now.getTime() + SESSION_HOURS * 60 * 60 * 1000).toISOString()
  const { data: session, error: sessionError } = await supabase
    .from('admin_pin_sessions')
    .insert({ expires_at: expiresAt })
    .select('session_token, expires_at')
    .single()

  if (sessionError || !session) {
    return res.status(500).json({ ok: false, message: 'Could not create session' })
  }

  const supabaseSession = await exchangePinForSupabaseSession()

  return res.status(200).json({
    ok: true,
    token: session.session_token,
    expires_at: session.expires_at,
    ...(supabaseSession
      ? {
          access_token: supabaseSession.access_token,
          refresh_token: supabaseSession.refresh_token,
        }
      : {}),
  })
}

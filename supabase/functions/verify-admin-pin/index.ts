import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1'

const MAX_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15
const SESSION_HOURS = 8

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function clientKey(req: Request): Promise<string> {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const ua = req.headers.get('user-agent') ?? ''
  const data = new TextEncoder().encode(`${forwarded}|${ua}`)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const adminPin = Deno.env.get('ADMIN_PIN')

  if (!supabaseUrl || !serviceKey) {
    return json({ ok: false, message: 'Server configuration error' }, 500)
  }

  if (!adminPin) {
    return json({ ok: false, message: 'PIN login not configured' }, 503)
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const body = await req.json().catch(() => ({}))
  const action = typeof body.action === 'string' ? body.action : 'verify'

  if (action === 'validate') {
    const token = typeof body.token === 'string' ? body.token : ''
    if (!token) return json({ ok: false, message: 'Missing token' }, 400)

    const { data, error } = await supabase
      .from('admin_pin_sessions')
      .select('expires_at')
      .eq('session_token', token)
      .maybeSingle()

    if (error || !data) return json({ ok: false, message: 'Invalid session' }, 401)

    const expiresAt = new Date(data.expires_at as string)
    if (expiresAt.getTime() <= Date.now()) {
      await supabase.from('admin_pin_sessions').delete().eq('session_token', token)
      return json({ ok: false, message: 'Session expired' }, 401)
    }

    return json({ ok: true, expires_at: data.expires_at })
  }

  const pin = typeof body.pin === 'string' ? body.pin.trim() : ''
  if (!/^\d{4}$/.test(pin)) {
    return json({ ok: false, message: 'PIN must be 4 digits' }, 400)
  }

  const key = await clientKey(req)
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
      return json(
        {
          ok: false,
          message: `Too many attempts. Try again in ${minutesLeft} minute(s).`,
          locked_until: attemptRow.locked_until,
        },
        429
      )
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
    return json(
      {
        ok: false,
        message: lockedUntil
          ? `Locked for ${LOCKOUT_MINUTES} minutes after ${MAX_ATTEMPTS} wrong attempts.`
          : `Incorrect PIN. ${remaining} attempt(s) remaining.`,
        locked_until: lockedUntil,
      },
      lockedUntil ? 429 : 401
    )
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
    return json({ ok: false, message: 'Could not create session' }, 500)
  }

  return json({
    ok: true,
    token: session.session_token,
    expires_at: session.expires_at,
  })
})

import { createClient } from '@supabase/supabase-js'
import type { VercelRequest, VercelResponse } from '@vercel/node'

function expectedAdminPin(): string {
  return (
    process.env.ADMIN_PIN ||
    process.env.ADMIN_PIN_SERVER ||
    process.env.VITE_ADMIN_PIN ||
    ''
  )
}

function headerValue(
  req: VercelRequest,
  name: string,
): string | undefined {
  const raw = req.headers[name]
  return Array.isArray(raw) ? raw[0] : raw
}

function supabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
  if (!url || !key) return null
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

/**
 * Gate admin API routes.
 * Accepts either:
 * - `x-admin-pin`: raw PIN matching ADMIN_PIN / ADMIN_PIN_SERVER
 * - `x-admin-pin-token`: session token from /api/verify-admin-pin
 */
export async function requireAdminPin(
  req: VercelRequest,
  res: VercelResponse,
): Promise<boolean> {
  const expected = expectedAdminPin()
  const providedPin = headerValue(req, 'x-admin-pin')
  const providedToken = headerValue(req, 'x-admin-pin-token')

  if (expected && providedPin && providedPin === expected) {
    return true
  }

  if (providedToken) {
    const sb = supabaseAdmin()
    if (sb) {
      const { data, error } = await sb
        .from('admin_pin_sessions')
        .select('expires_at')
        .eq('session_token', providedToken)
        .maybeSingle()

      if (!error && data) {
        const expiresAt = new Date(data.expires_at as string)
        if (expiresAt.getTime() > Date.now()) {
          return true
        }
      }
    }
  }

  res.status(401).json({ ok: false, error: 'Unauthorized' })
  return false
}

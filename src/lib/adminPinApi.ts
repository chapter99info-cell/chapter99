const PIN_TOKEN_KEY = 'chapter99_admin_pin_token'

export function getStoredPinToken(): string | null {
  return sessionStorage.getItem(PIN_TOKEN_KEY)
}

export function clearPinToken(): void {
  sessionStorage.removeItem(PIN_TOKEN_KEY)
}

interface PinApiResponse {
  ok?: boolean
  token?: string
  expires_at?: string
  message?: string
  locked_until?: string | null
  access_token?: string
  refresh_token?: string
}

export type PinVerifyResult = {
  token: string
  access_token?: string
  refresh_token?: string
}

async function callPinApi(body: Record<string, string>): Promise<PinApiResponse> {
  const res = await fetch('/api/verify-admin-pin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = (await res.json().catch(() => ({}))) as PinApiResponse

  if (!res.ok) {
    throw new Error(data.message || `PIN request failed (${res.status})`)
  }

  return data
}

/** Verify PIN; stores pin-session token. May also return Supabase JWT for AMS RLS. */
export async function verifyAdminPin(pin: string): Promise<PinVerifyResult> {
  const data = await callPinApi({ action: 'verify', pin })

  if (!data.ok || !data.token) {
    throw new Error(data.message || 'Incorrect PIN')
  }

  sessionStorage.setItem(PIN_TOKEN_KEY, data.token)

  return {
    token: data.token,
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  }
}

export async function validatePinSession(): Promise<boolean> {
  const token = getStoredPinToken()
  if (!token) return false

  try {
    const data = await callPinApi({ action: 'validate', token })
    if (!data.ok) {
      clearPinToken()
      return false
    }
    return true
  } catch {
    clearPinToken()
    return false
  }
}

/** Headers for admin API routes gated by requireAdminPin. */
export function adminPinHeaders(): Record<string, string> {
  const token = getStoredPinToken()
  return token ? { 'x-admin-pin-token': token } : {}
}

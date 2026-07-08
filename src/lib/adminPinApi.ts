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

export async function verifyAdminPin(pin: string): Promise<void> {
  const data = await callPinApi({ action: 'verify', pin })

  if (!data.ok || !data.token) {
    throw new Error(data.message || 'Incorrect PIN')
  }

  sessionStorage.setItem(PIN_TOKEN_KEY, data.token)
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

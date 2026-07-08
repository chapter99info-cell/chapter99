import { supabase } from './supabase'

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

export async function verifyAdminPin(pin: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke<PinApiResponse>('verify-admin-pin', {
    body: { action: 'verify', pin },
  })

  if (error) throw new Error(error.message || 'PIN verification failed')
  if (!data?.ok || !data.token) {
    throw new Error(data?.message || 'Incorrect PIN')
  }

  sessionStorage.setItem(PIN_TOKEN_KEY, data.token)
}

export async function validatePinSession(): Promise<boolean> {
  const token = getStoredPinToken()
  if (!token) return false

  const { data, error } = await supabase.functions.invoke<PinApiResponse>('verify-admin-pin', {
    body: { action: 'validate', token },
  })

  if (error || !data?.ok) {
    clearPinToken()
    return false
  }

  return true
}

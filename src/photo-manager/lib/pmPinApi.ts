export type PmPinVerifyResult = {
  email: string
  token_hash: string
}

async function callPmPinApi(body: Record<string, string>, token?: string): Promise<Record<string, unknown>> {
  const res = await fetch('/api/pm-verify-pin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    throw new Error(typeof data.message === 'string' ? data.message : `PIN request failed (${res.status})`)
  }
  return data
}

export async function verifyPmAccountPin(pin: string): Promise<PmPinVerifyResult> {
  const data = await callPmPinApi({ action: 'verify', pin })
  const email = typeof data.email === 'string' ? data.email : ''
  const token_hash = typeof data.token_hash === 'string' ? data.token_hash : ''
  if (!data.ok || !email || !token_hash) throw new Error('เข้าสู่ระบบด้วย PIN ไม่สำเร็จ')
  return { email, token_hash }
}

export async function setPmAccountPin(pin: string, accessToken: string): Promise<void> {
  const data = await callPmPinApi({ action: 'set', pin }, accessToken)
  if (!data.ok) throw new Error(typeof data.message === 'string' ? data.message : 'บันทึก PIN ไม่ได้')
}

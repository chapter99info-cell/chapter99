import { useState } from 'react'

export default function PinPad({
  onSubmit,
  disabled,
  hint,
}: {
  onSubmit: (pin: string) => Promise<void>
  disabled?: boolean
  hint?: string
}) {
  const [pin, setPin] = useState('')
  const [busy, setBusy] = useState(false)

  function press(d: string) {
    if (disabled || busy) return
    setPin((p) => (p.length >= 4 ? p : p + d))
  }

  function back() {
    if (disabled || busy) return
    setPin((p) => p.slice(0, -1))
  }

  async function submit() {
    if (pin.length !== 4 || busy || disabled) return
    setBusy(true)
    try {
      await onSubmit(pin)
    } finally {
      setBusy(false)
      setPin('')
    }
  }

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

  return (
    <div className="pin-pad">
      {hint && <p className="muted" style={{ textAlign: 'center', marginBottom: 10 }}>{hint}</p>}
      <div className="pin-dots" aria-hidden>
        {Array.from({ length: 4 }).map((_, i) => (
          <span key={i} className={i < pin.length ? 'on' : ''} />
        ))}
      </div>
      <p className="muted" style={{ textAlign: 'center', margin: '6px 0 12px' }}>
        {pin.length < 4 ? 'ใส่ PIN 4 หลัก' : 'กดปลดล็อก'}
      </p>
      <div className="pin-grid">
        {keys.map((k) => (
          <button key={k} type="button" className="pin-key" onClick={() => press(k)} disabled={disabled || busy}>
            {k}
          </button>
        ))}
        <button type="button" className="pin-key ghost" onClick={back} disabled={disabled || busy}>
          ⌫
        </button>
        <button type="button" className="pin-key" onClick={() => press('0')} disabled={disabled || busy}>
          0
        </button>
        <button type="button" className="pin-key ok" onClick={() => void submit()} disabled={disabled || busy || pin.length !== 4}>
          {busy ? '…' : 'OK'}
        </button>
      </div>
    </div>
  )
}

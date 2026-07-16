import { FormEvent, useRef, useState } from 'react'
import { brandColor } from '../../lib/useBrand'

interface AdminPinPadProps {
  onSubmit: (pin: string) => Promise<void>
  disabled?: boolean
}

export default function AdminPinPad({ onSubmit, disabled = false }: AdminPinPadProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', ''])
  const [submitting, setSubmitting] = useState(false)
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  function updateDigit(index: number, value: string) {
    const next = value.replace(/\D/g, '').slice(-1)
    const updated = [...digits]
    updated[index] = next
    setDigits(updated)
    if (next && index < 3) inputsRef.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, key: string) {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  function handleReset() {
    setDigits(['', '', '', ''])
    inputsRef.current[0]?.focus()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const pin = digits.join('')
    if (pin.length !== 4 || submitting || disabled) return
    setSubmitting(true)
    try {
      await onSubmit(pin)
    } finally {
      setSubmitting(false)
    }
  }

  const primary = brandColor('primary')
  const hasInput = digits.some((d) => d !== '')

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: brandColor('textMuted') }}>
          Quick access · รหัส PIN 4 หลัก
        </p>
        <button
          type="button"
          onClick={handleReset}
          disabled={disabled || submitting || !hasInput}
          className="text-sm font-medium underline-offset-2 hover:underline disabled:opacity-0"
          style={{ color: brandColor('textMuted') }}
        >
          Reset
        </button>
      </div>
      <div className="flex justify-center gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el
            }}
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            autoComplete="off"
            aria-label={`PIN digit ${index + 1}`}
            value={digit}
            disabled={disabled || submitting}
            onChange={(e) => updateDigit(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e.key)}
            className="h-14 w-12 rounded-xl border-2 text-center text-2xl font-bold text-[#1A1A1A] focus:border-[#2D5016] focus:outline-none"
            style={{ borderColor: brandColor('border') }}
          />
        ))}
      </div>
      <button
        type="submit"
        disabled={disabled || submitting || digits.join('').length !== 4}
        className="w-full rounded-lg py-4 text-base font-bold text-white disabled:opacity-50"
        style={{ backgroundColor: primary }}
      >
        {submitting ? 'Checking…' : 'Enter with PIN'}
      </button>
    </form>
  )
}

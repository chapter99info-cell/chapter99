import { FormEvent, useRef, useState } from 'react'
import { brandColor } from '../../lib/useBrand'

interface AdminPinPadProps {
  onSubmit: (pin: string) => Promise<void>
  disabled?: boolean
}

/** Large-touch-target PIN pad for phone use while traveling. */
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm sm:text-base" style={{ color: brandColor('textMuted') }}>
          รหัส PIN 4 หลัก
        </p>
        <button
          type="button"
          onClick={handleReset}
          disabled={disabled || submitting || !hasInput}
          className="min-h-11 px-2 text-sm font-medium underline-offset-2 hover:underline disabled:opacity-0"
          style={{ color: brandColor('textMuted') }}
        >
          Reset
        </button>
      </div>

      <div className="flex justify-center gap-3 sm:gap-4">
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
            className="h-16 w-14 rounded-2xl border-2 text-center text-3xl font-bold text-[#1A1A1A] focus:border-[#2D5016] focus:outline-none sm:h-[4.5rem] sm:w-16 sm:text-4xl"
            style={{ borderColor: brandColor('border') }}
          />
        ))}
      </div>

      {/* Number pad for large thumbs on mobile */}
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2 sm:gap-3">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((key, i) => {
          if (key === '') {
            return <span key={`empty-${i}`} className="min-h-14" aria-hidden />
          }
          return (
            <button
              key={key}
              type="button"
              disabled={disabled || submitting}
              onClick={() => {
                if (key === '⌫') {
                  const lastFilled = [...digits].map((d, idx) => ({ d, idx })).reverse().find((x) => x.d)
                  if (lastFilled) {
                    const updated = [...digits]
                    updated[lastFilled.idx] = ''
                    setDigits(updated)
                    inputsRef.current[lastFilled.idx]?.focus()
                  }
                  return
                }
                const emptyIdx = digits.findIndex((d) => !d)
                if (emptyIdx >= 0) updateDigit(emptyIdx, key)
              }}
              className="min-h-14 rounded-xl border-2 bg-[#F5F5F5] text-2xl font-semibold text-[#1A1A1A] active:bg-[#E8E8E8] disabled:opacity-40 sm:min-h-16"
              style={{ borderColor: brandColor('border') }}
            >
              {key}
            </button>
          )
        })}
      </div>

      <button
        type="submit"
        disabled={disabled || submitting || digits.join('').length !== 4}
        className="min-h-14 w-full rounded-xl text-lg font-bold text-white disabled:opacity-50 sm:min-h-16 sm:text-xl"
        style={{ backgroundColor: primary }}
      >
        {submitting ? 'Checking…' : 'Unlock / เข้าสู่ระบบ'}
      </button>
    </form>
  )
}

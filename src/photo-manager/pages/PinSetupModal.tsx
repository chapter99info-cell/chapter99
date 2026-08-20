import { useState } from 'react'
import { isValidPin } from '../lib/devicePin'
import PinPad from './PinPad'

export default function PinSetupModal({
  email,
  onSave,
  onSkip,
}: {
  email: string
  onSave: (pin: string) => Promise<void>
  onSkip: () => void
}) {
  const [step, setStep] = useState<'choose' | 'confirm'>('choose')
  const [first, setFirst] = useState('')
  const [err, setErr] = useState('')

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby="pin-setup-title">
      <div className="modal-card card">
        <h3 id="pin-setup-title">ตั้ง PIN เครื่องนี้</h3>
        <p className="muted">
          ใช้เฉพาะบนโทรศัพท์หรือคอมพิวเตอร์เครื่องนี้ สำหรับ {email} — ไม่ใช่รหัสร่วมทั้งทีม และไม่แทนที่อีเมล/รหัสผ่าน
        </p>
        {step === 'choose' ? (
          <PinPad
            hint="เลือก PIN 4–6 หลัก"
            onSubmit={async (pin) => {
              if (!isValidPin(pin)) return
              setFirst(pin)
              setStep('confirm')
            }}
          />
        ) : (
          <PinPad
            hint="ใส่ PIN อีกครั้งเพื่อยืนยัน"
            onSubmit={async (pin) => {
              if (pin !== first) {
                setErr('PIN ไม่ตรงกัน — ลองใหม่')
                setStep('choose')
                setFirst('')
                return
              }
              await onSave(pin)
            }}
          />
        )}
        {err && <p className="warn">{err}</p>}
        <button className="btn ghost" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={onSkip}>
          ข้ามไปก่อน
        </button>
      </div>
    </div>
  )
}

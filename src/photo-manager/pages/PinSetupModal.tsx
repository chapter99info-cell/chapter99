import { useState } from 'react'
import PinPad from './PinPad'
import { Modal } from './ui'

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
    <Modal title="ตั้ง PIN 4 หลัก" titleId="pin-setup-title" onClose={onSkip}>
        <p className="muted">
          PIN นี้ผูกกับบัญชี {email} — ใช้ได้ทุกเครื่อง ไม่ใช่รหัสร่วมทั้งทีม ตรวจบนเซิร์ฟเวอร์เท่านั้น
        </p>
        {step === 'choose' ? (
          <PinPad
            hint="เลือก PIN 4 หลัก"
            onSubmit={async (pin) => {
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
    </Modal>
  )
}

import { useState } from 'react'
import PinPad from './PinPad'
import { Modal } from './ui'

export default function EnablePinModal({
  email,
  onSave,
  onClose,
}: {
  email: string
  onSave: (password: string, pin: string) => Promise<void>
  onClose: () => void
}) {
  const [step, setStep] = useState<'choose' | 'confirm'>('choose')
  const [first, setFirst] = useState('')
  const [err, setErr] = useState('')

  return (
    <Modal title="ตั้ง / เปลี่ยน PIN บัญชี" onClose={onClose}>
        <p className="muted">PIN 4 หลักของ {email} ใช้ได้ทุกเครื่อง ตรวจบนเซิร์ฟเวอร์</p>
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
            hint="ยืนยัน PIN"
            onSubmit={async (pin) => {
              if (pin !== first) {
                setErr('PIN ไม่ตรงกัน')
                setStep('choose')
                setFirst('')
                return
              }
              try {
                await onSave('', pin)
                onClose()
              } catch (e) {
                setErr(String(e instanceof Error ? e.message : e))
                setStep('choose')
              }
            }}
          />
        )}
        {err && <p className="warn">{err}</p>}
        <button className="btn ghost" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={onClose}>
          ยกเลิก
        </button>
    </Modal>
  )
}

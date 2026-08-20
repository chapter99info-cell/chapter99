import { useState } from 'react'
import { isValidPin } from '../lib/devicePin'
import PinPad from './PinPad'

export default function EnablePinModal({
  email,
  onSave,
  onClose,
}: {
  email: string
  onSave: (password: string, pin: string) => Promise<void>
  onClose: () => void
}) {
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [ready, setReady] = useState(false)

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true">
      <div className="modal-card card">
        <h3>ตั้ง PIN เครื่องนี้</h3>
        <p className="muted">ยืนยันรหัสผ่านของ {email} แล้วเลือก PIN เฉพาะเครื่องนี้</p>
        {!ready ? (
          <>
            <div className="field">
              <label>รหัสผ่านบัญชี</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            {err && <p className="warn">{err}</p>}
            <div className="row">
              <button className="btn ghost" onClick={onClose}>
                ยกเลิก
              </button>
              <button className="btn" onClick={() => (password ? setReady(true) : setErr('ใส่รหัสผ่านก่อน'))}>
                ถัดไป
              </button>
            </div>
          </>
        ) : (
          <PinPad
            hint="เลือก PIN 4–6 หลัก"
            onSubmit={async (pin) => {
              if (!isValidPin(pin)) return
              try {
                await onSave(password, pin)
                onClose()
              } catch (e) {
                setErr(String(e instanceof Error ? e.message : e))
                setReady(false)
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

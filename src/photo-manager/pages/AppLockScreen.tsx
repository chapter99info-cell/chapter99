import { useState } from 'react'
import { getDevicePinMeta } from '../lib/devicePin'
import { usePhotoStore } from '../store/StoreContext'
import PinPad from './PinPad'
import { PageTitle } from './ui'

export default function AppLockScreen() {
  const { devicePinEmail, unlockWithPin, login } = usePhotoStore()
  const hint = devicePinEmail ?? getDevicePinMeta()?.email ?? ''
  const [err, setErr] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [email, setEmail] = useState(hint)
  const [password, setPassword] = useState('')

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <PageTitle sub="Chapter99 Photography · ปลดล็อกเครื่องนี้">ใส่ PIN เพื่อเปิดแอป</PageTitle>
        {!usePassword ? (
          <>
            <p className="muted" style={{ textAlign: 'center' }}>
              {hint}
            </p>
            <PinPad
              onSubmit={async (pin) => {
                setErr('')
                try {
                  await unlockWithPin(pin)
                } catch (e) {
                  setErr(String(e instanceof Error ? e.message : e))
                  if (!getDevicePinMeta()) setUsePassword(true)
                }
              }}
            />
            {err && <p className="warn">{err}</p>}
            <button className="btn ghost" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={() => setUsePassword(true)}>
              ใช้อีเมล / รหัสผ่านแทน
            </button>
          </>
        ) : (
          <>
            <p className="muted">เซสชันยังอยู่บนเครื่องนี้ แต่ต้องยืนยันรหัสผ่านถ้าไม่ใช้ PIN</p>
            <div className="field">
              <label>อีเมล</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
            </div>
            <div className="field">
              <label>รหัสผ่าน</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            {err && <p className="warn">{err}</p>}
            <button className="btn" onClick={() => login(email, password).catch((e) => setErr(String(e.message ?? e)))}>
              เข้าสู่ระบบ
            </button>
            {getDevicePinMeta() && (
              <button className="btn ghost sm" style={{ marginTop: 10 }} onClick={() => setUsePassword(false)}>
                ใช้ PIN เครื่องนี้
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

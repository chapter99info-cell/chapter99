import { useState } from 'react'
import { usePhotoStore } from '../store/StoreContext'
import PinPad from './PinPad'
import { PageTitle } from './ui'

export default function AppLockScreen() {
  const { unlockWithPin, login } = usePhotoStore()
  const [err, setErr] = useState('')
  const [usePassword, setUsePassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <PageTitle sub="Chapter99 Photography">ใส่ PIN เพื่อเปิดแอป</PageTitle>
        {!usePassword ? (
          <>
            <PinPad
              hint="PIN 4 หลัก"
              onSubmit={async (pin) => {
                setErr('')
                try {
                  await unlockWithPin(pin)
                } catch (e) {
                  setErr(String(e instanceof Error ? e.message : e))
                }
              }}
            />
            {err && <p className="warn">{err}</p>}
            <button className="btn ghost" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={() => setUsePassword(true)}>
              ใช้อีเมลแทน
            </button>
          </>
        ) : (
          <>
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
            <button className="btn ghost sm" style={{ marginTop: 10 }} onClick={() => setUsePassword(false)}>
              ใช้ PIN
            </button>
          </>
        )}
      </div>
    </div>
  )
}

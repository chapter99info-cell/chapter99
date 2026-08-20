import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { usePhotoStore } from '../store/StoreContext'
import PinPad from './PinPad'
import { PageTitle } from './ui'

export default function LoginPage() {
  const {
    session,
    login,
    bootstrapOwner,
    registerStaff,
    adapterId,
    supabaseReady,
    needsOwner,
    requestPasswordReset,
    unlockWithPin,
    appUnlocked,
  } = usePhotoStore()
  const [mode, setMode] = useState<'pin' | 'email' | 'staff'>('pin')
  const [email, setEmail] = useState(needsOwner ? 'chapter99manager@gmail.com' : '')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('Saen')
  const [err, setErr] = useState('')
  const [resetNote, setResetNote] = useState('')

  if (session && appUnlocked) return <Navigate to="/pm" replace />

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <PageTitle sub="Chapter99 Photography · Forestville NSW 2087">เข้าสู่ระบบ Manager</PageTitle>
        {needsOwner ? (
          <>
            <p className="muted">สร้างบัญชีเจ้าของคนแรกด้วยอีเมลและรหัสผ่าน แล้วค่อยตั้ง PIN 4 หลัก</p>
            <div className="field">
              <label>ชื่อ</label>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label>อีเมล</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label>รหัสผ่าน</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {err && <p className="warn">{err}</p>}
            <button
              className="btn"
              onClick={() => bootstrapOwner(email, password, name).catch((e) => setErr(String(e.message ?? e)))}
            >
              สร้างบัญชีเจ้าของ
            </button>
          </>
        ) : mode === 'pin' ? (
          <>
            <p className="muted" style={{ textAlign: 'center' }}>
              ใส่ PIN 4 หลัก
            </p>
            <PinPad
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
            <button className="btn ghost" style={{ marginTop: 12, width: '100%', justifyContent: 'center' }} onClick={() => setMode('email')}>
              ใช้อีเมลแทน
            </button>
          </>
        ) : (
          <>
            <div className="row" style={{ marginBottom: 12 }}>
              <button className={mode === 'email' ? 'btn sm' : 'btn ghost sm'} onClick={() => setMode('email')}>
                เข้าสู่ระบบ
              </button>
              {supabaseReady && (
                <button className={mode === 'staff' ? 'btn sm' : 'btn ghost sm'} onClick={() => setMode('staff')}>
                  พนักงานสมัคร (มีคำเชิญ)
                </button>
              )}
            </div>
            {mode === 'staff' && (
              <div className="field">
                <label>ชื่อ</label>
                <input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            )}
            <div className="field">
              <label>อีเมล</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
            </div>
            <div className="field">
              <label>รหัสผ่าน</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            {err && <p className="warn">{err}</p>}
            {mode === 'email' ? (
              <>
                <button className="btn" onClick={() => login(email, password).catch((e) => setErr(String(e.message ?? e)))}>
                  เข้าสู่ระบบ
                </button>
                <button
                  className="btn ghost sm"
                  style={{ marginTop: 10 }}
                  onClick={() =>
                    requestPasswordReset(email)
                      .then(() => setResetNote('ส่งลิงก์รีเซ็ตรหัสผ่านไปที่อีเมลแล้ว (ดูโฟลเดอร์ Spam ด้วย)'))
                      .catch((e) => setErr(String(e.message ?? e)))
                  }
                >
                  ลืมรหัสผ่าน
                </button>
                <button className="btn ghost sm" style={{ marginTop: 10 }} onClick={() => setMode('pin')}>
                  ใช้ PIN
                </button>
                {resetNote && <p className="muted">{resetNote}</p>}
              </>
            ) : (
              <button
                className="btn"
                onClick={() => registerStaff(email, password, name).catch((e) => setErr(String(e.message ?? e)))}
              >
                สมัครบัญชีพนักงาน
              </button>
            )}
          </>
        )}
        <p className="muted" style={{ marginTop: 16 }}>
          โหมด {adapterId}
          {!supabaseReady && ' · ยังไม่พบ VITE_PM_SUPABASE_*'}
        </p>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { usePhotoStore } from '../store/StoreContext'
import { PageTitle } from './ui'

export default function LoginPage() {
  const { session, login, bootstrapOwner, registerStaff, adapterId, supabaseReady, needsOwner, requestPasswordReset } =
    usePhotoStore()
  const [mode, setMode] = useState<'login' | 'staff'>('login')
  const [email, setEmail] = useState(needsOwner ? 'chapter99manager@gmail.com' : '')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('Saen')
  const [err, setErr] = useState('')
  const [resetNote, setResetNote] = useState('')

  if (session) return <Navigate to="/pm" replace />

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <PageTitle sub="Chapter99 Photography · Forestville NSW 2087">เข้าสู่ระบบ Manager</PageTitle>
        <div className="banner">
          {supabaseReady ? (
            <>
              เชื่อมโปรเจกต์ Supabase ของ Photo Manager แล้ว (แยกจากเอเจนซี่และร้านนวด) · โหมด {adapterId}
              <br />
              แนะนำ: Authentication → Providers → Email → ปิด Confirm email สำหรับเครื่องมือภายในนี้
            </>
          ) : (
            <>ยังไม่พบ VITE_PM_SUPABASE_* — ตอนนี้ยังเป็นที่เก็บในเบราว์เซอร์</>
          )}
        </div>
        {needsOwner ? (
          <>
            <p className="muted">สร้างบัญชีเจ้าของคนแรก (Saen) ด้วยอีเมลและรหัสผ่าน — ไม่ใช้ PIN</p>
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
        ) : (
          <>
            <div className="row" style={{ marginBottom: 12 }}>
              <button className={mode === 'login' ? 'btn sm' : 'btn ghost sm'} onClick={() => setMode('login')}>
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
              <input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label>รหัสผ่าน</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            {err && <p className="warn">{err}</p>}
            {mode === 'login' ? (
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
      </div>
    </div>
  )
}

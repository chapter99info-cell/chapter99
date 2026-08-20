import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { usePhotoStore } from '../store/StoreContext'
import { useState } from 'react'
import PinSetupModal from './PinSetupModal'
import EnablePinModal from './EnablePinModal'
import AppLockScreen from './AppLockScreen'

const LINKS = [
  { to: '/pm', end: true, ico: '◈', label: 'แดชบอร์ด' },
  { to: '/pm/clients', ico: '◍', label: 'ลูกค้า / คิวงาน' },
  { to: '/pm/calendar', ico: '▦', label: 'ปฏิทิน' },
  { to: '/pm/contract', ico: '✎', label: 'สัญญา' },
  { to: '/pm/quote', ico: '◇', label: 'ใบเสนอราคา' },
  { to: '/pm/invoice', ico: '▤', label: 'ใบแจ้งหนี้' },
  { to: '/pm/timeline', ico: '◷', label: 'ตารางเวลา (ทีมงาน)' },
  { to: '/pm/vendors', ico: '☰', label: 'Vendor Sheet' },
  { to: '/pm/brief', ico: '◐', label: 'สรุปงานวันถ่าย' },
  { to: '/pm/email', ico: '✉', label: 'อีเมลลูกค้า' },
  { to: '/pm/gallery', ico: '▣', label: 'ส่งมอบแกลเลอรี' },
]

export default function Shell() {
  const { session, isOwner, logout, addStaff, adapterId, pinOffer, savePinForDevice, dismissPinOffer, enableDevicePin, pinLocked } =
    usePhotoStore()
  const [staffOpen, setStaffOpen] = useState(false)
  const [staff, setStaff] = useState({ name: '', email: '', password: '' })
  const [inviteMsg, setInviteMsg] = useState('')
  const [navOpen, setNavOpen] = useState(false)
  const [enablePin, setEnablePin] = useState(false)
  if (pinLocked) return <AppLockScreen />
  if (!session) return <Navigate to="/pm/login" replace />

  function closeNav() {
    setNavOpen(false)
  }

  return (
    <div className={`app ${navOpen ? 'nav-open' : ''}`}>
      <header className="mobile-bar">
        <button type="button" className="nav-toggle" aria-label={navOpen ? 'ปิดเมนู' : 'เปิดเมนู'} onClick={() => setNavOpen((v) => !v)}>
          {navOpen ? '✕' : '☰'}
        </button>
        <div className="mobile-bar-title">
          <strong>Chapter99</strong>
          <span>Manager</span>
        </div>
        <button type="button" className="btn ghost sm" onClick={logout}>
          ออก
        </button>
      </header>
      {navOpen && <button type="button" className="nav-scrim" aria-label="ปิดเมนู" onClick={closeNav} />}
      <nav className={`sidebar ${navOpen ? 'open' : ''}`}>
        <div className="brand">
          <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
            <rect x="6" y="14" width="28" height="18" rx="3" stroke="#f3efe3" strokeWidth="1.6" />
            <circle cx="20" cy="23" r="6" stroke="#f3efe3" strokeWidth="1.6" />
            <rect x="15" y="10" width="10" height="5" rx="1.5" stroke="#f3efe3" strokeWidth="1.6" />
          </svg>
          <div>
            <div className="mark">Chapter99</div>
            <div className="sub">Photography · Manager</div>
          </div>
        </div>
        <div className="navlist">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
              onClick={closeNav}
            >
              <span className="ico">{l.ico}</span> {l.label}
            </NavLink>
          ))}
          {isOwner && (
            <>
              <NavLink to="/pm/quote-calculator" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeNav}>
                <span className="ico">▣</span> คำนวณใบเสนอราคา
              </NavLink>
              <NavLink to="/pm/packages" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeNav}>
                <span className="ico">◈</span> ราคาแพ็กเกจ
              </NavLink>
              <NavLink to="/pm/tax" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeNav}>
                <span className="ico">$</span> สรุปภาษี
              </NavLink>
              <NavLink to="/pm/brand" className={({ isActive }) => (isActive ? 'active' : '')} onClick={closeNav}>
                <span className="ico">◎</span> โลโก้เอกสาร
              </NavLink>
            </>
          )}
        </div>
        <div className="side-foot">
          {session.name} · {session.role}
          <br />
          store: {adapterId}
          {session.pinSet ? (
            <>
              <br />
              PIN บัญชีนี้: เปิดแล้ว
            </>
          ) : null}
          <br />
          {isOwner && (
            <button className="btn ghost sm" style={{ marginTop: 8, color: '#cfe0d6' }} onClick={() => setStaffOpen((v) => !v)}>
              + พนักงาน
            </button>
          )}
          <button className="btn ghost sm" style={{ marginTop: 8, color: '#cfe0d6' }} onClick={() => setEnablePin(true)}>
            {session.pinSet ? 'เปลี่ยน PIN 4 หลัก' : 'ตั้ง PIN 4 หลัก'}
          </button>
          <button className="btn ghost sm" style={{ marginTop: 8, color: '#cfe0d6' }} onClick={logout}>
            ออกจากระบบ
          </button>
          {staffOpen && (
            <div style={{ marginTop: 10 }}>
              <input placeholder="ชื่อ" value={staff.name} onChange={(e) => setStaff({ ...staff, name: e.target.value })} />
              <input placeholder="อีเมล" value={staff.email} onChange={(e) => setStaff({ ...staff, email: e.target.value })} />
              <input
                placeholder="รหัสผ่าน"
                type="password"
                value={staff.password}
                onChange={(e) => setStaff({ ...staff, password: e.target.value })}
              />
              <button
                className="btn sm"
                style={{ marginTop: 6 }}
                onClick={() =>
                  addStaff(staff.email, staff.password, staff.name).then((msg) => {
                    setInviteMsg(typeof msg === 'string' ? msg : 'บันทึกพนักงานแล้ว')
                    setStaffOpen(false)
                  })
                }
              >
                เชิญพนักงาน
              </button>
            </div>
          )}
          {inviteMsg && <div style={{ marginTop: 8, color: '#cfe0d6' }}>{inviteMsg}</div>}
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      {pinOffer && (
        <PinSetupModal email={pinOffer.email} onSave={savePinForDevice} onSkip={dismissPinOffer} />
      )}
      {enablePin && (
        <EnablePinModal email={session.email} onSave={enableDevicePin} onClose={() => setEnablePin(false)} />
      )}
    </div>
  )
}

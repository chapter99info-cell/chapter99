import { useId, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

export const siteNav = [
  { to: '/#system', label: 'ระบบของเรา' },
  { to: '/business-toolkit', label: 'เครื่องมือฟรี' },
  { to: '/massage', label: 'ร้านนวด' },
  { to: '/restaurants', label: 'ร้านอาหาร' },
  { to: '/pricing', label: 'ราคา' },
  { to: '/photography', label: 'ถ่ายภาพ' },
  { to: '/work', label: 'ผลงาน' },
  { to: '/about', label: 'เกี่ยวกับเรา' },
] as const

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const navId = useId()

  return (
    <header className="site-header">
      <Link className="logo" to="/">
        CHAPTER<span>99</span>
        <small>DIGITAL SHOP OPERATING SYSTEM</small>
      </Link>
      <button
        className="nav-toggle"
        type="button"
        aria-expanded={open}
        aria-controls={navId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? 'ปิดเมนู' : 'เมนู'}
      </button>
      <nav id={navId} className={`site-nav${open ? ' is-open' : ''}`} aria-label="เมนูหลัก">
        {siteNav.map((item) =>
          item.to.startsWith('/#') ? (
            <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ) : (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ),
        )}
        <Link className="btn small" to="/contact" onClick={() => setOpen(false)}>
          นัดคุยเรื่องร้าน ↗
        </Link>
      </nav>
    </header>
  )
}

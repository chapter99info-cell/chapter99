import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { SiteHeader } from './SiteHeader'

export function Layout() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1))
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nodes.forEach((n) => n.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('is-visible')
        })
      },
      { threshold: 0.12 },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [location.pathname])

  return (
    <>
      <a className="skip-link" href="#main">
        ข้ามไปเนื้อหา
      </a>
      <SiteHeader />
      <main id="main" className="page-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-brand">
          <Link className="logo" to="/">
            CHAPTER<span>99</span>
          </Link>
          <p>Digital Shop Operating System</p>
          <p>คุณดูแลลูกค้า เราดูแลร้านในโลกดิจิทัล</p>
        </div>
        <nav aria-label="ผลิตภัณฑ์">
          <strong>ผลิตภัณฑ์</strong>
          <Link to="/#system">Core Platform</Link>
          <Link to="/business-toolkit">เครื่องมือฟรี</Link>
          <Link to="/massage">ร้านนวด</Link>
          <Link to="/restaurants">ร้านอาหาร</Link>
          <Link to="/photography">ถ่ายภาพ</Link>
          <Link to="/legal">ธุรกิจบริการอื่น</Link>
        </nav>
        <nav aria-label="เกี่ยวกับเรา">
          <Link to="/about">เกี่ยวกับเรา</Link>
          <Link to="/pricing">ราคา</Link>
          <Link to="/work">ผลงาน</Link>
          <Link to="/contact">ติดต่อ</Link>
        </nav>
        <nav aria-label="ข้อกำหนด">
          <Link to="/legal/terms">Terms of Service</Link>
          <Link to="/legal/privacy">Privacy Policy</Link>
          <Link to="/legal/cookies">Cookie Policy</Link>
          <Link to="/legal/acceptable-use">Acceptable Use</Link>
          <Link to="/legal/refunds">Refund Policy</Link>
        </nav>
        <nav aria-label="ซัพพอร์ต">
          <strong>ซัพพอร์ต</strong>
          <Link to="/legal">Trust Centre</Link>
          <Link to="/legal/availability">สถานะระบบ</Link>
          <Link to="/legal/complaints">ร้องเรียน</Link>
          <Link to="/contact">ติดต่อซัพพอร์ต</Link>
          <Link to="/demo/massage">เดโมจอง</Link>
        </nav>
        <p className="footer-copy">© 2026 Chapter99. All rights reserved.</p>
      </footer>
    </>
  )
}

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { LanguageProvider, useTranslation } from '../cinematic/i18n/LanguageContext'
import type { Lang } from '../cinematic/i18n/types'
import { solutions } from '../data/solutions'
import { siteContact, siteIcons, siteMedia } from './media'
import { SiteUx } from './SiteUx'
import './site.css'
import './homepage-v2.css'
import './homepage-approved.css'
import './theme-blue.css'

const navLinks = [
  { href: '/#solutions', label: { th: 'โซลูชัน', en: 'Solutions' } },
  { href: '/toolkit', label: { th: 'เครื่องมือฟรี', en: 'Free Toolkit' } },
  { href: '/#how', label: { th: 'ขั้นตอนการทำงาน', en: 'How It Works' } },
  { href: '/pricing', label: { th: 'ราคา', en: 'Pricing' } },
  { href: '/business-check', label: { th: 'ตรวจธุรกิจ', en: 'Business Check' } },
  { href: '/#resources', label: { th: 'แหล่งความรู้', en: 'Resources' } },
  { href: '/about', label: { th: 'เกี่ยวกับเรา', en: 'About' } },
]

function linkActive(pathname: string, hash: string, href: string) {
  if (href.startsWith('/#')) return pathname === '/' && hash === href.slice(1)
  return pathname === href || (href.startsWith('/solutions') && pathname.startsWith('/solutions'))
}

function scrollToRouteHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false
  const header = document.querySelector('.topbar') as HTMLElement | null
  const offset = (header?.getBoundingClientRect().height ?? 72) + 12
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  window.scrollTo({ top: Math.max(0, top), behavior: reduce ? 'auto' : 'smooth' })
  return true
}

function SiteChrome({ children }: { children: ReactNode }) {
  const { lang, setLang, t } = useTranslation()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [solOpen, setSolOpen] = useState(false)
  const [newsNote, setNewsNote] = useState('')
  const solRef = useRef<HTMLDivElement>(null)
  const isToolkit = location.pathname.startsWith('/toolkit') || location.pathname === '/business-check'
  const isPricing = location.pathname === '/pricing'
  const solActive = location.pathname.startsWith('/solutions') || solutions.some((item) => location.pathname === item.href)

  useEffect(() => {
    document.body.classList.add('site-app')
    document.body.classList.remove('cinematic-page')
    document.documentElement.lang = lang
    return () => document.body.classList.remove('site-app')
  }, [lang])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!solRef.current?.contains(e.target as Node)) setSolOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSolOpen(false)
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
      return
    }
    let cancelled = false
    const tryScroll = () => {
      if (cancelled) return
      scrollToRouteHash(location.hash)
    }
    const timers = [0, 50, 200, 400].map((ms) => window.setTimeout(tryScroll, ms))
    return () => {
      cancelled = true
      timers.forEach((id) => window.clearTimeout(id))
    }
  }, [location.pathname, location.hash])

  function onNewsletter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setNewsNote(
      t({
        th: 'กล่องข่าวสารยังไม่เชื่อมต่อ — ยังไม่มีการเก็บอีเมล',
        en: 'Newsletter is not connected — no email is stored.',
      }),
    )
  }

  return (
    <div className={`site-root site-v2 site-approved${isToolkit ? ' is-toolkit' : ''}${isPricing ? ' is-pricing' : ''}`}>
      <div className="announce">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', minHeight: 38 }}>
          <span>{t({ th: 'สนับสนุนธุรกิจไทยขนาดเล็กในออสเตรเลีย', en: 'Proudly supporting Thai-owned small businesses in Australia' })}</span>
          <ul className="announce-ticks">
            <li>{t({ th: 'บริการภาษาไทย', en: 'Thai-friendly support' })}</li>
            <li>{t({ th: 'เจ้าของเป็นเจ้าของบัญชีเอง', en: 'You own your accounts' })}</li>
          </ul>
          <span className="lang-toggle">
            {(['en', 'th'] as Lang[]).map((code) => (
              <button
                key={code}
                type="button"
                className={`lang-btn${lang === code ? ' active' : ''}`}
                aria-pressed={lang === code}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </span>
        </div>
      </div>
      <header className={`topbar${open ? ' is-open' : ''}`}>
        <div className="container nav">
          <Link className="brand" to="/" onClick={() => setOpen(false)}>
            <img className="brand-mark" src={siteMedia.logo} alt="" />
            <span>
              <strong>CHAPTER99</strong>
              <small>{t({ th: 'โครงสร้างดิจิทัลสำหรับธุรกิจไทย', en: 'Digital Infrastructure for Thai Businesses' })}</small>
            </span>
          </Link>
          <nav className="navlinks" aria-label="Main">
            <div className={`nav-sol${solOpen ? ' is-open' : ''}`} ref={solRef}>
              <button
                type="button"
                className={`nav-link nav-sol-btn${solActive ? ' is-active' : ''}`}
                aria-expanded={solOpen}
                aria-haspopup="true"
                onClick={() => setSolOpen((v) => !v)}
              >
                {t({ th: 'โซลูชัน', en: 'Solutions' })}
              </button>
              {solOpen ? (
                <div className="nav-sol-menu" role="menu">
                  {solutions.map((item) => (
                    <Link
                      key={item.slug}
                      role="menuitem"
                      to={item.href}
                      className={location.pathname === item.href ? 'is-active' : ''}
                      onClick={() => {
                        setSolOpen(false)
                        setOpen(false)
                      }}
                    >
                      {t(item.name)}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
            {navLinks
              .filter((link) => link.href !== '/#solutions')
              .map((link) => {
                const active = linkActive(location.pathname, location.hash, link.href)
                return link.href.startsWith('/#') ? (
                  <a
                    key={link.href}
                    className={`nav-link${active ? ' is-active' : ''}`}
                    href={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {t(link.label)}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    className={`nav-link${active ? ' is-active' : ''}`}
                    to={link.href}
                    onClick={() => setOpen(false)}
                  >
                    {t(link.label)}
                  </Link>
                )
              })}
          </nav>
          <div className="nav-end">
            <Link className="navcta header-cta" to="/contact" onClick={() => setOpen(false)}>
              {t({ th: 'คุยกับ Chapter99', en: 'Talk to Chapter99' })}
            </Link>
            <button
              type="button"
              className="nav-burger"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <img src={open ? siteIcons.logout : siteIcons.menu} alt="" />
            </button>
          </div>
        </div>
        <div className="nav-drawer">
          {solutions.map((item) => (
            <Link key={`d-${item.slug}`} to={item.href} onClick={() => setOpen(false)}>
              {t(item.name)}
            </Link>
          ))}
          {navLinks.map((link) =>
            link.href.startsWith('/#') ? (
              <a key={`d-${link.href}`} href={link.href} onClick={() => setOpen(false)}>
                {t(link.label)}
              </a>
            ) : (
              <Link key={`d-${link.href}`} to={link.href} onClick={() => setOpen(false)}>
                {t(link.label)}
              </Link>
            ),
          )}
          <Link className="navcta drawer-cta" to="/contact" onClick={() => setOpen(false)}>
            {t({ th: 'คุยกับ Chapter99', en: 'Talk to Chapter99' })}
          </Link>
        </div>
      </header>
      <SiteUx />
      <div id="main">{children}</div>
      <footer className="site-approved-footer" id="contact">
        <div className="container">
          <div className="fgrid">
            <div>
              <div className="brand">
                <strong style={{ color: '#fff' }}>CHAPTER99</strong>
                <small>Digital Infrastructure for Thai Businesses in Australia</small>
              </div>
              <p style={{ fontSize: 14, marginTop: 14 }}>
                {t({ th: 'คนไทย ธุรกิจท้องถิ่น อนาคตที่สดใสกว่า', en: 'Thai people. Local businesses. Brighter tomorrow.' })}
              </p>
            </div>
            <div>
              <h4>{t({ th: 'โซลูชัน', en: 'Solutions' })}</h4>
              <ul>
                {solutions.map((item) => (
                  <li key={item.slug}>
                    <Link to={item.href}>{t(item.name)}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>{t({ th: 'บริษัท', en: 'Company' })}</h4>
              <ul>
                <li>
                  <Link to="/about">{t({ th: 'เกี่ยวกับเรา', en: 'About Us' })}</Link>
                </li>
                <li>
                  <a href="/#how">{t({ th: 'วิธีทำงาน', en: 'Our Approach' })}</a>
                </li>
                <li>
                  <Link to="/contact">{t({ th: 'ติดต่อเรา', en: 'Contact Us' })}</Link>
                </li>
              </ul>
            </div>
            <div id="resources">
              <h4>{t({ th: 'แหล่งความรู้', en: 'Resources' })}</h4>
              <ul>
                <li>
                  <Link to="/business-check">{t({ th: 'ตรวจธุรกิจ', en: 'Business Check' })}</Link>
                </li>
                <li>
                  <Link to="/pricing">{t({ th: 'ราคา', en: 'Pricing' })}</Link>
                </li>
                <li>
                  <Link to="/toolkit">{t({ th: 'เครื่องมือฟรี', en: 'Free Toolkit' })}</Link>
                </li>
                <li>
                  <a href={siteContact.communityHref} target="_blank" rel="noreferrer">
                    {t({ th: 'ชุมชน Facebook', en: 'Facebook community' })}
                  </a>
                </li>
                <li>
                  <Link to="/legal">{t({ th: 'เอกสารกฎหมาย', en: 'Legal' })}</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>{t({ th: 'รับข่าวสารและเคล็ดลับ', en: 'Get tips and updates' })}</h4>
              <form className="sub-form" onSubmit={onNewsletter} noValidate>
                <label className="sr-only" htmlFor="hp-news-email">
                  {t({ th: 'อีเมล', en: 'Email address' })}
                </label>
                <input id="hp-news-email" type="email" name="email" placeholder="Your email address" autoComplete="email" />
                <button className="navcta" type="submit">
                  {t({ th: 'สมัคร', en: 'Subscribe' })}
                </button>
              </form>
              <small className="sub-note">
                {newsNote ||
                  t({
                    th: 'ส่วนติดต่อนี้ยังไม่เชื่อมต่อ — ยังไม่เก็บอีเมล',
                    en: 'UI only — not connected yet. No email is stored.',
                  })}
              </small>
            </div>
          </div>
          <svg className="skyline" viewBox="0 0 800 46" preserveAspectRatio="none" fill="#cfe6fa" aria-hidden="true">
            <path d="M0 46V34h40v-6h30v10h50V30h30V20h20v18h60V26h40v12h60V32c20-10 40-10 60 0v6h50V28h40v10h60V24h30v14h60V30h60v16z" />
          </svg>
          <div className="fbottom">
            <span>© 2026 Chapter99. All rights reserved.</span>
            <span>Australia · chapter99solutions@gmail.com</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <LanguageProvider>
      <SiteChrome>{children}</SiteChrome>
    </LanguageProvider>
  )
}

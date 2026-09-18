import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../cinematic/i18n/LanguageContext'
import { siteCatalog } from './catalog'
import { siteContact } from './media'

const COOKIE_KEY = 'chapter99-cookie'
const NEWS_KEY = 'chapter99-newsletter'

export function withUtm(href: string) {
  if (!href.startsWith('http://') && !href.startsWith('https://')) return href
  try {
    const url = new URL(href)
    if (!url.searchParams.has('utm_source')) {
      url.searchParams.set('utm_source', 'chapter99info')
      url.searchParams.set('utm_medium', 'site')
      url.searchParams.set('utm_campaign', 'outbound')
    }
    return url.toString()
  } catch {
    return href
  }
}

export function CopySnippet({ text, children }: { text: string; children: string }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  return (
    <div className="snippet">
      <pre className="tool-pre">{children}</pre>
      <button
        type="button"
        className="snippet-copy"
        onClick={async () => {
          await navigator.clipboard.writeText(text)
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1600)
        }}
      >
        {copied ? t({ th: 'คัดลอกแล้ว', en: 'Copied' }) : t({ th: 'คัดลอก', en: 'Copy' })}
      </button>
    </div>
  )
}

let openSearchFn: (() => void) | null = null

export function SearchButton() {
  const { t } = useTranslation()
  return (
    <button type="button" className="icon-btn" onClick={() => openSearchFn?.()}>
      {t({ th: 'ค้นหา', en: 'Search' })}
    </button>
  )
}

export function SiteUx() {
  const { t, lang } = useTranslation()
  const location = useLocation()
  const [progress, setProgress] = useState(0)
  const [showTop, setShowTop] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cookie, setCookie] = useState<'unknown' | 'ok' | 'no'>('unknown')
  const [loading, setLoading] = useState(true)
  const [confirm, setConfirm] = useState<{ message: string; onYes: () => void } | null>(null)

  useEffect(() => {
    delete document.documentElement.dataset.theme
    localStorage.removeItem('chapter99-theme')
    const c = localStorage.getItem(COOKIE_KEY)
    if (c === 'ok' || c === 'no') setCookie(c)
    const tmr = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(tmr)
  }, [])

  openSearchFn = () => setSearchOpen(true)

  useEffect(() => {
    setLoading(true)
    const tmr = window.setTimeout(() => setLoading(false), 280)
    return () => window.clearTimeout(tmr)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0)
      setShowTop(el.scrollTop > 420)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest('a')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || (!href.startsWith('http://') && !href.startsWith('https://'))) return
      const next = withUtm(href)
      if (next !== href) a.setAttribute('href', next)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return siteCatalog
    return siteCatalog.filter((item) => {
      const blob = `${item.title.th} ${item.title.en} ${item.blurb.th} ${item.blurb.en} ${item.href}`
      return blob.toLowerCase().includes(q)
    })
  }, [query])

  const acceptCookie = () => {
    localStorage.setItem(COOKIE_KEY, 'ok')
    setCookie('ok')
  }

  const declineCookie = () => {
    setConfirm({
      message: t({
        th: 'ปฏิเสธคุกกี้ที่ไม่จำเป็น?',
        en: 'Decline optional cookies on this device?',
      }),
      onYes: () => {
        localStorage.setItem(COOKIE_KEY, 'no')
        setCookie('no')
        setConfirm(null)
      },
    })
  }

  return (
    <>
      <a className="skip-link" href="#main">
        {t({ th: 'ข้ามไปเนื้อหา', en: 'Skip to content' })}
      </a>
      <div className="scroll-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
        <span style={{ width: `${progress}%` }} />
      </div>
      {loading ? (
        <div className="route-loader" aria-live="polite">
          {t({ th: 'กำลังโหลด…', en: 'Loading…' })}
        </div>
      ) : null}

      {searchOpen ? (
        <div className="search-scrim" role="dialog" aria-modal="true" aria-label="Site search">
          <div className="search-panel">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t({ th: 'ค้นหาหน้า แพ็กเกจ เครื่องมือ…', en: 'Search pages, packages, tools…' })}
            />
            <ul>
              {results.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith('/#') || item.href.startsWith('mailto:') ? (
                    <a href={item.href} onClick={() => setSearchOpen(false)}>
                      <strong>{t(item.title)}</strong>
                      <small>{t(item.blurb)}</small>
                    </a>
                  ) : (
                    <Link to={item.href} onClick={() => setSearchOpen(false)}>
                      <strong>{t(item.title)}</strong>
                      <small>{t(item.blurb)}</small>
                    </Link>
                  )}
                </li>
              ))}
              {results.length === 0 ? <li className="muted">{t({ th: 'ไม่พบผลลัพธ์', en: 'No matches' })}</li> : null}
            </ul>
            <button type="button" className="btn secondary" onClick={() => setSearchOpen(false)}>
              {t({ th: 'ปิด', en: 'Close' })}
            </button>
          </div>
        </div>
      ) : null}

      <a className="fab-contact" href={siteContact.mail}>
        {t({ th: 'ส่งอีเมล', en: 'Email us' })}
      </a>
      {showTop ? (
        <button type="button" className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          {t({ th: 'ขึ้นบน', en: 'Top' })}
        </button>
      ) : null}

      {cookie === 'unknown' ? (
        <div className="cookie-banner" role="dialog" aria-label="Cookies">
          <p>
            {t({
              th: 'เราใช้คุกกี้เท่าที่จำเป็นเพื่อจำการตั้งค่าบนเครื่องคุณ',
              en: 'We use essential cookies to remember preferences on this device.',
            })}
          </p>
          <div className="cookie-actions">
            <button type="button" className="btn primary" onClick={acceptCookie}>
              {t({ th: 'ยอมรับ', en: 'Accept' })}
            </button>
            <button type="button" className="btn secondary" onClick={declineCookie}>
              {t({ th: 'ปฏิเสธ', en: 'Decline' })}
            </button>
          </div>
        </div>
      ) : null}

      {confirm ? (
        <div className="confirm-scrim" role="alertdialog" aria-modal="true">
          <div className="confirm-card">
            <p>{confirm.message}</p>
            <div className="cookie-actions">
              <button type="button" className="btn primary" onClick={confirm.onYes}>
                {t({ th: 'ยืนยัน', en: 'Confirm' })}
              </button>
              <button type="button" className="btn secondary" onClick={() => setConfirm(null)}>
                {t({ th: 'ยกเลิก', en: 'Cancel' })}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <span className="sr-only">{lang}</span>
    </>
  )
}

export function NewsletterCard() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(() => Boolean(localStorage.getItem(NEWS_KEY)))
  const [error, setError] = useState('')

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t({ th: 'ใส่อีเมลที่ใช้ได้', en: 'Enter a valid email' }))
      return
    }
    localStorage.setItem(NEWS_KEY, email.trim())
    setDone(true)
    setError('')
  }

  if (done) {
    return (
      <div className="news-card is-success">
        <strong>{t({ th: 'บันทึกแล้ว', en: 'You’re on the list' })}</strong>
        <p>
          {t({
            th: 'เราจะส่งอัปเดตแพ็กเกจไปที่อีเมลนี้ — ไม่มีการสมัครสมาชิกรายเดือนอัตโนมัติ',
            en: 'We’ll send package notes to this email — no automatic paid subscription.',
          })}
        </p>
      </div>
    )
  }

  return (
    <form className="news-card" onSubmit={submit}>
      <strong>{t({ th: 'อัปเดตราคาและเครื่องมือ', en: 'Price and toolkit updates' })}</strong>
      <p>{t({ th: 'อีเมลร้าน เราไม่ขายรายชื่อ', en: 'Shop email only. We don’t sell the list.' })}</p>
      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="shop@email.com"
          required
        />
      </label>
      {error ? <p className="news-error">{error}</p> : null}
      <button type="submit" className="btn primary">
        {t({ th: 'สมัครรับข่าว', en: 'Subscribe' })}
      </button>
    </form>
  )
}

export function FaqSection() {
  const { t } = useTranslation()
  const items = [
    {
      q: { th: 'มีล็อกสัญญา 12 เดือนไหม?', en: 'Is there a 12-month lock-in?' },
      a: {
        th: 'แพ็กเกจเว็บรายเดือนยกเลิกได้ทุกเดือน ไม่มีล็อก 12 เดือน',
        en: 'Monthly web packages can be cancelled any month. No 12-month lock-in.',
      },
    },
    {
      q: { th: 'รับ HICAPS ไหม?', en: 'Do you support HICAPS shops?' },
      a: {
        th: 'ระบบอ้างอิงร้านนวดรองรับการบันทึกยอด Cash/Card/HICAPS ตามที่ร้านใช้งาน',
        en: 'The massage reference system can record Cash/Card/HICAPS as the shop uses them.',
      },
    },
    {
      q: { th: 'โดเมนรวมไหม?', en: 'Is a domain included?' },
      a: {
        th: 'Growth ขึ้นไปมีโดเมนปีแรกตามแพ็กเกจที่ตกลง',
        en: 'Growth and above include the first-year domain as agreed in the package.',
      },
    },
    {
      q: { th: 'เริ่มยังไง?', en: 'How do we start?' },
      a: {
        th: 'ใช้ชุดเครื่องมือฟรี หรือจอง Business Audit — คุยขอบเขตก่อน ไม่ใช่สมัครสมาชิกอัตโนมัติ',
        en: 'Use the free toolkit or book a Business Audit. Scope first — not an auto subscription.',
      },
    },
  ]
  const [open, setOpen] = useState(0)

  return (
    <section className="section" id="faq">
      <div className="container">
        <div className="kicker">FAQ</div>
        <h2>{t({ th: 'คำถามที่พบบ่อย', en: 'Questions shops actually ask' })}</h2>
        <div className="faq-list">
          {items.map((item, i) => (
            <details key={item.q.en} className="faq-item" open={open === i} onToggle={(e) => {
              if ((e.target as HTMLDetailsElement).open) setOpen(i)
            }}>
              <summary>{t(item.q)}</summary>
              <p>{t(item.a)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

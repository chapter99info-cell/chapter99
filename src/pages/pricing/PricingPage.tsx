import { Camera, Clapperboard, CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LanguageProvider, useTranslation } from '../../cinematic/i18n/LanguageContext'
import { squareFees, squareHardware, squarePlans, squareSetup } from '../../cinematic/data/packages'
import { Footer } from '../../components/home-v7/Footer'
import { MobileNav } from '../../components/home-v7/MobileNav'
import { PressIcon } from '../../components/home-v7/PressIcon'
import { StickyContact } from '../../components/home-v7/StickyContact'
import { pricing } from '../../content/pricing'
import { demoHref, pricingPage as copy } from '../../content/pricing-page'
import { v7Copy } from '../../content/v7'
import { setSeo } from '../../lib/seo'
import '../../styles/home-v7.css'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Anton&family=Anuphan:wght@500;600;700&family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans+Thai:wght@400;500&display=swap'

type Segment = 'massage' | 'restaurant'

function PricingInner() {
  const { lang, setLang, t } = useTranslation()
  const [segment, setSegment] = useState<Segment>('massage')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const links: HTMLLinkElement[] = []
    const add = (rel: string, href: string) => {
      const el = document.createElement('link')
      el.rel = rel
      el.href = href
      document.head.appendChild(el)
      links.push(el)
    }
    add('preconnect', 'https://fonts.googleapis.com')
    add('preconnect', 'https://fonts.gstatic.com')
    add('stylesheet', FONT_HREF)
    const title = lang === 'th' ? 'Chapter99 — ราคาชัด 2 แพ็กเกจ' : 'Chapter99 — Two clear packages'
    const description =
      lang === 'th'
        ? 'ค่าตั้งค่าครั้งแรก + รายเดือน · ตกลงขอบเขตก่อนเริ่ม Starter และ Professional'
        : 'One-time setup plus monthly. Scope agreed first. Starter and Professional.'
    setSeo({
      title,
      description,
      path: '/pricing',
      lang,
    })
    return () => links.forEach((l) => l.remove())
  }, [lang])

  const starterBullets = copy.starterBullets[segment]
  const proBullets = copy.proBullets[segment]

  return (
    <div className="home-v7 price-v7">
      <header className="nav price-v7__nav">
        <div className="wrap">
          <a className="logo" href="/">
            <img src="/mockup/media/web/logo.webp" alt="Chapter99" width={44} height={44} />
            CHAPTER99
          </a>
          <nav className="menu" aria-label={lang === 'th' ? 'เมนูหลัก' : 'Main'}>
            <a href="/#massage">{lang === 'th' ? 'ตัวอย่างร้าน' : 'Shops'}</a>
            <a href="#packages">{lang === 'th' ? 'ราคา' : 'Prices'}</a>
            <a href="#faq">{lang === 'th' ? 'คำถาม' : 'FAQ'}</a>
          </nav>
          <div className="price-lang" role="group" aria-label="Language">
            <button type="button" aria-pressed={lang === 'th'} onClick={() => setLang('th')}>
              TH
            </button>
            <button type="button" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>
              EN
            </button>
          </div>
          <button
            type="button"
            className="burger"
            aria-label={menuOpen ? (lang === 'th' ? 'ปิดเมนู' : 'Close menu') : lang === 'th' ? 'เปิดเมนู' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="v7-mnav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
      <section className="price-hero" id="top">
        <div className="wrap">
          <span className="kicker">{t(copy.eyebrow)}</span>
          <h1 className="th2">{t(copy.h1)}</h1>
          <p className="sub">{t(copy.sub)}</p>
        </div>
      </section>

      <section className="sec" id="packages">
        <div className="wrap">
          <div className="price-seg" role="tablist" aria-label={lang === 'th' ? 'ประเภทธุรกิจ' : 'Shop type'}>
            <button type="button" role="tab" aria-selected={segment === 'massage'} onClick={() => setSegment('massage')}>
              {t(copy.massage)}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={segment === 'restaurant'}
              onClick={() => setSegment('restaurant')}
            >
              {t(copy.restaurant)}
            </button>
          </div>
          <p className="price-swap">
            {t(copy.system[segment])}
            <a className="demo-tag" href={demoHref[segment]} target="_blank" rel="noopener noreferrer">
              {t(copy.demo)}
            </a>
          </p>

          <div className="xplans">
            <article className="plan" id="starter">
              <div className="plan__top">
                <h3>{pricing.starter.name}</h3>
              </div>
              <div className="amt">
                <b>{pricing.starter.setup}</b>
                <span>+ {pricing.starter.monthly} / {lang === 'th' ? 'เดือน' : 'mo'}</span>
              </div>
              <ul>
                {starterBullets.map((item) => (
                  <li key={item.en}>{t(item)}</li>
                ))}
              </ul>
              <a className="btn btn--dark" href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
                {t(copy.ctaFb)}
              </a>
            </article>
            <article className="plan plan--hi" id="professional">
              <div className="plan__top">
                <h3>{pricing.professional.name}</h3>
                <span className="badge">{t(copy.recommended)}</span>
              </div>
              <div className="amt">
                <b>{pricing.professional.setup}</b>
                <span>+ {pricing.professional.monthly} / {lang === 'th' ? 'เดือน' : 'mo'}</span>
              </div>
              <ul>
                {proBullets.map((item) => (
                  <li key={item.en}>{t(item)}</li>
                ))}
              </ul>
              <a className="btn btn--gold" href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
                {t(copy.ctaFb)}
              </a>
            </article>
          </div>

          <div className="xaddon price-addons">
            <span className="xtag">{t(copy.optional)}</span>
            <span>
              <PressIcon icon={Camera} label={t(copy.photo)} />
              {t(copy.photo)} <b>{pricing.addons.photography.price}</b>
            </span>
            <span>
              <PressIcon icon={Clapperboard} label={t(copy.reels)} />
              {t(copy.reels)} <b>{pricing.addons.reels.price}</b>
            </span>
            <span>
              <PressIcon icon={CreditCard} label={t(copy.square)} />
              {t(copy.square)} <b>{pricing.addons.square.price}</b> {t(copy.once)}
            </span>
          </div>

          <p className="price-inc">{t(copy.include)}</p>
          <p className="price-exc">{t(copy.exclude)}</p>

          <div className="price-square" id="square-setup">
            <p>{t(copy.squareLine)}</p>
            <details>
              <summary>{t(copy.details)}</summary>
              <SquareTables />
            </details>
          </div>
        </div>
      </section>

      <section className="sec" id="faq">
        <div className="wrap">
          <span className="kicker">{t(copy.faqKicker)}</span>
          <h2 className="th2">{t(copy.faqTitle)}</h2>
          <div className="price-faq">
            {copy.faqs.map((item) => (
              <details key={item.q.en}>
                <summary>{t(item.q)}</summary>
                <p>{t(item.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final price-final" id="contact">
        <div className="wrap">
          <h2 className="th2" style={{ color: '#fff' }}>
            {t(copy.close)}
          </h2>
          <div className="final__cta">
            <a className="btn btn--gold" href={v7Copy.contact.sms}>
              {t(copy.sms)}
            </a>
            <a className="btn btn--line" href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
              {t(copy.ctaFb)}
            </a>
          </div>
        </div>
      </section>
      </main>
      <Footer />
      <StickyContact heroSelector=".price-v7 .price-hero" />
    </div>
  )
}

function SquareTables() {
  const { t } = useTranslation()
  return (
    <div className="square-addon">
      <table className="square-table">
        <caption>{t({ th: 'แผนซอฟต์แวร์', en: 'Software plans' })}</caption>
        <thead>
          <tr>
            <th>{t({ th: 'แผน', en: 'Plan' })}</th>
            <th>{t({ th: 'รายเดือน', en: 'Monthly' })}</th>
            <th>{t({ th: 'รับชำระเงิน', en: 'Processing' })}</th>
          </tr>
        </thead>
        <tbody>
          {squarePlans.map((row) => (
            <tr key={row.plan}>
              <td>{row.plan}</td>
              <td>{t(row.monthly)}</td>
              <td>{t(row.processing)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="square-table">
        <caption>{t({ th: 'ค่าธรรมเนียมรับชำระ', en: 'Processing fees' })}</caption>
        <thead>
          <tr>
            <th>{t({ th: 'ประเภท', en: 'Type' })}</th>
            <th>{t({ th: 'อัตรา', en: 'Rate' })}</th>
          </tr>
        </thead>
        <tbody>
          {squareFees.map((row) => (
            <tr key={row.value + row.label.en}>
              <td>{t(row.label)}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="square-table">
        <caption>{t({ th: 'ฮาร์ดแวร์ (อาจเปลี่ยนได้)', en: 'Hardware (can change)' })}</caption>
        <thead>
          <tr>
            <th>{t({ th: 'รายการ', en: 'Item' })}</th>
            <th>{t({ th: 'ราคาอ้างอิง', en: 'Reference price' })}</th>
          </tr>
        </thead>
        <tbody>
          {squareHardware.map((row) => (
            <tr key={row.item}>
              <td>{row.item}</td>
              <td>{row.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>{t(squareSetup.surcharge)}</p>
      <p>{t(squareSetup.checked)}</p>
      <div className="pkg-cta-row">
        {squareSetup.sources.map((source) => (
          <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
            {source.label}
          </a>
        ))}
      </div>
    </div>
  )
}

export function PricingPage() {
  return (
    <LanguageProvider>
      <PricingInner />
    </LanguageProvider>
  )
}

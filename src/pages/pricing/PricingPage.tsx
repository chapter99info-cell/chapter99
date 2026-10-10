import { Camera, Clapperboard, CreditCard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LanguageProvider, useTranslation } from '../../cinematic/i18n/LanguageContext'
import { squareFees, squareHardware, squarePlans, squareSetup } from '../../cinematic/data/packages'
import { Footer } from '../../components/home-v7/Footer'
import { MobileNav } from '../../components/home-v7/MobileNav'
import { PressIcon } from '../../components/home-v7/PressIcon'
import { StickyContact } from '../../components/home-v7/StickyContact'
import {
  editsDisplay,
  hoursDisplay,
  isSegment,
  monthlyDisplay,
  plansFor,
  pricing,
  setupDisplay,
  type Segment,
} from '../../content/pricing'
import { demoHref, pricingPage as copy } from '../../content/pricing-page'
import { v7Copy } from '../../content/v7'
import { setSeo } from '../../lib/seo'
import '../../styles/home-v7.css'

function PricingInner() {
  const { lang, setLang, t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const tab = searchParams.get('tab')
  const [segment, setSegment] = useState<Segment>(isSegment(tab) ? tab : 'massage')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (isSegment(tab) && tab !== segment) setSegment(tab)
  }, [tab, segment])

  const selectSegment = (next: Segment) => {
    setSegment(next)
    if (next === 'massage') setSearchParams({}, { replace: true })
    else setSearchParams({ tab: next }, { replace: true })
  }

  useEffect(() => {
    const title = lang === 'th' ? 'Chapter99 — ราคาตามประเภทธุรกิจ' : 'Chapter99 — Prices by shop type'
    const description =
      lang === 'th'
        ? 'ร้านนวดและร้านอาหาร · ค่าตั้งค่า + รายเดือน รวม GST แล้ว'
        : 'Massage and restaurant packages. Setup plus monthly. GST included.'
    setSeo({
      title,
      description,
      path: '/pricing',
      lang,
    })
  }, [lang])

  const plans = plansFor(segment)

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
            <button type="button" role="tab" aria-selected={segment === 'massage'} onClick={() => selectSegment('massage')}>
              {t(copy.massage)}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={segment === 'restaurant'}
              onClick={() => selectSegment('restaurant')}
            >
              {t(copy.restaurant)}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={segment === 'photography'}
              onClick={() => selectSegment('photography')}
            >
              {t(copy.photography)}
            </button>
          </div>
          <p className="price-swap">
            {t(copy.system[segment])}
            {segment !== 'photography' ? (
              <a className="demo-tag" href={demoHref[segment]} target="_blank" rel="noopener noreferrer">
                {t(copy.demo)}
              </a>
            ) : null}
          </p>

          {segment === 'photography' ? <ApprovedPhotoStrip /> : null}

          <div className="xplans xplans--3">
            {plans.map((plan, index) => (
              <article
                key={plan.id}
                className={`plan${plan.badge ? ' plan--hi' : ''}`}
                id={plan.id}
              >
                <div className="plan__top">
                  <h3>{plan.label}</h3>
                  {plan.badge ? <span className="badge">{t(plan.badge)}</span> : null}
                </div>
                <div className="amt">
                  <b>{setupDisplay(plan, lang)}</b>
                  {monthlyDisplay(plan, lang) ? <span>{monthlyDisplay(plan, lang)}</span> : null}
                </div>
                <div className="amt-note">
                  {segment === 'photography' ? hoursDisplay(plan, lang) : editsDisplay(plan, lang)}
                </div>
                {plan.fit ? (
                  <p className="plan-fit">
                    {t(copy.fit)} {t(plan.fit)}
                  </p>
                ) : (
                  <ul>
                    {plan.bullets.map((item) => (
                      <li key={item.en}>{t(item)}</li>
                    ))}
                  </ul>
                )}
                <a
                  className={index === 1 ? 'btn btn--gold' : 'btn btn--dark'}
                  href={v7Copy.contact.facebookInbox}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t(copy.ctaFb)}
                </a>
                {segment === 'photography' ? (
                  <a className="btn btn--line plan-sms" href={v7Copy.contact.sms}>
                    {t(copy.sms)}
                  </a>
                ) : null}
              </article>
            ))}
          </div>

          {segment === 'photography' ? (
            <div className="photo-scope">
              {copy.photoScope.map((line) => (
                <p key={line.en}>{t(line)}</p>
              ))}
            </div>
          ) : (
            <p className="price-inc">{t(copy.gstLine)}</p>
          )}

          <div className="xaddon price-addons">
            <span className="xtag">{t(copy.optional)}</span>
            <a className="addon-link" href="/pricing?tab=photography">
              <PressIcon icon={Camera} label={t(copy.photo)} />
              {t(copy.photo)} <b>{pricing.addons.photography.price}</b>
            </a>
            <span>
              <PressIcon icon={Clapperboard} label={t(copy.reels)} />
              {t(copy.reels)} <b>{pricing.addons.reels.price}</b>
            </span>
            <span>
              <PressIcon icon={CreditCard} label={t(copy.square)} />
              {t(copy.square)} <b>{pricing.addons.squareSetup.price}</b> {t(copy.once)}
            </span>
            <p className="price-exc">{t(copy.addonNote)}</p>
          </div>

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

function ApprovedPhotoStrip() {
  const { t } = useTranslation()
  const [images, setImages] = useState<{ src: string; alt?: string }[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    fetch('/portfolio/approved/manifest.json')
      .then((res) => (res.ok ? res.json() : { images: [] }))
      .then((data: { images?: { src: string; alt?: string }[] }) => {
        setImages((data.images ?? []).filter((item) => item.src).slice(0, 6))
      })
      .catch(() => setImages([]))
      .finally(() => setReady(true))
  }, [])

  if (!ready) return null
  if (images.length === 0) {
    return (
      <p className="photo-fb">
        <a href={v7Copy.contact.facebook} target="_blank" rel="noopener noreferrer">
          {t(copy.fbWork)}
        </a>
      </p>
    )
  }
  return (
    <div className="photo-port" aria-label="ผลงานที่อนุมัติแล้ว">
      {images.map((item) => (
        <img key={item.src} src={item.src} alt={item.alt || ''} width={240} height={180} />
      ))}
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

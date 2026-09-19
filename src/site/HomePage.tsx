import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatAud, hardwareNote, publicPackages } from '../../config/pricing'
import { solutions } from '../data/solutions'
import { useTranslation } from '../cinematic/i18n/LanguageContext'
import { SiteLayout } from './SiteLayout'
import './homepage-approved.css'

const howSteps = [
  { n: '01', ic: '🔍', title: { th: 'ตรวจธุรกิจ', en: 'Business Check' }, body: { th: 'ดูว่าตอนนี้อยู่ตรงไหน และอะไรควรปรับ', en: 'See where you are and what may need attention.' } },
  { n: '02', ic: '📄', title: { th: 'เลือกแพ็กเกจ', en: 'Choose Your Setup' }, body: { th: 'เลือกแพ็กเกจที่เหมาะกับธุรกิจ', en: 'Choose the appropriate package.' } },
  { n: '03', ic: '🖼️', title: { th: 'ส่งข้อมูล', en: 'Provide Information' }, body: { th: 'ส่งข้อมูล เนื้อหา และรูปภาพที่อนุมัติแล้ว', en: 'Share approved content, details and photos.' } },
  { n: '04', ic: '⚙️', title: { th: 'เราสร้างและตั้งค่า', en: 'We Build & Configure' }, body: { th: 'Chapter99 สร้างและเชื่อมระบบดิจิทัลให้', en: 'Chapter99 builds and connects your system.' } },
  { n: '05', ic: '🚀', title: { th: 'ตรวจและเปิดใช้งาน', en: 'Review & Launch' }, body: { th: 'เจ้าของตรวจสอบก่อนเปิดจริง', en: 'You review before going live.' } },
  { n: '06', ic: '📊', title: { th: 'ดูแลต่อเนื่อง', en: 'Ongoing Care' }, body: { th: 'ดูแลระบบตามที่ตกลงกัน', en: 'We maintain the agreed infrastructure.' } },
] as const

const trustOwn = [
  { th: 'โดเมน', en: 'Domain' },
  { th: 'Google Business Profile', en: 'Google Business Profile' },
  { th: 'บัญชีผู้ให้บริการรับชำระเงิน', en: 'Payment-provider accounts' },
  { th: 'บัญชีโซเชียล', en: 'Social accounts' },
  { th: 'เนื้อหาธุรกิจ', en: 'Business content' },
] as const

const principles = [
  { title: { th: 'คุณเป็นเจ้าของ', en: 'You Own It' }, body: { th: 'บัญชีของคุณ ข้อมูลของคุณ ธุรกิจของคุณ', en: 'Your accounts, your data, your business.' } },
  { title: { th: 'เราช่วยดูแลการใช้งาน', en: 'We Help Operate It' }, body: { th: 'ตั้งค่า เชื่อมระบบ อัปเดต และซัพพอร์ตตามที่ตกลง', en: 'Setup, integrations, updates and agreed support.' } },
  { title: { th: 'สร้างเพื่อความต่อเนื่อง', en: 'Built for Continuity' }, body: { th: 'กระบวนการที่เชื่อถือได้ สำรองข้อมูล และตรวจสอบเท่าที่เกี่ยวข้อง — ไม่รับประกัน uptime ทั้งวัน', en: 'Reliable processes, backups and monitoring where applicable — not a 24/7 uptime promise.' } },
  { title: { th: 'AI ช่วย คนตรวจ', en: 'AI-Assisted. Human-Reviewed.' }, body: { th: 'ระบบอัตโนมัติช่วยลดงานซ้ำ ส่วนเรื่องสำคัญยังมีคนดูแล', en: 'Automation reduces repetitive work while important actions keep human oversight.' } },
] as const

const checkAreas = [
  { th: 'Google', en: 'Google presence' },
  { th: 'เว็บไซต์บนมือถือ', en: 'Mobile website' },
  { th: 'บริการ / เมนูชัดเจน', en: 'Clear services / menu' },
  { th: 'ช่องทางจอง / สั่ง', en: 'Booking / order path' },
  { th: 'ช่องทางชำระเงิน', en: 'Payment path' },
  { th: 'รูปถ่ายจริง', en: 'Real photography' },
  { th: 'ช่องทางติดต่อ', en: 'Customer contact' },
  { th: 'รีวิว', en: 'Reviews' },
] as const

function HomeInner() {
  const { t } = useTranslation()
  const [active, setActive] = useState(0)
  const current = solutions[active]

  useEffect(() => {
    document.title = t({
      th: 'Chapter99 — พาธุรกิจของคุณขึ้นออนไลน์',
      en: 'Chapter99 — Bring Your Business to Life Online',
    })
  }, [t])

  return (
    <main className="home-approved" id="top">
      <section className="hp-hero" aria-labelledby="hp-hero-title">
        <div className="hp-wrap hp-hero-grid">
          <div>
            <p className="hp-eyebrow">{t({ th: 'ธุรกิจไทยในออสเตรเลีย', en: 'Thai businesses in Australia' })}</p>
            <h1 id="hp-hero-title">
              {t({ th: 'พาธุรกิจของคุณ', en: 'Bring Your Business to' })}{' '}
              <em>{t({ th: 'ขึ้นออนไลน์อย่างมีชีวิตชีวา', en: 'Life Online.' })}</em>
            </h1>
            <p className="hp-sub">
              {t({
                th: 'ตั้งแต่ภาพลักษณ์ของธุรกิจ ไปจนถึงวิธีที่ธุรกิจทำงาน',
                en: 'From the way your business looks, to the way it works.',
              })}
            </p>
            <p className="hp-lead">
              {t({
                th: 'Chapter99 ช่วยเจ้าของธุรกิจไทยในออสเตรเลียให้ดูมืออาชีพ ถูกค้นเจอ รับจองหรือรับออเดอร์ รับชำระเงิน และดำเนินงานต่อเนื่อง ด้วยเครื่องมือที่ใช้ง่ายและทีมที่พร้อมช่วย',
                en: 'Chapter99 helps Thai business owners in Australia look professional, get found, get booked or ordered, get paid and keep running — with simple tools and friendly support.',
              })}
            </p>
            <div className="hp-cta-row">
              <a className="hp-btn hp-btn-dark" href="#check">
                {t({ th: 'ตรวจธุรกิจของฉัน', en: 'Check My Business' })}
              </a>
              <a className="hp-btn hp-btn-line" href="#how">
                {t({ th: 'ดูวิธีการทำงาน', en: 'See How It Works' })}
              </a>
            </div>
          </div>
          <div
            className="hp-visual"
            role="img"
            aria-label={t({
              th: 'ตัวอย่างหน้าเว็บร้านนวดบนมือถือ ข้อมูลสมมติ',
              en: 'Placeholder illustration of a wellness business page on a phone (sample data)',
            })}
          >
            <span className="hp-tag hp-demo-flag">Placeholder image</span>
            <div className="hp-side" aria-hidden="true">
              <span>{t({ th: 'จองง่ายขึ้น', en: 'Easier booking' })}</span>
              <span>{t({ th: 'ลูกค้าติดต่อสะดวก', en: 'Clear contact' })}</span>
              <span>{t({ th: 'ธุรกิจดูน่าเชื่อถือ', en: 'A stronger look' })}</span>
            </div>
            <div className="hp-phone" aria-hidden="true">
              <div className="hp-screen">
                <div className="hp-status">
                  <span>9:41</span>
                  <span>●●●</span>
                </div>
                <h3>Sample Thai Massage</h3>
                <div className="hp-rate">★ Rating shown here is SAMPLE · Sydney</div>
                <div className="hp-cover">Photo placeholder</div>
                <div className="hp-acts">
                  <span>Book Now</span>
                  <span>Services</span>
                  <span>Contact</span>
                </div>
                <div className="hp-svc">
                  <span>Thai Massage</span>
                  <span>60 min</span>
                </div>
                <div className="hp-svc">
                  <span>Aromatherapy</span>
                  <span>60 min</span>
                </div>
                <div className="hp-svc">
                  <span>Foot Massage</span>
                  <span>45 min</span>
                </div>
                <div className="hp-book">Book Now</div>
              </div>
            </div>
            <span className="hp-ph-note">
              {t({
                th: 'ข้อมูลตัวอย่างเท่านั้น — ภาพถ่ายลูกค้าจริงจะใส่ทีหลัง',
                en: 'Demo data only — production will use real client photography.',
              })}
            </span>
          </div>
        </div>
      </section>

      <section className="hp-sec" id="solutions" aria-labelledby="hp-sol-title">
        <div className="hp-wrap">
          <div className="hp-head">
            <div>
              <h2 id="hp-sol-title">{t({ th: 'โซลูชันสำหรับธุรกิจของคุณ', en: 'Solutions for Your Business' })}</h2>
              <p>{t({ th: 'ธุรกิจต่างกัน แต่ใช้ระบบที่ทรงพลังเดียวกัน', en: 'Different businesses. Same powerful system.' })}</p>
            </div>
            <span className="hp-arrow">{t({ th: 'เลือกประเภทธุรกิจ →', en: 'Choose your industry →' })}</span>
          </div>
          <div className="hp-ind-grid" role="list">
            {solutions.map((item, index) => (
              <Link
                key={item.slug}
                role="listitem"
                className={`hp-ind${index === active ? ' is-on' : ''}`}
                to={item.href}
                onFocus={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
              >
                <div className="hp-img" style={{ background: item.imageBg }} aria-hidden="true">
                  {item.icon}
                </div>
                <div className="hp-txt">
                  <h3>{t(item.name)}</h3>
                  <p>{t(item.desc)}</p>
                  <span className="hp-go">{item.href} →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="hp-journey" aria-live="polite">
            <div className="hp-eyebrow">
              {t(current.name)} — {t({ th: 'เส้นทางลูกค้า (ตัวอย่าง)', en: 'customer journey (sample)' })}
            </div>
            <div className="hp-jsteps">
              {current.journey.map((step, i) => (
                <span key={step.en} style={{ display: 'contents' }}>
                  {i > 0 ? (
                    <span className="ar" aria-hidden="true">
                      →
                    </span>
                  ) : null}
                  <span className="st">{t(step)}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <aside className="hp-slot" id="toolkit-slot">
        {t({
          th: 'ช่อง Free Toolkit (งานแยก) — ยังไม่สร้างในรอบนี้',
          en: 'Free Toolkit teaser slot — built in a separate task. Do not implement here.',
        })}
      </aside>

      <section className="hp-sec hp-how" id="how" aria-labelledby="hp-how-title">
        <div className="hp-wrap">
          <h2 id="hp-how-title">{t({ th: 'Chapter99 ทำงานอย่างไร', en: 'How Chapter99 Works' })}</h2>
          <p style={{ color: 'var(--muted)', margin: '8px 0 0' }}>
            {t({ th: 'ขั้นตอนง่าย ๆ ตั้งแต่เริ่มจนพร้อมใช้งาน', en: 'A simple process from start to success.' })}
          </p>
          <ol className="hp-steps">
            {howSteps.map((step) => (
              <li className="hp-step" key={step.n}>
                <div className="ic" aria-hidden="true">
                  {step.ic}
                </div>
                <h3>
                  <span>{step.n}</span>
                  {t(step.title)}
                </h3>
                <p>{t(step.body)}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="hp-sec" id="about-trust" aria-labelledby="hp-trust-title">
        <div className="hp-wrap hp-trust-grid">
          <div className="hp-trust-dark">
            <h2 id="hp-trust-title">
              {t({ th: 'ธุรกิจของคุณ', en: 'Your Business' })}
              <br />
              <em>{t({ th: 'ยังเป็นของคุณ', en: 'Stays Yours.' })}</em>
            </h2>
            <p>{t({ th: 'เจ้าของธุรกิจยังคงควบคุมสิ่งสำคัญเหล่านี้:', en: 'You keep control of your:' })}</p>
            <ul>
              {trustOwn.map((item) => (
                <li key={item.en}>{t(item)}</li>
              ))}
            </ul>
            <Link className="hp-btn hp-btn-light" to="/about">
              {t({ th: 'เรียนรู้เพิ่มเติม', en: 'Learn More' })}
            </Link>
          </div>
          <div className="hp-princ">
            {principles.map((item) => (
              <article className="hp-pr" key={item.title.en}>
                <h3>{t(item.title)}</h3>
                <p>{t(item.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hp-sec" id="pricing" aria-labelledby="hp-price-title" style={{ paddingTop: 0 }}>
        <div className="hp-wrap">
          <h2 id="hp-price-title">{t({ th: 'แพ็กเกจเรียบง่าย ผลลัพธ์ชัดเจน', en: 'Simple Packages. Big Impact.' })}</h2>
          <p style={{ color: 'var(--muted)', margin: '8px 0 0' }}>
            {t({ th: 'เลือกแพ็กเกจที่เหมาะกับระยะของธุรกิจ', en: 'Choose the package that fits your business stage.' })}
          </p>
          <div className="hp-price-grid">
            {publicPackages.map((plan) => (
              <article
                key={plan.id}
                id={plan.id}
                className={`hp-plan${plan.featured ? ' feat' : ''}${plan.comingSoon ? ' soon' : ''}`}
              >
                <h3>{plan.name}</h3>
                {plan.comingSoon || plan.setupAud == null || plan.monthlyAud == null ? (
                  <p>
                    <span className="hp-tag" style={{ background: 'var(--green)' }}>
                      {t({ th: 'เร็ว ๆ นี้', en: 'Coming Soon' })}
                    </span>
                  </p>
                ) : (
                  <div className="hp-price">
                    <b>{formatAud(plan.setupAud)}</b>
                    <span>{t({ th: 'ค่าติดตั้ง', en: 'setup' })}</span>
                    <i>+</i>
                    <b>{formatAud(plan.monthlyAud)}</b>
                    <span>{t({ th: '/ เดือน', en: '/ month' })}</span>
                  </div>
                )}
                <p>{t(plan.blurb)}</p>
                <Link className={plan.comingSoon ? 'hp-btn hp-btn-line' : 'hp-btn hp-btn-dark'} to="/contact">
                  {t(plan.cta)}
                </Link>
              </article>
            ))}
          </div>
          <p className="hp-note">{t(hardwareNote)}</p>
        </div>
      </section>

      <section className="hp-sec" id="check" aria-labelledby="hp-check-title" style={{ paddingTop: 0 }}>
        <div className="hp-wrap">
          <div className="hp-check">
            <div>
              <h2 id="hp-check-title">
                {t({ th: 'ประตูหน้าดิจิทัลของคุณพร้อมแค่ไหน?', en: 'How ready is your digital front door?' })}
              </h2>
              <p>
                {t({
                  th: 'ดูอย่างรวดเร็วว่าลูกค้าค้นเจอ เข้าใจ และดำเนินการกับธุรกิจของคุณได้ง่ายเพียงใด',
                  en: 'Get a quick look at how easy it is for customers to find, understand and take action with your business.',
                })}
              </p>
              <ul className="hp-ticks">
                {checkAreas.map((item) => (
                  <li key={item.en}>{t(item)}</li>
                ))}
              </ul>
            </div>
            <div className="hp-check-side">
              <div className="hp-eyebrow" style={{ color: '#a9c3b5' }}>
                {t({ th: 'ใช้เวลาไม่กี่นาที', en: 'Takes only a few minutes' })}
              </div>
              <button className="hp-btn hp-btn-light" type="button" disabled>
                {t({ th: 'ตรวจธุรกิจของฉัน', en: 'Check My Business' })}
              </button>
              <small>
                {t({
                  th: 'ยังไม่เชื่อมต่อ — ยังไม่มีผลประเมินอัตโนมัติ',
                  en: 'Not connected yet — no assessment results are generated.',
                })}
              </small>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default function HomePage() {
  return (
    <SiteLayout>
      <HomeInner />
    </SiteLayout>
  )
}

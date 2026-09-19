import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { formatAud, hardwareNote, publicPackages } from '../../config/pricing'
import { useTranslation } from '../cinematic/i18n/LanguageContext'
import { SiteLayout } from '../site/SiteLayout'
import '../site/homepage-approved.css'

export function SitePricingPage() {
  return (
    <SiteLayout>
      <PricingInner />
    </SiteLayout>
  )
}

function PricingInner() {
  const { t } = useTranslation()
  useEffect(() => {
    document.title = t({ th: 'Chapter99 — แพ็กเกจและราคา', en: 'Chapter99 — Packages & Pricing' })
  }, [t])

  return (
      <main className="home-approved" id="packages">
        <section className="hp-sec" aria-labelledby="price-title">
          <div className="hp-wrap">
            <p className="hp-eyebrow">Chapter99</p>
            <h1 id="price-title" style={{ fontSize: 'clamp(34px,5vw,56px)', margin: '10px 0 8px' }}>
              {t({ th: 'แพ็กเกจเรียบง่าย ผลลัพธ์ชัดเจน', en: 'Simple Packages. Big Impact.' })}
            </h1>
            <p className="hp-note" style={{ marginTop: 0 }}>
              {t({
                th: 'เลือกแพ็กเกจที่เหมาะกับระยะของธุรกิจ — เราตั้งค่าให้ คุณยังเป็นเจ้าของบัญชีและข้อมูลทั้งหมด',
                en: 'Choose the package that fits your business stage. We set things up — you keep ownership of your accounts and data.',
              })}
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
            <div className="hp-next">
              <span>{t({ th: 'ไม่แน่ใจว่าเริ่มตรงไหน? ตรวจความพร้อมของธุรกิจก่อนได้ฟรี', en: 'Not sure where to start? Check your digital readiness first — it’s free.' })}</span>
              <Link className="hp-btn hp-btn-dark" to="/business-check">
                {t({ th: 'ตรวจธุรกิจของฉัน', en: 'Check My Business' })}
              </Link>
            </div>
          </div>
        </section>
      </main>
  )
}

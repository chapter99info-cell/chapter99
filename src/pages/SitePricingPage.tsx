import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  formatAud,
  hardwareNote,
  photoNotes,
  photoPackages,
  pricingLineFromHash,
  pricingLines,
  publicPackages,
  squareSetup,
  squareSetupAud,
  type PricingLineId,
} from '../../config/pricing'
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
  const location = useLocation()
  const navigate = useNavigate()
  const [line, setLine] = useState<PricingLineId>(() => pricingLineFromHash(location.hash))

  useEffect(() => {
    document.title = t({ th: 'Chapter99 — แพ็กเกจและราคา', en: 'Chapter99 — Packages & Pricing' })
  }, [t])

  useEffect(() => {
    setLine(pricingLineFromHash(location.hash))
  }, [location.hash])

  function pickLine(next: PricingLineId) {
    setLine(next)
    const row = pricingLines.find((item) => item.id === next)
    navigate({ pathname: '/pricing', hash: row?.hash ?? next }, { replace: true })
  }

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
              th: 'เลือกลายงานก่อน แล้วดูราคาของสายนั้น — เว็บ ช่างภาพ และ Square เป็นคนละสินค้า',
              en: 'Pick a service line first, then see that line’s prices. Web, photography and Square are separate products.',
            })}
          </p>
          <div className="hp-tabs" role="tablist" aria-label={t({ th: 'ลายงาน', en: 'Service lines' })}>
            {pricingLines.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={line === item.id}
                aria-controls={`panel-${item.id}`}
                className={`hp-tab${line === item.id ? ' is-on' : ''}`}
                onClick={() => pickLine(item.id)}
              >
                {t(item.label)}
              </button>
            ))}
          </div>

          {line === 'web' ? (
            <div id="panel-web" role="tabpanel" aria-labelledby="tab-web">
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
                        <span className="hp-tag">{t({ th: 'เร็ว ๆ นี้', en: 'Coming Soon' })}</span>
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
          ) : null}

          {line === 'photo' ? (
            <div id="panel-photo" role="tabpanel" aria-labelledby="tab-photo">
              <h2 className="hp-line-title">{t(photoNotes.heading)}</h2>
              <p className="hp-note" style={{ marginTop: 0 }}>{t(photoNotes.sub)}</p>
              <div className="hp-price-grid">
                {photoPackages.map((plan) => (
                  <article key={plan.id} id={plan.id} className={`hp-plan${plan.featured ? ' feat' : ''}`}>
                    <h3>{t(plan.name)}</h3>
                    <div className="hp-price">
                      <b>{formatAud(plan.amountAud)}</b>
                      <span>{t(plan.unit)}</span>
                    </div>
                    <p>{t(plan.blurb)}</p>
                    <ul className="hp-rate-list">
                      {plan.rates.map((rate) => (
                        <li key={`${plan.id}-${rate.amountAud}-${rate.label.en}`}>
                          {t(rate.label)} — {formatAud(rate.amountAud)} {t(rate.unit)}
                        </li>
                      ))}
                    </ul>
                    <Link className={plan.featured ? 'hp-btn hp-btn-dark' : 'hp-btn hp-btn-line'} to="/contact">
                      {t(plan.cta)}
                    </Link>
                  </article>
                ))}
              </div>
              <p className="hp-note">{t(photoNotes.ai)}</p>
            </div>
          ) : null}

          {line === 'square' ? (
            <div id="panel-square" role="tabpanel" aria-labelledby="tab-square">
              <article id="square-setup" className="hp-plan feat hp-plan-wide">
                <p className="hp-eyebrow">{t(squareSetup.tag)}</p>
                <h3>{t(squareSetup.title)}</h3>
                <div className="hp-price">
                  <b>{formatAud(squareSetupAud)}</b>
                  <span>{t(squareSetup.unit)}</span>
                </div>
                <p>{t(squareSetup.subtitle)}</p>
                <ul className="hp-rate-list">
                  {squareSetup.items.map((item) => (
                    <li key={item.en}>{t(item)}</li>
                  ))}
                </ul>
                <p>{t(squareSetup.ownership)}</p>
                <p className="hp-note">{t(squareSetup.feeNote)}</p>
                <p className="hp-note">{t(squareSetup.surcharge)}</p>
                <p className="hp-note">{t(hardwareNote)}</p>
                <Link className="hp-btn hp-btn-dark" to="/contact">
                  {t(squareSetup.cta)}
                </Link>
              </article>
            </div>
          ) : null}

          <div className="hp-next">
            <span>
              {t({
                th: 'ไม่แน่ใจว่าเริ่มตรงไหน? ตรวจความพร้อมของธุรกิจก่อนได้ฟรี',
                en: 'Not sure where to start? Check your digital readiness first — it’s free.',
              })}
            </span>
            <Link className="hp-btn hp-btn-dark" to="/business-check">
              {t({ th: 'ตรวจธุรกิจของฉัน', en: 'Check My Business' })}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

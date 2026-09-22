import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  bundleNotes,
  bundlePackages,
  brandCategoryNote,
  brandPackages,
  budgetFitNote,
  categories,
  categoryFromHash,
  experienceNote,
  familyPackages,
  familyPriceFromNote,
  formatAud,
  hardwareNote,
  personalBrandPending,
  portfolioLinks,
  profilePackages,
  profileSourceUrl,
  publicPackages,
  squareSetup,
  squareSetupAud,
  valueChecklist,
  valueSectionTitle,
  webScopeNote,
  weddingGstNote,
  weddingPackages,
  weddingScopeNote,
  weddingSourceUrl,
  buildContactHref,
  type CategoryId,
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
  const [category, setCategory] = useState<CategoryId>(() => categoryFromHash(location.hash))
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  useEffect(() => {
    document.title = t({ th: 'Chapter99 — แพ็กเกจและราคา', en: 'Chapter99 — Packages & Pricing' })
  }, [t])

  useEffect(() => {
    setCategory(categoryFromHash(location.hash))
  }, [location.hash])

  function pickCategory(next: CategoryId, focus = false) {
    setCategory(next)
    const row = categories.find((item) => item.id === next)
    navigate({ pathname: '/pricing', hash: row?.hash ?? next }, { replace: true })
    if (focus) tabRefs.current[next]?.focus()
  }

  function onTabKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const dir = e.key === 'ArrowRight' ? 1 : -1
      const next = categories[(index + dir + categories.length) % categories.length]
      pickCategory(next.id, true)
    } else if (e.key === 'Home') {
      e.preventDefault()
      pickCategory(categories[0].id, true)
    } else if (e.key === 'End') {
      e.preventDefault()
      pickCategory(categories[categories.length - 1].id, true)
    }
  }

  return (
    <main className="home-approved" id="packages">
      <section className="hp-sec" aria-labelledby="price-title">
        <div className="hp-wrap">
          <p className="hp-eyebrow">Chapter99</p>
          <h1 id="price-title" style={{ fontSize: 'clamp(34px,5vw,56px)', margin: '10px 0 8px' }}>
            {t({ th: 'เลือกงานที่ใช่ ในงบที่วางแผนได้', en: 'Choose the right work, for a budget you can plan.' })}
          </h1>
          <p className="hp-note" style={{ marginTop: 0, fontSize: 15 }}>
            {t({
              th: 'ภาพนิ่ง วิดีโอ และเว็บไซต์ เลือกแยกหรือทำร่วมกันได้ พร้อมขอบเขตงานและรายการส่งมอบที่ชัดเจน',
              en: 'Photos, video and websites — pick them separately or together, each with a clear scope and deliverables.',
            })}
          </p>

          <div
            className="hp-tabs hp-tabs-scroll"
            role="tablist"
            aria-label={t({ th: 'หมวดบริการ', en: 'Service categories' })}
          >
            {categories.map((item, index) => (
              <button
                key={item.id}
                ref={(el) => {
                  tabRefs.current[item.id] = el
                }}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                tabIndex={category === item.id ? 0 : -1}
                aria-selected={category === item.id}
                aria-controls={`panel-${item.id}`}
                className={`hp-tab${category === item.id ? ' is-on' : ''}`}
                onClick={() => pickCategory(item.id)}
                onKeyDown={(e) => onTabKeyDown(e, index)}
              >
                {t(item.label)}
              </button>
            ))}
          </div>

          {category === 'web' ? <WebPanel /> : null}
          {category === 'brand' ? <BrandPanel /> : null}
          {category === 'profile-family' ? <ProfileFamilyPanel /> : null}
          {category === 'wedding' ? <WeddingPanel /> : null}
          {category === 'bundle' ? <BundlePanel /> : null}

          <ValueSection />
          <BudgetFitSection />

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

function PortfolioLink({ category }: { category: CategoryId }) {
  const { t } = useTranslation()
  const link = portfolioLinks[category]
  const label = t({ th: 'ดูผลงาน', en: 'See portfolio' })
  if (link.external) {
    return (
      <a className="hp-btn hp-btn-line" href={link.href as string} target="_blank" rel="noopener noreferrer">
        {label} ↗
      </a>
    )
  }
  return (
    <Link className="hp-btn hp-btn-line" to={link.href as string}>
      {label}
    </Link>
  )
}

function WebPanel() {
  const { t } = useTranslation()
  return (
    <div id="panel-web" role="tabpanel" aria-labelledby="tab-web">
      <h2 className="hp-line-title">{t({ th: 'เว็บไซต์และระบบ', en: 'Website & systems' })}</h2>
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
                <span className="hp-tag">{t({ th: 'เร็ว ๆ นี้ / ติดต่อประเมิน', en: 'Coming soon / contact for a quote' })}</span>
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
            <Link className={plan.comingSoon ? 'hp-btn hp-btn-line' : 'hp-btn hp-btn-dark'} to="/contact?need=shop">
              {t(plan.cta)}
            </Link>
          </article>
        ))}
      </div>
      <p className="hp-note">{t(webScopeNote)}</p>

      <article id="square-setup" className="hp-plan hp-plan-wide" style={{ marginTop: 24 }}>
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
        <p className="hp-note">{t(hardwareNote)}</p>
        <Link className="hp-btn hp-btn-dark" to="/contact?need=shop">
          {t(squareSetup.cta)}
        </Link>
      </article>

      <div className="hp-cat-links">
        <PortfolioLink category="web" />
      </div>
    </div>
  )
}

function BrandPanel() {
  const { t } = useTranslation()
  return (
    <div id="panel-brand" role="tabpanel" aria-labelledby="tab-brand">
      <h2 className="hp-line-title">{t({ th: 'ภาพ + วิดีโอธุรกิจ', en: 'Brand photo + video' })}</h2>
      <p className="hp-note" style={{ marginTop: 0 }}>
        {t({
          th: 'เวลาที่ระบุคือเวลารวมสำหรับภาพและวิดีโอในเซสชันนั้น',
          en: 'Listed shoot time is the total time covering both photo and video in that session.',
        })}
      </p>
      <div className="hp-price-grid">
        {brandPackages.map((plan) => (
          <article key={plan.id} id={plan.id} className={`hp-plan${plan.featured ? ' feat' : ''}`}>
            <h3>{t(plan.name)}</h3>
            <div className="hp-price">
              <b>{formatAud(plan.amountAud)}</b>
              <span>{t(plan.unit)}</span>
            </div>
            <p>{t(plan.recommendedFor)}</p>
            <ul className="hp-rate-list">
              {plan.includes.map((item) => (
                <li key={item.en}>{t(item)}</li>
              ))}
            </ul>
            <Link className={plan.featured ? 'hp-btn hp-btn-dark' : 'hp-btn hp-btn-line'} to={buildContactHref('brand', t(plan.name))}>
              {t({ th: 'เลือกแพ็กนี้', en: 'Choose this package' })}
            </Link>
          </article>
        ))}
      </div>
      <p className="hp-note">{t(brandCategoryNote)}</p>
      <div className="hp-cat-links">
        <PortfolioLink category="brand" />
      </div>
    </div>
  )
}

function ProfileFamilyPanel() {
  const { t } = useTranslation()
  return (
    <div id="panel-profile-family" role="tabpanel" aria-labelledby="tab-profile-family">
      <h2 className="hp-line-title">{t({ th: 'โปรไฟล์และครอบครัว', en: 'Profile & family' })}</h2>

      <h3 className="hp-sub-title">{t({ th: 'Profile', en: 'Profile' })}</h3>
      <div className="hp-price-grid">
        {profilePackages.map((plan) => (
          <article key={plan.id} id={plan.id} className={`hp-plan${plan.featured ? ' feat' : ''}`}>
            <h3>{t(plan.name)}</h3>
            <div className="hp-price">
              <b>{formatAud(plan.amountAud)}</b>
            </div>
            <ul className="hp-rate-list">
              <li>{t(plan.duration)}</li>
              <li>{t(plan.deliverable)}</li>
            </ul>
            <p>{t(plan.recommendedFor)}</p>
            <Link className={plan.featured ? 'hp-btn hp-btn-dark' : 'hp-btn hp-btn-line'} to={buildContactHref('profile-family', `Profile ${t(plan.name)}`)}>
              {t({ th: 'เลือกแพ็กนี้', en: 'Choose this package' })}
            </Link>
          </article>
        ))}
      </div>

      <h3 className="hp-sub-title" style={{ marginTop: 32 }}>{t({ th: 'Family', en: 'Family' })}</h3>
      <div className="hp-price-grid">
        {familyPackages.map((plan) => (
          <article key={plan.id} id={plan.id} className={`hp-plan${plan.featured ? ' feat' : ''}`}>
            <h3>{t(plan.name)}</h3>
            <div className="hp-price">
              <b>{t({ th: `เริ่ม ${formatAud(plan.amountAud)}`, en: `From ${formatAud(plan.amountAud)}` })}</b>
            </div>
            <ul className="hp-rate-list">
              <li>{t(plan.duration)}</li>
              {plan.extra ? <li>{t(plan.extra)}</li> : null}
            </ul>
            <p>{t(plan.recommendedFor)}</p>
            <Link className={plan.featured ? 'hp-btn hp-btn-dark' : 'hp-btn hp-btn-line'} to={buildContactHref('profile-family', `Family ${t(plan.name)}`)}>
              {t({ th: 'เลือกแพ็กนี้', en: 'Choose this package' })}
            </Link>
          </article>
        ))}
      </div>
      <p className="hp-note">{t(familyPriceFromNote)}</p>

      <h3 className="hp-sub-title" style={{ marginTop: 32 }}>{t(personalBrandPending.title)}</h3>
      <article id="personal-brand" className="hp-plan hp-plan-wide soon">
        <span className="hp-tag">{t({ th: 'ยังไม่เปิดขาย', en: 'Not yet for sale' })}</span>
        <p>{t(personalBrandPending.body)}</p>
        <p className="hp-note">{t(personalBrandPending.clipNote)}</p>
        <a className="hp-btn hp-btn-line" href={profileSourceUrl} target="_blank" rel="noopener noreferrer">
          {t(personalBrandPending.cta)} ↗
        </a>
      </article>

      <div className="hp-cat-links">
        <PortfolioLink category="profile-family" />
      </div>
    </div>
  )
}

function WeddingPanel() {
  const { t } = useTranslation()
  return (
    <div id="panel-wedding" role="tabpanel" aria-labelledby="tab-wedding">
      <h2 className="hp-line-title">{t({ th: 'งานแต่ง', en: 'Wedding' })}</h2>
      <p className="hp-note" style={{ marginTop: 0 }}>{t(weddingGstNote)}</p>
      <div className="hp-price-grid">
        {weddingPackages.map((plan) => (
          <article key={plan.id} id={plan.id} className={`hp-plan${plan.featured ? ' feat' : ''}`}>
            <h3>{t(plan.name)}</h3>
            <div className="hp-price-stack">
              {plan.rates.map((rate) => (
                <div className="hp-price" key={`${plan.id}-${rate.amountAud}`}>
                  <b>{formatAud(rate.amountAud)}</b>
                  <span>{t(rate.unit)}</span>
                </div>
              ))}
            </div>
            <ul className="hp-rate-list">
              <li>{t({ th: `ช่างภาพ ${plan.photographers} คน`, en: `${plan.photographers} photographer${plan.photographers > 1 ? 's' : ''}` })}</li>
              <li>{t(plan.album)}</li>
            </ul>
            <p>{t(plan.recommendedFor)}</p>
            <Link className={plan.featured ? 'hp-btn hp-btn-dark' : 'hp-btn hp-btn-line'} to={buildContactHref('wedding', t(plan.name))}>
              {t({ th: 'เลือกแพ็กนี้', en: 'Choose this package' })}
            </Link>
          </article>
        ))}
      </div>
      <p className="hp-note">{t(weddingScopeNote)}</p>
      <div className="hp-cat-links">
        <a className="hp-btn hp-btn-line" href={weddingSourceUrl} target="_blank" rel="noopener noreferrer">
          {t({ th: 'ดูผลงานแต่งงาน', en: 'See wedding portfolio' })} ↗
        </a>
        <Link className="hp-btn hp-btn-dark" to={buildContactHref('wedding', 'Availability check')}>
          {t({ th: 'สอบถามวันว่าง', en: 'Check availability' })}
        </Link>
      </div>
    </div>
  )
}

function BundlePanel() {
  const { t } = useTranslation()
  return (
    <div id="panel-bundle" role="tabpanel" aria-labelledby="tab-bundle">
      <h2 className="hp-line-title">{t({ th: 'ภาพ + เว็บ', en: 'Photo + web' })}</h2>
      <p className="hp-note" style={{ marginTop: 0 }}>
        {t({
          th: 'นำราคาของแพ็กเว็บและแพ็กภาพมารวมกันอย่างโปร่งใส ไม่ใช่ราคาส่วนลดพิเศษ',
          en: 'These figures transparently add up an existing web plan and photo plan — not a special discount price.',
        })}
      </p>
      <div className="hp-price-grid">
        {bundlePackages.map((plan) => (
          <article key={plan.id} id={plan.id} className={`hp-plan${plan.featured ? ' feat' : ''}`}>
            <h3>{t(plan.name)}</h3>
            <ul className="hp-rate-list">
              {plan.lineItems.map((li) => (
                <li key={li.en}>{t(li)}</li>
              ))}
            </ul>
            <div className="hp-price">
              <b>{formatAud(plan.totalAud)}</b>
              {plan.monthlyAud ? (
                <>
                  <i>+</i>
                  <b>{formatAud(plan.monthlyAud)}</b>
                  <span>{t({ th: '/ เดือน', en: '/ month' })}</span>
                </>
              ) : null}
            </div>
            <p className="hp-bundle-total-label">{t(plan.totalLabel)}</p>
            <p>{t(plan.shoots)}</p>
            <Link className={plan.featured ? 'hp-btn hp-btn-dark' : 'hp-btn hp-btn-line'} to={buildContactHref('bundle', t(plan.name))}>
              {t({ th: 'เลือกแพ็กนี้', en: 'Choose this package' })}
            </Link>
          </article>
        ))}
      </div>
      <ul className="hp-rate-list" style={{ marginTop: 18 }}>
        {bundleNotes.map((n) => (
          <li key={n.en}>{t(n)}</li>
        ))}
      </ul>
      <div className="hp-cat-links">
        <PortfolioLink category="bundle" />
      </div>
    </div>
  )
}

function ValueSection() {
  const { t } = useTranslation()
  return (
    <section className="hp-value-sec" aria-labelledby="value-title">
      <h2 id="value-title" className="hp-line-title">{t(valueSectionTitle)}</h2>
      <ul className="hp-value-list">
        {valueChecklist.map((item) => (
          <li key={item.en}>{t(item)}</li>
        ))}
      </ul>
      <p className="hp-note">{t(experienceNote)}</p>
    </section>
  )
}

function BudgetFitSection() {
  const { t } = useTranslation()
  return (
    <section className="hp-budget-note" aria-label={t({ th: 'ปรับงานให้เข้ากับงบ', en: 'Fitting the work to your budget' })}>
      <p>{t(budgetFitNote)}</p>
    </section>
  )
}

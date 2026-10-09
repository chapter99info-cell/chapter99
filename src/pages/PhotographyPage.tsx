import { useEffect, useMemo, useState } from 'react'
import { CompareSlider } from '../components/photo-v7/CompareSlider'
import {
  allowLayoutPreview,
  approvedBeforeAfter,
  approvedPortfolio,
  approvedProcess,
  canPublishSalesPage,
  emptyManifest,
  loadPhotoManifest,
  loadRights,
  requiredShots,
  type PhotoCategory,
  type PhotoManifest,
  type RightsRow,
} from '../data/photoPortfolio'
import '../styles/photo-v7.css'

const WA =
  'https://wa.me/61452044382?text=' +
  encodeURIComponent('สวัสดีครับ สนใจบริการ Photography ของ Chapter99 อยากขอใบเสนอราคาครับ')

const FONT =
  'https://fonts.googleapis.com/css2?family=Anton&family=Kanit:wght@600;700&family=IBM+Plex+Sans+Thai:wght@400;600&display=swap'

const services = [
  { title: 'Photography', lines: ['ภาพจริงจากร้านและสินค้า', 'ไฟล์สำหรับเว็บและโซเชียล'] },
  { title: 'AI Creative', lines: ['ต่อยอดจากภาพถ่ายจริงเท่านั้น', 'ติดป้ายงานที่สร้างด้วย AI'] },
  { title: 'Reels Video', lines: ['คลิปสั้นจากบรรยากาศร้านจริง', 'เริ่มต้น A$349 ตามขอบเขต'] },
  { title: 'Brand Content', lines: ['โทนภาพให้ร้านดูเป็นชุดเดียวกัน', 'โปสเตอร์และเมนูตามที่ตกลง'] },
] as const

function setRobotsNoIndex() {
  let el = document.querySelector('meta[name="robots"]')
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', 'robots')
    document.head.appendChild(el)
  }
  el.setAttribute('content', 'noindex,nofollow')
}

function Slot({ label, why }: { label: string; why: string }) {
  return (
    <div className="slot">
      <span className="badge">SLOT</span>
      <b>{label}</b>
      <span>{why}</span>
    </div>
  )
}

function LayoutPreview({
  manifest,
  rights,
}: {
  manifest: PhotoManifest
  rights: RightsRow[]
}) {
  const portfolio = approvedPortfolio(manifest.portfolio, rights)
  const beforeAfter = approvedBeforeAfter(manifest.beforeAfter, rights)
  const process = approvedProcess(manifest.process, rights)
  const featured = portfolio[0]
  const rest = portfolio.slice(1)
  const [filter, setFilter] = useState<'all' | PhotoCategory>('all')
  const visible = filter === 'all' ? rest : rest.filter((p) => p.category === filter)
  const cats: { id: 'all' | PhotoCategory; label: string }[] = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'foodRestaurant', label: 'Food / Restaurant' },
    { id: 'product', label: 'Product' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'massage', label: 'Massage' },
  ]

  return (
    <>
      <div className="notice" role="status">
        LAYOUT PREVIEW ONLY — ไม่ใช่หน้าขาย · ยังไม่ครบภาพที่ได้รับอนุญาต · ไม่ใช้ภาพสต็อกหรือ AI แทนผลงานจริง
      </div>
      <section className="hero hero--fill" id="top">
        <div className="hero__ph" aria-hidden="true">
          HERO · landscape ≥2400px
        </div>
        <header className="nav">
          <div className="wrap">
            <a className="logo" href="/v7">
              <img src="/mockup/media/web/logo.webp" alt="Chapter99" width={40} height={40} />
              CHAPTER99
            </a>
            <nav className="menu" aria-label="เมนูหลัก">
              <a href="#portfolio">ผลงาน</a>
              <a href="#before-after">ก่อน–หลัง</a>
              <a href="#process">กระบวนการ</a>
              <a href="#create">บริการ</a>
              <a href="#pricing">ราคา</a>
              <a href="/v7">หน้าแรก</a>
            </nav>
            <a className="btn btn--gold" href="#portfolio">
              ดูผลงานของเรา
            </a>
          </div>
        </header>
        <div className="hero__in">
          <span className="kicker">Chapter99 Photography</span>
          <h1 className="big">
            Real photos.
            <br />
            <em>Smarter content.</em>
          </h1>
          <div className="hero__cta">
            <a className="btn btn--gold" href="#portfolio">
              ดูผลงานของเรา
            </a>
            <a className="btn btn--line" href={WA}>
              ขอใบเสนอราคา
            </a>
          </div>
        </div>
      </section>

      <section className="sec" id="portfolio">
        <div className="wrap">
          <span className="kicker">Portfolio</span>
          <h2 className="th2">Editorial grid — ภาพที่ได้รับอนุญาตเท่านั้น</h2>
          {portfolio.length === 0 ? (
            <div className="editorial">
              {requiredShots
                .filter((s) => s.section === 'portfolio')
                .map((s, i) => (
                  <div key={s.id} className={i === 1 ? 'feat-slot' : undefined}>
                    <Slot label={s.label} why={s.why} />
                  </div>
                ))}
            </div>
          ) : (
            <>
              <div className="filters">
                {cats.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-pressed={filter === c.id}
                    onClick={() => setFilter(c.id)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="editorial">
                {featured ? (
                  <figure className="tile feat">
                    <span className="badge">{featured.badge}</span>
                    <img src={featured.src} alt={featured.alt} loading="eager" />
                  </figure>
                ) : null}
                {visible.map((item) => (
                  <figure className="tile" key={item.id}>
                    <span className="badge">{item.badge}</span>
                    <img src={item.src} alt={item.alt} loading="lazy" />
                  </figure>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="sec cream" id="before-after">
        <div className="wrap">
          <span className="kicker">Before / After</span>
          <h2 className="th2">คู่ภาพที่ตรวจแล้วเท่านั้น</h2>
          {beforeAfter.length === 0 ? (
            <div className="slots">
              {requiredShots
                .filter((s) => s.section === 'beforeAfter')
                .map((s) => (
                  <Slot key={s.id} label={s.label} why={s.why} />
                ))}
            </div>
          ) : (
            beforeAfter.map((item) => <CompareSlider key={item.id} item={item} />)
          )}
        </div>
      </section>

      <section className="sec" id="process">
        <div className="wrap">
          <span className="kicker">Creative process</span>
          <h2 className="th2">REAL PHOTO → EDITING → AI CREATIVE → MARKETING</h2>
          <p className="sub">ชุดเดียวกันจากการถ่ายจริงหนึ่งครั้ง · งาน AI ต้องติดป้าย</p>
          <div className="process">
            {process.length >= 4
              ? process.map((step) => (
                  <figure className="tile" key={step.id}>
                    <span className="badge">{step.label}</span>
                    <img src={step.src} alt={step.alt} loading="lazy" />
                    {step.aiNote ? <figcaption>{step.aiNote}</figcaption> : null}
                  </figure>
                ))
              : requiredShots
                  .filter((s) => s.section === 'process')
                  .map((s) => <Slot key={s.id} label={s.label} why={s.why} />)}
          </div>
        </div>
      </section>

      <section className="sec cream" id="create">
        <div className="wrap">
          <span className="kicker">Services</span>
          <h2 className="th2">งานที่ต่อจากภาพจริง</h2>
          <div className="svc">
            {services.map((card, i) => (
              <article className="svc-card" key={card.title}>
                <Slot
                  label={requiredShots.filter((s) => s.section === 'services')[i]?.label ?? card.title}
                  why="รอภาพที่ได้รับอนุญาต"
                />
                <h3>{card.title}</h3>
                <p>{card.lines[0]}</p>
                <p>{card.lines[1]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec dark" id="pricing">
        <div className="wrap">
          <span className="kicker">Pricing · after proof</span>
          <h2 className="th2">บริการเสริม ไม่รวมในแพ็กเกจเว็บ</h2>
          <div className="xplans">
            <div className="plan">
              <h3>Photography</h3>
              <div className="amt">A$349</div>
              <p>from A$349 · Scope confirmed before payment.</p>
            </div>
            <div className="plan plan--hi">
              <h3>Reels Video</h3>
              <div className="amt">A$349</div>
              <p>from A$349 · Scope confirmed before payment.</p>
            </div>
          </div>
          <div className="ask-row">AI Creative — request quote</div>
          <p className="disclaimer">
            Optional add-ons · ไม่รวมใน Starter / Professional · Scope confirmed before payment.
          </p>
        </div>
      </section>

      <section className="final" id="contact">
        <div className="wrap">
          <h2 className="big">
            Your business
            <br />
            <em>deserves to look this good.</em>
          </h2>
          <div className="final__cta">
            <a className="btn btn--gold" href={WA}>
              ขอใบเสนอราคา
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

function UnpublishedStub() {
  return (
    <section className="stub">
      <div className="wrap">
        <span className="kicker">Internal · not published</span>
        <h1 className="th2">หน้า Photography ยังไม่เปิดขาย</h1>
        <p className="sub">
          ยังไม่มีภาพจริงที่ได้รับอนุญาตครบตามเกณฑ์ (ฮีโร่, พอร์ตอย่างน้อย 8 ภาพ, Before/After 2 คู่, กระบวนการ 4 ขั้น).
          ไม่ใส่ภาพสต็อกหรือผลงานปลอม
        </p>
        <p className="sub">ดูเลย์เอาต์ได้เฉพาะเครื่องพัฒนา หรือโฮสต์พรีวิวที่ต่อท้าย ?layout=1</p>
        <a className="btn btn--dark" href="/v7">
          กลับหน้าแรก
        </a>
      </div>
    </section>
  )
}

export function PhotographyPage() {
  const [manifest, setManifest] = useState<PhotoManifest>(emptyManifest)
  const [rights, setRights] = useState<RightsRow[]>([])
  const preview = allowLayoutPreview()
  const sales = useMemo(() => canPublishSalesPage(manifest, rights), [manifest, rights])

  useEffect(() => {
    document.title = sales
      ? 'Photography & AI Creative | Chapter99'
      : 'Photography (unpublished) | Chapter99'
    setRobotsNoIndex()
    const el = document.createElement('link')
    el.rel = 'stylesheet'
    el.href = FONT
    document.head.appendChild(el)
    void Promise.all([loadPhotoManifest(), loadRights()]).then(([m, r]) => {
      setManifest(m)
      setRights(r)
    })
    return () => el.remove()
  }, [sales])

  return (
    <div className="photo-v7">
      {sales ? (
        <LayoutPreview manifest={manifest} rights={rights} />
      ) : preview ? (
        <LayoutPreview manifest={manifest} rights={rights} />
      ) : (
        <UnpublishedStub />
      )}
      <footer>
        <div className="wrap fbar">
          <span>© 2026 Chapter99</span>
          <span>
            <a href="/v7">หน้าแรก</a>
            <a href="/legal/privacy">Privacy</a>
          </span>
        </div>
      </footer>
    </div>
  )
}

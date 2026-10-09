import { useEffect, useMemo, useState } from 'react'
import { CompareSlider } from '../components/photo-v7/CompareSlider'
import {
  approvedPortfolio,
  canPublishSalesPage,
  emptyManifest,
  loadPhotoManifest,
  requiredShots,
  type BeforeAfterItem,
  type PhotoCategory,
  type PhotoManifest,
  type PortfolioItem,
} from '../data/photoPortfolio'
import '../styles/photo-v7.css'

const WA_LAYOUT =
  'https://wa.me/61452044382?text=' +
  encodeURIComponent('สวัสดีครับ ส่งรายการภาพที่ได้รับอนุญาตสำหรับหน้า Photography ของ Chapter99')

const WA_SALES =
  'https://wa.me/61452044382?text=' +
  encodeURIComponent('สวัสดีครับ สนใจบริการ Photography & AI Creative ของ Chapter99 อยากสอบถามรายละเอียดครับ')

const FONT =
  'https://fonts.googleapis.com/css2?family=Anton&family=Kanit:wght@600;700&family=IBM+Plex+Sans+Thai:wght@400;600&display=swap'

const creates = [
  {
    title: 'Professional Photography',
    bullets: [
      'ถ่ายสินค้า อาหาร และบรรยากาศร้าน ตามขอบเขตที่ตกลง',
      'ไฟล์ต้นฉบับสำหรับเว็บและโซเชียล ตามขอบเขตที่ตกลง',
      'นัดวันถ่ายหลังคุยรายละเอียด ตามขอบเขตที่ตกลง',
    ],
  },
  {
    title: 'AI-Assisted Creative',
    bullets: [
      'ต่อยอดจากภาพถ่ายจริงของร้าน ตามขอบเขตที่ตกลง',
      'โปสเตอร์ เมนู และภาพโปรโมต ตามขอบเขตที่ตกลง',
      'ไม่นำเสนอภาพ AI ว่าเป็นภาพถ่ายจริง ตามขอบเขตที่ตกลง',
    ],
  },
  {
    title: 'Short-Form Video',
    bullets: [
      'คลิปสั้นโปรโมตร้าน ตามขอบเขตที่ตกลง',
      'ใช้ภาพและบรรยากาศจากร้านจริง ตามขอบเขตที่ตกลง',
      'รูปแบบคลิปตกลงก่อนเริ่ม ตามขอบเขตที่ตกลง',
    ],
  },
  {
    title: 'Brand Consistency',
    bullets: [
      'โทนภาพให้สอดคล้องกัน ตามขอบเขตที่ตกลง',
      'ใช้ภาพต้นฉบับต่อยอดหลายชิ้น ตามขอบเขตที่ตกลง',
      'งานออกแบบเพิ่มเติมสอบถามราคา ตามขอบเขตที่ตกลง',
    ],
  },
] as const

const processSteps = [
  { n: '01', t: 'ถ่ายภาพจริงที่ร้าน', d: 'เริ่มจากสินค้า อาหาร และพื้นที่จริง ไม่สร้างภาพปลอม' },
  { n: '02', t: 'คัดภาพที่ใช้ได้', d: 'เลือกรูปที่ร้านอนุญาตให้เผยแพร่เท่านั้น' },
  { n: '03', t: 'ต่อยอดคอนเทนต์', d: 'โปสเตอร์ เมนู Reels จากภาพต้นฉบับเดียวกัน' },
  { n: '04', t: 'ติดป้ายให้ชัด', d: 'REAL PHOTO / PHOTO + AI CREATIVE / DESIGN CONCEPT' },
] as const

const filterLabels: { id: 'all' | PhotoCategory; label: string }[] = [
  { id: 'all', label: 'ทั้งหมด' },
  { id: 'food', label: 'Food' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'massage', label: 'Massage & Spa' },
  { id: 'products', label: 'Products' },
  { id: 'reels', label: 'Reels' },
]

const baTabs: { id: BeforeAfterItem['category']; label: string }[] = [
  { id: 'food', label: 'Food' },
  { id: 'massage', label: 'Massage & Spa' },
  { id: 'products', label: 'Products' },
  { id: 'restaurant', label: 'Restaurant Promotion' },
]

function Slot({ label, why, badge }: { label: string; why: string; badge: string }) {
  return (
    <div className="slot">
      <span className="badge">{badge}</span>
      <b>{label}</b>
      <span>{why}</span>
    </div>
  )
}

export function PhotographyPage() {
  const [manifest, setManifest] = useState<PhotoManifest>(emptyManifest)
  const [filter, setFilter] = useState<'all' | PhotoCategory>('all')
  const [baTab, setBaTab] = useState<BeforeAfterItem['category'] | null>(null)

  const portfolio = useMemo(() => approvedPortfolio(manifest.portfolio), [manifest.portfolio])
  const beforeAfter = manifest.beforeAfter
  const sales = canPublishSalesPage(manifest)
  const wa = sales ? WA_SALES : WA_LAYOUT
  const heroPhoto = portfolio.find((p) => p.badge === 'REAL PHOTO')

  const visible: PortfolioItem[] =
    filter === 'all' ? portfolio : portfolio.filter((p) => p.category === filter)

  const usedCats = new Set(portfolio.map((p) => p.category))
  const usedBa = new Set(beforeAfter.map((p) => p.category))
  const baItems = baTab ? beforeAfter.filter((p) => p.category === baTab) : []
  const pfSlots = requiredShots.filter((s) => s.section === 'portfolio')
  const baSlots = requiredShots.filter((s) => s.section === 'beforeAfter')
  const whySlots = requiredShots.filter((s) => s.section === 'why')

  useEffect(() => {
    document.title = sales
      ? 'Photography & AI Creative | Chapter99'
      : 'Photography layout (not for sale) | Chapter99'
    const el = document.createElement('link')
    el.rel = 'stylesheet'
    el.href = FONT
    document.head.appendChild(el)
    void loadPhotoManifest().then((data) => {
      setManifest(data)
      const first = data.beforeAfter[0]?.category
      if (first) setBaTab(first)
    })
    return () => el.remove()
  }, [sales])

  return (
    <div className="photo-v7">
      {!sales ? (
        <div className="notice" role="status">
          หน้านี้ยังไม่เปิดขาย — ยังไม่มีภาพที่ได้รับอนุญาต จึงเตรียมเลย์เอาต์และรายการภาพที่ต้องใช้แทน ไม่สร้างผลงานปลอม
        </div>
      ) : null}

      <section className="hero" id="top">
        {heroPhoto ? (
          <div className="hero__bg">
            <img
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              width={heroPhoto.width ?? 2000}
              height={heroPhoto.height ?? 1200}
              fetchPriority="high"
              decoding="async"
            />
          </div>
        ) : (
          <div className="hero__type" aria-hidden="true">
            PHOTO
          </div>
        )}
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
            <a className="btn btn--gold" href={sales ? '#contact' : '#shots'}>
              {sales ? 'คุยเรื่องถ่ายภาพร้าน' : 'ดูรายการภาพที่ต้องใช้'}
            </a>
          </div>
        </header>
        <div className="hero__in">
          <span className="kicker">
            {sales ? 'Chapter99 Photography & AI Creative' : 'Layout preview · ไม่ใช่หน้าขาย'}
          </span>
          <h1 className="big">
            Real photos.
            <br />
            <em>Smarter content.</em>
          </h1>
          <p className="lead">ภาพจริงจากร้านคุณ / ต่อยอดเป็นคอนเทนต์ที่แตกต่าง</p>
          <p className="lead2">
            {sales
              ? 'เราใช้ภาพถ่ายสินค้าจริงเป็นจุดเริ่มต้น แล้วผสานงานออกแบบและ AI เพื่อสร้างภาพโปรโมต เมนู โปสเตอร์ และคอนเทนต์สำหรับร้านคุณ'
              : 'บริการนี้ขายด้วยภาพจริงที่ร้านอนุญาตเท่านั้น ลำดับหน้า: Hero → Portfolio → Before/After → Creative Process → Services → Pricing → CTA'}
          </p>
          <div className="hero__cta">
            <a className="btn btn--gold" href="#portfolio">
              {sales ? 'ดูตัวอย่างผลงาน' : 'ดูช่องว่างผลงาน'}
            </a>
            <a className="btn btn--line" href={sales ? wa : '#shots'}>
              {sales ? 'คุยเรื่องถ่ายภาพร้าน' : 'รายการภาพที่ต้องใช้'}
            </a>
          </div>
        </div>
      </section>

      <section className="sec" id="portfolio">
        <div className="wrap">
          <span className="kicker">Portfolio</span>
          <h2 className="th2">{sales ? 'ผลงานที่ได้รับอนุญาตจากร้าน' : 'ช่องผลงาน — รอภาพที่ได้รับอนุญาต'}</h2>
          {portfolio.length === 0 ? (
            <>
              <p className="sub">
                ยังไม่มีไฟล์ใน manifest ที่ permission.approved = true จึงไม่ใส่ภาพสมมติ
                กรอบด้านล่างคือตำแหน่งที่ต้องมีภาพจริง
              </p>
              <div className="slots">
                {pfSlots.map((s) => (
                  <Slot key={s.id} label={s.label} why={s.why} badge={s.badge} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="filters">
                {filterLabels
                  .filter((f) => f.id === 'all' || usedCats.has(f.id))
                  .map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={filter === f.id}
                      onClick={() => setFilter(f.id)}
                    >
                      {f.label}
                    </button>
                  ))}
              </div>
              <div className="masonry">
                {visible.map((item) => (
                  <figure className="tile" key={item.id}>
                    <span className="badge">{item.badge}</span>
                    <img
                      src={item.src}
                      alt={item.alt}
                      width={item.width ?? (item.orientation === 'portrait' ? 900 : 1200)}
                      height={item.height ?? (item.orientation === 'portrait' ? 1200 : 800)}
                      loading="lazy"
                    />
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
          <h2 className="th2">จากภาพถ่ายจริง สู่คอนเทนต์ที่ใช้โปรโมตได้</h2>
          {beforeAfter.length === 0 ? (
            <>
              <p className="sub">คู่ภาพจะแสดงเมื่อมีไฟล์ที่ได้รับอนุญาตเท่านั้น ไม่ใช้สไลเดอร์ว่างหลอกตา</p>
              <div className="slots">
                {baSlots.map((s) => (
                  <Slot key={s.id} label={s.label} why={s.why} badge={s.badge} />
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="ba-tabs" role="tablist">
                {baTabs
                  .filter((tab) => usedBa.has(tab.id))
                  .map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={baTab === tab.id}
                      onClick={() => setBaTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
              </div>
              {baItems.map((item) => (
                <CompareSlider key={item.id} item={item} />
              ))}
            </>
          )}
        </div>
      </section>

      <section className="sec" id="process">
        <div className="wrap">
          <span className="kicker">Creative process</span>
          <h2 className="th2">Why real photography</h2>
          <p className="sub">ท่อนนี้ต้องพิสูจน์ด้วยภาพคู่กัน ไม่ใช่ข้อความอย่างเดียว</p>
          <div className="slots">
            {sales && heroPhoto ? (
              <figure className="tile">
                <span className="badge">REAL PHOTO</span>
                <img src={heroPhoto.src} alt={heroPhoto.alt} loading="lazy" />
              </figure>
            ) : (
              whySlots.map((s) => <Slot key={s.id} label={s.label} why={s.why} badge={s.badge} />)
            )}
          </div>
          <ul className="benefits" style={{ marginTop: 28 }}>
            <li>สินค้าและบรรยากาศตรงกับธุรกิจจริง</li>
            <li>ลูกค้าเห็นสิ่งที่ร้านมีจริง</li>
            <li>ภาพต้นฉบับนำไปต่อยอดเป็นคอนเทนต์ได้หลายรูปแบบ</li>
          </ul>
          <div className="cards" style={{ marginTop: 32 }}>
            {processSteps.map((s) => (
              <article className="card" key={s.n}>
                <h3>
                  {s.n} {s.t}
                </h3>
                <p>{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sec cream" id="create">
        <div className="wrap">
          <span className="kicker">Services</span>
          <h2 className="th2">งานที่ต่อจากภาพจริงของร้าน</h2>
          <div className="cards">
            {creates.map((card) => (
              <article className="card" key={card.title}>
                <h3>{card.title}</h3>
                <ul>
                  {card.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <span className="scope">ตามขอบเขตที่ตกลง</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`sec dark ${sales ? '' : 'muted-price'}`} id="pricing">
        <div className="wrap">
          <span className="kicker">{sales ? 'Add-on pricing' : 'ราคาที่เตรียมไว้ — ยังไม่เปิดขาย'}</span>
          <h2 className="th2">บริการเสริม ไม่รวมในแพ็กเกจเว็บ</h2>
          <div className="xplans">
            <div className="plan">
              <h3>Photography</h3>
              <div className="amt">A$349</div>
              <p>เริ่มต้น A$349 · ตามขอบเขตที่ตกลง</p>
            </div>
            <div className="plan plan--hi">
              <h3>Reels Video</h3>
              <div className="amt">A$349</div>
              <p>เริ่มต้น A$349 · ตามขอบเขตที่ตกลง</p>
            </div>
          </div>
          <div className="ask-row">AI Creative · Brand Kit · Poster Design — สอบถามราคา</div>
          <p className="disclaimer">
            Add-on ไม่บังคับ · ไม่รวมใน Starter / Professional · แจ้งรายละเอียดทั้งหมดก่อนยืนยันงาน
            {!sales ? ' · ยังไม่รับงานจนกว่าหน้านี้จะมีภาพจริงที่ได้รับอนุญาต' : ''}
          </p>
        </div>
      </section>

      {!sales ? (
        <section className="sec" id="shots">
          <div className="wrap">
            <span className="kicker">Required shots</span>
            <h2 className="th2">รายการภาพที่ต้องมีก่อนเปิดขาย</h2>
            <p className="sub">ใส่ไฟล์ใน public/portfolio/approved/ แล้วลงใน manifest.json พร้อม permission.approved = true</p>
            <table className="shot-table">
              <thead>
                <tr>
                  <th>ส่วนหน้า</th>
                  <th>ภาพที่ต้องใช้</th>
                  <th>ป้าย</th>
                  <th>ทำไมต้องมี</th>
                </tr>
              </thead>
              <tbody>
                {requiredShots.map((s) => (
                  <tr key={s.id}>
                    <td>{s.section}</td>
                    <td>{s.label}</td>
                    <td>{s.badge}</td>
                    <td>{s.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      <section className="final" id="contact">
        <div className="wrap">
          <h2 className="big">
            {sales ? (
              <>
                ร้านคุณมีของดีอยู่แล้ว
                <br />
                ให้เราช่วยนำเสนอให้คนเห็น
              </>
            ) : (
              <>
                เปิดขายเมื่อมีภาพจริง
                <br />
                ที่ร้านอนุญาตแล้วเท่านั้น
              </>
            )}
          </h2>
          <p>
            {sales
              ? 'Photography & AI Creative เป็นบริการเสริม ตามขอบเขตที่ตกลง'
              : 'ส่งภาพที่ได้รับอนุญาตมาลงในพอร์ตแล้วค่อยเปิดหน้านี้เป็นหน้าขาย'}
          </p>
          <div className="final__cta">
            <a className="btn btn--gold" href={wa}>
              {sales ? 'ขอประเมินงานถ่ายภาพ' : 'ส่งภาพที่ได้รับอนุญาต'}
            </a>
            <a className="btn btn--line" href="/v7">
              กลับหน้าแรก
            </a>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap fbar">
          <span>© 2026 Chapter99</span>
          <span>
            <a href="/v7">หน้าแรก</a>
            <a href="/pricing">แพ็กเกจ</a>
            <a href="/legal/privacy">Privacy</a>
          </span>
        </div>
      </footer>
    </div>
  )
}

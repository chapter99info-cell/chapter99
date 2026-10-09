import { useEffect, useMemo, useState } from 'react'
import { CompareSlider } from '../components/photo-v7/CompareSlider'
import {
  approvedPortfolio,
  emptyManifest,
  loadPhotoManifest,
  type BeforeAfterItem,
  type PhotoCategory,
  type PhotoManifest,
  type PortfolioItem,
} from '../data/photoPortfolio'
import '../styles/photo-v7.css'

const WA =
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

export function PhotographyPage() {
  const [manifest, setManifest] = useState<PhotoManifest>(emptyManifest)
  const [filter, setFilter] = useState<'all' | PhotoCategory>('all')
  const [baTab, setBaTab] = useState<BeforeAfterItem['category'] | null>(null)

  const portfolio = useMemo(() => approvedPortfolio(manifest.portfolio), [manifest.portfolio])
  const beforeAfter = manifest.beforeAfter
  const heroPhoto = portfolio.find((p) => p.badge === 'REAL PHOTO')

  const visible: PortfolioItem[] =
    filter === 'all' ? portfolio : portfolio.filter((p) => p.category === filter)

  const usedCats = new Set(portfolio.map((p) => p.category))
  const usedBa = new Set(beforeAfter.map((p) => p.category))
  const baItems = baTab ? beforeAfter.filter((p) => p.category === baTab) : []

  useEffect(() => {
    document.title = 'Photography & AI Creative | Chapter99'
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
  }, [])

  return (
    <div className="photo-v7">
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
              <a href="#create">งานที่ทำ</a>
              <a href="#pricing">ราคา</a>
              <a href="#portfolio">ผลงาน</a>
              <a href="/v7">หน้าแรก</a>
            </nav>
            <a className="btn btn--gold" href={WA}>
              คุยเรื่องถ่ายภาพร้าน
            </a>
          </div>
        </header>
        <div className="hero__in">
          <span className="kicker">Chapter99 Photography & AI Creative</span>
          <h1 className="big">
            Real photos.
            <br />
            <em>Smarter content.</em>
          </h1>
          <p className="lead">ภาพจริงจากร้านคุณ / ต่อยอดเป็นคอนเทนต์ที่แตกต่าง</p>
          <p className="lead2">
            เราใช้ภาพถ่ายสินค้าจริงเป็นจุดเริ่มต้น แล้วผสานงานออกแบบและ AI เพื่อสร้างภาพโปรโมต เมนู โปสเตอร์ และคอนเทนต์สำหรับร้านคุณ
          </p>
          <div className="hero__cta">
            <a className="btn btn--gold" href="#portfolio">
              ดูตัวอย่างผลงาน
            </a>
            <a className="btn btn--line" href={WA}>
              คุยเรื่องถ่ายภาพร้าน
            </a>
          </div>
        </div>
      </section>

      <section className="sec cream" id="before-after">
        <div className="wrap">
          <span className="kicker">Before / After</span>
          <h2 className="th2">จากภาพถ่ายจริง สู่คอนเทนต์ที่ใช้โปรโมตได้</h2>
          {beforeAfter.length === 0 ? (
            <p className="sub">
              เราเริ่มจากภาพถ่ายร้านและสินค้าจริง จากนั้นจัดแสง จัดองค์ประกอบ และต่อยอดเป็นงานโปรโมตเมื่อร้านอนุญาต
              คู่ภาพก่อน–หลังจะแสดงเมื่อมีไฟล์ที่ได้รับอนุญาตเท่านั้น ไม่ใช้ภาพสมมติหรือสไลเดอร์ว่าง
            </p>
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

      <section className="sec" id="create">
        <div className="wrap">
          <span className="kicker">What we create</span>
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

      <section className="sec dark" id="pricing">
        <div className="wrap">
          <span className="kicker">Add-on pricing</span>
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
          </p>
        </div>
      </section>

      <section className="sec cream" id="why">
        <div className="wrap why">
          <div>
            <span className="kicker">Why real photography</span>
            <h2 className="th2">
              AI สร้างภาพสวยได้
              <br />
              แต่ภาพจริงสร้างความมั่นใจ
            </h2>
          </div>
          <ul className="benefits">
            <li>สินค้าและบรรยากาศตรงกับธุรกิจจริง</li>
            <li>ลูกค้าเห็นสิ่งที่ร้านมีจริง</li>
            <li>ภาพต้นฉบับนำไปต่อยอดเป็นคอนเทนต์ได้หลายรูปแบบ</li>
          </ul>
        </div>
      </section>

      <section className="sec" id="portfolio">
        <div className="wrap">
          <span className="kicker">Portfolio</span>
          <h2 className="th2">ผลงานที่ได้รับอนุญาตจากร้าน</h2>
          {portfolio.length === 0 ? (
            <div className="empty">
              <p>ผลงานจริงจะแสดงเมื่อได้รับอนุญาตจากร้าน</p>
              <a className="btn btn--dark" href={WA} style={{ marginTop: 16 }}>
                คุยเรื่องถ่ายภาพร้าน
              </a>
            </div>
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

      <section className="final" id="contact">
        <div className="wrap">
          <h2 className="big">
            ร้านคุณมีของดีอยู่แล้ว
            <br />
            ให้เราช่วยนำเสนอให้คนเห็น
          </h2>
          <p>Photography & AI Creative เป็นบริการเสริม ตามขอบเขตที่ตกลง</p>
          <div className="final__cta">
            <a className="btn btn--gold" href={WA}>
              ขอประเมินงานถ่ายภาพ
            </a>
            <a className="btn btn--line" href="/v7#massage">
              ดูตัวอย่างเว็บไซต์ร้าน
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

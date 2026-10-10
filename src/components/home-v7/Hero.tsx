import { useState } from 'react'
import { fromPrices, money } from '../../content/pricing'
import { v7Copy } from '../../content/v7'
import { MobileNav } from './MobileNav'
import { DecoLines } from './PressIcon'

type HeroProps = {
  onOpenDemo?: (src: string) => void
}

export function Hero(_props: HeroProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const priceCta = `ดูแพ็กเกจ · เริ่มต้น ${money(fromPrices.massage)} →`
  return (
    <section className="hero hero--cover" id="top">
      <div className="hero__bg">
        <img
          src="/mockup/media/web/hero-sydney.webp"
          alt="ซิดนีย์ยามค่ำ"
          width={2000}
          height={1333}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <div className="hero__crop" aria-hidden="true">
        <span className="tl" />
        <span className="tr" />
        <span className="bl" />
        <span className="br" />
      </div>
      <DecoLines />
      <header className="nav">
        <div className="wrap">
          <a className="logo" href="#top">
            <img src="/mockup/media/web/logo.webp" alt="Chapter99" width={44} height={44} />
            CHAPTER99
          </a>
          <nav className="menu" aria-label="เมนูหลัก">
            <a href="#massage">ตัวอย่างร้าน</a>
            <a href="#how">วิธีทำงาน</a>
            <a href="#packages">ราคา</a>
            <a href="#faq">คำถาม</a>
          </nav>
          <a className="btn btn--gold" href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
            {v7Copy.th.ctaTalk}
          </a>
          <button
            type="button"
            className="burger"
            aria-label={menuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={menuOpen}
            aria-controls="v7-mnav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </header>
      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="hero__in">
        <div>
          <span className="kicker">{v7Copy.cover.kicker}</span>
          <h1 className="big cover-title">
            <span>WE BUILD</span>
            <span>SHOPS</span>
            <em>THAT SELL.</em>
          </h1>
        </div>
        <div className="hero__side">
          <p className="th-lead">{v7Copy.th.heroSub}</p>
          <p className="lead2">{v7Copy.th.heroLine}</p>
          <div className="hero__cta">
            <a className="btn btn--gold" href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
              {v7Copy.th.ctaTalk}
            </a>
            <a className="btn btn--line" href="/pricing">
              {priceCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

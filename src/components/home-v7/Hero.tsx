import { useState } from 'react'
import { CalendarCheck, MessagesSquare, Smartphone, Timer } from 'lucide-react'
import { v7Copy } from '../../content/v7'
import { MobileNav } from './MobileNav'
import { DecoLines, PressIcon } from './PressIcon'

type HeroProps = {
  onOpenDemo?: (src: string) => void
}

export function Hero(_props: HeroProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <section className="hero" id="top">
      <div className="hero__bg">
        <img
          src="/mockup/media/web/cta-spa.webp"
          alt="ร้านนวดไทยในออสเตรเลีย"
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
        <span className="kicker">01 / AUSTRALIA</span>
        <h1 className="th2 hero__title">
          {v7Copy.th.heroHeadline}
        </h1>
        <p className="lead2">{v7Copy.th.heroSub}</p>
        <div className="hero__cta">
          <a className="btn btn--gold" href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
            {v7Copy.th.ctaTalk}
          </a>
          <a className="btn btn--line" href="#packages">
            {v7Copy.th.ctaPackages}
          </a>
        </div>
      </div>
      <div className="perks">
        <div className="wrap">
          <div className="perk">
            <PressIcon icon={CalendarCheck} label="จองออนไลน์" />
            <div>
              <b>ลูกค้าจองออนไลน์</b>
              <span>ในแพ็ก Professional</span>
            </div>
          </div>
          <div className="perk">
            <PressIcon icon={Smartphone} label="มือถือ" />
            <div>
              <b>ใช้งานง่าย</b>
              <span>บนมือถือ</span>
            </div>
          </div>
          <div className="perk">
            <PressIcon icon={Timer} label="งานแอดมิน" />
            <div>
              <b>ลดงานหลังร้าน</b>
              <span>ประหยัดเวลา</span>
            </div>
          </div>
          <div className="perk">
            <PressIcon icon={MessagesSquare} label="ซัพพอร์ตไทย" />
            <div>
              <b>คุยภาษาไทย</b>
              <span>ดูแลในออสเตรเลีย</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

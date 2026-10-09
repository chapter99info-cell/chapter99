import { v7Copy } from '../../content/v7'

type HeroProps = {
  onOpenDemo?: (src: string) => void
}

const WA = `${v7Copy.contact.whatsapp}?text=${encodeURIComponent('สวัสดีครับ สนใจเว็บไซต์ร้าน (จากเว็บ Chapter99)')}`

export function Hero(_props: HeroProps) {
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
          <a className="btn btn--gold" href="#contact">
            {v7Copy.th.ctaTalk}
          </a>
          <a className="burger" href="#packages" aria-label="ไปที่แพ็กเกจ">
            ☰
          </a>
        </div>
      </header>
      <div className="hero__in">
        <span className="kicker">{v7Copy.th.heroKicker}</span>
        <h1 className="th2" style={{ color: '#fff', fontSize: 'clamp(36px, 8vw, 64px)', lineHeight: 1.2 }}>
          {v7Copy.th.heroHeadline}
        </h1>
        <p className="lead2">{v7Copy.th.heroSub}</p>
        <div className="hero__cta">
          <a className="btn btn--gold" href="#contact">
            {v7Copy.th.ctaTalk}
          </a>
          <a className="btn btn--line" href="/business-toolkit">
            {v7Copy.th.ctaToolkit}
          </a>
        </div>
      </div>
      <p className="hand hero__note">
        “ให้คุณโฟกัสกับสิ่งที่คุณถนัด
        <br />
        เราดูแลเรื่องออนไลน์ให้”
      </p>
      <div className="perks">
        <div className="wrap">
          <div className="perk">
            <i>
              <img src="/icons/v7/online-booking.png" alt="" width={40} height={40} />
            </i>
            <div>
              <b>ลูกค้าจองออนไลน์</b>
              <span>ในแพ็ก Professional</span>
            </div>
          </div>
          <div className="perk">
            <i>
              <img src="/icons/v7/mobile-phone.png" alt="" width={40} height={40} />
            </i>
            <div>
              <b>ใช้งานง่าย</b>
              <span>บนมือถือ</span>
            </div>
          </div>
          <div className="perk">
            <i>
              <img src="/icons/v7/website.png" alt="" width={40} height={40} />
            </i>
            <div>
              <b>ลดงานหลังร้าน</b>
              <span>ประหยัดเวลา</span>
            </div>
          </div>
          <div className="perk">
            <i>
              <img src="/icons/v7/support-chat.png" alt="" width={40} height={40} />
            </i>
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

export { WA }

type HeroProps = {
  onOpenDemo: (src: string) => void
}

const WA =
  'https://wa.me/61452044382?text=%E0%B8%AA%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B5%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B8%9A%20%E0%B8%AA%E0%B8%99%E0%B9%83%E0%B8%88%E0%B9%80%E0%B8%A7%E0%B9%87%E0%B8%9A%E0%B9%84%E0%B8%8B%E0%B8%95%E0%B9%8C%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%99%20(%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B9%80%E0%B8%A7%E0%B9%87%E0%B8%9A%20Chapter99)'

export function Hero({ onOpenDemo }: HeroProps) {
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
            <img src="/mockup/media/web/logo.webp" alt="Chapter99" width={40} height={40} />
            CHAPTER99
          </a>
          <nav className="menu" aria-label="เมนูหลัก">
            <a href="#massage">ตัวอย่างร้าน</a>
            <a href="#how">วิธีทำงาน</a>
            <a href="#team">ทีมงาน</a>
            <a href="#packages">ราคา</a>
            <a href="#faq">คำถาม</a>
          </nav>
          <a className="btn btn--gold" href="#contact">
            ติดต่อเรา
          </a>
          <a className="burger" href="#packages" aria-label="ไปที่แพ็กเกจ">
            ☰
          </a>
        </div>
      </header>
      <div className="hero__in">
        <span className="kicker">For Thai businesses in Australia</span>
        <h1 className="big">
          Less admin.
          <br />
          <em>More time</em>
          <br />
          for customers.
        </h1>
        <p className="lead">งานหลังร้านน้อยลง มีเวลาดูแลลูกค้ามากขึ้น</p>
        <p className="lead2">
          เว็บไซต์ เมนูออนไลน์ และเครื่องมือจัดการร้าน — ระบบจองคิวอยู่ในแพ็ก Professional — ไม่ต้องเก่งคอม เราตั้งค่าให้ครับ
        </p>
        <div className="hero__cta">
          <a className="btn btn--gold" href="#packages">
            ดูแพ็กเกจ · เริ่มต้น A$199 →
          </a>
          <button type="button" className="btn btn--line" onClick={() => onOpenDemo('/demo/demo-booking.html')}>
            ลองระบบในเดโม <span className="play">▶</span>
          </button>
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
              <img src="/mockup/media/icons8-notification-50.png" alt="" width={26} height={26} />
            </i>
            <div>
              <b>ลูกค้าจองออนไลน์</b>
              <span>ในแพ็ก Professional</span>
            </div>
          </div>
          <div className="perk">
            <i>
              <img src="/mockup/media/icons8-smartphone-50.png" alt="" width={26} height={26} />
            </i>
            <div>
              <b>ใช้งานง่าย</b>
              <span>บนมือถือ</span>
            </div>
          </div>
          <div className="perk">
            <i>
              <img src="/mockup/media/icons8-settings-50.png" alt="" width={26} height={26} />
            </i>
            <div>
              <b>ลดงานหลังร้าน</b>
              <span>ประหยัดเวลา</span>
            </div>
          </div>
          <div className="perk">
            <i>
              <img src="/mockup/media/icons8-chat-bubble-50.png" alt="" width={26} height={26} />
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

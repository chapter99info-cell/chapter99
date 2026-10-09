type Props = { onOpenDemo: (src: string) => void }

export function MassageDemo({ onOpenDemo }: Props) {
  return (
    <section className="sec cream" id="massage">
      <div className="wrap">
        <div className="massage">
          <div className="rv">
            <span className="kicker">
              <img src="/mockup/media/web/logo.webp" alt="" width={22} height={22} />
              Massage shops
            </span>
            <h2 className="th2" style={{ marginTop: 12 }}>
              สำหรับร้านนวดไทย
              <br />
              ในออสเตรเลีย
            </h2>
            <p className="sub">
              มีเว็บร้าน ลูกค้าดูบริการ–ราคาเองได้ ลดงานตอบแชท — จองออนไลน์อยู่ในแพ็ก Professional — ไม่ต้องเก่งคอม
            </p>
            <div className="row">
              <button type="button" className="btn btn--gold" onClick={() => onOpenDemo('/demo/demo-booking.html')}>
                ▶ ลองจองคิว (เดโม)
              </button>
              <button type="button" className="btn btn--outline" onClick={() => onOpenDemo('food-app')}>
                ลองสั่งอาหาร (เดโม)
              </button>
            </div>
          </div>
          <div className="devices rv">
            <span className="demo-tag">DEMO</span>
            <button
              type="button"
              className="tryme"
              onClick={() => onOpenDemo('/demo/demo-booking.html')}
              aria-label="ลองกดเว็บตัวอย่าง"
            >
              ▶ ลองกดดู
            </button>
            <div className="laptop">
              <div className="laptop__screen">
                <img
                  src="/mockup/media/web/demo-desk.webp"
                  alt="ตัวอย่างเว็บร้านนวด (demo)"
                  width={900}
                  height={563}
                  loading="lazy"
                />
              </div>
              <div className="laptop__base" />
            </div>
            <div className="phone">
              <img
                src="/mockup/media/web/demo-phone.webp"
                alt="ตัวอย่างเว็บร้านนวดบนมือถือ (demo)"
                width={360}
                height={720}
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="checks">
          <div className="check rv">
            <i>✓</i>
            <div>
              <b>เว็บไซต์สวย</b>
              <span>บริการและราคาครบ</span>
            </div>
          </div>
          <div className="check rv">
            <i>✓</i>
            <div>
              <b>ระบบจองคิว</b>
              <span>
                จองออนไลน์ <span className="plan-pill">Professional เท่านั้น</span>
              </span>
            </div>
          </div>
          <div className="check rv">
            <i>✓</i>
            <div>
              <b>จัดการง่าย</b>
              <span>ดูคิวบนมือถือหรือคอม</span>
            </div>
          </div>
          <div className="check rv">
            <i>✓</i>
            <div>
              <b>น่าเชื่อถือขึ้น</b>
              <span>ลูกค้าใหม่หาร้านเจอ</span>
            </div>
          </div>
        </div>
        <p className="demo-note">* ภาพหน้าจอเป็นเว็บตัวอย่าง (demo) ไม่ใช่ร้านลูกค้าจริง</p>
      </div>
    </section>
  )
}

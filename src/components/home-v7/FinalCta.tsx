import { WA } from './Hero'

export function FinalCta() {
  return (
    <section className="final" id="contact">
      <img src="/mockup/media/web/hero-sydney.webp" alt="ซิดนีย์" width={2000} height={1125} loading="lazy" />
      <div className="wrap">
        <h2 className="big">
          Better shops
          <br />
          start with a clearer direction.
        </h2>
        <p>ให้ Chapter99 ช่วยพาธุรกิจของคุณไปต่อ</p>
        <div className="final__cta">
          <a className="btn btn--gold" href={WA}>
            💬 คุยภาษาไทยผ่าน WhatsApp →
          </a>
          <a className="btn btn--line" href="#packages">
            ดูแพ็กเกจ →
          </a>
        </div>
      </div>
    </section>
  )
}

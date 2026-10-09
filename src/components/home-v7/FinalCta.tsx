import { v7Copy } from '../../content/v7'

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
          <a className="btn btn--gold" href={v7Copy.contact.facebookInbox} target="_blank" rel="noopener noreferrer">
            {v7Copy.th.ctaTalk}
          </a>
          <a className="btn btn--line" href="#packages">
            {v7Copy.th.ctaPackages}
          </a>
        </div>
      </div>
    </section>
  )
}

import { fromPrices, money } from '../../content/pricing'

import { DecoLines } from './PressIcon'

export function Pricing() {
  return (
    <section className="sec dark" id="packages">
      <DecoLines />
      <div className="wrap">
        <span className="kicker">06 / PACKAGES</span>
        <h2 className="th2" style={{ marginTop: 12 }}>
          แพ็กเกจตามประเภทร้าน
        </h2>
        <p className="sub price-teaser">
          ร้านนวด เริ่ม {money(fromPrices.massage)} · ร้านอาหาร เริ่ม {money(fromPrices.restaurant)}
        </p>
        <p className="sub price-teaser">
          <a href="/pricing?tab=photography">ถ่ายภาพอย่างเดียว เริ่ม {money(fromPrices.photography)}</a>
        </p>
        <a className="btn btn--gold" href="/pricing">
          ดูแพ็กเกจ →
        </a>
      </div>
    </section>
  )
}

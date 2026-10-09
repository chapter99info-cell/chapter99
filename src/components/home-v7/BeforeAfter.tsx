import { DecoLines } from './PressIcon'

function CheckIcon() {
  return (
    <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function BeforeAfter() {
  return (
    <section className="sec" id="before-after">
      <DecoLines />
      <div className="wrap">
        <span className="kicker">02 / PROCESS</span>
        <h2 className="th2" style={{ marginTop: 12 }}>
          ร้านเดิม ทำงานน้อยลง
        </h2>
        <div className="xba">
          <div className="xba__c rv">
            <b>ก่อน</b>
            <ul>
              <li>ตอบแชทถามราคาทั้งวัน</li>
              <li>จดคิวในสมุด ตกหล่นง่าย</li>
              <li>ลูกค้าใหม่หาร้านไม่เจอ</li>
            </ul>
          </div>
          <div className="xba__arrow" aria-hidden="true">
            <svg className="ic" viewBox="0 0 24 24">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
          <div className="xba__c xba__c--after rv">
            <b>หลัง</b>
            <ul>
              <li>
                <CheckIcon />
                <span>
                  ลูกค้าดูบริการ–ราคาเองบนเว็บ <span className="plan-pill">Starter+</span>
                </span>
              </li>
              <li>
                <CheckIcon />
                <span>
                  ลูกค้าจองออนไลน์ได้ <span className="plan-pill">Professional เท่านั้น</span>
                </span>
              </li>
              <li>
                <CheckIcon />
                <span>
                  มีเว็บให้ลูกค้าใหม่หาเจอ <span className="plan-pill">Starter+</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

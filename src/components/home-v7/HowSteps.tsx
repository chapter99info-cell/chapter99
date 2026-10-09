export function HowSteps() {
  return (
    <section className="sec cream" id="how">
      <div className="wrap">
        <div className="xpanel">
          <div className="xpanel__head">
            <div>
              <span className="kicker">How to start</span>
              <h2 className="th2" style={{ marginTop: 10 }}>
                เริ่มง่าย 3 ขั้น
              </h2>
              <p className="xsub">เราตั้งค่าให้ ไม่ต้องทำเอง</p>
            </div>
            <a className="btn btn--gold" href="#contact">
              คุยกับเรา
            </a>
          </div>
          <div className="xpanel__body">
            <ol className="xsteps">
              <li className="rv">
                <span>1</span>
                <div>
                  <b>คุยกันภาษาไทย</b>
                  <em>เล่าเรื่องร้าน เลือกแพ็กที่ใช่</em>
                </div>
              </li>
              <li className="rv">
                <span>2</span>
                <div>
                  <b>เราตั้งค่าให้</b>
                  <em>เว็บ ข้อมูลร้าน ระบบจองตามแพ็ก Professional</em>
                </div>
              </li>
              <li className="rv">
                <span>3</span>
                <div>
                  <b>เปิดใช้ + สอนใช้งาน</b>
                  <em>ร้านเป็นเจ้าของข้อมูล</em>
                </div>
              </li>
            </ol>
            <div className="xbrowser rv">
              <div className="xbrowser__bar">
                <i />
                <i />
                <i />
                <span>sabai-thai-massage.com.au · DEMO</span>
              </div>
              <span className="demo-tag">DEMO</span>
              <img
                src="/mockup/media/web/demo-desk.webp"
                alt="ตัวอย่างเว็บร้านนวด (demo)"
                width={900}
                height={563}
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

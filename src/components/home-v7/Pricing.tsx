import { pricing } from '../../content/pricing'
import { v7Copy } from '../../content/v7'

export function Pricing() {
  return (
    <section className="sec dark" id="packages">
      <div className="wrap">
        <span className="kicker">Packages</span>
        <h2 className="th2" style={{ marginTop: 12 }}>
          2 แพ็กเกจ ราคาชัดเจน
        </h2>
        <p className="sub">ค่าตั้งค่าครั้งแรก + รายเดือน · ขอบเขตงานตกลงกันก่อนเริ่ม</p>
        <div className="xplans">
          <div className="plan rv" id="starter">
            <div className="plan__top">
              <h3>Starter</h3>
              <span className="badge">อยากมีเว็บไซต์</span>
            </div>
            <div className="amt">
              <b>{pricing.starter.setup}</b>
              <span>+ {pricing.starter.monthly} / เดือน</span>
            </div>
            <div className="amt-note">ค่าตั้งค่าครั้งแรก</div>
            <ul>
              <li>เว็บไซต์ร้านแบบมือถือ</li>
              <li>บริการ / เมนู / ราคา</li>
              <li>ข้อมูลติดต่อ แผนที่</li>
              <li>{v7Copy.th.starterNoBooking}</li>
            </ul>
            <a className="btn btn--dark" href="mailto:chapter99solutions@gmail.com?subject=Chapter99%20Starter">
              เลือก Starter →
            </a>
          </div>
          <div className="plan plan--hi rv" id="professional">
            <div className="plan__top">
              <h3>Professional</h3>
              <span className="badge">แนะนำ</span>
            </div>
            <div className="amt">
              <b>{pricing.professional.setup}</b>
              <span>+ {pricing.professional.monthly} / เดือน</span>
            </div>
            <div className="amt-note">ค่าตั้งค่าครั้งแรก</div>
            <ul>
              <li>ทุกอย่างใน Starter</li>
              <li>ตั้งค่าระบบจอง / สั่งอาหาร ตามขอบเขตที่ตกลง</li>
              <li>เครื่องมือช่วยจัดการร้าน</li>
            </ul>
            <a className="btn btn--gold" href="mailto:chapter99solutions@gmail.com?subject=Chapter99%20Professional">
              เลือก Professional →
            </a>
          </div>
        </div>
        <div className="after-strip rv">
          <article>
            <b>ตั้งค่าให้</b>
            <span>คุย → ทำเว็บ/ตั้งค่า → สอนใช้งาน (ระยะเวลาแจ้งหลังคุยขอบเขต)</span>
          </article>
          <article>
            <b>ค่ารายเดือนรวม</b>
            <span>โฮสติ้ง · ดูแลให้เว็บใช้งานได้ · แก้ข้อมูลเล็กน้อยตามขอบเขต · ทีมไทยดูแลโดยตรง</span>
          </article>
          <article>
            <b>ไม่รวม / จ่ายเพิ่ม</b>
            <span>ค่าโดเมน (ถ้ามี) · งานนอกขอบเขต (แจ้งราคาก่อนทำ) · บริการเสริม</span>
          </article>
        </div>
        <div className="xaddon rv">
          <span className="xtag">บริการเสริม · ไม่บังคับ — ไม่รวมในราคาแพ็กเกจ</span>
          <span>
            ถ่ายภาพร้าน <b>{pricing.addons.photography.price}</b>
          </span>
          <span>
            วิดีโอ Reels <b>{pricing.addons.reels.price}</b>
          </span>
          <span>
            Square Setup <b>{pricing.addons.square.price}</b> ครั้งเดียว
          </span>
          <a href="/pricing">ดูขอบเขตงาน →</a>
        </div>
      </div>
    </section>
  )
}

import { Link } from 'react-router-dom'

export function MassagePage() {
  return (
    <>
      <section className="split">
        <div>
          <p className="eyebrow">CHAPTER99 FOR MASSAGE & WELLNESS</p>
          <h1>
            คุณดูแลลูกค้า
            <br />
            <em>ให้เราช่วยเรื่องคิว</em>
          </h1>
          <p className="lead">
            เว็บไซต์ที่สะท้อนบรรยากาศร้าน
            <br />
            พร้อมตัวอย่างการจองและหน้าคิวที่ทีมเข้าใจตรงกัน
          </p>
          <div className="actions">
            <Link className="btn" to="/demo/massage">
              ลองจองและรับคิว ↗
            </Link>
            <Link to="/pricing#pack-massage">ดูราคาร้านนวด →</Link>
            <Link to="/business-toolkit">ลองเครื่องมือฟรี →</Link>
          </div>
        </div>
        <figure>
          <img src="/images/concept-wellness.svg" alt="ภาพแนวคิดร้านนวด / ไม่ใช่ภาพร้านหรือพนักงานจริง" />
          <figcaption>ภาพประกอบแนวคิด ไม่ใช่ภาพร้านจริง</figcaption>
        </figure>
      </section>
      <section>
        <div className="section-title">
          <h2>
            หนึ่งคิว
            <br />
            <em>ทีมเห็นตรงกัน</em>
          </h2>
          <p>ต้นแบบสาธิต ลูกค้า → เจ้าของ → พนักงาน</p>
        </div>
        <div className="three">
          <article>
            <b>01 / ลูกค้า</b>
            <h3>เลือกบริการและเวลา</h3>
            <p>รู้ระยะเวลาและราคาก่อนส่งคำขอจอง ชำระค่าบริการที่ร้าน</p>
          </article>
          <article>
            <b>02 / เจ้าของ</b>
            <h3>เปิดดูแล้วรับคิว</h3>
            <p>เห็นคำขอใหม่ รวมกับคิวโทรจองและลูกค้า walk-in</p>
          </article>
          <article>
            <b>03 / พนักงาน</b>
            <h3>รู้ว่าต้องทำอะไรต่อ</h3>
            <p>ดูเวลานัด เริ่มบริการ และเปลี่ยนสถานะเมื่อจบงาน</p>
          </article>
        </div>
        <div className="demo-link">
          <div>
            <small>INTERACTIVE DEMO</small>
            <h3>ลองเป็นลูกค้า แล้วกลับมาเป็นเจ้าของร้าน</h3>
            <p>ข้อมูลสมมติ ไม่ส่งข้อความและไม่รับจองจริง</p>
          </div>
          <Link className="btn" to="/demo/massage">
            เปิดเดโมสามมุมมอง ↗
          </Link>
        </div>
      </section>
      <section className="cta">
        <h2>เลือกงานที่อยากให้เบาลง</h2>
        <p>รายละเอียดแพ็กเกจใช้ชุดราคาทดลองชุดเดียวกับหน้าแรก</p>
        <Link className="btn" to="/pricing#pack-massage">
          ดูแพ็กเกจร้านนวด ↗
        </Link>
      </section>
    </>
  )
}

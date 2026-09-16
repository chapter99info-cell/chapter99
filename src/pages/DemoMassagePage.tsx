import { Link } from 'react-router-dom'
import { MassageDemo } from '../components/MassageDemo'

export function DemoMassagePage() {
  return (
    <>
      <section className="pricing-head">
        <p className="eyebrow">INTERACTIVE DEMO / SAMPLE SHOP</p>
        <h1>
          ลูกค้าจอง
          <br />
          <em>เจ้าของรับคิว พนักงานทำงานต่อ</em>
        </h1>
        <p className="lead">ร้านสมมติบ้านละมุน · ไม่เชื่อมข้อมูลร้านจริง</p>
        <p>
          <Link to="/massage">กลับหน้าร้านนวด →</Link>
        </p>
      </section>
      <MassageDemo />
    </>
  )
}

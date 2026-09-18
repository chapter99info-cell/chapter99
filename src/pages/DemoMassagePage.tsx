import { Link } from 'react-router-dom'
import { MassageDemo } from '../components/MassageDemo'
import { SiteLayout } from '../site/SiteLayout'
import '../site/homepage-v2.css'

export function DemoMassagePage() {
  return (
    <SiteLayout>
      <section className="legal-page">
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
    </SiteLayout>
  )
}

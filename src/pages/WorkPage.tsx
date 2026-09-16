import { Link } from 'react-router-dom'
import { WorkHero } from '../components/WorkHero'

export function WorkPage() {
  return (
    <>
      <WorkHero />
      <section className="work-grid">
        <Link to="/restaurants">
          <img src="/images/concept-restaurant.svg" alt="บอร์ดแนวคิดเว็บไซต์ร้านอาหาร / ไม่ใช่ภาพร้านจริง" />
          <p className="eyebrow">CONCEPT BOARD</p>
          <h3>ร้านอาหารและเมนู ↗</h3>
          <p>ภาพประกอบแนวคิด · เว็บไซต์และเมนู</p>
        </Link>
        <Link to="/massage">
          <img src="/images/concept-wellness.svg" alt="ภาพแนวคิดร้านนวด / ไม่ใช่ภาพร้านจริง" />
          <p className="eyebrow">CONCEPT DESIGN</p>
          <h3>บ้านละมุน Thai Massage ↗</h3>
          <p>ร้านสมมติ · ภาพประกอบแนวคิดและเดโมการจอง</p>
        </Link>
      </section>
    </>
  )
}

import { Link } from 'react-router-dom'
import { WorkHero } from '../components/WorkHero'
import { SiteLayout } from '../site/SiteLayout'
import { siteMedia } from '../site/media'
import '../site/homepage-v2.css'

export function WorkPage() {
  return (
    <SiteLayout>
    <main className="home-v2">
      <WorkHero />
      <section className="work-grid">
        <Link to="/restaurants">
          <img src={siteMedia.restaurant} alt="ภาพแนวคิดเว็บไซต์ร้านอาหาร / ไม่ใช่ภาพร้านจริง" />
          <p className="eyebrow">CONCEPT BOARD</p>
          <h3>ร้านอาหารและเมนู ↗</h3>
          <p>ภาพประกอบแนวคิด · เว็บไซต์และเมนู</p>
        </Link>
        <Link to="/massage">
          <img src={siteMedia.massage} alt="ภาพแนวคิดร้านนวดไทย / ไม่ใช่ภาพร้านจริง" />
          <p className="eyebrow">CONCEPT DESIGN</p>
          <h3>บ้านละมุน Thai Massage ↗</h3>
          <p>ร้านสมมติ · ภาพประกอบแนวคิดและเดโมการจอง</p>
        </Link>
        <Link to="/beauty">
          <img src={siteMedia.review} alt="ภาพแนวคิดสื่อรีวิวร้านบริการ / ไม่ใช่รีวิวจริง" />
          <p className="eyebrow">SERVICE PAGE</p>
          <h3>ความงาม ↗</h3>
          <p>หน้าสื่อสารบริการร้านความงาม</p>
        </Link>
        <Link to="/cleaning">
          <img src={siteMedia.system} alt="ภาพแนวคิดงานประจำวันบนแท็บเล็ต / ไม่ใช่ทีมทำความสะอาดจริง" />
          <p className="eyebrow">SERVICE PAGE</p>
          <h3>ทำความสะอาด ↗</h3>
          <p>หน้าสื่อสารบริการทำความสะอาด</p>
        </Link>
      </section>
    </main>
    </SiteLayout>
  )
}

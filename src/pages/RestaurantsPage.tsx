import { Link } from 'react-router-dom'
import { RestaurantCast } from '../components/RestaurantCast'
import { RestaurantPlans } from '../components/RestaurantPlans'

export function RestaurantsPage() {
  return (
    <>
      <p className="eyebrow food-cast-kicker">CHAPTER99 FOR RESTAURANTS & CAFÉS</p>
      <RestaurantCast />
      <section className="portfolio" id="example">
        <div className="section-title">
          <div>
            <p className="eyebrow">DESIGN REFERENCE</p>
            <h2>
              ภาพอาหารนำเรื่อง
              <br />
              <em>เมนูพร้อมให้เลือก</em>
            </h2>
          </div>
          <p>
            ภาพประกอบแนวคิดสำหรับหารืองานออกแบบ
            <br />
            ไม่ใช่หลักฐานระบบสดหรือร้านที่เปิดใช้แล้ว
          </p>
        </div>
        <img src="/images/concept-restaurant.svg" alt="ภาพแนวคิดเว็บไซต์ร้านอาหารพร้อมเมนูบนมือถือ / ไม่ใช่ภาพร้านจริง" />
        <span className="concept-caption">ภาพประกอบแนวคิด ไม่ใช่ภาพร้านหรือจานอาหารจริง</span>
      </section>
      <section>
        <div className="three">
          <article>
            <b>01</b>
            <h3>ให้เมนูดูน่าลอง</h3>
            <p>จัดภาพอาหาร ชื่อเมนู และราคา ให้เลือกดูสะดวก</p>
          </article>
          <article>
            <b>02</b>
            <h3>เข้าถึงจากโต๊ะหรือที่บ้าน</h3>
            <p>วางเมนู QR และเส้นทางสั่งอาหารตามรูปแบบที่ร้านต้องการ</p>
          </article>
          <article>
            <b>03</b>
            <h3>ตกลงงานหน้าร้านให้ชัด</h3>
            <p>ประเมินระบบสั่งอาหาร เครื่องพิมพ์ และอุปกรณ์ก่อนกำหนดขอบเขต</p>
          </article>
        </div>
      </section>
      <section id="restaurant-plans" className="new-plans">
        <RestaurantPlans heading />
      </section>
      <section className="cta">
        <h2>ให้เว็บเข้ากับวิธีที่ร้านทำงาน</h2>
        <p>ร้านอาหารแยกจากเดโมร้านนวด เพราะขั้นตอนหน้าร้านต่างกัน</p>
        <Link className="btn" to="/pricing?type=restaurant">
          ดูแพ็กเกจร้านอาหาร ↗
        </Link>
      </section>
    </>
  )
}

import { useSearchParams } from 'react-router-dom'
import { PhotoPackages } from '../components/PhotoPackages'
import { PlansGrid } from '../components/PlansGrid'
import { PricingHero } from '../components/PricingHero'
import { RestaurantPlans } from '../components/RestaurantPlans'
import { Link } from 'react-router-dom'
import { priceDisclaimer } from '../data/pricing'

export function PricingPage() {
  const [params, setParams] = useSearchParams()
  const type = params.get('type') === 'restaurant' ? 'restaurant' : 'massage'

  return (
    <>
      <PricingHero />
      <section className="pricing-head">
        <div className="price-tabs" role="group" aria-label="ประเภทร้าน">
          <button
            type="button"
            aria-pressed={type === 'massage'}
            onClick={() => setParams({ type: 'massage' })}
          >
            ร้านนวด / สปา
          </button>
          <button
            type="button"
            aria-pressed={type === 'restaurant'}
            onClick={() => setParams({ type: 'restaurant' })}
          >
            ร้านอาหาร / คาเฟ่
          </button>
        </div>
        <p className="draft">{priceDisclaimer} · สกุลเงิน AUD</p>
      </section>
      <section className="service-picker">
        <p className="eyebrow">เลือกบริการที่คุณสนใจ</p>
        <div className="service-links">
          <Link to="/photography">
            <strong>01 / ช่างภาพ F&B / สปา ↗</strong>
            <span>ถ่ายอาหาร ร้านนวด และคอนเทนต์ร้านค้า</span>
          </Link>
          <a href="#web-packages">
            <strong>02 / เว็บไซต์และงานดูแล ↓</strong>
            <span>
              {type === 'restaurant'
                ? 'แพ็กหน้าร้านอาหาร: ติดตั้งครั้งเดียว + ค่าดูแลรายเดือน'
                : 'แพ็กเดียวกัน เน้นการจองและคิวร้านนวด'}
            </span>
          </a>
          <Link to="/contact?kind=other">
            <strong>03 / Beauty · Cleaning · Trades ↗</strong>
            <span>แนวทางขยาย / รับประเมินงาน ไม่ใช่ผลิตภัณฑ์พร้อมใช้</span>
          </Link>
        </div>
      </section>
      <PhotoPackages />
      <section className="price-content" id="web-packages">
        {type === 'restaurant' ? (
          <RestaurantPlans heading />
        ) : (
          <>
            <p className="note">ร้านนวดเป็นตลาดหลัก เดโมจองอยู่ในหน้าเดโมสามมุมมอง · ใช้ชุด Digital Shop / Owner Care / Growth</p>
            <PlansGrid />
          </>
        )}
        <div className="scope">
          <div>
            <p className="eyebrow">BEFORE WE BEGIN</p>
            <h2>
              ก่อนเริ่มงาน
              <br />
              <em>ใบเสนอราคาจะสรุปอะไร</em>
            </h2>
            <p>
              ตัวเลขบนหน้านี้ยังเป็นราคาทดลอง ใบเสนอราคาจริงจะเขียนเป็นลายลักษณ์อักษรหลังคุยกับร้าน ไม่ใช่ให้คุณกรอกภาษีหรือเงื่อนไขเอง
            </p>
          </div>
          <ul>
            <li>ค่าทำครั้งแรกเท่าไหร่ และในใบนั้นรวม GST หรือยัง</li>
            <li>ค่าดูแลรายเดือนเท่าไหร่ และเดือนนั้นช่วยอัปเดตอะไรได้บ้าง</li>
            <li>จะถ่ายกี่ภาพ แก้กี่รอบ และไปถ่ายที่ร้านหรือทำงานทางไกล</li>
            <li>ถ้าต้องใช้เครื่องพิมพ์ ข้อความ SMS หรือบริการบริษัทอื่น จะแยกคิดให้ชัด</li>
            <li>ส่งงานเมื่อไหร่ สอนใช้งานอย่างไร และมีเงื่อนไขบริการอะไรที่ตกลงกัน</li>
          </ul>
        </div>
      </section>
      <section className="cta">
        <h2>ยังไม่แน่ใจว่าต้องใช้แพ็กไหน?</h2>
        <p>เล่าวิธีทำงานของร้านก่อน แล้วค่อยกำหนดขอบเขตด้วยกัน</p>
        <Link className="btn" to={`/contact?kind=${type}`}>
          คุยเรื่องแพ็กเกจ ↗
        </Link>
      </section>
    </>
  )
}

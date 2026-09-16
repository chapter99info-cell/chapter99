import { Link } from 'react-router-dom'
import { TrustSummary } from '../components/TrustSummary'

export function AboutPage() {
  return (
    <>
      <section className="about-new">
        <div>
          <p className="eyebrow">THE PEOPLE BEHIND YOUR NEXT CHAPTER</p>
          <h1>
            Chapter99
            <br />
            <em>เริ่มจากความเข้าใจร้าน</em>
          </h1>
        </div>
        <div>
          <p className="about-lead">
            ร้านที่เจ้าของตั้งใจทำ
            <br />
            ควรมีงานดิจิทัลที่ช่วยให้วันทำงานง่ายขึ้น
          </p>
          <p>
            เรานำงานภาพถ่าย เว็บไซต์ และการดูแลหน้าร้านมาวางแผนร่วมกัน เพื่อให้ธุรกิจไทยในออสเตรเลียมีหน้าร้านออนไลน์ที่เป็นตัวเอง
            และมีขั้นตอนที่ทีมใช้งานเข้าใจ ทิศทางต่อไปคือเครือข่ายคนทำงานสร้างสรรค์และดิจิทัล ที่ส่งมอบงานตามขอบเขตเดียวกัน
            โดยเริ่มจากงานที่ร้านต้องการจริง
          </p>
          <p>เว็บนี้ใช้แนะนำบริการและนัดคุย ไม่ใช่ระบบสมัครสมาชิก รับเงิน หรือเปิดร้านอัตโนมัติ</p>
          <p>Digital Shop Operating System คือคำอธิบายงานที่เราช่วยดูแลด้านดิจิทัลของร้าน ไม่ใช่ชื่อซอฟต์แวร์ที่ติดตั้งเอง</p>
          <Link to="/work">ดูตัวอย่างงานออกแบบ ↗</Link>
        </div>
      </section>
      <TrustSummary />
      <section className="cta">
        <h2>อยากเล่าเรื่องร้านไหม?</h2>
        <Link className="btn" to="/contact">
          นัดคุยกับ Chapter99 ↗
        </Link>
      </section>
    </>
  )
}

import { useEffect } from 'react'
import styles from './PricingPage.module.css'

export default function PricingPage() {
  useEffect(() => {
    document.title = 'Chapter99 — แพ็กเกจถ่ายภาพ + เว็บไซต์ + Reels'
  }, [])

  return (
    <div className={styles.page} lang="th">
      <div className={styles.wrap}>
        <div className={styles.brand}>
          <span className={styles.dot}></span>
          <span>Chapter99 Solutions</span>
        </div>
        <div className={styles.head}>
          <h1>แพ็กเกจถ่ายภาพ + Reels + เว็บไซต์</h1>
          <p>สำหรับร้านอาหาร/ร้านนวดไทยในออสเตรเลีย จบครบทั้งภาพ วิดีโอ และหน้าเว็บ ในที่เดียว</p>
        </div>

        <div className={styles.promo}>
          <span>🔥 ราคาพิเศษสำหรับ 10 ร้านแรกเท่านั้น</span>
        </div>

        <div className={styles.pricingGrid}>
          <div className={styles.plan}>
            <h3>Starter</h3>
            <div className={styles.priceRow}>
              <div className={styles.setup}>ค่า Setup ครั้งเดียว $299</div>
              <div className={styles.price}>
                <span className={styles.strike}>$29</span>
                <span className={styles.now}>$19</span>
                <span className={styles.per}>/เดือน</span>
              </div>
            </div>
            <ul>
              <li>ถ่ายภาพ 2 ชม. (~25 รูปแต่ง)</li>
              <li>Link-hub 1 หน้า รวมทุกช่องทางสั่งอาหาร</li>
              <li>อัปเดตข้อมูล/เมนูเมื่อร้านขอ</li>
              <li>เหมาะกับร้านเล็ก งบจำกัด</li>
            </ul>
            <a className={styles.cta} href="tel:+61452044382">
              เลือกแพ็กนี้
            </a>
          </div>

          <div className={`${styles.plan} ${styles.featured}`}>
            <span className={styles.badge}>แนะนำ</span>
            <h3>Growth</h3>
            <div className={styles.priceRow}>
              <div className={`${styles.setup} ${styles.setupMuted}`}>ค่า Setup ครั้งเดียว $599</div>
              <div className={styles.price}>
                <span className={styles.strike}>$79</span>
                <span className={styles.now}>$49</span>
                <span className={styles.per}>/เดือน</span>
              </div>
            </div>
            <ul>
              <li>ถ่ายภาพครึ่งวัน (~50 รูปแต่ง)</li>
              <li>Reels 2 คลิปตอน setup</li>
              <li>เว็บไซต์เต็มรูปแบบ (Hero+เมนู+รีวิว+แผนที่)</li>
              <li>Reels ใหม่ 1 คลิป/เดือน</li>
            </ul>
            <a className={styles.cta} href="tel:+61452044382">
              เลือกแพ็กนี้
            </a>
          </div>

          <div className={styles.plan}>
            <h3>Premium</h3>
            <div className={styles.priceRow}>
              <div className={styles.setup}>ค่า Setup ครั้งเดียว $999</div>
              <div className={styles.price}>
                <span className={styles.strike}>$149</span>
                <span className={styles.now}>$89</span>
                <span className={styles.per}>/เดือน</span>
              </div>
            </div>
            <ul>
              <li>ถ่ายภาพเต็มวัน (~90 รูปแต่ง)</li>
              <li>Reels 4 คลิปตอน setup</li>
              <li>เว็บไซต์เต็มรูปแบบ + ปรับแบรนด์</li>
              <li>Reels ใหม่ 2 คลิป/เดือน + รีเฟรชภาพ 5-10 รูป</li>
            </ul>
            <a className={styles.cta} href="tel:+61452044382">
              เลือกแพ็กนี้
            </a>
          </div>
        </div>

        <div className={styles.rateNote}>
          <span className={styles.eyebrow}>เงื่อนไข</span>
          <table>
            <tbody>
              <tr>
                <td>รายการ</td>
                <td>รายละเอียด</td>
              </tr>
              <tr>
                <td>สัญญา</td>
                <td>รายเดือน ยกเลิกได้ทุกเดือน ไม่มีล็อก 12 เดือน</td>
              </tr>
              <tr>
                <td>โดเมน</td>
                <td>ฟรีโดเมนปีแรก (Growth ขึ้นไป)</td>
              </tr>
              <tr>
                <td>ราคาพิเศษ</td>
                <td>คงราคานี้ตลอดสำหรับ 10 ร้านแรก ร้านถัดไปใช้เรตปกติ</td>
              </tr>
              <tr>
                <td>อุปกรณ์</td>
                <td>ร้านจัดหา iPad/แท็บเล็ตของตัวเอง</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className={styles.terms}>
          ราคาไม่รวม GST · เสนอราคานี้เป็นราคาแนะนำ อาจปรับตามขอบเขตงานจริงของแต่ละร้าน
        </p>

        <div className={styles.ctaBand}>
          <div>
            <h3>พร้อมเริ่มงานให้ร้านคุณ?</h3>
            <p>ทักไลน์/โทรเพื่อนัดวันเข้าไปถ่ายงาน</p>
          </div>
          <a href="tel:+61452044382">โทร 0452 044 382</a>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { Link } from 'react-router-dom'

const frames = [
  {
    id: 'massage',
    src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกบรรยากาศนวด / ไม่ใช่ภาพร้านลูกค้า',
    label: 'นวด',
  },
  {
    id: 'food',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
    alt: 'ภาพสต็อกอาหารบนโต๊ะ / ไม่ใช่ภาพร้านลูกค้า',
    label: 'อาหาร',
  },
  {
    id: 'salon',
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80',
    alt: 'ภาพสต็อกร้านเสริมสวย / ไม่ใช่ภาพร้านลูกค้า',
    label: 'ร้านเสริมสวย',
  },
  {
    id: 'photo',
    src: 'https://images.unsplash.com/photo-1492693429561-45c31e4f4ff3?auto=format&fit=crop&w=900&q=80',
    alt: 'ภาพสต็อกกล้องถ่ายภาพ / ไม่ใช่ผลงานร้านจริง',
    label: 'ภาพถ่าย',
  },
  {
    id: 'shop',
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
    alt: 'ภาพสต็อกหน้าจอทำงาน / ไม่ใช่ระบบร้านจริง',
    label: 'หน้าร้านดิจิทัล',
  },
]

export function ShopEscape() {
  const [active, setActive] = useState(0)
  const hero = frames[active]
  const strips = frames.filter((_, i) => i !== active)

  return (
    <section className="shop-escape">
      <p className="eyebrow">LET'S START WITH YOUR SHOP</p>
      <h2>
        วันนี้มีงานอะไร
        <br />
        ที่ร้านอยากให้ช่วย
      </h2>
      <p>
        เล่าประเภทร้าน เมือง และวิธีรับลูกค้าที่ใช้อยู่ แล้วค่อยกำหนดขอบเขตด้วยกัน ภาพด้านล่างเป็นภาพสต็อกประกอบแนวคิด
        ไม่ใช่ภาพร้านลูกค้า
      </p>
      <div className="shop-escape-stage">
        <figure className="shop-escape-hero">
          <img src={hero.src} alt={hero.alt} />
          <figcaption>{hero.label}</figcaption>
        </figure>
        <ul>
          {strips.map((frame) => (
            <li key={frame.id}>
              <button type="button" onClick={() => setActive(frames.findIndex((item) => item.id === frame.id))}>
                <img src={frame.src} alt={frame.alt} />
                <span>{frame.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Link className="btn" to="/contact">
        นัดคุยกับ Chapter99 ↗
      </Link>
      <p className="note">เริ่มด้วยการคุยขอบเขต ยังไม่รับชำระเงินในต้นแบบนี้</p>
    </section>
  )
}

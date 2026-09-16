import { useState } from 'react'
import { Link } from 'react-router-dom'

const frames = [
  {
    src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกนวด / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกอาหาร / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกร้านเสริมสวย / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    src: 'https://images.unsplash.com/photo-1492693429561-45c31e4f4ff3?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกกล้อง / ไม่ใช่ผลงานร้านจริง',
  },
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกวิวทะเล / ประกอบแนวคิด ไม่ใช่ภาพร้าน',
  },
  {
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกธรรมชาติ / ประกอบแนวคิด ไม่ใช่ภาพร้าน',
  },
  {
    src: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกภายในร้าน / ไม่ใช่ภาพร้านลูกค้า',
  },
]

export function PricingHero() {
  const [start, setStart] = useState(0)
  const visible = 5
  const shown = Array.from({ length: visible }, (_, i) => frames[(start + i) % frames.length])
  const mid = Math.floor(visible / 2)

  return (
    <section className="pricing-stage">
      <p className="pricing-stage-pill">เลือกแพ็กให้ตรงร้าน · ยังไม่รับชำระบนหน้านี้</p>
      <h1>
        เลือกให้ตรงกับร้าน
        <br />
        <em>เห็นค่าใช้จ่ายให้ชัด</em>
      </h1>
      <p className="lead">
        แยกค่าจัดทำครั้งแรกและค่าดูแลรายเดือน พร้อมขอบเขตที่ต้องคุยก่อนเริ่มงาน
      </p>
      <div className="pricing-stage-strip">
        <button
          type="button"
          className="pricing-stage-arrow"
          aria-label="ภาพก่อนหน้า"
          onClick={() => setStart((s) => (s - 1 + frames.length) % frames.length)}
        >
          ‹
        </button>
        <ul>
          {shown.map((frame, i) => (
            <li key={`${frame.src}-${i}`} className={i === mid ? 'is-mid' : undefined}>
              <img src={frame.src} alt={frame.alt} />
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="pricing-stage-arrow"
          aria-label="ภาพถัดไป"
          onClick={() => setStart((s) => (s + 1) % frames.length)}
        >
          ›
        </button>
        <Link className="btn pricing-stage-cta" to="/contact">
          นัดคุยเรื่องร้าน
        </Link>
      </div>
    </section>
  )
}

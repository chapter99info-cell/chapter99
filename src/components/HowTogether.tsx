import { useState } from 'react'
import { Link } from 'react-router-dom'

const steps = [
  {
    n: '01',
    title: 'คุยและกำหนดงาน',
    body: 'ดูวิธีรับลูกค้าเดิม ตกลงราคาและขอบเขตก่อนเริ่ม',
    prompt: 'เล่าให้ฟังหน่อยว่าร้านรับลูกค้าอยู่ทางไหน',
  },
  {
    n: '02',
    title: 'ส่งข้อมูลและภาพร้าน',
    body: 'รวบรวมบริการ ราคา เวลาร้าน และนัดถ่ายภาพเมื่อเลือกบริการ',
    prompt: 'มีรูปหน้าร้านหรือรายการบริการอยู่แล้วไหม?',
  },
  {
    n: '03',
    title: 'เราจัดทำ คุณตรวจ',
    body: 'ดูตัวอย่าง ตรวจข้อมูลและทดลองใช้ร่วมกับทีม',
    prompt: 'อยากให้ทีมลองดูตัวอย่างก่อนเปิดใช้ไหม?',
  },
  {
    n: '04',
    title: 'เปิดใช้และดูแลต่อ',
    body: 'เปิดเมื่อคุณยืนยัน พร้อมช่องทางช่วยเหลือตามที่ตกลง',
    prompt: 'เปิดใช้เมื่อพร้อม แล้วมีคนช่วยดูแลต่อตามขอบเขต',
  },
] as const

export function HowTogether() {
  const [active, setActive] = useState(0)
  const step = steps[active]

  return (
    <section id="how" className="how-together reveal">
      <div className="section-title">
        <div>
          <p className="eyebrow">03 / WE WALK THROUGH IT TOGETHER</p>
          <h2>
            คุณไม่ต้องเก่งเทคโนโลยี
            <br />
            <em>เราค่อย ๆ เริ่มด้วยกัน</em>
          </h2>
        </div>
      </div>
      <div className="how-stage">
        <div className="how-scene">
          <img
            src="https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=80"
            alt="ภาพสต็อกบรรยากาศร้านนวด / ไม่ใช่ภาพร้านจริง"
          />
          <p className="how-scene-cap">ภาพสต็อกประกอบแนวคิด</p>
          <div className="how-card">
            <p className="how-card-label">เริ่มจากคุยกัน</p>
            <p className="how-card-q">{step.prompt}</p>
            <div className="how-card-bar">
              <span>ภาษาไทยได้</span>
              <Link className="btn small" to="/contact">
                นัดคุยเรื่องร้าน ↗
              </Link>
            </div>
            <p className="note">กดเพื่อเปิดหน้าติดต่อ ไม่ส่งข้อความอัตโนมัติ</p>
          </div>
        </div>
        <ol className="how-steps">
          {steps.map((item, i) => (
            <li key={item.n}>
              <button type="button" aria-pressed={i === active} onClick={() => setActive(i)}>
                <span>
                  {item.n} — {item.title}
                </span>
                <p>{item.body}</p>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

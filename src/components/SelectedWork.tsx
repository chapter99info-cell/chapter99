import { useState } from 'react'
import { Link } from 'react-router-dom'

const projects = [
  {
    id: 'wellness',
    menu: 'Wellness & calm',
    title: 'บ้านละมุน',
    note: 'ร้านสมมติ · ภาพแนวคิดและเดโมการจอง',
    to: '/massage',
    link: 'ดูแนวคิดร้านนวด ↗',
    image: '/images/concept-wellness.svg',
    alt: 'ภาพแนวคิดร้านนวด / ไม่ใช่ภาพร้านจริง',
    tag: 'WELLNESS / CONCEPT',
  },
  {
    id: 'food',
    menu: 'Food & hospitality',
    title: 'ร้านอาหารและเมนู',
    note: 'บอร์ดแนวคิด · เว็บไซต์ เมนู และงานหน้าร้าน',
    to: '/restaurants',
    link: 'ดูแนวคิดร้านอาหาร ↗',
    image: '/images/concept-restaurant.svg',
    alt: 'ภาพแนวคิดเว็บร้านอาหาร / ไม่ใช่ภาพร้านจริง',
    tag: 'FOOD / CONCEPT',
  },
] as const

export function SelectedWork() {
  const [id, setId] = useState<(typeof projects)[number]['id']>('wellness')
  const project = projects.find((p) => p.id === id) ?? projects[0]

  return (
    <section className="selected-work reveal" id="selected-work">
      <div className="section-title">
        <div>
          <p className="eyebrow">A FEW POSSIBILITIES</p>
          <h2>
            Selected
            <br />
            <em>directions.</em>
          </h2>
        </div>
        <p>
          กดเลือกเพื่อสำรวจงานแต่ละแนว
          <br />
          ภาพประกอบแนวคิดสำหรับคุยทิศทาง ไม่ใช่ผลงานร้านจริง
        </p>
      </div>
      <div className="project-stage">
        <div className="project-menu" role="group" aria-label="เลือกงานตัวอย่าง">
          {projects.map((p, i) => (
            <button key={p.id} type="button" aria-pressed={id === p.id} onClick={() => setId(p.id)}>
              <span>0{i + 1}</span> {p.menu} <b>↗</b>
            </button>
          ))}
          <div className="project-caption" aria-live="polite">
            <h3>{project.title}</h3>
            <p>{project.note}</p>
            <Link to={project.to}>{project.link}</Link>
          </div>
        </div>
        <div className={`project-image${project.id === 'food' ? ' food' : ''}`}>
          <img src={project.image} alt={project.alt} />
          <span>{project.tag}</span>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'

const steps = [
  {
    n: '01',
    title: 'ทุกคนเห็นบนเว็บ',
    body: 'คำอธิบายบริการ ราคา ความรับผิดชอบของร้าน สรุปข้อมูล และคำถามที่พบบ่อย',
  },
  {
    n: '02',
    title: 'ตอนจะซื้อ',
    body: 'Terms รายละเอียดราคา ค่าจัดทำ การยกเลิก คืนเงิน ความเป็นเจ้าของข้อมูล และบริการภายนอก',
  },
  {
    n: '03',
    title: 'เอกสารเต็ม',
    body: 'Privacy, Cookie, Acceptable Use, Data & Security, AI, Complaints',
  },
]

export function LegalLayersSteps() {
  const stageRef = useRef<HTMLElement>(null)
  const [spot, setSpot] = useState({ x: 50, y: 40 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduce.current) return
    const el = stageRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width) * 100
    const ny = ((e.clientY - r.top) / r.height) * 100
    setSpot({ x: nx, y: ny })
    setTilt({
      x: (e.clientX - r.left) / r.width - 0.5,
      y: (e.clientY - r.top) / r.height - 0.5,
    })
  }

  function onLeave() {
    setSpot({ x: 50, y: 40 })
    setTilt({ x: 0, y: 0 })
  }

  return (
    <section
      ref={stageRef}
      className="legal-how"
      aria-labelledby="legal-how-title"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={
        {
          '--spot-x': `${spot.x}%`,
          '--spot-y': `${spot.y}%`,
          '--tilt-x': `${tilt.x}`,
          '--tilt-y': `${tilt.y}`,
        } as CSSProperties
      }
    >
      <p className="legal-how-eyebrow">HOW IT WORKS</p>
      <h2 id="legal-how-title">สามชั้นจากหน้าเว็บถึงเอกสารเต็ม</h2>
      <ol className="legal-how-steps">
        {steps.map((step, i) => (
          <li
            key={step.n}
            style={{
              transform: reduce.current
                ? undefined
                : `translate(${tilt.x * (10 + i * 6)}px, ${tilt.y * (8 - i * 2)}px)`,
            }}
          >
            <span className="legal-how-num">{step.n}</span>
            <strong>{step.title}</strong>
            <p>{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

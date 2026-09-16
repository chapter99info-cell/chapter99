import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Cookie, Lock, Scale, Server, Shield } from 'lucide-react'
import { legalDocs } from '../data/legal'

const icons = {
  privacy: Shield,
  cookies: Cookie,
  'acceptable-use': Scale,
  'data-security': Lock,
  subprocessors: Server,
  ai: Bot,
} as const

const docs = legalDocs.filter((d) => d.layer === 'policy')

export function LegalPolicyPath() {
  const stageRef = useRef<HTMLElement>(null)
  const [spot, setSpot] = useState({ x: 50, y: 28 })
  const [shifts, setShifts] = useState(() => docs.map(() => ({ x: 0, y: 0 })))
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduce.current) return
    const stage = stageRef.current
    if (!stage) return
    const box = stage.getBoundingClientRect()
    setSpot({
      x: ((e.clientX - box.left) / box.width) * 100,
      y: ((e.clientY - box.top) / box.height) * 100,
    })
    const cards = stage.querySelectorAll<HTMLElement>('.legal-path-card')
    setShifts(
      Array.from(cards).map((card) => {
        const r = card.getBoundingClientRect()
        const dx = (e.clientX - (r.left + r.width / 2)) / 28
        const dy = (e.clientY - (r.top + r.height / 2)) / 36
        return {
          x: Math.max(-10, Math.min(10, dx)),
          y: Math.max(-8, Math.min(8, dy)),
        }
      }),
    )
  }

  function onLeave() {
    setSpot({ x: 50, y: 28 })
    setShifts(docs.map(() => ({ x: 0, y: 0 })))
  }

  return (
    <section
      ref={stageRef}
      className="legal-path"
      aria-labelledby="legal-path-title"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ '--spot-x': `${spot.x}%`, '--spot-y': `${spot.y}%` } as CSSProperties}
    >
      <h2 id="legal-path-title">Privacy / Policy</h2>
      <p className="legal-path-lead">นโยบายที่อ่านก่อนใช้ระบบ — เก็บเท่าที่จำเป็น และแยกจากการตลาด</p>
      <ol className="legal-path-list">
        {docs.map((doc, i) => {
          const Icon = icons[doc.slug as keyof typeof icons] ?? Shield
          const shift = shifts[i] ?? { x: 0, y: 0 }
          return (
            <li key={doc.slug}>
              <span className="legal-path-num">{String(i + 1).padStart(2, '0')}</span>
              <Link
                className="legal-path-card"
                to={`/legal/${doc.slug}`}
                style={{
                  transform: reduce.current ? undefined : `translate(${shift.x}px, ${shift.y}px)`,
                }}
              >
                <span className="legal-path-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <span>
                  <strong>
                    {doc.titleTh} / {doc.titleEn}
                  </strong>
                  <small>{doc.summary}</small>
                </span>
              </Link>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

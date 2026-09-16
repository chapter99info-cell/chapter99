import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Activity, FileText, Layers, MessageCircleQuestion, Receipt, Store } from 'lucide-react'
import { Link } from 'react-router-dom'
import { legalDocs } from '../data/legal'

const intro = [
  {
    Icon: Layers,
    title: 'Chapter99 ดูแลงานดิจิทัล',
    body: 'เว็บไซต์ ระบบจอง การจัดการลูกค้า การสื่อสาร และงานอัตโนมัติ ตามแพ็กเกจที่ซื้อ ไม่ได้แทนเจ้าของร้าน',
  },
  {
    Icon: Store,
    title: 'ร้านดูแลธุรกิจและบริการวิชาชีพ',
    body: 'คุณภาพบริการ พนักงาน ราคา ใบอนุญาต และลูกค้าปลายทางยังเป็นความรับผิดชอบของเจ้าของธุรกิจ',
  },
]

const extraIcons = {
  availability: Activity,
  complaints: MessageCircleQuestion,
  terms: FileText,
  refunds: Receipt,
} as const

export function LegalBoundaryPath() {
  const docs = [
    ...legalDocs.filter((d) => d.layer === 'web'),
    ...legalDocs.filter((d) => d.layer === 'terms'),
  ]

  const stageRef = useRef<HTMLElement>(null)
  const [spot, setSpot] = useState({ x: 18, y: 18 })
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
  }

  function onLeave() {
    setSpot({ x: 18, y: 18 })
  }

  return (
    <section
      ref={stageRef}
      className="legal-light"
      aria-labelledby="legal-light-title"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ '--spot-x': `${spot.x}%`, '--spot-y': `${spot.y}%` } as CSSProperties}
    >
      <h2 id="legal-light-title">เส้นแบ่งงาน</h2>
      <p className="legal-light-lead">
        Chapter99 เป็นผู้ให้บริการเทคโนโลยีและงานดิจิทัลของร้าน ลูกค้าเป็นเจ้าของธุรกิจและบริการวิชาชีพ
        คุณดูแลลูกค้า เราดูแลร้านในโลกดิจิทัล
      </p>
      <ol className="legal-light-list">
        {intro.map((item) => (
          <li key={item.title}>
            <span className="legal-light-icon" aria-hidden="true">
              <item.Icon size={18} strokeWidth={1.75} />
            </span>
            <div>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
            </div>
          </li>
        ))}
        {docs.map((doc) => {
          const Icon = extraIcons[doc.slug as keyof typeof extraIcons] ?? FileText
          return (
            <li key={doc.slug}>
              <span className="legal-light-icon" aria-hidden="true">
                <Icon size={18} strokeWidth={1.75} />
              </span>
              <div>
                <Link to={`/legal/${doc.slug}`}>
                  {doc.titleTh} / {doc.titleEn}
                </Link>
                <p>{doc.summary}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

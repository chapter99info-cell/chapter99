import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { currencyNote, plans, priceDisclaimer, type Plan } from '../data/pricing'

const custom = {
  id: 'custom',
  eyebrow: 'CUSTOM',
  title: 'คุยเฉพาะร้าน',
  monthlyLabel: 'ตามงาน',
  monthlyNote: 'ใบเสนอราคา',
  setupLabel: 'ยืนยันก่อนเริ่ม',
  includes: [
    'ขอบเขตตามร้านจริง',
    'แยกค่าจัดทำและค่าดูแล',
    'ยังไม่รับชำระบนหน้านี้',
    'นัดคุยก่อนเริ่มงาน',
  ],
  cta: 'นัดคุยแพ็กเฉพาะร้าน ↗',
}

type View = 'month' | 'setup'

function priceFor(plan: Plan | typeof custom, view: View) {
  if (plan.id === 'custom') {
    return view === 'month'
      ? { big: 'ตามงาน', small: 'กำหนดในใบเสนอราคา' }
      : { big: 'คุยก่อน', small: 'ยังไม่ตั้งยอดขาย' }
  }
  const p = plan as Plan
  return view === 'month'
    ? { big: p.monthlyLabel, small: p.monthlyNote }
    : { big: 'ครั้งแรก', small: p.setupLabel.replace('ค่าจัดทำครั้งแรก: ', '') }
}

export function PlansGrid({ note, compact }: { note?: string; compact?: boolean }) {
  const boardRef = useRef<HTMLDivElement>(null)
  const [view, setView] = useState<View>('month')
  const [hover, setHover] = useState<string | null>(null)
  const [spot, setSpot] = useState({ x: 50, y: 40 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  function onMove(e: MouseEvent<HTMLDivElement>) {
    if (reduce.current) return
    const box = boardRef.current?.getBoundingClientRect()
    if (!box) return
    const x = ((e.clientX - box.left) / box.width) * 100
    const y = ((e.clientY - box.top) / box.height) * 100
    setSpot({ x, y })
    setTilt({ x: (x - 50) / 18, y: (y - 40) / 22 })
  }

  const cards = [...plans, custom]

  return (
    <div
      className="simple-price"
      ref={boardRef}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setTilt({ x: 0, y: 0 })
        setHover(null)
      }}
      style={
        {
          '--spot-x': `${spot.x}%`,
          '--spot-y': `${spot.y}%`,
        } as CSSProperties
      }
    >
      <div className="simple-price-head">
        <h3>ค่าดูแลรายเดือนและค่าทำครั้งแรก</h3>
        <p>สลับมุมมองด้านล่างได้ ค่าทำครั้งแรกยังไม่ตั้งยอดบนเว็บ ต้องระบุในใบเสนอราคา</p>
        <div className="simple-price-toggle" role="group" aria-label="มุมมองราคา">
          <button type="button" aria-pressed={view === 'month'} onClick={() => setView('month')}>
            รายเดือน
          </button>
          <button type="button" aria-pressed={view === 'setup'} onClick={() => setView('setup')}>
            ค่าจัดทำครั้งแรก
          </button>
        </div>
      </div>
      <ul className="simple-price-row">
        {cards.map((plan, i) => {
          const featured = 'featured' in plan && plan.featured
          const dark = plan.id === 'custom'
          const price = priceFor(plan, view)
          const dx = hover === plan.id && !reduce.current ? tilt.x : tilt.x * 0.25
          const dy = hover === plan.id && !reduce.current ? tilt.y : tilt.y * 0.2
          return (
            <li
              key={plan.id}
              className={`simple-price-card${featured ? ' is-featured' : ''}${dark ? ' is-dark' : ''}${hover === plan.id ? ' is-hot' : ''}`}
              style={{
                transform: `translate(${dx * (i - 1.5) * 0.4}px, ${dy}px)`,
              }}
              onMouseEnter={() => setHover(plan.id)}
            >
              {featured ? <span className="simple-price-badge">แนะนำเมื่อร้านพร้อมดูแลต่อ</span> : null}
              <p className="eyebrow">{plan.eyebrow}</p>
              <h4>{plan.title}</h4>
              <p className="simple-price-amount">
                {price.big} <small>{price.small}</small>
              </p>
              <ul>
                {plan.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {!compact && plan.id !== 'custom'
                ? (plan as Plan).limits.map((item) => (
                    <p className="simple-price-limit" key={item}>
                      {item}
                    </p>
                  ))
                : null}
              <Link to={`/contact?plan=${plan.id}`}>{plan.cta}</Link>
            </li>
          )
        })}
      </ul>
      {compact ? null : <p className="note">{note ?? `${priceDisclaimer} · ${currencyNote}`}</p>}
    </div>
  )
}

import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Cpu, Lock, ShieldCheck, Store, UserRound } from 'lucide-react'

const items = [
  {
    q: 'Chapter99 คืออะไร',
    a: 'ระบบ Digital Shop ที่ช่วยธุรกิจบริการเรื่องหน้าร้านออนไลน์ การจอง ลูกค้า และงานดิจิทัลประจำวัน',
    actor: 'Chapter99',
    badges: [
      { label: 'แพลตฟอร์ม', tone: 'gold' },
      { label: 'ข้อมูลบนเว็บ', tone: 'ok' },
    ],
    meta: 'ชั้น 1',
    Icon: Store,
  },
  {
    q: 'อะไรเป็นของคุณ',
    a: 'ธุรกิจ ความสัมพันธ์กับลูกค้า เนื้อหาร้าน และการตัดสินใจของร้าน ยังเป็นของคุณ',
    actor: 'เจ้าของร้าน',
    badges: [{ label: 'ความเป็นเจ้าของ', tone: 'mint' }],
    meta: 'ร้านของคุณ',
    Icon: UserRound,
  },
  {
    q: 'เราดูแลอะไร',
    a: 'เทคโนโลยี อัตโนมัติ และโครงสร้างดิจิทัลที่ช่วยให้ร้านในโลกออนไลน์เดินได้ ตามแพ็กเกจที่ซื้อ',
    actor: 'ทีม Chapter99',
    badges: [
      { label: 'เทคโนโลยี', tone: 'gold' },
      { label: 'งานดิจิทัล', tone: 'ok' },
    ],
    meta: 'ขอบเขตเรา',
    Icon: Cpu,
  },
  {
    q: 'คุณรับผิดชอบอะไร',
    a: 'บริการ พนักงาน ราคา การปฏิบัติตามกฎหมายของร้าน และข้อมูลที่คุณอนุมัติให้ออกสู่สาธารณะ',
    actor: 'เจ้าของร้าน',
    badges: [{ label: 'ความรับผิดชอบ', tone: 'warn' }],
    meta: 'ร้านของคุณ',
    Icon: ShieldCheck,
  },
  {
    q: 'ข้อมูลถูกใช้อย่างไร',
    a: 'เราเก็บเท่าที่จำเป็น และใช้แนวทางสิทธิ์ ความปลอดภัย และความเป็นส่วนตัวเพื่อให้บริการ',
    actor: 'Privacy',
    badges: [
      { label: 'ความปลอดภัย', tone: 'ok' },
      { label: 'เก็บเท่าที่จำเป็น', tone: 'mint' },
    ],
    meta: 'นโยบาย',
    Icon: Lock,
  },
]

export function TrustSummary() {
  const feedRef = useRef<HTMLOListElement>(null)
  const [spot, setSpot] = useState({ x: 28, y: 22 })
  const [active, setActive] = useState<number | null>(null)
  const [shifts, setShifts] = useState(() => items.map(() => ({ x: 0, y: 0 })))
  const reduce = useRef(false)

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  function onMove(e: MouseEvent<HTMLOListElement>) {
    if (reduce.current) return
    const feed = feedRef.current
    if (!feed) return
    const box = feed.getBoundingClientRect()
    setSpot({
      x: ((e.clientX - box.left) / box.width) * 100,
      y: ((e.clientY - box.top) / box.height) * 100,
    })
    const rows = feed.querySelectorAll<HTMLElement>('.trust-feed-row')
    setShifts(
      Array.from(rows).map((row) => {
        const r = row.getBoundingClientRect()
        return {
          x: Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) / 32)),
          y: Math.max(-5, Math.min(5, (e.clientY - (r.top + r.height / 2)) / 40)),
        }
      }),
    )
  }

  function onLeave() {
    setSpot({ x: 28, y: 22 })
    setActive(null)
    setShifts(items.map(() => ({ x: 0, y: 0 })))
  }

  return (
    <section className="trust-summary reveal" aria-labelledby="trust-heading">
      <div className="trust-summary-head">
        <p className="eyebrow">CUSTOMER INFORMATION</p>
        <h2 id="trust-heading">
          เข้าใจใน 30 วินาที
          <br />
          <em>ก่อนอ่านเอกสารเต็ม</em>
        </h2>
        <p>
          Chapter99 เป็นผู้ให้บริการเทคโนโลยีและงานดิจิทัล ไม่ได้แทนเจ้าของร้านหรือบริการวิชาชีพของร้าน
          คุณดูแลลูกค้า เราดูแลร้านในโลกดิจิทัล
        </p>
      </div>
      <ol
        ref={feedRef}
        className={`trust-feed${active !== null ? ' is-reading' : ''}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ '--spot-x': `${spot.x}%`, '--spot-y': `${spot.y}%` } as CSSProperties}
      >
        {items.map((item, i) => {
          const shift = shifts[i] ?? { x: 0, y: 0 }
          const hot = active === i
          return (
            <li
              key={item.q}
              className={`trust-feed-row${hot ? ' is-hot' : ''}`}
              onMouseEnter={() => setActive(i)}
              style={
                reduce.current
                  ? undefined
                  : {
                      transform: `translate(${hot ? shift.x : shift.x * 0.35}px, ${hot ? shift.y : shift.y * 0.2}px)`,
                    }
              }
            >
              <span className="trust-feed-icon" aria-hidden="true">
                <item.Icon size={18} strokeWidth={1.75} />
              </span>
              <div className="trust-feed-body">
                <p className="trust-feed-title">{item.q}</p>
                <p className="trust-feed-copy">{item.a}</p>
                <div className="trust-feed-meta">
                  <span className="trust-feed-actor">{item.actor}</span>
                  {item.badges.map((badge) => (
                    <span key={badge.label} className={`trust-pill trust-pill-${badge.tone}`}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
              <span className="trust-feed-when">{item.meta}</span>
            </li>
          )
        })}
      </ol>
      <p className="trust-more">
        <Link to="/legal">อ่าน Legal & Trust Centre ↗</Link>
      </p>
    </section>
  )
}

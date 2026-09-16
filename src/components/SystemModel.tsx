import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'

const items = [
  {
    kicker: '01 / DISCOVER',
    title: 'เว็บไซต์ร้าน',
    body: 'ภาพ บริการ ราคา และช่องทางติดต่อที่ลูกค้าเปิดดูจากมือถือได้',
    icon: 'globe',
  },
  {
    kicker: '02 / BOOK',
    title: 'การจองและคิว',
    body: 'เส้นทางลูกค้าขอจอง เจ้าของรับคิว และพนักงานทำงานต่อ',
    icon: 'cal',
  },
  {
    kicker: '03 / ORGANISE',
    title: 'ลูกค้าและทีม',
    body: 'วางข้อมูลที่แต่ละหน้าที่จำเป็นต้องใช้ ให้ทีมเห็นตรงกัน',
    icon: 'users',
  },
  {
    kicker: '04 / FOLLOW UP',
    title: 'ข้อความแจ้งเตือน',
    body: 'กำหนดอีเมลหรือ SMS ตามงานที่ต้องใช้และบริการที่รองรับ',
    icon: 'bell',
  },
  {
    kicker: '05 / RECORD',
    title: 'ใบเสร็จและรายงาน',
    body: 'ประเมินเอกสารและรายงานตามร้าน รวมถึง Health Fund เมื่อรองรับ',
    icon: 'file',
  },
  {
    kicker: '06 / KEEP IT CURRENT',
    title: 'Owner Care',
    body: 'กำหนดรอบอัปเดตข้อมูลและช่องทางช่วยเหลือหลังเปิดใช้งาน',
    icon: 'care',
  },
]

function Icon({ name }: { name: string }) {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 } as const
  if (name === 'globe')
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </svg>
    )
  if (name === 'cal')
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </svg>
    )
  if (name === 'users')
    return (
      <svg {...common}>
        <circle cx="9" cy="8" r="3" />
        <circle cx="16" cy="9" r="2.4" />
        <path d="M4 19a5 5 0 0 1 10 0M14 19a4 4 0 0 1 6 0" />
      </svg>
    )
  if (name === 'bell')
    return (
      <svg {...common}>
        <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" />
        <path d="M10 21a2 2 0 0 0 4 0" />
      </svg>
    )
  if (name === 'file')
    return (
      <svg {...common}>
        <path d="M7 3h7l5 5v13H7z" />
        <path d="M14 3v5h5M9 13h6M9 17h6" />
      </svg>
    )
  return (
    <svg {...common}>
      <path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z" />
    </svg>
  )
}

export function SystemModel() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useRef(false)
  const [spot, setSpot] = useState({ x: 72, y: 28 })
  const [hot, setHot] = useState<string | null>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    reduce.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  function onMove(e: MouseEvent<HTMLElement>) {
    if (reduce.current) return
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    const x = ((e.clientX - box.left) / box.width) * 100
    const y = ((e.clientY - box.top) / box.height) * 100
    setSpot({ x, y })
    setTilt({ x: (x - 58) / 14, y: (y - 40) / 18 })
  }

  return (
    <section
      id="system"
      ref={ref}
      className="how-model reveal"
      onMouseMove={onMove}
      onMouseLeave={() => {
        setTilt({ x: 0, y: 0 })
        setHot(null)
      }}
      style={{ '--spot-x': `${spot.x}%`, '--spot-y': `${spot.y}%` } as CSSProperties}
    >
      <div className="how-model-copy">
        <p className="eyebrow">OUR MODEL</p>
        <h2>
          งานดิจิทัลของร้าน
          <br />
          <em>ควรต่อกันเป็นเรื่องเดียว</em>
        </h2>
        <p>ภาพรวมสิ่งที่เราจะวางให้เหมาะกับร้าน เลือกเฉพาะงานที่ต้องใช้ แล้วค่อยขยาย ไม่ใช่การยืนยันว่าทุกความสามารถเปิดใช้แล้วในทุกแพ็กเกจ</p>
        <Link className="how-model-cta" to="/#how">
          ดูวิธีเริ่มงาน ↗
        </Link>
      </div>
      <div className="how-model-grid">
        {items.map((item, i) => (
          <article
            key={item.kicker}
            className={hot === item.kicker ? 'is-hot' : undefined}
            style={{
              transform: `translate(${tilt.x * (i % 2 === 0 ? 0.6 : 1)}px, ${tilt.y * (i < 2 ? 0.8 : 1.1)}px)`,
            }}
            onMouseEnter={() => setHot(item.kicker)}
          >
            <span className="how-model-icon" aria-hidden="true">
              <Icon name={item.icon} />
            </span>
            <p className="how-model-kicker">{item.kicker}</p>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

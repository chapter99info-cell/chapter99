import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import {
  Ban,
  Bot,
  CalendarCheck,
  CreditCard,
  FileText,
  Globe,
  HeartPulse,
  Image,
  KeyRound,
  Layers,
  LogOut,
  ShieldOff,
  TrendingDown,
  WifiOff,
} from 'lucide-react'

const icons = [
  FileText,
  Layers,
  ShieldOff,
  KeyRound,
  CreditCard,
  CalendarCheck,
  HeartPulse,
  Image,
  Bot,
  WifiOff,
  LogOut,
  Globe,
  TrendingDown,
  Ban,
]

type Item = { heading: string; paras: string[] }

function label(heading: string) {
  return heading.replace(/^\d+\.\s*/, '')
}

export function LegalReadPath({
  title,
  lead,
  items,
}: {
  title: string
  lead: string
  items: Item[]
}) {
  const stageRef = useRef<HTMLElement>(null)
  const [spot, setSpot] = useState({ x: 42, y: 18 })
  const [active, setActive] = useState<number | null>(null)
  const [nudge, setNudge] = useState({ x: 0, y: 0 })
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
    const target = (e.target as HTMLElement).closest('.legal-read-card')
    if (!target) {
      setNudge({ x: 0, y: 0 })
      return
    }
    const r = target.getBoundingClientRect()
    setNudge({
      x: Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) / 24)),
      y: Math.max(-6, Math.min(6, (e.clientY - (r.top + r.height / 2)) / 30)),
    })
  }

  function onLeave() {
    setSpot({ x: 42, y: 18 })
    setActive(null)
    setNudge({ x: 0, y: 0 })
  }

  return (
    <section
      ref={stageRef}
      className={`legal-path legal-read${active !== null ? ' is-reading' : ''}`}
      aria-labelledby="legal-read-title"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ '--spot-x': `${spot.x}%`, '--spot-y': `${spot.y}%` } as CSSProperties}
    >
      <h2 id="legal-read-title">{title}</h2>
      <p className="legal-path-lead">{lead}</p>
      <ol className="legal-path-list">
        {items.map((item, i) => {
          const Icon = icons[i % icons.length]
          const hot = active === i
          return (
            <li key={item.heading}>
              <span className={`legal-path-num${hot ? ' is-hot' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
              <article
                className={`legal-path-card legal-read-card${hot ? ' is-hot' : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
                style={
                  hot && !reduce.current
                    ? { transform: `translate(${nudge.x}px, ${nudge.y}px) scale(1.015)` }
                    : undefined
                }
              >
                <span className="legal-path-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <div>
                  <strong>{label(item.heading)}</strong>
                  {item.paras.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </article>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

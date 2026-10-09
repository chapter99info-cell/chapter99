import { useEffect, useState } from 'react'
import { FOOD_APP_SHOTS, FOOD_APP_URL, FOOD_DEMO_NOTE, FOOD_DEMO_TAB } from '../../data/foodDemo'

const TABS = [
  { src: '/demo/demo-booking.html', label: 'จองคิว · ร้านนวด' },
  { src: FOOD_DEMO_TAB, label: 'สั่งอาหาร · ร้านอาหาร' },
] as const

type Props = {
  src: string | null
  onClose: () => void
  onChange: (src: string) => void
}

export function DemoModal({ src, onClose, onChange }: Props) {
  const [shot, setShot] = useState(0)
  const food = src === FOOD_DEMO_TAB

  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (!food) return
      if (e.key === 'ArrowRight') setShot((n) => (n + 1) % FOOD_APP_SHOTS.length)
      if (e.key === 'ArrowLeft') setShot((n) => (n + FOOD_APP_SHOTS.length - 1) % FOOD_APP_SHOTS.length)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [src, onClose, food])

  if (!src) return null

  return (
    <div
      className="dmodal"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="dphone">
        <div className="dtabs">
          {TABS.map((tab) => (
            <button
              type="button"
              key={tab.src}
              className={tab.src === src ? 'on' : ''}
              onClick={() => onChange(tab.src)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button type="button" className="dclose" aria-label="ปิด" onClick={onClose}>
          ✕
        </button>
        {food ? (
          <div className="dfood">
            <span className="dfood__badge">DEMO</span>
            <img src={FOOD_APP_SHOTS[shot].src} alt={FOOD_APP_SHOTS[shot].alt} width={366} height={720} />
            <div className="dfood__nav">
              <button type="button" aria-label="ภาพก่อนหน้า" onClick={() => setShot((n) => (n + FOOD_APP_SHOTS.length - 1) % FOOD_APP_SHOTS.length)}>
                ‹
              </button>
              <span>
                {shot + 1} / {FOOD_APP_SHOTS.length}
              </span>
              <button type="button" aria-label="ภาพถัดไป" onClick={() => setShot((n) => (n + 1) % FOOD_APP_SHOTS.length)}>
                ›
              </button>
            </div>
            <p className="dfood__note">{FOOD_DEMO_NOTE}</p>
            <a className="dfood__open" href={FOOD_APP_URL} target="_blank" rel="noopener">
              เปิดดูแอปจริง
            </a>
          </div>
        ) : (
          <iframe title="เดโม" src={src} loading="lazy" />
        )}
      </div>
    </div>
  )
}

import { useEffect } from 'react'

const TABS = [
  { src: '/demo/demo-booking.html', label: 'จองคิว · ร้านนวด' },
  { src: '/demo/demo-order.html', label: 'สั่งอาหาร · ร้านอาหาร' },
] as const

type Props = {
  src: string | null
  onClose: () => void
  onChange: (src: string) => void
}

export function DemoModal({ src, onClose, onChange }: Props) {
  useEffect(() => {
    if (!src) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [src, onClose])

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
        <iframe title="เดโม" src={src} loading="lazy" />
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { BeforeAfterItem } from '../../data/photoPortfolio'

type Props = { item: BeforeAfterItem }

export function CompareSlider({ item }: Props) {
  const [pos, setPos] = useState(50)

  const apply = (next: number) => setPos(Math.min(100, Math.max(0, next)))

  return (
    <div>
      <div className="slider" style={{ ['--pos' as string]: `${pos}%` }}>
        <img
          src={item.before.src}
          alt={item.before.alt}
          width={item.before.width ?? 1200}
          height={item.before.height ?? 800}
          loading="lazy"
        />
        <img
          className="slider__after"
          src={item.after.src}
          alt={item.after.alt}
          width={item.after.width ?? 1200}
          height={item.after.height ?? 800}
          loading="lazy"
        />
        <div className="slider__bar" aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          aria-label="เปรียบเทียบก่อนและหลัง"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pos}
          onChange={(e) => apply(Number(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') {
              e.preventDefault()
              apply(pos - 5)
            }
            if (e.key === 'ArrowRight') {
              e.preventDefault()
              apply(pos + 5)
            }
            if (e.key === 'Home') {
              e.preventDefault()
              apply(0)
            }
            if (e.key === 'End') {
              e.preventDefault()
              apply(100)
            }
          }}
        />
      </div>
      <p className="ba-note">{item.sourceNote}</p>
    </div>
  )
}

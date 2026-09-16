import { useState } from 'react'
import { Link } from 'react-router-dom'

type Slide = {
  id: string
  tag: string
  title: string
  to: string
  src: string
  alt: string
}

const defaultSlides: Slide[] = [
  {
    id: 'wellness',
    tag: 'WELLNESS',
    title: 'นวด',
    to: '/massage',
    src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกบรรยากาศนวด / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'food',
    tag: 'HOSPITALITY',
    title: 'อาหาร',
    to: '/restaurants',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกอาหารบนโต๊ะ / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'photo',
    tag: 'PHOTOGRAPHY',
    title: 'ภาพ',
    to: '/photography',
    src: 'https://images.unsplash.com/photo-1492693429561-45c31e4f4ff3?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกกล้องถ่ายภาพ / ไม่ใช่ผลงานร้านจริง',
  },
  {
    id: 'shop',
    tag: 'DIGITAL SHOP',
    title: 'เว็บ',
    to: '/#system',
    src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกหน้าจอทำงาน / ไม่ใช่ระบบร้านจริง',
  },
  {
    id: 'care',
    tag: 'OWNER CARE',
    title: 'ดูแล',
    to: '/pricing',
    src: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกบรรยากาศร้านบริการ / ไม่ใช่ภาพร้านลูกค้า',
  },
]

export const photoSlides: Slide[] = [
  {
    id: 'wellness',
    tag: 'WELLNESS',
    title: 'นวด',
    to: '/photography',
    src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกบรรยากาศนวด / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'food',
    tag: 'FOOD',
    title: 'อาหาร',
    to: '/photography',
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกอาหารบนโต๊ะ / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'salon',
    tag: 'SALON',
    title: 'ร้านเสริมสวย',
    to: '/photography',
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1600&q=80',
    alt: 'ภาพสต็อกร้านเสริมสวย / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'portrait',
    tag: 'PORTRAIT',
    title: 'คน',
    to: '/photography',
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกบุคคล / ไม่ใช่ภาพลูกค้าร้าน',
  },
  {
    id: 'space',
    tag: 'INTERIOR',
    title: 'พื้นที่ร้าน',
    to: '/photography',
    src: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=80',
    alt: 'ภาพสต็อกภายในร้าน / ไม่ใช่ภาพร้านลูกค้า',
  },
]

export function CoverflowGallery({
  slides = defaultSlides,
  initialActive = 0,
  showCta = true,
}: {
  slides?: readonly Slide[]
  initialActive?: number
  showCta?: boolean
}) {
  const [active, setActive] = useState(initialActive)

  return (
    <section
      className="coverflow"
      aria-labelledby="coverflow-title"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault()
          setActive((i) => (i + 1) % slides.length)
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          setActive((i) => (i - 1 + slides.length) % slides.length)
        }
      }}
    >
      <div className="coverflow-head">
        <p className="eyebrow">GALLERY</p>
        <h2 id="coverflow-title">งานที่เราจัดให้เห็นภาพ</h2>
        <p>ภาพสต็อกประกอบแนวคิด กดแผ่นข้างเพื่อขยาย ไม่ใช่ผลงานร้านลูกค้า</p>
      </div>
      <div className="coverflow-track" role="list">
        {slides.map((slide, i) => {
          const open = i === active
          return (
            <article key={slide.id} className={`coverflow-card${open ? ' is-open' : ''}`} role="listitem">
              <button type="button" aria-pressed={open} onClick={() => setActive(i)}>
                <img src={slide.src} alt={slide.alt} />
                <span className="coverflow-spine">{slide.title}</span>
                <span className="coverflow-copy">
                  <small>{slide.tag}</small>
                  <strong>{slide.title}</strong>
                </span>
              </button>
              {open && showCta ? (
                <Link className="coverflow-go" to={slide.to}>
                  ดูหน้านี้ ↗
                </Link>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}

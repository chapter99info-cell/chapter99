import { useState } from 'react'
import { Link } from 'react-router-dom'
import { siteMedia } from '../site/media'

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
    src: siteMedia.hero,
    alt: 'ภาพแนวคิดบรรยากาศนวด / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'food',
    tag: 'HOSPITALITY',
    title: 'อาหาร',
    to: '/restaurants',
    src: siteMedia.restaurant,
    alt: 'ภาพแนวคิดอาหารไทยและงานถ่าย / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'photo',
    tag: 'PHOTOGRAPHY',
    title: 'ภาพ',
    to: '/photography',
    src: siteMedia.photography,
    alt: 'ภาพแนวคิดถ่ายจานแล้วใช้บนระบบร้าน / ไม่ใช่ผลงานร้านจริง',
  },
  {
    id: 'shop',
    tag: 'DIGITAL SHOP',
    title: 'เว็บ',
    to: '/#system',
    src: siteMedia.system,
    alt: 'ภาพแนวคิดงานประจำวันบนแท็บเล็ต / ไม่ใช่ระบบร้านจริง',
  },
  {
    id: 'care',
    tag: 'OWNER CARE',
    title: 'ดูแล',
    to: '/pricing',
    src: siteMedia.booking,
    alt: 'ภาพแนวคิดเคาน์เตอร์ร้านบริการ / ไม่ใช่ภาพร้านลูกค้า',
  },
]

export const photoSlides: Slide[] = [
  {
    id: 'wellness',
    tag: 'WELLNESS',
    title: 'นวด',
    to: '/photography',
    src: siteMedia.massage,
    alt: 'ภาพแนวคิดบรรยากาศนวด / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'food',
    tag: 'FOOD',
    title: 'อาหาร',
    to: '/photography',
    src: siteMedia.restaurant,
    alt: 'ภาพแนวคิดอาหารบนโต๊ะถ่าย / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'salon',
    tag: 'SALON',
    title: 'ร้านเสริมสวย',
    to: '/photography',
    src: siteMedia.booking,
    alt: 'ภาพแนวคิดเคาน์เตอร์ร้านบริการ / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    id: 'portrait',
    tag: 'CONTENT',
    title: 'คอนเทนต์',
    to: '/photography',
    src: siteMedia.demo,
    alt: 'ภาพแนวคิดคอนเทนต์ร้านนวด / ไม่ใช่ภาพลูกค้าร้าน',
  },
  {
    id: 'space',
    tag: 'INTERIOR',
    title: 'พื้นที่ร้าน',
    to: '/photography',
    src: siteMedia.massage,
    alt: 'ภาพแนวคิดภายในร้านนวด / ไม่ใช่ภาพร้านลูกค้า',
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

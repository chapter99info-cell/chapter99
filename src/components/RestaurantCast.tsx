import { useState } from 'react'
import { Link } from 'react-router-dom'

const photos = [
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
    alt: 'ภาพสต็อกอาหารบนโต๊ะ / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกบรรยากาศร้านอาหาร / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกจานอาหาร / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกคาเฟ่ / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    src: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกครัวร้านอาหาร / ไม่ใช่ภาพร้านลูกค้า',
  },
  {
    src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=800&q=80',
    alt: 'ภาพสต็อกพิซซ่า / ไม่ใช่ภาพร้านลูกค้า',
  },
]

export function RestaurantCast() {
  const [i, setI] = useState(0)
  const len = photos.length
  const at = (offset: number) => photos[(i + offset + len) % len]
  const slots = [
    { photo: at(-2), size: 'xs' },
    { photo: at(-1), size: 'sm' },
    { photo: at(0), size: 'copy' },
    { photo: at(1), size: 'lg' },
    { photo: at(2), size: 'sm' },
    { photo: at(3), size: 'xs' },
  ]

  return (
    <section className="food-cast" aria-label="ตัวอย่างภาพอาหาร">
      <button
        type="button"
        className="food-cast-arrow is-prev"
        aria-label="ภาพก่อนหน้า"
        onClick={() => setI((n) => (n - 1 + len) % len)}
      >
        ‹
      </button>
      <div className="food-cast-row">
        {slots.map((slot, index) =>
          slot.size === 'copy' ? (
            <div key="copy" className="food-cast-copy">
              <h1>
                อาหารที่คุณตั้งใจทำ
                <br />
                <em>ให้ลูกค้าเห็นแล้วอยากลอง</em>
              </h1>
              <p>
                ภาพอาหาร เว็บไซต์ และเมนูที่เปิดดูง่าย เชื่อมประสบการณ์บนมือถือกับงานในร้าน
              </p>
              <Link to="/pricing?type=restaurant">ดูราคาร้านอาหาร →</Link>
            </div>
          ) : (
            <figure key={`${slot.photo.src}-${index}`} className={`food-cast-card is-${slot.size}`}>
              <img src={slot.photo.src} alt={slot.photo.alt} />
            </figure>
          ),
        )}
      </div>
      <button
        type="button"
        className="food-cast-arrow is-next"
        aria-label="ภาพถัดไป"
        onClick={() => setI((n) => (n + 1) % len)}
      >
        ›
      </button>
    </section>
  )
}

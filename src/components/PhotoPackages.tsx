import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { photographyOffers } from '../data/pricing'

export function PhotoPackages() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useRef(false)
  const [spot, setSpot] = useState({ x: 62, y: 40 })
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
    setTilt({ x: (x - 50) / 16, y: (y - 45) / 20 })
  }

  return (
    <section
      id="photo-packages"
      ref={ref}
      className="photo-packages"
      onMouseMove={onMove}
      onMouseLeave={() => {
        setTilt({ x: 0, y: 0 })
        setHot(null)
      }}
      style={{ '--spot-x': `${spot.x}%`, '--spot-y': `${spot.y}%` } as CSSProperties}
    >
      <div className="section-title">
        <div>
          <p className="eyebrow">PHOTOGRAPHY BY CHAPTER99 / CHOOSE YOUR PACKAGE</p>
          <h2>
            เริ่มที่ภาพสวย ๆ
            <br />
            <em>หรือต่อให้ครบทั้งภาพและเว็บ</em>
          </h2>
        </div>
        <p>
          มีเว็บไซต์อยู่แล้ว เลือกถ่ายภาพอย่างเดียวได้
          <br />
          อยากทำใหม่ เลือกให้เราดูแลภาพและเว็บไปด้วยกัน
        </p>
      </div>
      <div className="photo-options">
        <article
          className={`photo-only${hot === 'only' ? ' is-hot' : ''}`}
          style={{ transform: `translate(${tilt.x * -0.8}px, ${tilt.y}px)` }}
          onMouseEnter={() => setHot('only')}
        >
          <p className="eyebrow">01 / PHOTOGRAPHY ONLY</p>
          <h3>{photographyOffers.photoOnly.title}</h3>
          <p>
            สำหรับร้านที่ต้องการภาพไปใช้กับเว็บไซต์
            <br />
            เมนู หรือโซเชียลที่มีอยู่แล้ว
          </p>
          <div className="quote-price">
            {photographyOffers.photoOnly.price}
            <small>{photographyOffers.photoOnly.note}</small>
          </div>
          <ul>
            <li>คุยแนวภาพและรายการที่ต้องถ่าย</li>
            <li>ถ่ายภาพอาหาร ร้านนวด และคอนเทนต์ร้านค้า</li>
            <li>ส่งภาพแต่งพร้อมนำไปใช้งาน</li>
          </ul>
          <p className="photo-boundary">
            ตกลงเวลาถ่าย การคัดและแต่งภาพ และพื้นที่หน้างาน
            <br />
            แพ็กนี้ไม่รวมการจัดทำเว็บไซต์
          </p>
          <Link className="btn" to="/contact?need=photo">
            คุยงานถ่ายภาพอย่างเดียว ↗
          </Link>
        </article>
        <article
          className={`photo-bundle${hot === 'bundle' ? ' is-hot' : ''}`}
          style={{ transform: `translate(${tilt.x * 0.9}px, ${tilt.y * 1.1}px)` }}
          onMouseEnter={() => setHot('bundle')}
        >
          <p className="eyebrow">02 / PHOTOGRAPHY + WEBSITE</p>
          <h3>{photographyOffers.photoPlusWeb.title}</h3>
          <p>
            ออกแบบภาพและเว็บไปด้วยกัน
            <br />
            ตั้งแต่วันถ่าย จนลูกค้าเปิดดูร้านบนมือถือ
          </p>
          <div className="quote-price">
            {photographyOffers.photoPlusWeb.price}
            <small>{photographyOffers.photoPlusWeb.note}</small>
          </div>
          <ul>
            <li>กำหนดขอบเขตถ่ายภาพและภาพแต่ง</li>
            <li>นำภาพจัดลงเว็บไซต์ให้เข้ากับร้าน</li>
            <li>วางเมนูหรือบริการและช่องทางจอง</li>
            <li>ประสานงานภาพและเว็บกับทีมเดียวกัน</li>
          </ul>
          <p className="photo-boundary">
            เมื่อมีราคายืนยัน จะเทียบซื้อแยกกับแพ็กรวมบนขอบเขตงานเดียวกัน
            <br />
            ค่าดูแลรายเดือนแสดงแยกจากค่าจัดทำ
          </p>
          <Link className="btn" to="/contact?need=photo-web">
            คุยแพ็กถ่ายภาพพร้อมเว็บไซต์ ↗
          </Link>
        </article>
      </div>
      <p className="note">
        ค่าถ่ายภาพ ราคาแพ็กรวม เวลาถ่าย และขอบเขตภาพแต่งยังไม่ยืนยัน จึงยังไม่คิดยอดส่วนลดหรือยอดประหยัด
      </p>
    </section>
  )
}

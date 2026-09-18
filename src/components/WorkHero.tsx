import { Link } from 'react-router-dom'
import { siteContact, siteMedia } from '../site/media'

const tiles = [
  {
    src: siteMedia.restaurant,
    alt: 'ภาพแนวคิดถ่ายอาหารไทย / ไม่ใช่ภาพร้านลูกค้า',
    to: '/restaurants',
  },
  {
    src: siteMedia.booking,
    alt: 'ภาพแนวคิดเคาน์เตอร์จองคิว / ไม่ใช่ภาพร้านลูกค้า',
    to: '/beauty',
  },
  {
    src: siteMedia.massage,
    alt: 'ภาพแนวคิดนวดไทย / ไม่ใช่ภาพร้านลูกค้า',
    to: '/massage',
  },
  {
    src: siteMedia.photography,
    alt: 'ภาพแนวคิดถ่ายภาพแล้วไปใช้บนระบบร้าน / ไม่ใช่ผลงานลูกค้า',
    to: '/photography',
  },
]

export function WorkHero() {
  return (
    <section className="work-stage">
      <div className="work-stage-copy">
        <p className="eyebrow">A FEEL FOR WHAT’S POSSIBLE</p>
        <h1>
          เห็นภาพร้าน
          <br />
          <em>ในแบบที่เป็นตัวเอง</em>
        </h1>
        <p className="lead">
          รวมตัวอย่างเพื่อคุยทิศทางการออกแบบ ยังไม่ใช่การรับรองผลงานหรือผลลัพธ์จากร้านจริง
        </p>
        <a className="work-stage-cta" href={siteContact.mail}>
          ส่งอีเมลเรื่องร้าน →
        </a>
      </div>
      <div className="work-mosaic">
        {tiles.map((tile) => (
          <Link key={tile.src} to={tile.to}>
            <img src={tile.src} alt={tile.alt} />
          </Link>
        ))}
      </div>
    </section>
  )
}

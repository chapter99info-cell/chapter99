import { Link } from 'react-router-dom'
import { siteContact, siteMedia } from '../site/media'

const tiles = [
  {
    src: siteMedia.hero,
    alt: 'ภาพแนวคิดร้านนวด / ไม่ใช่ภาพร้านลูกค้า',
    to: '/massage',
  },
  {
    src: siteMedia.photography,
    alt: 'ภาพแนวคิดถ่ายอาหารแล้วใช้บนระบบร้าน / ไม่ใช่ผลงานลูกค้า',
    to: '/photography',
  },
  {
    src: siteMedia.booking,
    alt: 'ภาพแนวคิดเคาน์เตอร์จองคิว / ไม่ใช่ภาพร้านลูกค้า',
    to: '/beauty',
  },
  {
    src: siteMedia.demo,
    alt: 'ภาพแนวคิดคอนเทนต์ร้านนวด / ไม่ใช่ภาพลูกค้าจริง',
    to: '/business-toolkit',
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

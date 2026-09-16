import { Link } from 'react-router-dom'

const tiles = [
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80',
    alt: 'ภาพสต็อกอาหาร / ไม่ใช่ภาพร้านลูกค้า',
    to: '/restaurants',
  },
  {
    src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80',
    alt: 'ภาพสต็อกร้านเสริมสวย / ไม่ใช่ภาพร้านลูกค้า',
    to: '/photography',
  },
  {
    src: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
    alt: 'ภาพสต็อกนวด / ไม่ใช่ภาพร้านลูกค้า',
    to: '/massage',
  },
  {
    src: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80',
    alt: 'ภาพสต็อกภายในร้าน / ไม่ใช่ภาพร้านลูกค้า',
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
        <Link className="work-stage-cta" to="/contact">
          นัดคุยเรื่องร้าน →
        </Link>
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

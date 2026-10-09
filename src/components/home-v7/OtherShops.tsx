const shops = [
  {
    href: '/massage',
    img: '/mockup/media/web/sol-massage.webp',
    alt: 'ร้านนวดไทย',
    title: 'ร้านนวด',
    text: 'เว็บร้าน ราคาชัด — จองออนไลน์อยู่ในแพ็ก Professional',
  },
  {
    href: '/restaurants',
    img: '/mockup/media/web/pg-food.webp',
    alt: 'ร้านอาหารไทย',
    title: 'ร้านอาหาร',
    text: 'เมนูออนไลน์ — สั่ง/จองโต๊ะอยู่ในแพ็ก Professional',
  },
  {
    href: '/beauty',
    img: '/mockup/media/web/sol-beauty.webp',
    alt: 'ร้านความงาม',
    title: 'ความงาม',
    text: 'โชว์ผลงาน นัดคิวง่าย',
  },
  {
    href: '/cleaning',
    img: '/mockup/media/web/sol-clean.webp',
    alt: 'บริการทำความสะอาด',
    title: 'ทำความสะอาด',
    text: 'บริการและราคา ขอราคาออนไลน์',
  },
] as const

export function OtherShops() {
  return (
    <section className="sec" id="shops">
      <div className="wrap">
        <span className="kicker">Other shops</span>
        <h2 className="th2" style={{ marginTop: 12 }}>
          สำหรับธุรกิจไทยอื่น ๆ
        </h2>
        <p className="sub">เครื่องมือเดียวกัน ปรับให้เหมาะกับร้านของคุณ</p>
        <div className="shops">
          {shops.map((s) => (
            <a className="shop rv" href={s.href} key={s.href + s.title}>
              <div className="shop__img">
                <img src={s.img} alt={s.alt} width={700} height={438} loading="lazy" />
              </div>
              <div className="shop__body">
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                <span className="btn btn--soft">ดูตัวอย่าง →</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

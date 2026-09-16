import { Link } from 'react-router-dom'
import { restaurantAddons, restaurantPlans, restaurantPriceNote, type RestaurantPlan } from '../data/pricing'

function Card({ plan }: { plan: RestaurantPlan }) {
  return (
    <article className={`plan${plan.featured ? ' featured' : ''}`}>
      {plan.featured ? <span className="plan-tag">ยอดนิยม</span> : null}
      <p className="eyebrow">{plan.eyebrow}</p>
      <h3>{plan.title}</h3>
      <p className="price">
        {plan.setupLabel} <small>{plan.setupNote}</small>
      </p>
      <p className="monthly">
        + {plan.monthlyLabel} {plan.monthlyNote}
      </p>
      <ul>
        {plan.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <ul className="plan-limits">
        {plan.limits.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <Link to={`/contact?kind=restaurant&plan=${plan.id}`}>{plan.cta}</Link>
    </article>
  )
}

export function RestaurantPlans({ heading }: { heading?: boolean }) {
  return (
    <>
      {heading ? (
        <div className="section-title">
          <div>
            <p className="eyebrow">RESTAURANT FRONT OF HOUSE</p>
            <h2>
              แพ็กหน้าร้านอาหาร
              <br />
              <em>ติดตั้งครั้งเดียว + ดูแลรายเดือน</em>
            </h2>
          </div>
          <p>เมนูดิจิทัล สั่งผ่าน QR และงานดูแลระบบ แยกจากแพ็ก Digital Shop ของร้านนวด</p>
        </div>
      ) : null}
      <div className="plans">
        {restaurantPlans.map((plan) => (
          <Card key={plan.id} plan={plan} />
        ))}
      </div>
      <p className="note">{restaurantPriceNote}</p>
      <div className="delivery-frame">
        <div className="delivery-copy">
          <p className="eyebrow">HOW WE INSTALL</p>
          <h2>
            เลือกวิธีติดตั้ง
            <br />
            <em>ที่เหมาะกับที่ตั้งร้าน</em>
          </h2>
          <p>
            ร้านในซิดนีย์หรือใกล้เคียง นัดไปหน้างานได้ ร้านในรัฐอื่นตั้งค่าและสอนผ่านวิดีโอคอล ราคายืนยันอีกครั้งในใบเสนอราคา
          </p>
        </div>
        <div className="delivery-groups">
          <ol className="delivery-steps" aria-label="บริการหน้างานในซิดนีย์">
            <li className="delivery-label">IN SYDNEY & SURROUNDS · บริการหน้างาน</li>
            {restaurantAddons.sydney.map((item, i) => (
              <li key={item.name}>
                <span className="delivery-num">{i + 1}</span>
                <article className="delivery-card">
                  <strong>
                    {item.name} · {item.price}
                  </strong>
                  <p>{item.note}</p>
                </article>
              </li>
            ))}
          </ol>
          <ol className="delivery-steps" aria-label="บริการทางไกลทั่วออสเตรเลีย">
            <li className="delivery-label">OUTSIDE SYDNEY · ทางไกลทั่วออสเตรเลีย</li>
            {restaurantAddons.remote.map((item, i) => (
              <li key={item.name}>
                <span className="delivery-num">{i + 1}</span>
                <article className="delivery-card">
                  <strong>
                    {item.name} · {item.price}
                  </strong>
                  <p>{item.note}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  )
}

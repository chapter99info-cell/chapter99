import { Link } from 'react-router-dom'
import { brandPackages, formatAud } from '../../config/pricing'
import { useTranslation } from '../cinematic/i18n/LanguageContext'
import { IndustryPage } from '../site/IndustryPage'
import { siteMedia } from '../site/media'

function PhotoRates() {
  const { t } = useTranslation()
  return (
    <section className="hp-sec" id="photo-packages" aria-labelledby="photo-rate-title" style={{ paddingTop: 0 }}>
      <div className="hp-wrap">
        <p className="hp-eyebrow">Chapter99</p>
        <h2 id="photo-rate-title">{t({ th: 'ภาพ + วิดีโอธุรกิจ', en: 'Brand photo + video' })}</h2>
        <p className="hp-note" style={{ marginTop: 8 }}>
          {t({ th: 'ดูแพ็กเกจแบบเต็มพร้อมสิ่งที่ได้รับในหน้าราคา', en: 'See the full packages and deliverables on the pricing page.' })}
        </p>
        <div className="hp-price-grid">
          {brandPackages.map((plan) => (
            <article key={plan.id} className={`hp-plan${plan.featured ? ' feat' : ''}`}>
              <h3>{t(plan.name)}</h3>
              <div className="hp-price">
                <b>{formatAud(plan.amountAud)}</b>
                <span>{t(plan.unit)}</span>
              </div>
              <p>{t(plan.recommendedFor)}</p>
              <Link className={plan.featured ? 'hp-btn hp-btn-dark' : 'hp-btn hp-btn-line'} to="/pricing#brand">
                {t({ th: 'ดูเรทเต็ม', en: 'See full rates' })}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PhotographyPage() {
  return (
    <IndustryPage
      content={{
        kind: 'photo',
        photo: siteMedia.photography,
        photoAlt: { th: 'ผลงานภาพถ่ายธุรกิจ', en: 'Business photography work' },
        photoNote: { th: 'ภาพแนวคิดจากคลัง Chapter99 web 2026 ไม่ใช่ผลงานร้านลูกค้า', en: 'Concept photo from Chapter99 web 2026 storage — not a client case.' },
        eyebrow: { th: 'ภาพถ่ายโดย Chapter99', en: 'Photography by Chapter99' },
        title: { th: 'ให้ภาพเล่าเสน่ห์ที่คุณตั้งใจใส่ไว้ในร้าน', en: 'Let photos carry the care in your shop.' },
        lead: {
          th: 'ภาพถ่ายคือจุดต่างของ Chapter99 นำไปใช้บนเว็บ เนื้อหา และประสบการณ์ลูกค้า ไม่ใช่แพลตฟอร์มจัดการช่างภาพใหม่',
          en: 'Photography is a core Chapter99 difference — used on the website, in content, and in the customer journey. This is not a photographer-management platform.',
        },
        steps: [
          { title: { th: 'ถ่ายให้ตรงธุรกิจ', en: 'Shoot for the shop' }, body: { th: 'คน อาหาร ห้อง และรายละเอียดที่ใช้ขายได้จริง', en: 'People, food, rooms and details that can actually be used.' } },
          { title: { th: 'ใช้บนเว็บ', en: 'Use on the website' }, body: { th: 'จัดภาพให้หน้าแรกและหน้าบริการอ่านง่าย', en: 'Place photos so service pages stay readable.' } },
          { title: { th: 'เนื้อหาและการจอง', en: 'Content and booking' }, body: { th: 'ภาพช่วยให้ลูกค้าเข้าใจบริการก่อนกดจอง', en: 'Photos help customers understand the service before they book.' } },
          { title: { th: 'ไม่สร้างระบบช่างภาพใหม่', en: 'No new photo platform' }, body: { th: 'งานนี้คือถ่ายและนำไปใช้ ไม่ใช่แอปจัดการช่างภาพ', en: 'This work is photography and use — not a photographer ops app.' } },
        ],
        extra: <PhotoRates />,
      }}
    />
  )
}

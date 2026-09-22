import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useTranslation } from '../cinematic/i18n/LanguageContext'
import { SiteLayout } from './SiteLayout'
import { siteContact } from './media'
import type { PreviewKind } from './SystemPreview'
import './homepage-approved.css'

type Copy = { th: string; en: string }

export type IndustryContent = {
  kind: PreviewKind
  photo: string
  photoAlt: Copy
  photoNote: Copy
  eyebrow: Copy
  title: Copy
  lead: Copy
  steps: { title: Copy; body: Copy }[]
  extra?: ReactNode
}

export function IndustryPage({ content }: { content: IndustryContent }) {
  return (
    <SiteLayout>
      <IndustryInner content={content} />
    </SiteLayout>
  )
}

function IndustryInner({ content }: { content: IndustryContent }) {
  const { t } = useTranslation()
  return (
    <main className="home-approved" id="top">
      <section className="hp-hero" aria-labelledby="ind-hero-title">
        <span className="hp-orb" aria-hidden="true" />
        <div className="hp-wrap hp-hero-grid">
          <div>
            <p className="hp-eyebrow">{t(content.eyebrow)}</p>
            <h1 id="ind-hero-title">{t(content.title)}</h1>
            <p className="hp-lead">{t(content.lead)}</p>
            <p className="hp-note" style={{ color: 'rgba(255,255,255,0.88)' }}>
              {t({
                th: 'หน้าสื่อสารบริการ · ภาพและตัวอย่างด้านขวาไม่ใช่ระบบร้านที่เปิดใช้แล้ว',
                en: 'Service page · the image and preview on the right are not a live shop system.',
              })}
            </p>
            <div className="hp-cta-row">
              <Link className="hp-btn hp-btn-dark" to="/toolkit">
                {t({ th: 'เปิดเครื่องมือฟรี', en: 'Open Free Toolkit' })}
              </Link>
              <a className="hp-btn hp-btn-line" href={siteContact.mail}>
                {t({ th: 'คุยกับ Chapter99', en: 'Talk to Chapter99' })}
              </a>
            </div>
          </div>
          <figure className="hp-ind-photo">
            <img src={content.photo} alt={t(content.photoAlt)} />
            <figcaption>{t(content.photoNote)}</figcaption>
          </figure>
        </div>
      </section>

      <section className="hp-sec" aria-labelledby="ind-steps-title">
        <div className="hp-wrap">
          <p className="hp-eyebrow">{t({ th: 'เส้นทางที่ช่วยร้าน', en: 'How we help this shop' })}</p>
          <h2 id="ind-steps-title">{t({ th: 'จากภาพลักษณ์ ไปจนถึงงานประจำวัน', en: 'From how you look, to how the day runs.' })}</h2>
          <div className="hp-price-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {content.steps.map((step, i) => (
              <article className="hp-plan" key={step.title.en}>
                <p className="hp-eyebrow">0{i + 1}</p>
                <h3>{t(step.title)}</h3>
                <p>{t(step.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {content.extra}

      <section className="hp-sec" style={{ paddingTop: 0 }}>
        <div className="hp-wrap">
          <div className="hp-next">
            <span>{t({ th: 'เริ่มจากเครื่องมือฟรี หรือคุยขอบเขตงาน', en: 'Start with free tools, or talk through scope.' })}</span>
            <span style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link className="hp-btn hp-btn-dark" to="/toolkit">
                {t({ th: 'เปิดเครื่องมือฟรี', en: 'Open Free Toolkit' })}
              </Link>
              <Link className="hp-btn hp-btn-line" to="/pricing">
                {t({ th: 'ดูราคา', en: 'See pricing' })}
              </Link>
            </span>
          </div>
        </div>
      </section>
    </main>
  )
}

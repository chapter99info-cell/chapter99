import { useEffect } from 'react'
import { pricing } from '../content/pricing'
import { v7Copy } from '../content/v7'
import { setSeo } from '../lib/seo'
import '../styles/v7-fonts-test.css'

const FONT_HREF =
  'https://fonts.googleapis.com/css2?family=Anton&family=IBM+Plex+Mono:wght@500&family=Noto+Sans+Thai:wght@600&family=Noto+Sans+Thai+Looped:wght@400;500&family=Sarabun:wght@400;500&family=Taviraj:wght@600&family=Trirong:wght@600&display=swap'

const options = [
  {
    id: 'A',
    title: 'A · Taviraj + Noto Looped',
    head: 'Taviraj 600',
    body: 'Noto Sans Thai Looped 400/500',
    cls: 'opt-a',
  },
  {
    id: 'B',
    title: 'B · Trirong + Sarabun',
    head: 'Trirong 600',
    body: 'Sarabun 400/500',
    cls: 'opt-b',
  },
  {
    id: 'C',
    title: 'C · Noto Sans Thai + Looped',
    head: 'Noto Sans Thai 600',
    body: 'Noto Sans Thai Looped 400/500',
    cls: 'opt-c',
  },
] as const

export function V7FontsTestPage() {
  useEffect(() => {
    setSeo({
      title: 'Font test (do not ship) — Chapter99',
      description: 'Internal V7 font comparison. Not for indexing.',
      path: '/v7/fonts-test',
      robots: 'noindex,nofollow',
      lang: 'th',
    })
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = FONT_HREF
    document.head.appendChild(link)
    return () => {
      link.remove()
    }
  }, [])

  return (
    <main className="fonts-test">
      <p className="fonts-test__kicker">INTERNAL · NOINDEX</p>
      <h1 className="fonts-test__en">FONT TEST</h1>
      <p className="fonts-test__note">Anton = EN display · IBM Plex Mono = labels · ไม่ลิงก์จากเมนู</p>
      <div className="fonts-test__grid">
        {options.map((opt) => (
          <article key={opt.id} className={`fonts-col ${opt.cls}`}>
            <p className="fonts-col__label">
              {opt.id} · {opt.head}
              <br />
              {opt.body}
            </p>
            <section className="fonts-hero">
              <p className="fonts-col__label">01 / AUSTRALIA</p>
              <h2>{v7Copy.th.heroHeadline}</h2>
              <p className="fonts-hero__sub">{v7Copy.th.heroSub}</p>
            </section>
            <article className="fonts-card">
              <p className="fonts-col__label">PACKAGES</p>
              <h3>{pricing.professional.name}</h3>
              <p className="fonts-card__price">
                {pricing.professional.setup}
                <span>
                  {' '}
                  + {pricing.professional.monthly} / เดือน
                </span>
              </p>
              <p>ทุกอย่างใน Starter · ระบบจองคิวตามขอบเขต · สอนใช้งาน</p>
            </article>
            <p className="fonts-p">
              เราตั้งเว็บและเครื่องมือร้านให้ธุรกิจไทยในออสเตรเลีย คุยภาษาไทย ตกลงขอบเขตก่อนเริ่ม
              ไม่บังคับจองผ่านแพ็ก Starter
            </p>
          </article>
        ))}
      </div>
    </main>
  )
}

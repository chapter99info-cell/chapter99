import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CONTACT_EMAIL } from '../data/pricing'
import { useTranslation } from '../cinematic/i18n/LanguageContext'
import { SiteLayout } from '../site/SiteLayout'
import type { Bilingual } from '../cinematic/i18n/types'

const kinds: { id: string; label: Bilingual }[] = [
  { id: 'massage', label: { th: 'ร้านนวด / สปา', en: 'Massage / spa' } },
  { id: 'restaurant', label: { th: 'ร้านอาหาร / คาเฟ่', en: 'Restaurant / cafe' } },
  { id: 'other', label: { th: 'ธุรกิจอื่น (ประเมินงาน)', en: 'Other business (scoped quote)' } },
]

const needs: { id: string; label: Bilingual }[] = [
  { id: 'shop', label: { th: 'เว็บไซต์และการจอง / งานหน้าร้าน', en: 'Website and booking / shop-front work' } },
  { id: 'photo', label: { th: 'ถ่ายภาพอย่างเดียว', en: 'Photography only' } },
  { id: 'photo-web', label: { th: 'ถ่ายภาพ + เว็บไซต์', en: 'Photography + website' } },
  { id: 'pricing', label: { th: 'แพ็กเกจและค่าดูแล', en: 'Packages and care fees' } },
  { id: 'toolkit', label: { th: 'อยากได้ระบบเต็มต่อจากเครื่องมือฟรี', en: 'Want the full system after the free toolkit' } },
]

export function ContactPage() {
  return (
    <SiteLayout>
      <ContactInner />
    </SiteLayout>
  )
}

function ContactInner() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const initialKind = kinds.some((k) => k.id === params.get('kind')) ? params.get('kind')! : 'massage'
  const initialNeed = needs.some((n) => n.id === params.get('need'))
    ? params.get('need')!
    : params.get('plan')
      ? 'pricing'
      : 'shop'

  const [kind, setKind] = useState(initialKind)
  const [need, setNeed] = useState(initialNeed)

  useEffect(() => {
    const nextNeed = params.get('need')
    if (nextNeed && needs.some((n) => n.id === nextNeed)) setNeed(nextNeed)
  }, [params])

  const kindLabel = useMemo(() => t(kinds.find((k) => k.id === kind)?.label ?? kind), [kind, t])
  const needLabel = useMemo(() => t(needs.find((n) => n.id === need)?.label ?? need), [need, t])
  const fromToolkit = params.get('need') === 'toolkit'
  const wantsToolkitFollowUp = need === 'toolkit'

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setStatus('')
    const data = new FormData(e.currentTarget)
    const shop = String(data.get('shop') ?? '').trim()
    const city = String(data.get('city') ?? '').trim()
    const contact = String(data.get('contact') ?? '').trim()
    const agreeTerms = data.get('agreeTerms') === 'on'
    const agreePrivacy = data.get('agreePrivacy') === 'on'
    const agreeBoundary = data.get('agreeBoundary') === 'on'
    const agreeAccuracy = data.get('agreeAccuracy') === 'on'
    const agreeOps = data.get('agreeOps') === 'on'
    const agreeMarketing = data.get('agreeMarketing') === 'on'
    if (!shop || !city || !contact) {
      setError(t({ th: 'กรุณากรอกชื่อร้าน เมือง/รัฐ และช่องทางติดต่อกลับ', en: 'Please enter the shop name, city/state and a return contact.' }))
      return
    }
    if (!agreeTerms || !agreePrivacy || !agreeBoundary || !agreeAccuracy || !agreeOps) {
      setError(t({ th: 'กรุณายืนยันข้อกำหนด ความเป็นส่วนตัว ขอบเขตบริการ และความถูกต้องของข้อมูล', en: 'Please confirm terms, privacy, service boundary and data accuracy.' }))
      return
    }
    const website = String(data.get('website') ?? '').trim()
    const message = String(data.get('message') ?? '').trim()
    const plan = params.get('plan')
    const body = [
      'สวัสดีทีม Chapter99',
      `ประเภทธุรกิจ: ${kindLabel}`,
      `ชื่อร้าน: ${shop}`,
      `เมือง/รัฐ: ${city}`,
      `เว็บไซต์ปัจจุบัน: ${website || 'ยังไม่มี / ไม่ระบุ'}`,
      `เรื่องที่ต้องการให้ช่วย: ${needLabel}`,
      plan ? `แพ็กเกจที่สนใจในพรีวิว: ${plan}` : '',
      message ? `รายละเอียด: ${message}` : '',
      `ช่องทางติดต่อกลับ: ${contact}`,
      `ยอมรับ Terms / Privacy / ขอบเขตบริการ / ข้อมูลถูกต้อง / ข้อความปฏิบัติการ: ใช่`,
      `รับข่าวสารการตลาดจาก Chapter99: ${agreeMarketing ? 'ใช่' : 'ไม่'}`,
    ]
      .filter(Boolean)
      .join('\n')

    const subject = wantsToolkitFollowUp
      ? `ขอเปิดใช้ Toolkit ฟรี — ${shop}`
      : `นัดคุย Chapter99 — ${shop}`
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = href
    setStatus(
      t({
        th: `เตรียมเปิดแอปอีเมลถึง ${CONTACT_EMAIL} แล้ว กรุณาตรวจข้อความแล้วกดส่งเอง หน้านี้ยังไม่ส่งข้อมูลให้เซิร์ฟเวอร์`,
        en: `Your email app is ready to ${CONTACT_EMAIL}. Check the message and send it yourself. This page does not send data to a server.`,
      }),
    )
  }

  return (
    <div className="site-page-body">
    <section className="contact-layout">
      <div>
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1>
          {t({ th: 'เล่าเรื่องร้าน', en: 'Tell us about the shop' })}
          <br />
          <em>{t({ th: 'ให้ทีม Chapter99 ฟังหน่อย', en: 'and we will listen' })}</em>
        </h1>
        <p className="lead">
          {fromToolkit
            ? t({
                th: 'ลองเครื่องมือฟรีได้เลย ไม่ต้องกรอกฟอร์มนี้ ฟอร์มด้านล่างมีไว้เมื่ออยากให้ทีมช่วยต่อยอดเป็นระบบเต็ม',
                en: 'You can try the free toolkit without this form. Use the form below only if you want the team to help move to the full system.',
              })
            : t({
                th: 'ประเภทร้าน เมือง และงานที่อยากให้ช่วย เราจะเริ่มออกแบบจากตรงนั้น',
                en: 'Shop type, city and the work you want help with — that is where we start.',
              })}
        </p>
        <p className="note">{t({ th: 'ยังไม่รับชำระเงิน และไม่สร้างบัญชีร้านจากฟอร์มนี้', en: 'This form does not take payment or create a shop account.' })}</p>
        <div className="contact-paths">
          <Link className="btn" to="/business-toolkit">
            {t({ th: 'เข้าใช้เครื่องมือฟรี ↗', en: 'Open the free toolkit ↗' })}
          </Link>
          <Link className={fromToolkit ? 'btn small' : undefined} to="/contact?need=shop#talk-team" onClick={() => setNeed('shop')}>
            {t({ th: 'คุยกับทีมเรื่องระบบเต็ม', en: 'Talk about the full system' })}
          </Link>
        </div>
      </div>
      <form id="talk-team" onSubmit={onSubmit} noValidate>
        <h3>{fromToolkit ? t({ th: 'ถ้าอยากให้ทีมช่วยต่อยอด', en: 'If you want the team to help next' }) : t({ th: 'ร้านของคุณต้องการให้ช่วยอะไร', en: 'What should we help with?' })}</h3>
        <label htmlFor="kind">{t({ th: 'ประเภทธุรกิจ', en: 'Business type' })}</label>
        <select id="kind" name="kind" value={kind} onChange={(e) => setKind(e.target.value)}>
          {kinds.map((k) => (
            <option key={k.id} value={k.id}>
              {t(k.label)}
            </option>
          ))}
        </select>
        <label htmlFor="shop">{t({ th: 'ชื่อร้าน', en: 'Shop name' })}</label>
        <input id="shop" name="shop" type="text" required autoComplete="organization" />
        <label htmlFor="city">{t({ th: 'เมือง / รัฐ', en: 'City / state' })}</label>
        <input id="city" name="city" type="text" required placeholder="เช่น Altona VIC" />
        <label htmlFor="website">{t({ th: 'เว็บไซต์ปัจจุบัน (ถ้ามี)', en: 'Current website (if any)' })}</label>
        <input id="website" name="website" type="text" placeholder="https://" />
        <label htmlFor="need">{t({ th: 'เรื่องที่ต้องการให้ช่วย', en: 'What you need help with' })}</label>
        <select id="need" name="need" value={need} onChange={(e) => setNeed(e.target.value)}>
          {needs.map((n) => (
            <option key={n.id} value={n.id}>
              {t(n.label)}
            </option>
          ))}
        </select>
        <label htmlFor="contact">{t({ th: 'ช่องทางติดต่อกลับ', en: 'Return contact' })}</label>
        <input
          id="contact"
          name="contact"
          type="text"
          required
          placeholder={t({ th: 'อีเมลที่สะดวกให้ตอบกลับ', en: 'Email we can reply to' })}
          autoComplete="email"
        />
        <label htmlFor="message">{t({ th: 'เล่ารายละเอียดเพิ่มเติม (ไม่บังคับ)', en: 'More detail (optional)' })}</label>
        <textarea id="message" name="message" rows={4} />
        <fieldset className="legal-checks">
          <legend>{t({ th: 'ก่อนเตรียมอีเมล', en: 'Before we prepare the email' })}</legend>
          <label>
            <input type="checkbox" name="agreeTerms" required />
            <span>
              {t({ th: 'ยอมรับ', en: 'Accept' })} <Link to="/legal/terms">Terms of Service</Link>
            </span>
          </label>
          <label>
            <input type="checkbox" name="agreePrivacy" required />
            <span>
              {t({ th: 'อ่าน', en: 'I have read' })} <Link to="/legal/privacy">Privacy Policy</Link>
            </span>
          </label>
          <label>
            <input type="checkbox" name="agreeBoundary" required />
            <span>{t({ th: 'เข้าใจว่า Chapter99 ให้บริการเทคโนโลยีและงานดิจิทัล ไม่ได้ให้บริการวิชาชีพแทนร้าน', en: 'I understand Chapter99 provides technology and digital work, not a substitute for the shop’s professional services.' })}</span>
          </label>
          <label>
            <input type="checkbox" name="agreeAccuracy" required />
            <span>{t({ th: 'ยืนยันว่าข้อมูลถูกต้อง และมีสิทธิ์ใช้เนื้อหา ภาพ และโลโก้ที่ส่งมา', en: 'I confirm the information is accurate and I have rights to any content, images and logos sent.' })}</span>
          </label>
          <label>
            <input type="checkbox" name="agreeOps" required />
            <span>{t({ th: 'ยินยอมรับข้อความที่จำเป็นต่อการนัดคุยและดูแลบัญชี เช่น อีเมลตอบกลับ', en: 'I agree to messages needed to arrange a conversation and look after the account, such as reply emails.' })}</span>
          </label>
          <label>
            <input type="checkbox" name="agreeMarketing" />
            <span>{t({ th: 'ต้องการรับข่าวสาร โปรโมชั่น และข้อเสนอจาก Chapter99 (ไม่บังคับ แยกจากการยอมรับข้อกำหนด)', en: 'I want news, promotions and offers from Chapter99 (optional, separate from accepting the terms).' })}</span>
          </label>
        </fieldset>
        <button className="btn" type="submit">
          {wantsToolkitFollowUp ? t({ th: 'ขอเปิดใช้ Toolkit ฟรี ↗', en: 'Ask to open the free toolkit ↗' }) : t({ th: `ส่งอีเมลถึง ${CONTACT_EMAIL} ↗`, en: `Email ${CONTACT_EMAIL} ↗` })}
        </button>
        <p className="note">
          {t({ th: 'กดปุ่มแล้วจะเปิดแอปอีเมลถึง', en: 'The button opens your email app to' })}{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          {t({ th: ' ให้คุณตรวจข้อความแล้วกดส่งเอง หน้านี้ไม่บันทึกข้อมูลบนคลาวด์', en: '. Check the message and send it yourself. This page does not store data in the cloud.' })}
        </p>
        <p className="contact-email-link">
          {t({ th: 'หรือส่งตรงที่', en: 'Or email directly' })}{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        {error ? (
          <p className="form-status error" role="alert">
            {error}
          </p>
        ) : (
          <p className="form-status" role="status">
            {status}
          </p>
        )}
      </form>
    </section>
    </div>
  )
}

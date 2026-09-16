import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CONTACT_EMAIL } from '../data/pricing'

const kinds = [
  { id: 'massage', label: 'ร้านนวด / สปา' },
  { id: 'restaurant', label: 'ร้านอาหาร / คาเฟ่' },
  { id: 'other', label: 'ธุรกิจอื่น (ประเมินงาน)' },
]

const needs = [
  { id: 'shop', label: 'เว็บไซต์และการจอง / งานหน้าร้าน' },
  { id: 'photo', label: 'ถ่ายภาพอย่างเดียว' },
  { id: 'photo-web', label: 'ถ่ายภาพ + เว็บไซต์' },
  { id: 'pricing', label: 'แพ็กเกจและค่าดูแล' },
  { id: 'toolkit', label: 'อยากได้ระบบเต็มต่อจากเครื่องมือฟรี' },
]

export function ContactPage() {
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

  const kindLabel = useMemo(() => kinds.find((k) => k.id === kind)?.label ?? kind, [kind])
  const needLabel = useMemo(() => needs.find((n) => n.id === need)?.label ?? need, [need])
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
      setError('กรุณากรอกชื่อร้าน เมือง/รัฐ และช่องทางติดต่อกลับ')
      return
    }
    if (!agreeTerms || !agreePrivacy || !agreeBoundary || !agreeAccuracy || !agreeOps) {
      setError('กรุณายืนยันข้อกำหนด ความเป็นส่วนตัว ขอบเขตบริการ และความถูกต้องของข้อมูล')
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
      `เตรียมเปิดแอปอีเมลถึง ${CONTACT_EMAIL} แล้ว กรุณาตรวจข้อความแล้วกดส่งเอง หน้านี้ยังไม่ส่งข้อมูลให้เซิร์ฟเวอร์`,
    )
  }

  return (
    <section className="contact-layout">
      <div>
        <p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
        <h1>
          เล่าเรื่องร้าน
          <br />
          <em>ให้ทีม Chapter99 ฟังหน่อย</em>
        </h1>
        <p className="lead">
          {fromToolkit
            ? 'ลองเครื่องมือฟรีได้เลย ไม่ต้องกรอกฟอร์มนี้ ฟอร์มด้านล่างมีไว้เมื่ออยากให้ทีมช่วยต่อยอดเป็นระบบเต็ม'
            : 'ประเภทร้าน เมือง และงานที่อยากให้ช่วย เราจะเริ่มออกแบบจากตรงนั้น'}
        </p>
        <p className="note">ยังไม่รับชำระเงิน และไม่สร้างบัญชีร้านจากฟอร์มนี้</p>
        <div className="contact-paths">
          <Link className="btn" to="/business-toolkit">
            เข้าใช้เครื่องมือฟรี ↗
          </Link>
          <Link className={fromToolkit ? 'btn small' : undefined} to="/contact?need=shop#talk-team" onClick={() => setNeed('shop')}>
            คุยกับทีมเรื่องระบบเต็ม
          </Link>
        </div>
      </div>
      <form id="talk-team" onSubmit={onSubmit} noValidate>
        <h3>{fromToolkit ? 'ถ้าอยากให้ทีมช่วยต่อยอด' : 'ร้านของคุณต้องการให้ช่วยอะไร'}</h3>
        <label htmlFor="kind">ประเภทธุรกิจ</label>
        <select id="kind" name="kind" value={kind} onChange={(e) => setKind(e.target.value)}>
          {kinds.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
        <label htmlFor="shop">ชื่อร้าน</label>
        <input id="shop" name="shop" type="text" required autoComplete="organization" />
        <label htmlFor="city">เมือง / รัฐ</label>
        <input id="city" name="city" type="text" required placeholder="เช่น Altona VIC" />
        <label htmlFor="website">เว็บไซต์ปัจจุบัน (ถ้ามี)</label>
        <input id="website" name="website" type="text" placeholder="https:// หรือยังไม่มี" />
        <label htmlFor="need">เรื่องที่ต้องการให้ช่วย</label>
        <select id="need" name="need" value={need} onChange={(e) => setNeed(e.target.value)}>
          {needs.map((n) => (
            <option key={n.id} value={n.id}>
              {n.label}
            </option>
          ))}
        </select>
        <label htmlFor="contact">ช่องทางติดต่อกลับ</label>
        <input
          id="contact"
          name="contact"
          type="text"
          required
          placeholder="อีเมล / โทรศัพท์ / WhatsApp ที่สะดวก"
          autoComplete="email"
        />
        <label htmlFor="message">เล่ารายละเอียดเพิ่มเติม (ไม่บังคับ)</label>
        <textarea id="message" name="message" rows={4} placeholder="เช่น มีพนักงาน 3 คน อยากให้ดูคิวร่วมกันง่ายขึ้น" />
        <fieldset className="legal-checks">
          <legend>ก่อนเตรียมอีเมล</legend>
          <label>
            <input type="checkbox" name="agreeTerms" required />
            <span>
              ยอมรับ <Link to="/legal/terms">Terms of Service</Link>
            </span>
          </label>
          <label>
            <input type="checkbox" name="agreePrivacy" required />
            <span>
              อ่าน <Link to="/legal/privacy">Privacy Policy</Link> แล้ว
            </span>
          </label>
          <label>
            <input type="checkbox" name="agreeBoundary" required />
            <span>เข้าใจว่า Chapter99 ให้บริการเทคโนโลยีและงานดิจิทัล ไม่ได้ให้บริการวิชาชีพแทนร้าน</span>
          </label>
          <label>
            <input type="checkbox" name="agreeAccuracy" required />
            <span>ยืนยันว่าข้อมูลถูกต้อง และมีสิทธิ์ใช้เนื้อหา ภาพ และโลโก้ที่ส่งมา</span>
          </label>
          <label>
            <input type="checkbox" name="agreeOps" required />
            <span>ยินยอมรับข้อความที่จำเป็นต่อการนัดคุยและดูแลบัญชี เช่น อีเมลตอบกลับ</span>
          </label>
          <label>
            <input type="checkbox" name="agreeMarketing" />
            <span>ต้องการรับข่าวสาร โปรโมชั่น และข้อเสนอจาก Chapter99 (ไม่บังคับ แยกจากการยอมรับข้อกำหนด)</span>
          </label>
        </fieldset>
        <button className="btn" type="submit">
          {wantsToolkitFollowUp ? 'ขอเปิดใช้ Toolkit ฟรี ↗' : 'เตรียมอีเมลคุยกับทีม Chapter99 ↗'}
        </button>
        <p className="note">
          เปิดแอปอีเมลให้คุณตรวจและกดส่งเอง หน้านี้ไม่บันทึกข้อมูลบนคลาวด์ และไม่แสดงว่าส่งสำเร็จจนกว่าคุณจะส่งจากแอปอีเมล
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
  )
}

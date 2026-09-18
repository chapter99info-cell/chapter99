import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from '../cinematic/i18n/LanguageContext'
import { ShopGlowGrid } from '../site/ShopGlowGrid'
import { SiteLayout } from '../site/SiteLayout'
import { siteMedia } from '../site/media'
import '../site/homepage-v2.css'

const workSteps = [
  {
    n: '01',
    title: { th: 'เข้าใจร้าน', en: 'Understand the shop' },
    body: {
      th: 'คุยว่าวันนี้ลูกค้าหาคุณยังไง จองยังไง จ่ายยังไง และอะไรที่กินเวลาเจ้าของทุกวัน',
      en: 'We look at how customers find you, book, pay, and what eats the owner’s day.',
    },
  },
  {
    n: '02',
    title: { th: 'วางแผนขอบเขต', en: 'Scope the work' },
    body: {
      th: 'จัดเป็น START, GROW หรือ SCALE ตามแค็ตตาล็อก ไม่ขายราคาเดียวที่ซ่อนงานทั้งหมด',
      en: 'START, GROW or SCALE from the Product Catalog — not one hidden price for everything.',
    },
  },
  {
    n: '03',
    title: { th: 'ทำตามที่ตกลง', en: 'Build what was agreed' },
    body: {
      th: 'ภาพ เว็บ ขั้นตอนจอง ชำระเงิน และงานประจำวัน ตามขอบเขต ไม่สร้างระบบที่ยังไม่มี',
      en: 'Photos, website, booking steps, payments and daily work — within scope, not imaginary products.',
    },
  },
  {
    n: '04',
    title: { th: 'ทดสอบกับทีมร้าน', en: 'Test with the shop team' },
    body: {
      th: 'ให้เจ้าของและพนักงานลองใช้ขั้นตอนจริง ก่อนบอกว่าส่งมอบแล้ว',
      en: 'Owners and staff try the real steps before we call it handed over.',
    },
  },
  {
    n: '05',
    title: { th: 'ส่งมอบสิทธิ์', en: 'Hand over access' },
    body: {
      th: 'บัญชี รหัส และหน้าที่ต้องอยู่กับร้าน บันทึกว่าใครเข้าถึงอะไรได้',
      en: 'Accounts, access and duties stay with the shop. We write down who can reach what.',
    },
  },
  {
    n: '06',
    title: { th: 'ดูแลตามข้อตกลง', en: 'Care as agreed' },
    body: {
      th: 'การดูแลต่อเนื่องคิดแยกตามโครงการ ไม่สัญญาซัพพอร์ต 24 ชั่วโมงถ้ายังไม่ได้ตกลง',
      en: 'Ongoing care is priced per project. We do not promise 24/7 support unless that is in the agreement.',
    },
  },
]

const ownership = [
  {
    q: { th: 'Chapter99 คืออะไร', en: 'What is Chapter99?' },
    a: {
      th: 'พาร์ตเนอร์วางรากฐานดิจิทัลให้ร้าน — ภาพลักษณ์ เว็บ การค้นพบ การจอง การชำระเงิน และงานประจำวัน ในขอบเขตที่ตกลง',
      en: 'A digital business infrastructure partner: look, website, discovery, booking, payment and daily work, within an agreed scope.',
    },
  },
  {
    q: { th: 'อะไรเป็นของร้าน', en: 'What stays yours?' },
    a: {
      th: 'ธุรกิจ ลูกค้า เนื้อหา และการตัดสินใจ บัญชีสำคัญควรอยู่ในชื่อเจ้าของร้าน',
      en: 'The business, customers, content and decisions. Key accounts should sit in the shop owner’s name.',
    },
  },
  {
    q: { th: 'เราช่วยดูแลอะไร', en: 'What do we look after?' },
    a: {
      th: 'งานดิจิทัลที่อยู่ในแพ็กเกจ เช่น เว็บ ขั้นตอนจอง แม่แบบ และเครื่องมือฟรีที่เปิดใช้ได้บนเว็บนี้',
      en: 'Digital work in the package: website, booking steps, templates, and the live free toolkit on this site.',
    },
  },
  {
    q: { th: 'ร้านรับผิดชอบอะไร', en: 'What does the shop own operationally?' },
    a: {
      th: 'บริการ พนักงาน ราคา กฎหมายของร้าน และข้อมูลที่อนุมัติให้ออกสู่สาธารณะ',
      en: 'Services, staff, prices, the shop’s legal duties, and anything approved for public use.',
    },
  },
  {
    q: { th: 'ข้อมูลใช้อย่างไร', en: 'How is information used?' },
    a: {
      th: 'เก็บเท่าที่จำเป็นต่อการติดต่อและทำงานตามขอบเขต รายละเอียดอยู่ที่ศูนย์กฎหมาย',
      en: 'Only what is needed to contact you and do the scoped work. Details sit in the legal centre.',
    },
  },
  {
    q: { th: 'หน้านี้ทำอะไรได้', en: 'What this site does' },
    a: {
      th: 'แนะนำบริการ เปิดเครื่องมือฟรี และนัดคุย ไม่ใช่ระบบสมัครสมาชิก รับเงิน หรือเปิดร้านอัตโนมัติ',
      en: 'It introduces the service, opens the free toolkit, and starts a conversation. It is not signup, payment or auto shop-opening software.',
    },
  },
]

function AboutInner() {
  const { t } = useTranslation()
  const [ownIndex, setOwnIndex] = useState(0)
  const current = ownership[ownIndex] ?? ownership[0]
  const goOwn = (dir: number) => {
    setOwnIndex((n) => (n + dir + ownership.length) % ownership.length)
  }

  useEffect(() => {
    document.title = t({
      th: 'เกี่ยวกับ Chapter99 — พาร์ตเนอร์ดิจิทัลให้ร้านไทยในออสเตรเลีย',
      en: 'About Chapter99 — digital partner for Thai shops in Australia',
    })
  }, [t])

  return (
    <main className="home-v2">
      <p className="v2-notice">
        {t({
          th: 'ซิดนีย์ · ออสเตรเลีย · สำหรับธุรกิจของคนไทยที่ทำร้านจริง',
          en: 'Sydney · Australia · for Thai-owned shops that actually run a floor',
        })}
      </p>

      <section className="v2-hero">
        <div className="v2-wrap v2-hero-grid">
          <div>
            <p className="v2-kicker">{t({ th: 'ผู้คนที่อยู่เบื้องหลังก้าวต่อไปของร้าน', en: 'The people behind your next chapter' })}</p>
            <h1>
              Chapter99
              <br />
              <em>{t({ th: 'เริ่มจากความเข้าใจร้าน', en: 'It starts with understanding the shop.' })}</em>
            </h1>
            <p className="v2-intro">
              {t({
                th: 'Digital Business Infrastructure Partner — จากภาพลักษณ์ที่ลูกค้าเห็น ไปจนถึงงานที่ร้านทำทุกวัน',
                en: 'Digital Business Infrastructure Partner — from the way your business looks, to the way it works.',
              })}
            </p>
            <div className="v2-actions">
              <Link className="v2-btn primary" to="/business-toolkit">
                {t({ th: 'เปิดชุดเครื่องมือธุรกิจฟรี', en: 'Open the Free Business Toolkit' })}
              </Link>
              <Link className="v2-btn secondary" to="/contact">
                {t({ th: 'นัดคุย Business Audit', en: 'Talk through a Business Audit' })}
              </Link>
            </div>
          </div>
          <figure className="v2-hero-photo">
            <img
              src={siteMedia.hero}
              alt={t({
                th: 'ภาพแนวคิดบรรยากาศร้านนวด',
                en: 'Concept photo of a massage studio',
              })}
            />
            <figcaption>
              {t({
                th: 'ภาพแนวคิดเพื่อสื่อโทนงาน ไม่ใช่ภาพทีม Chapter99 ทั้งแผนก',
                en: 'Concept photography for tone — not a full Chapter99 staff portrait.',
              })}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="v2-section">
        <div className="v2-wrap v2-story">
          <div>
            <p className="v2-eyebrow">{t({ th: 'เราทำอะไร', en: 'What we do' })}</p>
            <h2>{t({ th: 'ร้านที่ตั้งใจทำ ควรมีงานดิจิทัลที่ช่วยวันทำงาน', en: 'A carefully run shop deserves digital work that helps the day.' })}</h2>
            <p>
              {t({
                th: 'เราวางภาพถ่าย เว็บไซต์ การค้นพบบน Google ขั้นตอนจอง การชำระเงิน และงานประจำวันไว้ในแผนเดียวกัน สำหรับธุรกิจไทยในออสเตรเลีย',
                en: 'We put photography, website, local discovery, booking steps, payment and daily work in one plan — for Thai businesses in Australia.',
              })}
            </p>
            <p>
              {t({
                th: 'ไม่ได้ขายซอฟต์แวร์ให้ติดตั้งเอง และไม่ได้แทนเจ้าของร้านในการบริการลูกค้า',
                en: 'We do not sell self-install software, and we do not replace the owner in serving customers.',
              })}
            </p>
          </div>
          <div className="v2-tool-card">
            <p className="v2-eyebrow">{t({ th: 'จุดต่าง', en: 'What is different' })}</p>
            <h3>{t({ th: 'ภาพถ่ายเป็นงานจริงของ Chapter99', en: 'Photography is real Chapter99 work' })}</h3>
            <p>
              {t({
                th: 'ภาพนำไปใช้บนเว็บ เนื้อหา และเส้นทางลูกค้า ไม่ใช่แพลตฟอร์มจ้างช่างภาพทั่วไป',
                en: 'Photos go onto the website, into content and along the customer path. This is not a generic photographer marketplace.',
              })}
            </p>
            <Link className="v2-btn secondary" to="/photography">
              {t({ th: 'ดูหน้างานภาพ', en: 'View photography' })}
            </Link>
          </div>
        </div>
      </section>

      <section className="v2-section" id="how">
        <div className="v2-wrap">
          <p className="v2-eyebrow">{t({ th: 'วิธีทำงาน', en: 'How we work' })}</p>
          <h2>{t({ th: 'เข้าใจก่อน แล้วค่อยทำ ส่งมอบ และดูแล', en: 'Understand first. Then build, hand over and care.' })}</h2>
          <div className="v2-process">
            {workSteps.map((step) => (
              <article key={step.n}>
                <span className="num">{step.n}</span>
                <h3>{t(step.title)}</h3>
                <p>{t(step.body)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="v2-section v2-glow-band">
        <div className="v2-wrap">
          <p className="v2-eyebrow">{t({ th: 'ช่วยร้านแบบไหน', en: 'Who we help' })}</p>
          <h2>{t({ th: 'โครงเดียวกัน ปรับภาษาให้เข้ากับงานร้าน', en: 'One path, told in the shop’s language.' })}</h2>
          <ShopGlowGrid />
        </div>
      </section>

      <section className="v2-section v2-trust" id="care">
        <div className="v2-wrap">
          <p className="v2-eyebrow">{t({ th: 'รากฐานที่วางไว้ในงาน', en: 'Built into the work' })}</p>
          <h2>{t({ th: 'ปลอดภัย เป็นเจ้าของบัญชี และเดินต่อได้', en: 'Stay safe. Stay in control. Keep running.' })}</h2>
          <div className="v2-trust-grid">
            <article className="v2-trust-card">
              <h3>STAY SAFE</h3>
              <p>
                {t({
                  th: 'สิทธิ์พนักงาน การแยกข้อมูลร้าน และการเก็บ/ลบข้อมูลลูกค้าต้องอยู่ในขอบเขตงาน ไม่ใช่คำรับประกัน compliance ที่ยังไม่ตรวจ',
                  en: 'Staff access, shop data separation and retention belong in scope — not as an untested compliance claim.',
                })}
              </p>
            </article>
            <article className="v2-trust-card">
              <h3>STAY IN CONTROL</h3>
              <p>
                {t({
                  th: 'เจ้าของร้านต้องเข้าถึงบัญชีสำคัญได้ และรู้ว่าใครเป็นผู้ดูแล',
                  en: 'The owner should reach key accounts and know who administers them.',
                })}
              </p>
            </article>
            <article className="v2-trust-card">
              <h3>KEEP RUNNING</h3>
              <p>
                {t({
                  th: 'มีขั้นตอนสำรองและคนรับช่วงเมื่อเจ้าของไม่ว่าง เป้า 100 ร้านคือแนวออกแบบ ไม่ใช่จำนวนลูกค้าที่พิสูจน์แล้ว',
                  en: 'There should be a fallback when the owner is away. 100 shops is a design target — not a proven client count.',
                })}
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="v2-section v2-quote-band">
        <div className="v2-wrap">
          <p className="v2-eyebrow">{t({ th: 'เข้าใจก่อนอ่านเอกสารเต็ม', en: 'Before the legal centre' })}</p>
          <h2>{t({ th: 'ขอบเขตความรับผิดชอบ', en: 'Who is responsible for what' })}</h2>
          <div
            className="quote-stage"
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight') goOwn(1)
              if (e.key === 'ArrowLeft') goOwn(-1)
            }}
          >
            <p className="quote-rail">{t({ th: 'ขอบเขต', en: 'Scope' })}</p>
            <div className="quote-main">
              <span className="quote-pill">{t(current.q)}</span>
              <p className="quote-text">{t(current.a)}</p>
              <div className="quote-nav">
                <button type="button" aria-label={t({ th: 'ก่อนหน้า', en: 'Previous' })} onClick={() => goOwn(-1)}>
                  ‹
                </button>
                <button type="button" aria-label={t({ th: 'ถัดไป', en: 'Next' })} onClick={() => goOwn(1)}>
                  ›
                </button>
              </div>
            </div>
          </div>
          <p className="v2-note quote-note">
            <Link to="/legal">{t({ th: 'อ่าน Legal & Trust Centre', en: 'Read the Legal & Trust Centre' })}</Link>
            {' · '}
            <Link to="/pricing">{t({ th: 'ดู START / GROW / SCALE', en: 'See START / GROW / SCALE' })}</Link>
            {' · '}
            <Link to="/work">{t({ th: 'ดูตัวอย่างงานออกแบบ', en: 'See design examples' })}</Link>
          </p>
        </div>
      </section>

      <section className="v2-close">
        <p className="v2-eyebrow">{t({ th: 'ก้าวต่อไป', en: 'Next step' })}</p>
        <h2>{t({ th: 'อยากเล่าเรื่องร้านไหม?', en: 'Want to tell us about the shop?' })}</h2>
        <div className="v2-actions">
          <Link className="v2-btn light" to="/contact">
            {t({ th: 'ไปหน้าติดต่อ', en: 'Go to contact' })}
          </Link>
          <Link className="v2-btn secondary" to="/business-toolkit">
            {t({ th: 'ทดลองเครื่องมือฟรี', en: 'Try the free toolkit' })}
          </Link>
        </div>
      </section>
    </main>
  )
}

export function AboutPage() {
  return (
    <SiteLayout>
      <AboutInner />
    </SiteLayout>
  )
}

import { CreditCard, FileCheck, FolderLock } from 'lucide-react'
import { useId, useState } from 'react'
import { liveWorks, reviews } from '../../data/proof'
import { PressIcon } from './PressIcon'

const faqs = [
  {
    q: 'ต้องเก่งคอมไหม',
    a: 'ไม่ต้องครับ เราตั้งค่าให้และสอนใช้งาน ร้านแค่ส่งข้อมูลและรูปมา',
  },
  {
    q: 'ค่ารายเดือนจ่ายเพื่ออะไร',
    a: 'โฮสติ้งและการดูแลให้เว็บใช้งานได้ รวมการแก้ข้อมูลเล็กน้อยตามขอบเขตแพ็กเกจ',
  },
  {
    q: 'มีปัญหาติดต่อใคร',
    a: 'ทีม Chapter99 โดยตรง ทาง SMS โทร Facebook Inbox หรืออีเมล คุยภาษาไทย',
  },
  {
    q: 'ถ้าเลิกใช้ ข้อมูลไปไหน',
    a: 'ข้อมูลเป็นของร้าน ขอส่งออกและย้ายไปที่อื่นได้',
  },
] as const

export function TrustFaq() {
  const [open, setOpen] = useState(0)
  const baseId = useId()

  return (
    <section className="sec" id="faq">
      <div className="wrap">
        <div className="xtrust rv">
          <div>
            <PressIcon icon={FolderLock} label="ข้อมูลร้าน" />
            <b>ข้อมูลเป็นของร้าน</b>
            <span>ย้ายออกได้</span>
          </div>
          <div>
            <PressIcon icon={FileCheck} label="ราคาชัด" />
            <b>ราคาชัดก่อนเริ่ม</b>
            <span>ตกลงเป็นลายลักษณ์อักษร</span>
          </div>
          <div>
            <PressIcon icon={CreditCard} label="การรับเงิน" />
            <b>ไม่รับเงินแทนร้าน</b>
            <span>ร้านรับผ่าน Square / เครื่องรูดบัตรของร้าน</span>
          </div>
        </div>
        {liveWorks.length > 0 ? (
          <div className="proof-list">
            {liveWorks.map((work) => (
              <a className="proof-card" href={work.url} key={work.url} target="_blank" rel="noopener noreferrer">
                <img src={work.image} alt={work.name} width={700} height={438} loading="lazy" />
                <div>
                  <b>{work.name}</b>
                  <span className="live-pill">LIVE</span>
                </div>
              </a>
            ))}
          </div>
        ) : null}
        {reviews.length > 0 ? (
          <div className="review-list">
            {reviews.map((r) => (
              <a className="review-card" href={r.sourceUrl} key={r.sourceUrl} target="_blank" rel="noopener noreferrer">
                <p>{r.text}</p>
                <b>{r.author}</b>
                <span>{r.platform}</span>
              </a>
            ))}
          </div>
        ) : null}
        <div className="faq" style={{ marginTop: 56 }}>
          <div>
            <span className="kicker">07 / FAQ</span>
            <h2 className="th2" style={{ marginTop: 12 }}>
              คำถามที่เจอบ่อย
            </h2>
          </div>
          <div className="qa">
            {faqs.map((item, i) => {
              const panelId = `${baseId}-panel-${i}`
              const btnId = `${baseId}-btn-${i}`
              const isOpen = open === i
              return (
                <div className="qa-item" key={item.q}>
                  <button
                    type="button"
                    id={btnId}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {item.q}
                  </button>
                  {isOpen ? (
                    <p id={panelId} role="region" aria-labelledby={btnId}>
                      {item.a}
                    </p>
                  ) : (
                    <p id={panelId} hidden role="region" aria-labelledby={btnId}>
                      {item.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

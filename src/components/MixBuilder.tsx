import { useState } from 'react'
import { Link } from 'react-router-dom'

const mixes: Record<string, { title: string; body: string; to: string; label: string }> = {
  photo: {
    title: 'เริ่มด้วยภาพของร้าน',
    body: 'วางแนวภาพ ถ่ายและแต่งภาพ เพื่อใช้กับช่องทางที่ร้านมี',
    to: '/photography',
    label: 'ดูงานถ่ายภาพ ↗',
  },
  web: {
    title: 'เริ่มที่หน้าร้านออนไลน์',
    body: 'วางเว็บไซต์ บริการ และเส้นทางที่ลูกค้าเข้าใจบนมือถือ',
    to: '/pricing',
    label: 'ดูแนวทางเว็บไซต์ ↗',
  },
  care: {
    title: 'มีคนช่วยดูแลต่อ',
    body: 'ตกลงรอบอัปเดตและช่องทางช่วยเหลือหลังเปิดใช้',
    to: '/pricing',
    label: 'ดู Owner Care ↗',
  },
  'photo-web': {
    title: 'ภาพและเว็บไปด้วยกัน',
    body: 'วางวันถ่ายกับหน้าเว็บในชุดเดียวกัน ยังไม่แสดงยอดประหยัดจนกว่าราคาจะยืนยัน',
    to: '/photography#photo-packages',
    label: 'ดูแพ็กภาพพร้อมเว็บ ↗',
  },
  'web-care': {
    title: 'เว็บไซต์ที่ดูแลต่อได้',
    body: 'เปิดหน้าร้านออนไลน์ แล้วกำหนดงานอัปเดตให้ทีมไม่สะดุด',
    to: '/contact?need=pricing',
    label: 'คุยขอบเขตดูแล ↗',
  },
  'photo-care': {
    title: 'ภาพใหม่ และมีคนช่วยต่อ',
    body: 'ได้ภาพไปใช้ แล้วคุยรอบอัปเดตคอนเทนต์ตามที่ตกลง',
    to: '/contact?need=photo',
    label: 'คุยภาพและการดูแล ↗',
  },
  'photo-web-care': {
    title: 'ภาพ เว็บ และการดูแลเป็นเรื่องเดียว',
    body: 'Photography ＋ Website ＋ Owner Care ตามขอบเขตที่ร้านต้องการจริง',
    to: '/contact',
    label: 'นัดคุยเรื่องร้าน ↗',
  },
}

const keys = ['photo', 'web', 'care'] as const
const labels = { photo: 'ถ่ายภาพ', web: 'เว็บไซต์', care: 'ดูแลต่อเนื่อง' }

export function MixBuilder() {
  const [on, setOn] = useState({ photo: true, web: false, care: false })
  const key = keys.filter((k) => on[k]).join('-') || 'photo'
  const mix = mixes[key] ?? mixes.photo

  return (
    <section className="creative-builder reveal" id="mix">
      <div>
        <p className="eyebrow">MAKE YOUR OWN MIX</p>
        <h2>
          ร้านของคุณ
          <br />
          <em>อยากเริ่มตรงไหน?</em>
        </h2>
        <p>ลองเลือกงาน แล้วดูแนวทางที่เข้ากัน เริ่มชิ้นเดียวหรือทำไปด้วยกันก็ได้</p>
      </div>
      <div>
        <div className="mix-controls" role="group" aria-label="เลือกบริการที่สนใจ">
          {keys.map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={on[k]}
              onClick={() =>
                setOn((prev) => {
                  const next = { ...prev, [k]: !prev[k] }
                  if (!next.photo && !next.web && !next.care) return { ...next, [k]: true }
                  return next
                })
              }
            >
              {labels[k]} <span>＋</span>
            </button>
          ))}
        </div>
        <div className="mix-result" aria-live="polite">
          <p className="eyebrow">YOUR NEXT CHAPTER</p>
          <h3>{mix.title}</h3>
          <p>{mix.body}</p>
          <Link to={mix.to}>{mix.label}</Link>
        </div>
      </div>
    </section>
  )
}

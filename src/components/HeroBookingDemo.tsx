import { useState } from 'react'
import { Link } from 'react-router-dom'

const times = ['13:00', '14:30', '16:00']
const services = ['นวดอโรม่า · 60 นาที', 'นวดไทย · 60 นาที', 'นวดเท้า · 30 นาที']

export function HeroBookingDemo() {
  const [service, setService] = useState(services[0])
  const [time, setTime] = useState('14:30')
  const [sent, setSent] = useState(false)

  return (
    <div className="booking-preview">
      <div className="preview-top">
        <span>บ้านละมุน / ร้านสมมติ</span>
        <span className="demo-tag">DEMO</span>
      </div>
      <h3>
        เวลาพักของคุณ
        <br />
        <em>เริ่มตรงนี้</em>
      </h3>
      <label htmlFor="preview-service">บริการที่อยากจอง</label>
      <select
        id="preview-service"
        value={service}
        onChange={(e) => {
          setService(e.target.value)
          setSent(false)
        }}
      >
        {services.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <p className="booking-day">วันนี้ · วันตัวอย่าง</p>
      <div className="new-times" role="group" aria-label="เลือกเวลาตัวอย่าง">
        {times.map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={t === time}
            onClick={() => {
              setTime(t)
              setSent(false)
            }}
          >
            {t}
          </button>
        ))}
      </div>
      <button className="btn" type="button" onClick={() => setSent(true)}>
        ลองส่งคำขอจอง ↗
      </button>
      <div id="preview-result" role="status">
        {sent ? (
          <>
            <p>
              ✓ คำขอจองตัวอย่าง: {service} เวลา {time} น. — รอร้านยืนยัน (สาธิตเท่านั้น)
            </p>
            <Link to="/demo/massage">ลองเดโมเต็มตั้งแต่จองจนถึงหน้าร้าน →</Link>
          </>
        ) : (
          'ข้อมูลสาธิต ไม่มีการรับจองหรือส่งข้อความจริง'
        )}
      </div>
    </div>
  )
}

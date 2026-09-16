import { useMemo, useState, type FormEvent } from 'react'
import '../styles/demo.css'

type ServiceKey = 'thai' | 'aroma' | 'foot'
type Status = 'pending' | 'confirmed' | 'active' | 'done'
type Tab = 'customer' | 'owner' | 'staff'

type Booking = {
  id: number
  name: string
  service: ServiceKey
  day: 'today' | 'tomorrow'
  time: string
  status: Status
  source: string
  staff: string | null
}

const services: Record<ServiceKey, { name: string; minutes: number; price: number }> = {
  thai: { name: 'นวดไทย', minutes: 60, price: 80 },
  aroma: { name: 'นวดอโรม่า', minutes: 60, price: 95 },
  foot: { name: 'นวดเท้า', minutes: 30, price: 50 },
}

const labels: Record<Status, string> = {
  pending: 'รอยืนยัน',
  confirmed: 'รับคิวแล้ว',
  active: 'กำลังให้บริการ',
  done: 'เสร็จแล้ว',
}

const slotTimes = ['10:00', '11:30', '13:00', '14:30', '16:00']

function minutes(time: string) {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function seed(): Booking[] {
  return [
    { id: 1, name: 'คุณอร (ตัวอย่าง)', service: 'thai', day: 'today', time: '10:00', status: 'confirmed', source: 'โทรจอง', staff: 'มะลิ' },
    { id: 2, name: 'คุณแอน (ตัวอย่าง)', service: 'aroma', day: 'today', time: '11:30', status: 'active', source: 'ออนไลน์', staff: 'มะลิ' },
    { id: 3, name: 'คุณนิด (ตัวอย่าง)', service: 'foot', day: 'today', time: '13:00', status: 'pending', source: 'ออนไลน์', staff: null },
  ]
}

export function MassageDemo() {
  const [tab, setTab] = useState<Tab>('customer')
  const [bookings, setBookings] = useState<Booking[]>(seed)
  const [nextId, setNextId] = useState(4)
  const [service, setService] = useState<ServiceKey>('aroma')
  const [day, setDay] = useState<'today' | 'tomorrow'>('today')
  const [selectedTime, setSelectedTime] = useState('14:30')
  const [guest, setGuest] = useState('ลูกค้าทดลอง')
  const [confirm, setConfirm] = useState<string | null>(null)
  const [walkinNote, setWalkinNote] = useState('+ เพิ่มคิว walk-in ตัวอย่าง')

  const occupied = (time: string) => {
    const start = minutes(time)
    const end = start + services[service].minutes
    return bookings.some(
      (b) =>
        b.day === day &&
        start < minutes(b.time) + services[b.service].minutes &&
        end > minutes(b.time),
    )
  }

  const usableTime = useMemo(() => {
    const taken = (time: string) => {
      const start = minutes(time)
      const end = start + services[service].minutes
      return bookings.some(
        (b) =>
          b.day === day &&
          start < minutes(b.time) + services[b.service].minutes &&
          end > minutes(b.time),
      )
    }
    if (selectedTime && !taken(selectedTime)) return selectedTime
    return slotTimes.find((t) => !taken(t)) ?? ''
  }, [bookings, day, service, selectedTime])

  const today = bookings.filter((b) => b.day === 'today')

  function advance(id: number) {
    setBookings((list) =>
      list.map((b) => {
        if (b.id !== id) return b
        const next: Status | null =
          b.status === 'pending' ? 'confirmed' : b.status === 'confirmed' ? 'active' : b.status === 'active' ? 'done' : null
        if (!next) return b
        return { ...b, status: next, staff: 'มะลิ' }
      }),
    )
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!usableTime || occupied(usableTime)) return
    const name = guest.trim()
    if (!name) return
    const booking: Booking = {
      id: nextId,
      name,
      service,
      day,
      time: usableTime,
      status: 'pending',
      source: 'ออนไลน์',
      staff: null,
    }
    setNextId((n) => n + 1)
    setBookings((list) => [...list, booking])
    setConfirm(`✓ เพิ่มคำขอจองตัวอย่าง ${booking.time} น. แล้ว สถานะ: รอร้านยืนยัน`)
  }

  function addWalkin() {
    const time = ['17:30', '18:30', '19:30'].find((t) => !bookings.some((b) => b.day === 'today' && b.time === t))
    if (!time) {
      setWalkinNote('เพิ่มครบ 3 คิวตัวอย่างแล้ว')
      return
    }
    setBookings((list) => [
      ...list,
      {
        id: nextId,
        name: 'ลูกค้า walk-in (ตัวอย่าง)',
        service: 'thai',
        day: 'today',
        time,
        status: 'confirmed',
        source: 'Walk-in',
        staff: 'มะลิ',
      },
    ])
    setNextId((n) => n + 1)
  }

  function reset() {
    setBookings(seed())
    setNextId(4)
    setService('aroma')
    setDay('today')
    setSelectedTime('14:30')
    setGuest('ลูกค้าทดลอง')
    setConfirm(null)
    setWalkinNote('+ เพิ่มคิว walk-in ตัวอย่าง')
    setTab('customer')
  }

  const s = services[service]

  return (
    <div className="demo-app">
      <div className="wrap">
        <p className="demo-banner">
          เดโมร้านสมมติ “บ้านละมุน” · ไม่รับจองจริง ไม่รับเงิน และไม่ส่งข้อความ · การสลับมุมมองไม่ใช่ระบบยืนยันตัวตน
        </p>
        <div className="section-heading">
          <div>
            <p className="eyebrow">SEE HOW IT FEELS</p>
            <h2>
              ลองเป็นลูกค้า
              <br />
              <em>แล้วกลับมาดูคิวที่ร้าน</em>
            </h2>
          </div>
        </div>
        <div className="demo-toolbar">
          <div className="tabs" role="tablist" aria-label="มุมมองตัวอย่าง">
            {(
              [
                ['customer', '01 ลูกค้าของร้าน'],
                ['owner', '02 เจ้าของร้าน'],
                ['staff', '03 พนักงาน'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={tab === id}
                aria-controls={id}
                tabIndex={tab === id ? 0 : -1}
                onClick={() => setTab(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <button className="reset" type="button" onClick={reset}>
            เริ่มเดโมใหม่ ↺
          </button>
        </div>
        <div className="demo-frame">
          <div className="browser-bar">
            <span>● ● ●</span>
            <span>บ้านละมุน Thai Massage / ร้านสมมติ</span>
            <span>ตัวอย่าง</span>
          </div>
          {tab === 'customer' && (
            <div id="customer" role="tabpanel" aria-labelledby="tab-customer">
              <div className="shop-head">
                <div className="shop-logo">
                  บ้านละมุน<small>BAAN LAMUN · THAI MASSAGE</small>
                </div>
                <span>พื้นที่พักกาย ในวันที่เหนื่อยล้า</span>
              </div>
              <div className="booking-layout">
                <div className="shop-story">
                  <p className="eyebrow">YOUR TIME TO UNWIND</p>
                  <h3>
                    ให้วันนี้
                    <br />
                    <i>เบาสบายขึ้นอีกนิด</i>
                  </h3>
                  <div className="treatments">
                    {Object.values(services).map((item) => (
                      <div key={item.name}>
                        <span>{item.name}</span>
                        <small>{item.minutes} นาที</small>
                        <strong>A${item.price}</strong>
                      </div>
                    ))}
                  </div>
                  <small>รายการและราคาสมมติสำหรับทดลองเท่านั้น · ชำระที่ร้านในระบบจริงเมื่อเปิดใช้</small>
                </div>
                <form onSubmit={submit}>
                  <p className="eyebrow">MAKE A LITTLE TIME FOR YOU</p>
                  <h3>เลือกเวลาพักของคุณ</h3>
                  <label htmlFor="service">บริการ</label>
                  <select id="service" value={service} onChange={(e) => setService(e.target.value as ServiceKey)}>
                    <option value="thai">นวดไทย · 60 นาที · A$80</option>
                    <option value="aroma">นวดอโรม่า · 60 นาที · A$95</option>
                    <option value="foot">นวดเท้า · 30 นาที · A$50</option>
                  </select>
                  <label htmlFor="day">วันนัดหมาย</label>
                  <select id="day" value={day} onChange={(e) => setDay(e.target.value as 'today' | 'tomorrow')}>
                    <option value="today">วันนี้ (วันตัวอย่าง)</option>
                    <option value="tomorrow">พรุ่งนี้ (วันตัวอย่าง)</option>
                  </select>
                  <fieldset>
                    <legend>เวลาที่ต้องการ</legend>
                    <div className="slots">
                      {slotTimes.map((t) => (
                        <button
                          key={t}
                          type="button"
                          disabled={occupied(t)}
                          aria-pressed={t === usableTime}
                          onClick={() => setSelectedTime(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="field-row">
                    <div>
                      <label htmlFor="guest">ชื่อสำหรับทดลอง</label>
                      <input id="guest" maxLength={40} value={guest} onChange={(e) => setGuest(e.target.value)} required autoComplete="off" />
                    </div>
                    <div>
                      <label htmlFor="phone">เบอร์โทรตัวอย่าง</label>
                      <input id="phone" value="0400 000 000" readOnly aria-describedby="privacy-note" />
                    </div>
                  </div>
                  <small id="privacy-note">ใช้ข้อมูลสมมติ ไม่ต้องกรอกข้อมูลส่วนตัวจริง</small>
                  <p className="booking-summary">
                    {usableTime ? `${s.name} · ${s.minutes} นาที · ${usableTime} น. · A$${s.price}` : 'เวลาตัวอย่างเต็มแล้ว กรุณาเลือกวันอื่น'}
                  </p>
                  <button className="btn full" type="submit" disabled={!usableTime}>
                    ส่งคำขอจองตัวอย่าง ↗
                  </button>
                  <p className="note">ร้านตรวจสอบคิวก่อนยืนยัน · ไม่มีการชำระเงินในหน้านี้</p>
                  {confirm && (
                    <div className="demo-confirm" role="status">
                      <div>{confirm}</div>
                      <div>ยังไม่มีการส่งอีเมลหรือ SMS</div>
                      <button type="button" onClick={() => setTab('owner')}>
                        ดูคิวนี้ในมุมมองเจ้าของร้าน →
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
          {tab === 'owner' && (
            <div id="owner" role="tabpanel" aria-labelledby="tab-owner">
              <div className="dashboard-header">
                <div>
                  <p className="eyebrow">OWNER'S VIEW</p>
                  <h3>สวัสดีค่ะ วันนี้ร้านเป็นอย่างไรบ้าง</h3>
                  <p>สรุปวันนี้และรายการนัดหมาย · บ้านละมุน</p>
                </div>
                <span className="sample-label">ข้อมูลสาธิต · ไม่ใช่การเข้าสู่ระบบ</span>
              </div>
              <div className="metrics">
                <div>
                  <small>คิววันนี้</small>
                  <strong>{today.length}</strong>
                </div>
                <div>
                  <small>รอยืนยัน</small>
                  <strong>{today.filter((b) => b.status === 'pending').length}</strong>
                </div>
                <div>
                  <small>ให้บริการเสร็จแล้ว</small>
                  <strong>{today.filter((b) => b.status === 'done').length}</strong>
                </div>
              </div>
              <div className="queue-head">
                <h4>คิวของร้าน</h4>
                <button className="outline" type="button" onClick={addWalkin}>
                  {walkinNote}
                </button>
              </div>
              <p className="hint">คิวจากมุมมองลูกค้ามาอยู่ตรงนี้ กดรับคิวแล้วทีมเห็นสถานะเดียวกัน</p>
              <QueueList bookings={bookings} onAdvance={advance} staffOnly={false} />
              <p className="hint">การสลับมุมมองในเดโมใช้เล่าเรื่องการทำงาน ระบบจริงต้องเข้าสู่ระบบและตรวจสิทธิ์แยกกัน</p>
            </div>
          )}
          {tab === 'staff' && (
            <div id="staff" role="tabpanel" aria-labelledby="tab-staff">
              <div className="dashboard-header">
                <div>
                  <p className="eyebrow">YOUR DAY, AT A GLANCE</p>
                  <h3>คิวงานของคุณมะลิ</h3>
                  <p>เห็นเวลานัด บริการ และสิ่งที่ต้องทำต่อ</p>
                </div>
                <span className="sample-label">พนักงานตัวอย่าง</span>
              </div>
              <div className="staff-intro">
                <p>
                  <strong>เปิดดูคิว แล้วเริ่มดูแลลูกค้าได้เลย</strong>
                  <br />
                  แสดงคิวที่มอบหมายให้คุณมะลิในเดโม
                </p>
              </div>
              <QueueList bookings={bookings} onAdvance={advance} staffOnly />
            </div>
          )}
        </div>
        <div className="demo-bottom">
          <span>จองออนไลน์</span>
          <b>→</b>
          <span>เจ้าของรับคิว</span>
          <b>→</b>
          <span>พนักงานดูแลลูกค้า</span>
          <b>→</b>
          <span>จบงานในหน้าคิว</span>
        </div>
      </div>
    </div>
  )
}

function QueueList({
  bookings,
  onAdvance,
  staffOnly,
}: {
  bookings: Booking[]
  onAdvance: (id: number) => void
  staffOnly: boolean
}) {
  const list = bookings
    .filter((b) => !staffOnly || b.staff === 'มะลิ')
    .sort((a, b) => a.day.localeCompare(b.day) || a.time.localeCompare(b.time))

  return (
    <div>
      {list.map((b) => {
        const next =
          b.status === 'pending' ? 'รับคิวนี้' : b.status === 'confirmed' ? 'เริ่มบริการ' : b.status === 'active' ? 'เสร็จแล้ว' : null
        return (
          <div className="queue-row" key={b.id}>
            <strong>{b.time}</strong>
            <div>
              <strong>{b.name}</strong>
              <small>
                {services[b.service].name} · {services[b.service].minutes} นาที · {b.day === 'today' ? 'วันนี้' : 'พรุ่งนี้'} · {b.source}
              </small>
            </div>
            <span className={`status ${b.status}`}>{labels[b.status]}</span>
            {next ? (
              <button className="outline" type="button" onClick={() => onAdvance(b.id)}>
                {next}
              </button>
            ) : (
              <span className="done-mark">✓ จบงาน</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

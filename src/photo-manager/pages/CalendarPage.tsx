import { useState } from 'react'
import { isoFromDate, monthGrid, toBuddhistISOParts } from '../lib/dates'
import { usePhotoStore } from '../store/StoreContext'
import { PageTitle, Tag } from './ui'

export default function CalendarPage() {
  const { clients } = usePhotoStore()
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const { yearBE } = toBuddhistISOParts(`${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-15`)
  const cells = monthGrid(cursor.y, cursor.m)
  const dow = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

  function shift(delta: number) {
    const d = new Date(cursor.y, cursor.m + delta, 1)
    setCursor({ y: d.getFullYear(), m: d.getMonth() })
  }

  return (
    <>
      <PageTitle sub={`ปฏิทินงาน · พ.ศ. ${yearBE}`}>ปฏิทิน</PageTitle>
      <div className="card">
        <div className="row" style={{ marginBottom: 14 }}>
          <button className="btn ghost sm" onClick={() => shift(-1)}>
            ← เดือนก่อน
          </button>
          <h3 style={{ margin: 0 }}>
            {new Date(cursor.y, cursor.m, 1).toLocaleString('th-TH', { month: 'long', year: 'numeric' })}
          </h3>
          <button className="btn ghost sm" onClick={() => shift(1)}>
            เดือนถัดไป →
          </button>
        </div>
        <div className="cal-wrap">
        <div className="cal">
          {dow.map((d) => (
            <div key={d} className="dow">
              {d}
            </div>
          ))}
          {cells.map((d, i) => {
            if (!d) return <div key={i} className="day empty" />
            const iso = isoFromDate(d)
            const jobs = clients.filter((c) => c.dateISO === iso)
            return (
              <div key={iso} className="day">
                <strong>{d.getDate()}</strong>
                {jobs.map((c) => (
                  <span key={c.id} className={`chip tag ${c.status}`} title={c.name}>
                    {c.name}
                  </span>
                ))}
              </div>
            )
          })}
        </div>
        </div>
        <div className="muted" style={{ marginTop: 12 }}>
          สีชิปตามสถานะ: <Tag status="draft" label="ร่าง" /> <Tag status="pending" label="รอมัดจำ" />{' '}
          <Tag status="confirmed" label="ยืนยัน" /> <Tag status="paid" label="จ่ายแล้ว" />
        </div>
      </div>
    </>
  )
}

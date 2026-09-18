import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { generateReminder, generateReviewInvite, generateReviewReply } from '../lib/generateCopy'
import type { ToolkitGuest, ToolkitQueueItem, ToolkitState } from '../lib/toolkitStore'

function uid() {
  return crypto.randomUUID()
}

function todayIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function FieldHint({ children }: { children: string }) {
  return <p className="field-hint">{children}</p>
}

type Props = {
  panel: 'queue' | 'guests' | 'reminders' | 'reviews'
  state: ToolkitState
  setState: Dispatch<SetStateAction<ToolkitState>>
  t: (th: string, en: string) => string
  setStatus: (value: string) => void
  copyText: (value: string) => Promise<void>
}

export function ToolkitDailyPanels({ panel, state, setState, t, setStatus, copyText }: Props) {
  const [draft, setDraft] = useState('')
  const today = todayIso()
  const todaysQueue = state.queue.filter((row) => row.date === today).sort((a, b) => a.time.localeCompare(b.time))

  async function copy(text: string) {
    try {
      await copyText(text)
      setStatus(t('คัดลอกแล้ว ส่งจากแอปของคุณเอง', 'Copied. Send it from your own app.'))
    } catch {
      setStatus(
        t(
          'คัดลอกอัตโนมัติไม่ได้ในเบราว์เซอร์นี้ ให้เลือกข้อความในช่องแล้วคัดลอกเอง',
          'Automatic copy is blocked in this browser. Select the text in the box and copy it yourself.',
        ),
      )
    }
  }

  function addQueue(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const item: ToolkitQueueItem = {
      id: uid(),
      date: today,
      time: String(data.get('time') ?? '').trim(),
      service: String(data.get('service') ?? '').trim(),
      firstName: String(data.get('firstName') ?? '').trim(),
    }
    if (!item.time || !item.firstName) {
      setStatus(t('ใส่เวลาและชื่อเล่นให้ครบก่อนเพิ่มคิว', 'Add a time and first name before saving the queue.'))
      return
    }
    setState((s) => ({ ...s, queue: [...s.queue, item].slice(-40) }))
    e.currentTarget.reset()
    setStatus(t('บันทึกคิววันนี้บนเครื่องนี้แล้ว ไม่ส่งไประบบจอง', 'Saved on this device. Not a live booking system.'))
  }

  function addGuest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const item: ToolkitGuest = {
      id: uid(),
      name: String(data.get('name') ?? '').trim(),
      note: String(data.get('note') ?? '').trim(),
      lastVisit: String(data.get('lastVisit') ?? '').trim(),
    }
    if (!item.name) return
    setState((s) => ({ ...s, guests: [item, ...s.guests].slice(0, 40) }))
    e.currentTarget.reset()
    setStatus(t('จดชื่อบนเครื่องนี้แล้ว ไม่เก็บเบอร์หรืออีเมล', 'Saved on this device. No phone or email is stored.'))
  }

  if (panel === 'queue') {
    return (
      <section>
        <h2>{t('คิววันนี้', "Today's queue")}</h2>
        <p className="toolkit-explain">
          {t(
            'ดูคิววันนี้เรียงเวลา ไม่ต้องจดใส่กระดาษหรือจำเอง ใส่ชื่อเล่นกับเวลาบนเครื่องนี้ ไม่ใช่ระบบจองออนไลน์ และไม่เก็บเบอร์ลูกค้า',
            'See today in time order. First name and time stay on this device. This is not live booking and does not store phone numbers.',
          )}
        </p>
        <form className="toolkit-form" onSubmit={addQueue}>
          <label>
            {t('เวลา', 'Time')}
            <input name="time" type="time" required />
          </label>
          <label>
            {t('บริการ', 'Service')}
            <input name="service" placeholder={t('เช่น นวดไทย 60 นาที', 'e.g. Thai massage 60 min')} />
          </label>
          <label>
            {t('ชื่อเล่นลูกค้า', 'First name only')}
            <input name="firstName" required maxLength={24} placeholder={t('เช่น อร', 'e.g. Ann')} />
            <FieldHint>{t('ใส่ชื่อเล่นอย่างเดียว อย่าใส่เบอร์หรืออีเมล', 'First name only. Do not type a phone or email.')}</FieldHint>
          </label>
          <button className="btn" type="submit">
            {t('เพิ่มคิววันนี้', 'Add to today')}
          </button>
        </form>
        <ul className="toolkit-list">
          {todaysQueue.length === 0 ? <li>{t('ยังไม่มีคิววันนี้', 'No bookings listed for today.')}</li> : null}
          {todaysQueue.map((row) => (
            <li key={row.id}>
              <span>
                <strong>{row.time}</strong> · {row.firstName}
                {row.service ? ` · ${row.service}` : ''}
              </span>
              <button type="button" onClick={() => setState((s) => ({ ...s, queue: s.queue.filter((q) => q.id !== row.id) }))}>
                {t('ลบ', 'Remove')}
              </button>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (panel === 'guests') {
    return (
      <section>
        <h2>{t('ลูกค้าของฉัน', 'My customers')}</h2>
        <p className="toolkit-explain">
          {t(
            'จดจำลูกค้าประจำและสิ่งที่เขาชอบ ไม่ต้องจำเอง เก็บชื่อและโน้ตบนเครื่องนี้ ไม่มีช่องเบอร์หรืออีเมล',
            'Remember regulars and what they like. Names and notes stay on this device. There is no phone or email field.',
          )}
        </p>
        <form className="toolkit-form" onSubmit={addGuest}>
          <label>
            {t('ชื่อ', 'Name')}
            <input name="name" required maxLength={40} placeholder={t('เช่น คุณอร', 'e.g. Ann')} />
          </label>
          <label>
            {t('โน้ต', 'Note')}
            <input name="note" maxLength={80} placeholder={t('เช่น ชอบนวดแรง', 'e.g. prefers firm pressure')} />
          </label>
          <label>
            {t('มาล่าสุด', 'Last visit')}
            <input name="lastVisit" type="date" />
          </label>
          <button className="btn" type="submit">
            {t('จดชื่อนี้', 'Save this name')}
          </button>
        </form>
        <ul className="toolkit-list">
          {state.guests.length === 0 ? <li>{t('ยังไม่มีรายชื่อบนเครื่องนี้', 'No names saved on this device yet.')}</li> : null}
          {state.guests.map((row) => (
            <li key={row.id}>
              <span>
                <strong>{row.name}</strong>
                {row.note ? ` · ${row.note}` : ''}
                {row.lastVisit ? ` · ${row.lastVisit}` : ''}
              </span>
              <button type="button" onClick={() => setState((s) => ({ ...s, guests: s.guests.filter((g) => g.id !== row.id) }))}>
                {t('ลบ', 'Remove')}
              </button>
            </li>
          ))}
        </ul>
      </section>
    )
  }

  if (panel === 'reminders') {
    return (
      <section>
        <h2>{t('ตัวช่วยแจ้งเตือน', 'Reminder helper')}</h2>
        <p className="toolkit-explain">
          {t(
            'สร้างข้อความเตือนนัดล่วงหน้า คัดลอกไปส่งเองได้ทันที เราไม่ส่ง SMS อัตโนมัติ และไม่เก็บเบอร์ลูกค้า',
            'Draft a reminder, then copy and send it yourself. We do not send SMS and do not store phone numbers.',
          )}
        </p>
        <form
          className="toolkit-form"
          onSubmit={(e) => {
            e.preventDefault()
            const data = new FormData(e.currentTarget)
            const guestId = String(data.get('guestId') ?? '')
            const queueId = String(data.get('queueId') ?? '')
            const guest = state.guests.find((g) => g.id === guestId)
            const slot = todaysQueue.find((q) => q.id === queueId)
            const firstName = String(data.get('firstName') ?? '').trim() || guest?.name || slot?.firstName || ''
            const time = String(data.get('time') ?? '').trim() || slot?.time || ''
            const service = String(data.get('service') ?? '').trim() || slot?.service || ''
            const text = generateReminder(state.profile, firstName, time, service)
            setDraft(text)
            setStatus(t('สร้างบนเครื่องนี้แล้ว คัดลอกไปส่งเอง', 'Created on this device. Copy and send it yourself.'))
          }}
        >
          <label>
            {t('จากรายชื่อบนเครื่อง', 'From names on this device')}
            <select name="guestId" defaultValue="">
              <option value="">{t('ไม่เลือก', 'None')}</option>
              {state.guests.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('จากคิววันนี้', "From today's queue")}
            <select name="queueId" defaultValue="">
              <option value="">{t('ไม่เลือก', 'None')}</option>
              {todaysQueue.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.time} · {q.firstName}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t('ชื่อเล่น (ถ้าพิมพ์เอง)', 'First name (if typing)')}
            <input name="firstName" maxLength={24} />
            <FieldHint>{t('ไม่ต้องใส่เบอร์ ข้อความนี้คุณส่งเอง', 'No phone field. You send this text yourself.')}</FieldHint>
          </label>
          <label>
            {t('เวลา', 'Time')}
            <input name="time" type="time" />
          </label>
          <label>
            {t('บริการ', 'Service')}
            <input name="service" />
          </label>
          <button className="btn" type="submit">
            {t('สร้างข้อความเตือน', 'Generate reminder')}
          </button>
        </form>
        <div className="actions">
          <button className="btn" type="button" disabled={!draft} onClick={() => void copy(draft)}>
            {t('คัดลอก', 'Copy')}
          </button>
          {draft ? (
            <a className="btn small" href={`sms:?body=${encodeURIComponent(draft)}`}>
              {t('คัดลอกและเปิดแอป SMS', 'Open SMS app')}
            </a>
          ) : null}
        </div>
        <textarea
          readOnly
          rows={8}
          value={draft}
          aria-label={t('ข้อความเตือน', 'Reminder text')}
          onFocus={(e) => e.currentTarget.select()}
          onClick={(e) => e.currentTarget.select()}
        />
      </section>
    )
  }

  return (
    <section>
      <h2>{t('ดูแลรีวิว', 'Review care')}</h2>
      <p className="toolkit-explain">
        {t(
          'ร่างคำตอบรีวิวมืออาชีพ และวิธีชวนลูกค้าให้รีวิว การตอบช่วยให้คนค้นร้านเห็นว่าร้านดูแลลูกค้า ลิงก์ด้านล่างพิมพ์ติดหน้าร้านหรือนำไปทำ QR เองได้',
          'Draft a professional review reply and a short invite. Replies show you look after guests. Print the link or make a QR in your own app.',
        )}
      </p>
      <label>
        {t('ลิงก์รีวิวร้าน (Google / Facebook)', 'Shop review link (Google / Facebook)')}
        <input
          value={state.profile.reviewLink}
          onChange={(e) => setState((s) => ({ ...s, profile: { ...s.profile, reviewLink: e.target.value } }))}
          placeholder="https://"
        />
        <FieldHint>{t('วางลิงก์หน้ารีวิวของร้าน ไม่ใช่ข้อมูลลูกค้า', 'Paste the shop review page. Not a customer detail.')}</FieldHint>
      </label>
      <div className="actions">
        <button
          className="btn small"
          type="button"
          onClick={() => {
            setDraft(generateReviewReply('positive', state.profile))
            setStatus(t('ร่างคำขอบคุณแล้ว คัดลอกไปแปะใน Google หรือ Facebook', 'Thank-you draft ready. Copy into Google or Facebook.'))
          }}
        >
          {t('ร่างตอบรีวิวดี', 'Reply to a good review')}
        </button>
        <button
          className="btn small"
          type="button"
          onClick={() => {
            setDraft(generateReviewReply('negative', state.profile))
            setStatus(t('ร่างคำรับฟังแล้ว ไม่ใช่คำปรึกษากฎหมาย', 'Listening draft ready. Not legal advice.'))
          }}
        >
          {t('ร่างตอบรีวิวไม่ดี', 'Reply to a poor review')}
        </button>
        <button
          className="btn small"
          type="button"
          onClick={() => {
            setDraft(generateReviewInvite(state.profile))
            setStatus(t('ได้ข้อความชวนรีวิวแล้ว พิมพ์หรือทำ QR เอง', 'Invite text ready. Print it or make a QR yourself.'))
          }}
        >
          {t('ข้อความชวนรีวิว / ลิงก์พิมพ์', 'Invite text / printable link')}
        </button>
      </div>
      <textarea readOnly rows={10} value={draft} aria-label={t('ร่างรีวิว', 'Review draft')} />
      <p className="note">
        {t(
          'ทำ QR จากลิงก์นี้ด้วยแอปกล้องหรือเครื่องพิมพ์ของคุณ เครื่องมือนี้ไม่วาด QR และไม่โพสต์รีวิวแทนคุณ',
          'Make a QR from this link in your own camera or printer app. This toolkit does not draw a QR or post reviews for you.',
        )}
      </p>
      <button className="btn" type="button" disabled={!draft} onClick={() => void copy(draft)}>
        {t('คัดลอก', 'Copy')}
      </button>
    </section>
  )
}

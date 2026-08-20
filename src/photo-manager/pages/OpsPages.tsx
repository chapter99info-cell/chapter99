import { useState } from 'react'
import { emailCopy, EMAIL_KIND_LABEL, mailtoHref, type EmailKind } from '../lib/emails'
import { addMinutes, timelineForJob } from '../lib/timeline'
import { usePhotoStore } from '../store/StoreContext'
import { ClientSelect, PageTitle } from './ui'

export function TimelinePage() {
  const { clients, patchClient } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  if (!client) return <p>ยังไม่มีลูกค้า</p>
  const isWedding = client.type === 'wedding'
  const t0 = client.ceremonyTime || (isWedding ? '16:00' : '09:00')
  const rows = timelineForJob(client.type)
  const timeLabel = isWedding ? 'เวลาพิธีเริ่ม (Ceremony Start)' : 'เวลานัดเริ่มถ่าย (Call time)'
  const sub = isWedding
    ? 'ใส่เวลาพิธีเริ่ม ระบบคำนวณตารางถ่าย Photo/Video ให้อัตโนมัติ'
    : client.type === 'engagement'
      ? 'ตารางวันถ่าย Pre-wedding / Engagement — ไม่มีพิธี เค้ก หรือ first dance'
      : 'ตารางเซสชันสั้น Portrait / Family — ถึงงาน ถ่าย แรป'

  return (
    <>
      <PageTitle sub={sub}>ตารางเวลาวันงาน</PageTitle>
      <div className="card">
        <div className="grid2">
          <div className="field">
            <label>เลือกลูกค้า</label>
            <ClientSelect
              clients={clients}
              value={client.id}
              onChange={(v) => {
                setId(v)
              }}
            />
          </div>
          <div className="field">
            <label>{timeLabel}</label>
            <input type="time" value={t0} onChange={(e) => patchClient(client.id, { ceremonyTime: e.target.value })} />
          </div>
        </div>
        <p className="muted" style={{ margin: 0 }}>
          เทมเพลต: {client.typeLabel}
        </p>
      </div>
      <div className="card">
        <h3>ตาราง Photo / Video</h3>
        <table className="tl-table">
          <thead>
            <tr>
              <th>เวลา</th>
              <th>PHOTO</th>
              <th>VIDEO</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${client.type}-${row.off}`}>
                <td className="tl-time">{addMinutes(t0, row.off)}</td>
                <td>{row.photo}</td>
                <td>{row.video}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export function VendorsPage() {
  const { clients, vendorsFor, saveVendors } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  if (!client) return <p>ยังไม่มีลูกค้า</p>
  const sheet = vendorsFor(client.id)
  return (
    <>
      <PageTitle sub="เก็บเบอร์ติดต่อ vendor ของแต่ละงาน ดูรวดเร็วหน้างาน">Vendor Sheet</PageTitle>
      <div className="card">
        <div className="field" style={{ maxWidth: 360 }}>
          <label>เลือกลูกค้า/งาน</label>
          <ClientSelect clients={clients} value={client.id} onChange={setId} />
        </div>
        <table className="vendor-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>ชื่อ</th>
              <th>เบอร์โทร</th>
              <th>อีเมล</th>
            </tr>
          </thead>
          <tbody>
            {sheet.vendors.map((v, i) => (
              <tr key={v.role + i}>
                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{v.role}</td>
                {(['name', 'phone', 'email'] as const).map((k) => (
                  <td key={k}>
                    <input
                      value={v[k]}
                      onChange={(e) => {
                        const vendors = sheet.vendors.map((row, idx) => (idx === i ? { ...row, [k]: e.target.value } : row))
                        void saveVendors({ clientId: client.id, vendors })
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="btn ghost sm"
          style={{ marginTop: 12 }}
          onClick={() =>
            saveVendors({
              clientId: client.id,
              vendors: [...sheet.vendors, { role: 'Other', name: '', phone: '', email: '' }],
            })
          }
        >
          + เพิ่มแถว
        </button>
      </div>
    </>
  )
}

export function BriefPage() {
  const { clients } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  if (!client) return <p>ยังไม่มีลูกค้า</p>
  const text = `สรุปงานวันถ่าย — ${client.name}

📅 วันที่: ${client.date}
📍 สถานที่: ${client.location}
🎯 ประเภทงาน: ${client.typeLabel}
⏱ พิธีเริ่ม: ${client.ceremonyTime} น. (ทีมงานถึงก่อน 30 นาที)
🎨 สไตล์ภาพ: โทนธรรมชาติ อบอุ่น แสงนุ่ม
👥 ผู้ติดต่อหน้างาน: ${client.name} (${client.phone})

หมายเหตุ: กรุณายืนยันความพร้อมล่วงหน้า 3 วันก่อนวันงาน`
  const link = `${window.location.origin}/pm/confirm/${client.confirmToken}?k=brief`
  return (
    <>
      <PageTitle sub="สร้างหน้าสรุปคิวงาน ส่งลิงก์ให้ลูกค้าคอนเฟิร์ม">สรุปงานวันถ่าย (Shoot Brief)</PageTitle>
      <div className="card">
        <div className="field" style={{ maxWidth: 360 }}>
          <label>เลือกลูกค้า</label>
          <ClientSelect clients={clients} value={client.id} onChange={setId} />
        </div>
      </div>
      <div className="card">
        <div className="doc-preview">{text}</div>
        <div className="link-box">
          <span>🔗</span>
          <span className="url">{link}</span>
          <a className="btn ghost sm" href={link} target="_blank" rel="noreferrer">
            เปิดดูหน้าที่ลูกค้าเห็น
          </a>
          <span className={`confirm-status ${client.briefConfirmed ? 'confirmed' : 'waiting'}`}>
            {client.briefConfirmed ? '✓ ลูกค้ายืนยันแล้ว' : '● รอลูกค้ายืนยัน'}
          </span>
        </div>
      </div>
    </>
  )
}

export function EmailPage() {
  const { clients, patchClient } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const [kind, setKind] = useState<EmailKind>('confirm')
  const [lang, setLang] = useState<'th' | 'en'>('th')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  if (!client) return <p>ยังไม่มีลูกค้า</p>
  const copy = emailCopy(kind, client, lang, {
    gallery: [client.gallery.pictime, client.gallery.drive].filter(Boolean).join(' | '),
  })
  const href = mailtoHref(client.email, copy.subject, copy.body)

  async function onSendIntent() {
    if (kind === 'preshoot') {
      await patchClient(client.id, { checklist: { ...client.checklist, preshoot: true } })
    }
    if (kind === 'review') {
      await patchClient(client.id, { checklist: { ...client.checklist, review: true } })
    }
  }

  return (
    <>
      <PageTitle sub="ร่างอีเมลสองภาษา EN/TH — กดส่งแล้วเช็กลิสต์จะติ๊กให้อัตโนมัติเมื่อเป็นเตือนก่อนถ่ายหรือขอรีวิว">
        ร่างอีเมลถึงลูกค้า
      </PageTitle>
      <div className="card">
        <div className="grid2">
          <div className="field">
            <label>เลือกลูกค้า</label>
            <ClientSelect clients={clients} value={client.id} onChange={setId} />
          </div>
          <div className="field">
            <label>สถานการณ์</label>
            <select value={kind} onChange={(e) => setKind(e.target.value as EmailKind)}>
              {(Object.keys(EMAIL_KIND_LABEL) as EmailKind[]).map((k) => (
                <option key={k} value={k}>
                  {EMAIL_KIND_LABEL[k]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row" style={{ marginBottom: 12 }}>
          <button className={lang === 'th' ? 'btn sm' : 'btn ghost sm'} onClick={() => setLang('th')}>
            ไทย
          </button>
          <button className={lang === 'en' ? 'btn sm' : 'btn ghost sm'} onClick={() => setLang('en')}>
            English
          </button>
        </div>
      </div>
      <div className="card">
        <h3>ตัวอย่างอีเมล</h3>
        <div className="doc-preview">
          {copy.subject}
          {'\n\n'}
          {copy.body}
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <a className="btn sm" href={href} onClick={() => void onSendIntent()}>
            ✉ เปิดในเมล (mailto)
          </a>
          <button className="btn ghost sm" onClick={() => navigator.clipboard.writeText(`${copy.subject}\n\n${copy.body}`)}>
            คัดลอก
          </button>
        </div>
      </div>
    </>
  )
}

export function GalleryPage() {
  const { clients, patchClient } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const [withReview, setWithReview] = useState(true)
  const client = clients.find((c) => c.id === id) ?? clients[0]
  if (!client) return <p>ยังไม่มีลูกค้า</p>
  const g = client.gallery
  const review = 'https://g.page/r/chapter99photography'
  const links = [g.pictime && `Pic-Time: ${g.pictime}`, g.drive && `Google Drive: ${g.drive}`, g.password && `Password: ${g.password}`]
    .filter(Boolean)
    .join('\n')
  const email = emailCopy('delivery', client, 'en', { gallery: links })
  const messenger = `Hi ${client.name} — your Chapter99 gallery is ready.\n${links}${withReview ? `\n\nIf you have a moment, a Google review helps our small studio:\n${review}` : ''}`
  const mailto = mailtoHref(client.email, email.subject, `${email.body}\n\n${messenger}`)

  return (
    <>
      <PageTitle sub="วางลิงก์ Pic-Time / Drive แล้วส่งเมลหรือข้อความ Messenger (คัดลอกอย่างเดียว ไม่ต่อ Facebook API)">
        ส่งมอบแกลเลอรี
      </PageTitle>
      <div className="card">
        <div className="field">
          <label>เลือกลูกค้า</label>
          <ClientSelect clients={clients} value={client.id} onChange={setId} />
        </div>
        <div className="field">
          <label>Pic-Time URL</label>
          <input
            value={g.pictime}
            onChange={(e) => {
              const pictime = e.target.value
              const hasLink = Boolean(pictime.trim() || g.drive.trim())
              void patchClient(client.id, {
                gallery: { ...g, pictime },
                checklist: hasLink ? { ...client.checklist, gallery: true } : client.checklist,
              })
            }}
          />
        </div>
        <div className="field">
          <label>Google Drive URL</label>
          <input
            value={g.drive}
            onChange={(e) => {
              const drive = e.target.value
              const hasLink = Boolean(g.pictime.trim() || drive.trim())
              void patchClient(client.id, {
                gallery: { ...g, drive },
                checklist: hasLink ? { ...client.checklist, gallery: true } : client.checklist,
              })
            }}
          />
        </div>
        <div className="field">
          <label>รหัสแกลเลอรี (ถ้ามี)</label>
          <input value={g.password} onChange={(e) => patchClient(client.id, { gallery: { ...g, password: e.target.value } })} />
        </div>
        <label className="addon">
          <input type="checkbox" checked={withReview} onChange={(e) => setWithReview(e.target.checked)} />
          แนบข้อความขอรีวิว Google ในข้อความเดียวกัน
        </label>
      </div>
      <div className="card">
        <h3>อีเมล</h3>
        <div className="doc-preview">{`${email.subject}\n\n${email.body}\n\n${messenger}`}</div>
        <div className="row" style={{ marginTop: 12 }}>
          <a
            className="btn sm"
            href={mailto}
            onClick={() =>
              patchClient(client.id, {
                checklist: { ...client.checklist, gallery: true, review: withReview ? true : client.checklist.review },
              })
            }
          >
            เปิด mailto
          </a>
        </div>
      </div>
      <div className="card">
        <h3>ข้อความ Facebook / Messenger (คัดลอกวาง)</h3>
        <div className="doc-preview">{messenger}</div>
        <button
          className="btn ghost sm"
          onClick={() => {
            void navigator.clipboard.writeText(messenger)
            void patchClient(client.id, { checklist: { ...client.checklist, gallery: true } })
          }}
        >
          คัดลอกข้อความ
        </button>
      </div>
    </>
  )
}

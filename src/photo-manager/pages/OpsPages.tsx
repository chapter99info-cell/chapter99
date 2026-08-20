import { useEffect, useState } from 'react'
import { emailCopy, EMAIL_KIND_LABEL, mailtoHref, type EmailKind } from '../lib/emails'
import { defaultPrepTips } from '../lib/prepTips'
import { addMinutes, autoDaySummary, callTimeForJob, daySummaryText, timelineForJob } from '../lib/timeline'
import { usePhotoStore } from '../store/StoreContext'
import { PrepTipsCard } from './PrepTipsCard'
import { ClientConfirmBar, ClientSelect, PageTitle } from './ui'

export function TimelinePage() {
  const { clients, patchClient } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  if (!client) return <p>ยังไม่มีลูกค้า</p>
  const isWedding = client.type === 'wedding'
  const t0 = callTimeForJob(client.type, client.ceremonyTime)
  const rows = timelineForJob(client.type)
  const timeLabel = isWedding ? 'เวลาพิธีเริ่ม (Ceremony Start)' : 'เวลานัดเริ่มถ่าย (Call time)'
  const sub = isWedding
    ? 'ใส่เวลาพิธีเริ่ม ระบบคำนวณตารางถ่าย Photo/Video ให้อัตโนมัติ — หน้านี้สำหรับทีมงานเท่านั้น'
    : client.type === 'engagement'
      ? 'ตารางวันถ่าย Pre-wedding / Engagement สำหรับทีมงาน — ลูกค้าไม่เห็นหน้ารายนาทีนี้'
      : 'ตารางเซสชันสั้น Portrait / Family สำหรับทีมงาน — ลูกค้าไม่เห็นหน้ารายนาทีนี้'

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
          เทมเพลต: {client.typeLabel} · ลูกค้าไม่เห็นตาราง PHOTO/VIDEO นี้ — สรุปสั้นอยู่ที่หน้าสรุปงานวันถ่าย
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
  const { clients, patchClient } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  if (!client) return <p>ยังไม่มีลูกค้า</p>
  const autoPlan = autoDaySummary(client.type, client.ceremonyTime)
  const plan = daySummaryText(client)
  const text = `สรุปงานวันถ่าย — ${client.name}

📅 วันที่: ${client.date}
📍 สถานที่: ${client.location}
🎯 ประเภทงาน: ${client.typeLabel}
⏱ พิธีเริ่ม: ${client.ceremonyTime} น. (ทีมงานถึงก่อน 30 นาที)
🗓 แผนวันถ่าย: ${plan}
🎨 สไตล์ภาพ: โทนธรรมชาติ อบอุ่น แสงนุ่ม
👥 ผู้ติดต่อหน้างาน: ${client.name} (${client.phone})

หมายเหตุ: กรุณายืนยันความพร้อมล่วงหน้า 3 วันก่อนวันงาน`
  return (
    <>
      <PageTitle sub="สร้างหน้าสรุปคิวงาน ส่งลิงก์ให้ลูกค้าคอนเฟิร์ม — ไม่ส่งตารางถ่ายรายนาทีของทีมงาน">สรุปงานวันถ่าย (Shoot Brief)</PageTitle>
      <div className="card">
        <div className="field" style={{ maxWidth: 360 }}>
          <label>เลือกลูกค้า</label>
          <ClientSelect clients={clients} value={client.id} onChange={setId} />
        </div>
        <div className="field">
          <label>สรุปวันถ่ายที่ลูกค้าเห็น — ว่างไว้ = สร้างจากตารางเวลาอัตโนมัติ (แก้ได้ก่อนส่งลิงก์)</label>
          <textarea
            rows={3}
            value={client.daySummary}
            placeholder={autoPlan}
            onChange={(e) => void patchClient(client.id, { daySummary: e.target.value })}
          />
          <button
            type="button"
            className="btn ghost sm"
            style={{ marginTop: 8 }}
            onClick={() => void patchClient(client.id, { daySummary: '' })}
          >
            ใช้ข้อความจากตารางเวลา
          </button>
        </div>
        <div className="field">
          <label>เคล็ดลับเตรียมตัวที่ลูกค้าเห็น — แก้ได้เฉพาะงานนี้ (ว่าง = ใช้มาตรฐานตามประเภทงาน)</label>
          <textarea
            rows={10}
            value={client.prepTips}
            placeholder={defaultPrepTips(client.type)}
            onChange={(e) => void patchClient(client.id, { prepTips: e.target.value })}
          />
          <button
            type="button"
            className="btn ghost sm"
            style={{ marginTop: 8 }}
            onClick={() => void patchClient(client.id, { prepTips: defaultPrepTips(client.type) })}
          >
            ใช้ข้อความมาตรฐานของ {client.typeLabel}
          </button>
        </div>
      </div>
      <div className="card">
        <div className="doc-preview">{text}</div>
        <PrepTipsCard client={client} />
        <ClientConfirmBar
          client={client}
          kind="brief"
          onEnsureToken={(token) => patchClient(client.id, { confirmToken: token })}
        />
      </div>
    </>
  )
}

export function EmailPage() {
  const { clients, patchClient, data } = usePhotoStore()
  const [id, setId] = useState(clients[0]?.id ?? '')
  const [kind, setKind] = useState<EmailKind>('confirm')
  const [lang, setLang] = useState<'th' | 'en'>('th')
  const client = clients.find((c) => c.id === id) ?? clients[0]
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const generated = client
    ? emailCopy(
        kind,
        client,
        lang,
        { gallery: [client.gallery.pictime, client.gallery.drive].filter(Boolean).join(' | ') },
        { packages: data.packages, addons: data.addons },
      )
    : { subject: '', body: '' }
  const genKey = client
    ? `${client.id}|${kind}|${lang}|${client.packageId}|${client.customPrice}|${client.deposit}`
    : ''

  useEffect(() => {
    if (!generated.subject) return
    setSubject(generated.subject)
    setBody(generated.body)
    // Reset only when client / template / language / price inputs change — not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genKey])

  if (!client) return <p>ยังไม่มีลูกค้า</p>

  const href = mailtoHref(client.email, subject || generated.subject, body || generated.body)

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
      <PageTitle sub="ร่างอีเมลสองภาษา EN/TH — แก้ข้อความได้ก่อนเปิดเมลหรือคัดลอก">
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
        <h3>ร่างอีเมล (แก้ได้)</h3>
        <div className="field">
          <label>หัวข้อ</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="field">
          <label>เนื้อหา</label>
          <textarea className="email-draft" rows={16} value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <a className="btn sm" href={href} onClick={() => void onSendIntent()}>
            ✉ เปิดในเมล (mailto)
          </a>
          <button className="btn ghost sm" onClick={() => navigator.clipboard.writeText(`${subject}\n\n${body}`)}>
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

import { useRef, useState, type DragEvent, type MouseEvent } from 'react'
import { STATUS_LABEL } from '../data/catalog'
import { defaultsForJobType, typeLabel } from '../lib/categories'
import { formatThaiDate, isoFromDate, monthGrid, toBuddhistISOParts } from '../lib/dates'
import { defaultPrepTips, isDefaultPrepTips } from '../lib/prepTips'
import { blankClient, usePhotoStore } from '../store/StoreContext'
import type { Client, JobStatus, JobType } from '../types'
import { CategorySelect, Modal, PageTitle, Tag } from './ui'

const MAX_CHIPS = 2

function applyType(c: Client, type: JobType): Client {
  const defaults = defaultsForJobType(type)
  return {
    ...c,
    type,
    typeLabel: typeLabel(type),
    packageId: defaults.packageId,
    fixedPrice: defaults.fixedPrice,
    prepTips: isDefaultPrepTips(c.prepTips, c.type) ? defaultPrepTips(type) : c.prepTips,
  }
}

export default function CalendarPage() {
  const { clients, data, upsertClient, patchClient } = usePhotoStore()
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [draft, setDraft] = useState<Client | null>(null)
  const [expandedIso, setExpandedIso] = useState<string | null>(null)
  const dragId = useRef<string | null>(null)
  const dragged = useRef(false)
  const { yearBE } = toBuddhistISOParts(`${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-15`)
  const cells = monthGrid(cursor.y, cursor.m)
  const dow = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

  function shift(delta: number) {
    const d = new Date(cursor.y, cursor.m + delta, 1)
    setCursor({ y: d.getFullYear(), m: d.getMonth() })
  }

  function openNew(iso: string) {
    const row = blankClient()
    row.dateISO = iso
    row.date = formatThaiDate(iso)
    row.quote = { ...row.quote, expiryISO: iso }
    setDraft(row)
  }

  function onDayClick(iso: string, e: MouseEvent) {
    if ((e.target as HTMLElement).closest('.chip, .cal-more')) return
    openNew(iso)
  }

  async function dropOnDay(iso: string, e: DragEvent) {
    e.preventDefault()
    const id = e.dataTransfer.getData('text/pm-job') || dragId.current
    dragId.current = null
    if (!id) return
    const job = clients.find((c) => c.id === id)
    if (!job || job.dateISO === iso) return
    await patchClient(id, { dateISO: iso, date: formatThaiDate(iso) })
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
              const extra = jobs.length > MAX_CHIPS ? jobs.length - MAX_CHIPS : 0
              const shown = expandedIso === iso ? jobs : jobs.slice(0, MAX_CHIPS)
              return (
                <div
                  key={iso}
                  className="day"
                  role="button"
                  tabIndex={0}
                  onClick={(e) => onDayClick(iso, e)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      openNew(iso)
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault()
                    e.currentTarget.classList.add('drag-over')
                  }}
                  onDragLeave={(e) => e.currentTarget.classList.remove('drag-over')}
                  onDrop={(e) => {
                    e.currentTarget.classList.remove('drag-over')
                    void dropOnDay(iso, e)
                  }}
                >
                  <strong>{d.getDate()}</strong>
                  {shown.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      draggable
                      className={`chip tag ${c.status}`}
                      title={`${c.name} · ${c.statusLabel}`}
                      onDragStart={(e) => {
                        dragged.current = false
                        dragId.current = c.id
                        e.dataTransfer.setData('text/pm-job', c.id)
                        e.dataTransfer.effectAllowed = 'move'
                      }}
                      onDrag={() => {
                        dragged.current = true
                      }}
                      onDragEnd={() => {
                        dragId.current = null
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (dragged.current) {
                          dragged.current = false
                          return
                        }
                        setDraft({ ...c })
                      }}
                    >
                      {c.name || 'ไม่มีชื่อ'}
                    </button>
                  ))}
                  {extra > 0 && expandedIso !== iso && (
                    <button
                      type="button"
                      className="cal-more"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedIso(iso)
                      }}
                    >
                      +{extra} more
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="muted" style={{ marginTop: 12 }}>
          สีชิปตามสถานะ: <Tag status="draft" label="ร่าง" /> <Tag status="pending" label="รอมัดจำ" />{' '}
          <Tag status="confirmed" label="ยืนยัน" /> <Tag status="paid" label="จ่ายแล้ว" />
          <span style={{ marginLeft: 10 }}>คลิกช่องว่างเพื่อเพิ่มงาน · ลากชิปไปวันอื่นเพื่อเลื่อนคิว</span>
        </div>
      </div>
      {draft && (
        <JobQuickModal
          client={draft}
          packages={data.packages}
          onClose={() => setDraft(null)}
          onSave={async (row) => {
            await upsertClient(row)
            setDraft(null)
          }}
        />
      )}
    </>
  )
}

function JobQuickModal({
  client,
  packages,
  onClose,
  onSave,
}: {
  client: Client
  packages: { id: string; kind: string; name: string; price: number }[]
  onClose: () => void
  onSave: (c: Client) => void
}) {
  const [c, setC] = useState(client)
  const pkgs = packages.filter((p) => (c.type === 'wedding' ? p.kind === 'wedding' : p.kind === 'engagement'))
  const isNew = !client.name
  return (
    <Modal title={isNew ? 'เพิ่มงานวันนี้' : 'แก้ไขงาน'} onClose={onClose} cardClassName="cal-quick">
        <p className="muted" style={{ marginTop: -8 }}>
          {c.date} · บันทึกลงรายชื่อลูกค้า / คิวงาน ชุดเดียวกัน
        </p>
        <div className="field">
          <label>ชื่อลูกค้า / คู่บ่าวสาว</label>
          <input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} autoFocus />
        </div>
        <div className="grid2">
          <div className="field">
            <label>ประเภทงาน</label>
            <CategorySelect value={c.type} onChange={(type) => setC(applyType(c, type))} />
          </div>
          <div className="field">
            <label>สถานะ</label>
            <select
              value={c.status}
              onChange={(e) => {
                const status = e.target.value as JobStatus
                setC({ ...c, status, statusLabel: STATUS_LABEL[status] })
              }}
            >
              <option value="draft">ร่าง</option>
              <option value="pending">รอมัดจำ</option>
              <option value="confirmed">ยืนยัน</option>
              <option value="paid">จ่ายแล้ว</option>
            </select>
          </div>
          {(c.type === 'wedding' || c.type === 'engagement') && (
            <div className="field">
              <label>แพ็กเกจ</label>
              <select value={c.packageId ?? ''} onChange={(e) => setC({ ...c, packageId: e.target.value })}>
                {pkgs.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · A${p.price}
                  </option>
                ))}
              </select>
            </div>
          )}
          {(c.type === 'portrait' || c.type === 'family') && (
            <div className="field">
              <label>ราคาคงที่ (AUD inc GST)</label>
              <input
                type="number"
                value={c.fixedPrice ?? 0}
                onChange={(e) => setC({ ...c, fixedPrice: Number(e.target.value) })}
              />
            </div>
          )}
          <div className="field">
            <label>เวลาเริ่ม (พิธี / ถ่าย)</label>
            <input type="time" value={c.ceremonyTime} onChange={(e) => setC({ ...c, ceremonyTime: e.target.value })} />
          </div>
          <div className="field">
            <label>สถานที่</label>
            <input value={c.location} onChange={(e) => setC({ ...c, location: e.target.value })} />
          </div>
        </div>
        <div className="row">
          <button className="btn ghost sm" type="button" onClick={onClose}>
            ยกเลิก
          </button>
          <button
            className="btn sm"
            type="button"
            onClick={() => {
              if (!c.name.trim()) return
              onSave({
                ...c,
                name: c.name.trim(),
                date: formatThaiDate(c.dateISO),
                typeLabel: typeLabel(c.type),
                statusLabel: STATUS_LABEL[c.status],
              })
            }}
          >
            บันทึก
          </button>
        </div>
    </Modal>
  )
}

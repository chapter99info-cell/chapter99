import { useState } from 'react'
import { ALL_PACKAGES } from '../data/catalog'
import { defaultsForJobType } from '../lib/categories'
import { formatThaiDate } from '../lib/dates'
import { invoiceTotals, money } from '../lib/money'
import { defaultPrepTips, isDefaultPrepTips } from '../lib/prepTips'
import { blankClient, usePhotoStore } from '../store/StoreContext'
import type { Client, JobStatus } from '../types'
import { CategorySelect, ChecklistIcons, Modal, PageTitle, Tag } from './ui'

export default function ClientsPage() {
  const { clients, isOwner, data, upsertClient } = usePhotoStore()
  const [editing, setEditing] = useState<Client | null>(null)

  return (
    <>
      <PageTitle sub="รายชื่อลูกค้าทั้งหมด พร้อมสถานะงานและการเงิน">ลูกค้า / คิวงาน</PageTitle>
      <div className="card">
        <div className="row" style={{ marginBottom: 14 }}>
          <div className="muted">ทั้งหมด {clients.length} รายการ</div>
          <button className="btn sm" onClick={() => setEditing(blankClient())}>
            + เพิ่มลูกค้าใหม่
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>ลูกค้า</th>
              <th>ประเภทงาน</th>
              <th>วันถ่าย</th>
              {isOwner && <th>ยอดรวม</th>}
              {isOwner && <th>มัดจำ</th>}
              <th>เช็กลิสต์</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => {
              const t = invoiceTotals(c, data.packages, data.addons)
              return (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => setEditing(c)}>
                  <td>
                    <strong>{c.name}</strong>
                    <br />
                    <span className="muted">{c.phone}</span>
                  </td>
                  <td>{c.typeLabel}</td>
                  <td>
                    {c.preWeddingDateISO ? (
                      <>
                        <div>Pre-Wed: {formatThaiDate(c.preWeddingDateISO)}</div>
                        <div>Wedding: {c.date}</div>
                      </>
                    ) : (
                      c.date
                    )}
                  </td>
                  {isOwner && <td className="mono">{money(t.gstInclusive)}</td>}
                  {isOwner && <td className="mono">{money(c.deposit)}</td>}
                  <td>
                    <ChecklistIcons c={c} />
                  </td>
                  <td>
                    <Tag status={c.status} label={c.statusLabel} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {editing && (
        <ClientEditor
          client={editing}
          exists={clients.some((x) => x.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={async (row) => {
            await upsertClient(row)
            setEditing(null)
          }}
        />
      )}
    </>
  )
}

function ClientEditor({
  client,
  exists,
  onClose,
  onSave,
}: {
  client: Client
  exists: boolean
  onClose: () => void
  onSave: (c: Client) => void
}) {
  const { patchClient, deleteClient } = usePhotoStore()
  const [c, setC] = useState(client)
  const [savingCheck, setSavingCheck] = useState<string | null>(null)
  const pkgs = ALL_PACKAGES.filter((p) => (c.type === 'wedding' ? p.kind === 'wedding' : p.kind === 'engagement'))

  const checkItems = [
    { key: 'preshoot' as const, ico: '⏰', label: 'ก่อนถ่าย' },
    { key: 'balance' as const, ico: '💰', label: 'ยอดครบ' },
    { key: 'gallery' as const, ico: '📤', label: 'แกลเลอรี' },
    { key: 'review' as const, ico: '⭐', label: 'รีวิว' },
  ]

  async function toggleCheck(key: keyof Client['checklist']) {
    const prev = c.checklist
    const next = { ...prev, [key]: !prev[key] }
    setC((row) => ({ ...row, checklist: next }))
    if (!exists) return
    setSavingCheck(key)
    try {
      await patchClient(c.id, { checklist: next })
    } catch (err) {
      console.error('Checklist save failed', err)
      setC((row) => ({ ...row, checklist: prev }))
    } finally {
      setSavingCheck(null)
    }
  }

  return (
    <Modal title={client.name ? 'แก้ไขลูกค้า' : 'ลูกค้าใหม่'} onClose={onClose}>
      <div className="grid2">
        <div className="field">
          <label>ชื่อ</label>
          <input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} />
        </div>
        <div className="field">
          <label>ประเภท</label>
          <CategorySelect
            value={c.type}
            onChange={(type) => {
              const defaults = defaultsForJobType(type)
              setC({
                ...c,
                type,
                packageId: defaults.packageId,
                fixedPrice: defaults.fixedPrice,
                prepTips: isDefaultPrepTips(c.prepTips, c.type) ? defaultPrepTips(type) : c.prepTips,
              })
            }}
          />
        </div>
        <div className="field">
          <label>วันถ่าย (ISO)</label>
          <input type="date" value={c.dateISO} onChange={(e) => setC({ ...c, dateISO: e.target.value })} />
        </div>
        <div className="field">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={c.preWeddingDateISO != null}
              onChange={(e) => setC({ ...c, preWeddingDateISO: e.target.checked ? '' : null })}
            />
            รวม Pre-Wedding + Wedding Day (จองคนละวัน ลูกค้าคนเดียวกัน)
          </label>
        </div>
        {c.preWeddingDateISO != null && (
          <div className="field">
            <label>วันถ่าย Pre-Wedding (ISO)</label>
            <input
              type="date"
              value={c.preWeddingDateISO}
              onChange={(e) => setC({ ...c, preWeddingDateISO: e.target.value })}
            />
          </div>
        )}
        <div className="field">
          <label>เวลาพิธี</label>
          <input type="time" value={c.ceremonyTime} onChange={(e) => setC({ ...c, ceremonyTime: e.target.value })} />
        </div>
        <div className="field">
          <label>สถานที่</label>
          <input value={c.location} onChange={(e) => setC({ ...c, location: e.target.value })} />
        </div>
        <div className="field">
          <label>สถานะ</label>
          <select value={c.status} onChange={(e) => setC({ ...c, status: e.target.value as JobStatus })}>
            <option value="draft">รอเซ็นสัญญา</option>
            <option value="pending">รอมัดจำ</option>
            <option value="confirmed">ยืนยันแล้ว</option>
            <option value="paid">จ่ายครบแล้ว</option>
          </select>
        </div>
        <div className="field">
          <label>โทร</label>
          <input value={c.phone} onChange={(e) => setC({ ...c, phone: e.target.value })} />
        </div>
        <div className="field">
          <label>อีเมล</label>
          <input value={c.email} onChange={(e) => setC({ ...c, email: e.target.value })} />
        </div>
        {(c.type === 'wedding' || c.type === 'engagement') && (
          <div className="field">
            <label>แพ็กเกจ</label>
            <select value={c.packageId ?? ''} onChange={(e) => setC({ ...c, packageId: e.target.value })}>
              {pkgs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
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
          <label>มัดจำที่ได้รับ (AUD)</label>
          <input type="number" value={c.deposit} onChange={(e) => setC({ ...c, deposit: Number(e.target.value) })} />
        </div>
      </div>
      <div className="field">
        <label>เคล็ดลับเตรียมตัว (ลูกค้าเห็นใน brief / ลิงก์ยืนยัน) — ว่างไว้ = ใช้ค่าเริ่มต้นตามประเภทงาน</label>
        <textarea
          rows={8}
          value={c.prepTips}
          placeholder={defaultPrepTips(c.type)}
          onChange={(e) => setC({ ...c, prepTips: e.target.value })}
        />
        <button
          type="button"
          className="btn ghost sm"
          style={{ marginTop: 8 }}
          onClick={() => setC({ ...c, prepTips: defaultPrepTips(c.type) })}
        >
          ใช้ข้อความมาตรฐานของประเภทนี้
        </button>
      </div>
      <div className="muted" style={{ marginBottom: 10 }}>
        เช็กลิสต์ — กดสลับได้ทันที (ส่งอีเมลเตือน / เก็บยอด / ส่งแกลเลอรี / ขอรีวิว ก็ติ๊กให้อัตโนมัติ)
      </div>
      <div className="check-row">
        {checkItems.map((item) => {
          const on = c.checklist[item.key]
          return (
            <button
              key={item.key}
              type="button"
              className={`check-btn ${on ? 'on' : ''}`}
              disabled={savingCheck === item.key}
              onClick={() => void toggleCheck(item.key)}
            >
              <span className="check-mark">{on ? '✓' : ''}</span>
              <span>{item.ico}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>
      <div className="row">
        <button className="btn ghost sm" onClick={onClose}>
          ยกเลิก
        </button>
        {exists && (
          <button
            className="btn ghost sm"
            style={{ color: 'var(--rust)', borderColor: 'var(--rust)' }}
            onClick={async () => {
              if (!window.confirm(`ลบลูกค้า "${c.name}" ถาวร? กู้คืนไม่ได้`)) return
              await deleteClient(c.id)
              onClose()
            }}
          >
            ลบลูกค้า
          </button>
        )}
        <button className="btn sm" onClick={() => onSave(c)}>
          บันทึก
        </button>
      </div>
    </Modal>
  )
}

import { useState } from 'react'
import { ALL_PACKAGES } from '../data/catalog'
import { invoiceTotals, money } from '../lib/money'
import { blankClient, usePhotoStore } from '../store/StoreContext'
import type { Client, JobStatus, JobType } from '../types'
import { ChecklistIcons, PageTitle, Tag } from './ui'

export default function ClientsPage() {
  const { clients, isOwner, data, upsertClient, patchClient } = usePhotoStore()
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
                  <td>{c.date}</td>
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
          onClose={() => setEditing(null)}
          onSave={async (c) => {
            await upsertClient(c)
            setEditing(null)
          }}
          onToggle={async (key) => {
            const next = { ...editing.checklist, [key]: !editing.checklist[key] }
            await patchClient(editing.id, { checklist: next })
            setEditing({ ...editing, checklist: next })
          }}
        />
      )}
    </>
  )
}

function ClientEditor({
  client,
  onClose,
  onSave,
  onToggle,
}: {
  client: Client
  onClose: () => void
  onSave: (c: Client) => void
  onToggle: (k: keyof Client['checklist']) => void
}) {
  const [c, setC] = useState(client)
  const pkgs = ALL_PACKAGES.filter((p) => (c.type === 'wedding' ? p.kind === 'wedding' : p.kind === 'engagement'))

  return (
    <div className="card">
      <h3>{client.name ? 'แก้ไขลูกค้า' : 'ลูกค้าใหม่'}</h3>
      <div className="grid2">
        <div className="field">
          <label>ชื่อ</label>
          <input value={c.name} onChange={(e) => setC({ ...c, name: e.target.value })} />
        </div>
        <div className="field">
          <label>ประเภท</label>
          <select
            value={c.type}
            onChange={(e) => {
              const type = e.target.value as JobType
              setC({
                ...c,
                type,
                packageId: type === 'wedding' ? 'w1' : type === 'engagement' ? 'e1' : null,
                fixedPrice: type === 'portrait' ? 650 : type === 'family' ? 450 : null,
              })
            }}
          >
            <option value="wedding">งานแต่งงาน</option>
            <option value="engagement">Pre-Wedding / Engagement</option>
            <option value="portrait">Portrait/Branding</option>
            <option value="family">Family Portrait</option>
          </select>
        </div>
        <div className="field">
          <label>วันถ่าย (ISO)</label>
          <input type="date" value={c.dateISO} onChange={(e) => setC({ ...c, dateISO: e.target.value })} />
        </div>
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
      <div className="muted" style={{ marginBottom: 10 }}>
        เช็กลิสต์ (กดสลับได้ — แอปก็ติ๊กให้อัตโนมัติเมื่อส่งอีเมล/แกลเลอรี/รีวิว)
      </div>
      <div className="row" style={{ marginBottom: 14 }}>
        {(['preshoot', 'balance', 'gallery', 'review'] as const).map((k) => (
          <button key={k} className="btn ghost sm" type="button" onClick={() => onToggle(k)}>
            {k}: {c.checklist[k] ? '✓' : '○'}
          </button>
        ))}
      </div>
      <div className="row">
        <button className="btn ghost sm" onClick={onClose}>
          ยกเลิก
        </button>
        <button className="btn sm" onClick={() => onSave(c)}>
          บันทึก
        </button>
      </div>
    </div>
  )
}

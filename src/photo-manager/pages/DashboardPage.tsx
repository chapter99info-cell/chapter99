import { useMemo } from 'react'
import { usePhotoStore } from '../store/StoreContext'
import { daysUntil } from '../lib/dates'
import { invoiceTotals, money } from '../lib/money'
import { ChecklistIcons, PageTitle, Tag } from './ui'

export default function DashboardPage() {
  const { clients, isOwner, data } = usePhotoStore()
  const now = new Date()
  const thisMonth = clients.filter((c) => {
    const d = new Date(c.dateISO + 'T12:00:00')
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  })
  const collected = useMemo(
    () =>
      clients.reduce((s, c) => {
        const t = invoiceTotals(c, data.packages, data.addons)
        if (c.status === 'paid') return s + t.gstInclusive
        return s + (c.deposit || 0)
      }, 0),
    [clients, data.packages, data.addons],
  )
  const pendingDeposits = clients
    .filter((c) => c.status === 'pending' || (c.status === 'draft' && c.deposit === 0))
    .reduce((s, c) => s + Math.max(0, invoiceTotals(c, data.packages, data.addons).gstInclusive * 0.2 - c.deposit), 0)
  const upcoming = [...clients].filter((c) => daysUntil(c.dateISO) >= 0).sort((a, b) => a.dateISO.localeCompare(b.dateISO))
  const next = upcoming[0]

  return (
    <>
      <PageTitle sub="ภาพรวมงานและรายรับของ Chapter99 Photography">แดชบอร์ด</PageTitle>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">งานเดือนนี้</div>
          <div className="value">{thisMonth.length}</div>
        </div>
        {isOwner ? (
          <>
            <div className="stat-card">
              <div className="label">รายรับที่เข้าแล้ว</div>
              <div className="value">{money(collected)}</div>
            </div>
            <div className="stat-card">
              <div className="label">รอเก็บมัดจำ</div>
              <div className="value rust">{money(pendingDeposits)}</div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="label">ยืนยันแล้ว</div>
              <div className="value">{clients.filter((c) => c.briefConfirmed).length}</div>
            </div>
            <div className="stat-card">
              <div className="label">รอคอนเฟิร์ม</div>
              <div className="value rust">{clients.filter((c) => !c.briefConfirmed).length}</div>
            </div>
          </>
        )}
        <div className="stat-card">
          <div className="label">งานถัดไป</div>
          <div className="value blue" style={{ fontSize: 15, fontFamily: 'IBM Plex Sans Thai' }}>
            {next ? `${next.name} · ${next.date}` : '—'}
          </div>
        </div>
      </div>
      <div className="card">
        <h3>คิวงานเร็วๆ นี้</h3>
        <table>
          <thead>
            <tr>
              <th>วันที่</th>
              <th>ลูกค้า</th>
              <th>ประเภทงาน</th>
              <th>แพ็กเกจ</th>
              <th>เช็กลิสต์</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {upcoming
              .filter((c) => c.status !== 'paid')
              .map((c) => {
                const warn = daysUntil(c.dateISO) <= 3 && !c.checklist.preshoot
                const pkg = data.packages.find((p) => p.id === c.packageId)
                return (
                  <tr key={c.id}>
                    <td>
                      {c.date} {warn && <span className="warn" title="งานใกล้ถึงแต่ยังไม่ส่งเตือนก่อนถ่าย">⚠</span>}
                    </td>
                    <td>{c.name}</td>
                    <td>{c.typeLabel}</td>
                    <td>{pkg ? pkg.name : '—'}</td>
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
    </>
  )
}

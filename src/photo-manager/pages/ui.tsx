import type { ReactNode } from 'react'
import type { Client } from '../types'

export function PageTitle({ children, sub }: { children: ReactNode; sub: string }) {
  return (
    <>
      <h1 className="page-title">{children}</h1>
      <div className="page-sub">{sub}</div>
    </>
  )
}

export function ClientSelect({
  clients,
  value,
  onChange,
}: {
  clients: Client[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {clients.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} — {c.typeLabel}
        </option>
      ))}
    </select>
  )
}

export function Tag({ status, label }: { status: string; label: string }) {
  return <span className={`tag ${status}`}>{label}</span>
}

export function ChecklistIcons({ c }: { c: Client }) {
  const item = (ok: boolean, mark: string, title: string) => (
    <span title={title} style={{ opacity: ok ? 1 : 0.28 }}>
      {mark}
    </span>
  )
  return (
    <span className="check-ico">
      {item(c.checklist.preshoot, '⏰', 'Pre-shoot reminder')}
      {item(c.checklist.balance, '💰', 'Balance collected')}
      {item(c.checklist.gallery, '📤', 'Gallery delivered')}
      {item(c.checklist.review, '⭐', 'Review requested')}
    </span>
  )
}

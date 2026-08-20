import { X } from 'lucide-react'
import { useEffect, useState, type ReactNode } from 'react'
import { LEGACY_CATEGORIES, PHOTO_CATEGORIES, WEB_CATEGORIES } from '../lib/categories'
import { newId } from '../store/adapters/types'
import type { Client, JobType } from '../types'

export function PageTitle({ children, sub }: { children: ReactNode; sub: string }) {
  return (
    <>
      <h1 className="page-title">{children}</h1>
      <div className="page-sub">{sub}</div>
    </>
  )
}

export function Modal({
  title,
  titleId,
  onClose,
  children,
  cardClassName,
}: {
  title: ReactNode
  titleId?: string
  onClose: () => void
  children: ReactNode
  cardClassName?: string
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-scrim" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={onClose}>
      <div className={`modal-card card${cardClassName ? ` ${cardClassName}` : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3 id={titleId}>{title}</h3>
          <button type="button" className="modal-close" aria-label="ปิด" onClick={onClose}>
            <X size={20} strokeWidth={2} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function CategorySelect({
  value,
  onChange,
}: {
  value: string
  onChange: (type: JobType) => void
}) {
  const extra = LEGACY_CATEGORIES.filter((c) => c.id === value)
  return (
    <select value={value} onChange={(e) => onChange(e.target.value as JobType)}>
      <optgroup label="งานถ่ายภาพ">
        {PHOTO_CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </optgroup>
      <optgroup label="งานเว็บไซต์">
        {WEB_CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>
            {c.label}
          </option>
        ))}
      </optgroup>
      {extra.length > 0 && (
        <optgroup label="ประเภทเดิม">
          {extra.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </optgroup>
      )}
    </select>
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

export function ClientConfirmBar({
  client,
  kind,
  onEnsureToken,
}: {
  client: Client
  kind: 'brief' | 'contract'
  onEnsureToken: (token: string) => Promise<void>
}) {
  const [copied, setCopied] = useState('')
  const token = client.confirmToken
  const link = token ? `${window.location.origin}/pm/confirm/${token}?k=${kind}` : ''
  const confirmed = kind === 'contract' ? client.contractConfirmed : client.briefConfirmed

  async function generate() {
    let next = token
    if (!next) {
      next = newId('t')
      await onEnsureToken(next)
    }
    const url = `${window.location.origin}/pm/confirm/${next}?k=${kind}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied('คัดลอกลิงก์แล้ว — ส่งให้ลูกค้าพิมพ์ชื่อแล้วกดยืนยัน')
    } catch {
      setCopied('สร้างลิงก์แล้ว — คัดลอกจากกล่องด้านล่าง')
    }
  }

  return (
    <div className="no-print" style={{ marginTop: 14 }}>
      <div className="row">
        <div className="muted">ลูกค้าเปิดลิงก์ พิมพ์ชื่อ แล้วกดยืนยัน — ไม่ต้องพิมพ์เอกสาร</div>
        <button className="btn sm" type="button" onClick={() => void generate()}>
          🔗 สร้างลิงก์ให้ลูกค้ายืนยัน
        </button>
      </div>
      {link ? (
        <div className="link-box">
          <span>🔗</span>
          <span className="url">{link}</span>
          <a className="btn ghost sm" href={link} target="_blank" rel="noreferrer">
            เปิดหน้าที่ลูกค้าเห็น
          </a>
          <span className={`confirm-status ${confirmed ? 'confirmed' : 'waiting'}`}>
            {confirmed ? '✓ ลูกค้ายืนยันแล้ว' : '● รอลูกค้ายืนยัน'}
          </span>
        </div>
      ) : (
        <p className="muted" style={{ marginTop: 10 }}>
          กดปุ่มด้านบนเพื่อสร้างลิงก์ยืนยันสำหรับลูกค้านี้
        </p>
      )}
      {copied ? <p className="muted" style={{ marginTop: 8 }}>{copied}</p> : null}
    </div>
  )
}

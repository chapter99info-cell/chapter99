import { FormEvent, useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import type {
  Deliverable,
  Payment,
  PaymentStatus,
  ProjectAdminOverview,
  ProjectStatus,
  StaffProfile,
} from '../../../types/ams'
import { PAYMENT_STATUS_LABELS, PROJECT_STATUS_LABELS } from '../../../types/ams'
import {
  assignProjectStaff,
  getAdminProject,
  listProjectDeliverables,
  listProjectPayments,
  listStaff,
  markProjectCompleted,
  recordPayment,
} from '../../../lib/ams/service'
import { brandColor } from '../../../lib/useBrand'
import ProgressBar from '../../../ams/components/ProgressBar'

export default function AmsProjectDetail() {
  const { id: projectId = '' } = useParams<{ id: string }>()
  const [project, setProject] = useState<ProjectAdminOverview | null>(null)
  const [deliverables, setDeliverables] = useState<Deliverable[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [staff, setStaff] = useState<StaffProfile[]>([])
  const [staffId, setStaffId] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const primary = brandColor('primary')
  const muted = brandColor('textMuted')

  const load = useCallback(async () => {
    setError(null)
    try {
      const [p, staffList] = await Promise.all([getAdminProject(projectId), listStaff()])
      setStaff(staffList)
      if (!p) {
        setProject(null)
        setError('Project not found')
        return
      }
      setProject(p)
      setStaffId(p.staff_id ?? '')
      const [d, pay] = await Promise.all([
        listProjectDeliverables(projectId),
        listProjectPayments(projectId),
      ])
      setDeliverables(d)
      setPayments(pay)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    }
  }, [projectId])

  useEffect(() => {
    void load()
  }, [load])

  const trackUrl =
    typeof window !== 'undefined' && project
      ? `${window.location.origin}/track/${project.public_token}`
      : ''

  async function onMarkCompleted() {
    setBusy(true)
    setError(null)
    try {
      await markProjectCompleted(projectId)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'QC approve failed')
    } finally {
      setBusy(false)
    }
  }

  async function onAssignStaff() {
    setBusy(true)
    setError(null)
    try {
      await assignProjectStaff(projectId, staffId || null)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Assign failed')
    } finally {
      setBusy(false)
    }
  }

  async function onRecordPayment(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!project) return
    // Capture the form element before any `await` — currentTarget is only
    // valid during synchronous dispatch and becomes null after resuming
    // from an awaited promise.
    const form = e.currentTarget
    setBusy(true)
    setError(null)
    const fd = new FormData(form)
    try {
      await recordPayment({
        project_id: projectId,
        amount_cents: Math.round(Number(fd.get('amount') || 0) * 100),
        status: String(fd.get('status') || 'deposit_paid') as PaymentStatus,
        method: String(fd.get('method') || '') || null,
        reference: String(fd.get('reference') || '') || null,
      })
      form.reset()
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed')
    } finally {
      setBusy(false)
    }
  }

  async function copyTrack() {
    if (!trackUrl) return
    await navigator.clipboard.writeText(trackUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!project && !error) {
    return <p className="py-10 text-center text-sm">Loading…</p>
  }

  if (!project) {
    return (
      <p className="text-sm text-red-700" role="alert">
        {error}
      </p>
    )
  }

  const status = project.status as ProjectStatus
  const fieldClass = 'mt-1 w-full rounded-lg border px-3 py-2.5 text-sm'
  const fieldStyle = { borderColor: brandColor('border') }

  return (
    <div>
      <Link to="/admin/ams" className="text-sm font-semibold" style={{ color: primary }}>
        ← AMS dashboard
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold">{project.title}</h1>
          <p className="mt-1 text-sm" style={{ color: muted }}>
            {project.client_contact_name}
            {project.staff_name ? ` · ${project.staff_name}` : ' · Unassigned'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          {project.is_overdue ? (
            <span className="rounded bg-red-100 px-2 py-1 font-semibold text-red-700">OVERDUE</span>
          ) : null}
          {project.needs_qc_escalation ? (
            <span
              className="rounded px-2 py-1 font-semibold"
              style={{ backgroundColor: 'rgba(200,168,75,0.25)', color: '#8B6914' }}
            >
              QC 48h+
            </span>
          ) : null}
          <span className="rounded border px-2 py-1" style={{ borderColor: brandColor('border') }}>
            {PROJECT_STATUS_LABELS[status] ?? status}
          </span>
          <span className="rounded border px-2 py-1" style={{ borderColor: brandColor('border') }}>
            {PAYMENT_STATUS_LABELS[project.payment_status as PaymentStatus]}
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-5" style={{ borderColor: brandColor('border') }}>
        <ProgressBar status={status} />
      </div>

      <div className="mt-6 space-y-3 rounded-2xl border bg-white p-5" style={{ borderColor: brandColor('border') }}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void copyTrack()}
            className="min-h-11 flex-1 rounded-lg border px-3 py-2 text-sm font-semibold"
            style={{ borderColor: brandColor('border') }}
          >
            {copied ? 'Copied!' : 'Copy client track link'}
          </button>
          {status !== 'completed' && status !== 'cancelled' ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void onMarkCompleted()}
              className="min-h-11 flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: primary }}
            >
              Approve QC → Completed
            </button>
          ) : null}
        </div>
        <p className="break-all font-mono text-xs" style={{ color: muted }}>
          {trackUrl}
        </p>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide" style={{ color: muted }}>
          Assign staff
        </h2>
        <div
          className="mt-3 flex flex-col gap-3 rounded-2xl border bg-white p-5 sm:flex-row sm:items-end"
          style={{ borderColor: brandColor('border') }}
        >
          <label className="flex-1 text-sm">
            Staff
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className={fieldClass}
              style={fieldStyle}
            >
              <option value="">Unassigned</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name} ({s.role})
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onAssignStaff()}
            className="rounded-lg px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            Save assignment
          </button>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide" style={{ color: muted }}>
          Record payment
        </h2>
        <form
          onSubmit={onRecordPayment}
          className="mt-3 grid gap-3 rounded-2xl border bg-white p-5 sm:grid-cols-2"
          style={{ borderColor: brandColor('border') }}
        >
          <label className="text-sm">
            Amount (AUD)
            <input
              name="amount"
              type="number"
              min="0"
              step="0.01"
              required
              defaultValue={
                project.deposit_amount_cents
                  ? (project.deposit_amount_cents / 100).toFixed(2)
                  : ''
              }
              className={fieldClass}
              style={fieldStyle}
            />
          </label>
          <label className="text-sm">
            Status
            <select name="status" defaultValue="deposit_paid" className={fieldClass} style={fieldStyle}>
              <option value="deposit_paid">Deposit paid</option>
              <option value="paid">Paid in full</option>
              <option value="refunded">Refunded</option>
            </select>
          </label>
          <label className="text-sm">
            Method
            <input name="method" placeholder="Transfer / cash / card" className={fieldClass} style={fieldStyle} />
          </label>
          <label className="text-sm">
            Reference
            <input name="reference" className={fieldClass} style={fieldStyle} />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg py-2.5 text-sm font-semibold text-white sm:col-span-2"
            style={{ backgroundColor: primary }}
          >
            Save payment record
          </button>
        </form>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide" style={{ color: muted }}>
          Deliverable history
        </h2>
        <ul
          className="mt-3 divide-y rounded-2xl border bg-white"
          style={{ borderColor: brandColor('border') }}
        >
          {deliverables.length === 0 ? (
            <li className="px-4 py-6 text-sm" style={{ color: muted }}>
              No deliverables yet.
            </li>
          ) : (
            deliverables.map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
                <div>
                  <a
                    href={d.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold"
                    style={{ color: primary }}
                  >
                    v{d.version} · {d.link_domain ?? 'link'}
                  </a>
                  {d.notes ? (
                    <p className="text-xs" style={{ color: muted }}>
                      {d.notes}
                    </p>
                  ) : null}
                </div>
                <time className="text-xs" style={{ color: muted }}>
                  {new Date(d.uploaded_at).toLocaleString('en-AU')}
                </time>
              </li>
            ))
          )}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide" style={{ color: muted }}>
          Payments
        </h2>
        <ul
          className="mt-3 divide-y rounded-2xl border bg-white"
          style={{ borderColor: brandColor('border') }}
        >
          {payments.length === 0 ? (
            <li className="px-4 py-6 text-sm" style={{ color: muted }}>
              No payment records.
            </li>
          ) : (
            payments.map((p) => (
              <li key={p.id} className="flex justify-between px-4 py-3 text-sm">
                <span>
                  ${(p.amount_cents / 100).toFixed(2)} {p.currency} · {p.status}
                </span>
                <span style={{ color: muted }}>
                  {p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-AU') : '—'}
                </span>
              </li>
            ))
          )}
        </ul>
      </section>

      {error ? (
        <p className="mt-6 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

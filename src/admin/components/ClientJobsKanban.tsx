import { useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Plus } from 'lucide-react'
import {
  createClientJob,
  fetchClientJobs,
  triggerAgencyInvoice,
  updateClientJob,
  updateClientJobStatus,
} from '../../lib/clientJobsService'
import { formatAud } from '../../lib/agencyGst'
import { PAYMENT_LINKS } from '../../lib/paymentLinks'
import { brandColor } from '../../lib/useBrand'
import {
  JOB_STATUS_COLUMNS,
  JOB_TYPE_LABELS,
  type ClientJob,
  type ClientJobStatus,
  type ClientJobType,
} from '../../types/clientJobs'

const emptyForm = {
  client_name: '',
  client_email: '',
  job_type: 'photography' as ClientJobType,
  deposit_amount: '',
  total_amount: '',
  deadline: '',
  square_payment_link: '',
  deliverable_link: '',
  notes: '',
}

export default function ClientJobsKanban() {
  const [jobs, setJobs] = useState<ClientJob[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [selected, setSelected] = useState<ClientJob | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')

  const primary = brandColor('primary')
  const muted = brandColor('textMuted')
  const border = brandColor('border')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setJobs(await fetchClientJobs())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const byStatus = useMemo(() => {
    const map: Record<ClientJobStatus, ClientJob[]> = {
      received: [],
      in_progress: [],
      review: [],
      delivered: [],
      paid: [],
    }
    for (const job of jobs) map[job.status]?.push(job)
    return map
  }, [jobs])

  function flash(msg: string) {
    setToast(msg)
    window.setTimeout(() => setToast(''), 2800)
  }

  async function onDropStatus(status: ClientJobStatus) {
    if (!draggingId) return
    const job = jobs.find((j) => j.id === draggingId)
    setDraggingId(null)
    if (!job || job.status === status) return

    const prev = jobs
    setJobs((list) => list.map((j) => (j.id === job.id ? { ...j, status } : j)))
    try {
      const updated = await updateClientJobStatus(job.id, status)
      setJobs((list) => list.map((j) => (j.id === updated.id ? updated : j)))
      if (selected?.id === updated.id) setSelected(updated)
      if (status === 'paid') {
        const inv = await triggerAgencyInvoice(updated.id, 'final')
        if (inv.ok && inv.invoiceNumber) flash(`Invoice ${inv.invoiceNumber} issued`)
        else if (!inv.ok) flash(inv.error ?? 'Final invoice failed')
      }
    } catch (err) {
      setJobs(prev)
      setError(err instanceof Error ? err.message : 'Status update failed')
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    if (!form.client_name.trim()) return
    setSaving(true)
    try {
      const job = await createClientJob({
        client_name: form.client_name,
        client_email: form.client_email || null,
        job_type: form.job_type,
        status: 'received',
        deposit_amount: form.deposit_amount ? Number(form.deposit_amount) : null,
        deposit_paid_at: null,
        total_amount: form.total_amount ? Number(form.total_amount) : null,
        deadline: form.deadline || null,
        square_payment_link: form.square_payment_link || null,
        deliverable_link: form.deliverable_link || null,
        notes: form.notes || null,
      })
      setJobs((list) => [job, ...list])
      setForm(emptyForm)
      setShowNew(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
    } finally {
      setSaving(false)
    }
  }

  async function saveSelected(patch: Partial<ClientJob>) {
    if (!selected) return
    setSaving(true)
    const prevDepositPaid = selected.deposit_paid_at
    try {
      const updated = await updateClientJob(selected.id, patch)
      setJobs((list) => list.map((j) => (j.id === updated.id ? updated : j)))
      setSelected(updated)

      if (!prevDepositPaid && updated.deposit_paid_at) {
        const inv = await triggerAgencyInvoice(updated.id, 'deposit')
        if (inv.ok && inv.invoiceNumber) flash(`Deposit invoice ${inv.invoiceNumber}`)
        else if (!inv.ok) flash(inv.error ?? 'Deposit invoice failed')
      }
      if (patch.status === 'paid' && selected.status !== 'paid') {
        const inv = await triggerAgencyInvoice(updated.id, 'final')
        if (inv.ok && inv.invoiceNumber) flash(`Invoice ${inv.invoiceNumber}`)
        else if (!inv.ok) flash(inv.error ?? 'Final invoice failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-base" style={{ color: muted }}>Loading client jobs…</p>
  }

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: brandColor('text') }}>
            งานลูกค้า
          </h2>
          <p className="mt-2 text-base" style={{ color: muted }}>
            Chapter99 job queue — drag cards to change status. Square links from Finance can be pasted per job.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 rounded-lg px-5 py-3 text-base font-bold text-white"
          style={{ backgroundColor: primary }}
        >
          <Plus className="h-5 w-5" />
          New job
        </button>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      {toast && (
        <p className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-800">
          {toast}
        </p>
      )}

      <div className="mt-6 grid gap-3 overflow-x-auto pb-2 md:grid-cols-5">
        {JOB_STATUS_COLUMNS.map((col) => (
          <div
            key={col.id}
            className="min-w-[180px] rounded-xl border bg-white"
            style={{ borderColor: border }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => void onDropStatus(col.id)}
          >
            <div
              className="flex items-center justify-between border-b px-3 py-2 text-sm font-bold"
              style={{ borderColor: border }}
            >
              <span>{col.labelTh}</span>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
                {byStatus[col.id].length}
              </span>
            </div>
            <div className="flex min-h-[280px] flex-col gap-2 p-2">
              {byStatus[col.id].map((job) => (
                <button
                  key={job.id}
                  type="button"
                  draggable
                  onDragStart={() => setDraggingId(job.id)}
                  onDragEnd={() => setDraggingId(null)}
                  onClick={() => setSelected(job)}
                  className={`rounded-lg border bg-stone-50 p-3 text-left ${
                    draggingId === job.id ? 'opacity-50' : ''
                  }`}
                  style={{ borderColor: border }}
                >
                  <div className="text-sm font-bold">{job.client_name}</div>
                  <div className="mt-1 text-xs" style={{ color: muted }}>
                    {JOB_TYPE_LABELS[job.job_type]}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {job.deposit_amount != null && <span>Dep {formatAud(job.deposit_amount)}</span>}
                    {job.total_amount != null && <span>Tot {formatAud(job.total_amount)}</span>}
                  </div>
                  {job.deadline && (
                    <div className="mt-1 text-xs text-orange-800">Due {job.deadline}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showNew && (
        <Modal onClose={() => setShowNew(false)}>
          <h3 className="text-lg font-bold">New client job</h3>
          <form className="mt-4 flex flex-col gap-3" onSubmit={(e) => void handleCreate(e)}>
            <Field label="Client name">
              <input
                required
                className="input"
                value={form.client_name}
                onChange={(e) => setForm((f) => ({ ...f, client_name: e.target.value }))}
              />
            </Field>
            <Field label="Client email (invoice)">
              <input
                type="email"
                className="input"
                value={form.client_email}
                onChange={(e) => setForm((f) => ({ ...f, client_email: e.target.value }))}
              />
            </Field>
            <Field label="Job type">
              <select
                className="input"
                value={form.job_type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, job_type: e.target.value as ClientJobType }))
                }
              >
                {(Object.keys(JOB_TYPE_LABELS) as ClientJobType[]).map((k) => (
                  <option key={k} value={k}>
                    {JOB_TYPE_LABELS[k]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Deposit (AUD incl. GST)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  value={form.deposit_amount}
                  onChange={(e) => setForm((f) => ({ ...f, deposit_amount: e.target.value }))}
                />
              </Field>
              <Field label="Total (AUD incl. GST)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="input"
                  value={form.total_amount}
                  onChange={(e) => setForm((f) => ({ ...f, total_amount: e.target.value }))}
                />
              </Field>
            </div>
            <Field label="Deadline">
              <input
                type="date"
                className="input"
                value={form.deadline}
                onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))}
              />
            </Field>
            <Field label="Square payment link">
              <input
                className="input"
                placeholder={PAYMENT_LINKS.setupFee.url}
                value={form.square_payment_link}
                onChange={(e) =>
                  setForm((f) => ({ ...f, square_payment_link: e.target.value }))
                }
              />
            </Field>
            <Field label="Notes">
              <textarea
                className="input"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </Field>
            <div className="mt-2 flex justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={() => setShowNew(false)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving} style={{ backgroundColor: primary }}>
                {saving ? 'Saving…' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {selected && (
        <JobDetailModal
          job={selected}
          saving={saving}
          primary={primary}
          onClose={() => setSelected(null)}
          onSave={(patch) => void saveSelected(patch)}
        />
      )}

      <style>{`
        .input { width: 100%; border: 1px solid ${border}; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.95rem; }
        .btn-primary { color: #fff; border-radius: 0.5rem; padding: 0.5rem 1rem; font-weight: 700; }
        .btn-secondary { border: 1px solid ${border}; border-radius: 0.5rem; padding: 0.5rem 1rem; background: #fff; font-weight: 600; }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold text-stone-600">
      {label}
      {children}
    </label>
  )
}

function Modal({
  children,
  onClose,
}: {
  children: ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function JobDetailModal({
  job,
  saving,
  primary,
  onClose,
  onSave,
}: {
  job: ClientJob
  saving: boolean
  primary: string
  onClose: () => void
  onSave: (patch: Partial<ClientJob>) => void
}) {
  const [draft, setDraft] = useState(job)
  useEffect(() => setDraft(job), [job])

  return (
    <Modal onClose={onClose}>
      <h3 className="text-lg font-bold">{draft.client_name}</h3>
      <p className="text-sm text-stone-500">
        {JOB_TYPE_LABELS[draft.job_type]} · {draft.status}
      </p>
      <div className="mt-4 flex flex-col gap-3">
        <Field label="Client email">
          <input
            type="email"
            className="input"
            value={draft.client_email ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, client_email: e.target.value }))}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Deposit">
            <input
              type="number"
              step="0.01"
              className="input"
              value={draft.deposit_amount ?? ''}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  deposit_amount: e.target.value ? Number(e.target.value) : null,
                }))
              }
            />
          </Field>
          <Field label="Total">
            <input
              type="number"
              step="0.01"
              className="input"
              value={draft.total_amount ?? ''}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  total_amount: e.target.value ? Number(e.target.value) : null,
                }))
              }
            />
          </Field>
        </div>
        <Field label="Status">
          <select
            className="input"
            value={draft.status}
            onChange={(e) =>
              setDraft((d) => ({ ...d, status: e.target.value as ClientJobStatus }))
            }
          >
            {JOB_STATUS_COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.labelTh} / {c.labelEn}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Deadline">
          <input
            type="date"
            className="input"
            value={draft.deadline ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, deadline: e.target.value || null }))}
          />
        </Field>
        <Field label="Square payment link">
          <input
            className="input"
            value={draft.square_payment_link ?? ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, square_payment_link: e.target.value || null }))
            }
          />
        </Field>
        <Field label="Deliverable link">
          <input
            className="input"
            value={draft.deliverable_link ?? ''}
            onChange={(e) =>
              setDraft((d) => ({ ...d, deliverable_link: e.target.value || null }))
            }
          />
        </Field>
        <Field label="Notes">
          <textarea
            className="input"
            rows={3}
            value={draft.notes ?? ''}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value || null }))}
          />
        </Field>
        <p className="text-sm text-stone-500">
          Deposit paid:{' '}
          {draft.deposit_paid_at
            ? new Date(draft.deposit_paid_at).toLocaleString('en-AU')
            : '—'}
        </p>
        <div className="flex flex-wrap justify-end gap-2">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Close
          </button>
          {!draft.deposit_paid_at && (
            <button
              type="button"
              className="btn-secondary"
              disabled={saving || draft.deposit_amount == null}
              onClick={() =>
                onSave({
                  ...draft,
                  deposit_paid_at: new Date().toISOString(),
                })
              }
            >
              Mark deposit paid
            </button>
          )}
          <button
            type="button"
            className="btn-primary"
            style={{ backgroundColor: primary }}
            disabled={saving}
            onClick={() => onSave(draft)}
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

import { useState } from 'react'
import {
  PROJECT_STATUS_LABELS,
  type ProjectStatus,
} from '../../types/ams'
import {
  submitDeliverable,
  updateStaffProjectStatus,
} from '../../lib/ams/service'
import { brandColor } from '../../lib/useBrand'

const STAFF_STATUSES = ['capturing', 'editing', 'ready_for_review'] as const

type StaffProjectCardProps = {
  project: {
    id: string
    title: string
    status: ProjectStatus
    deadline: string | null
    service_type: string
  }
  onChanged: () => void
}

export default function StaffProjectCard({ project, onChanged }: StaffProjectCardProps) {
  const [status, setStatus] = useState(project.status)
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const primary = brandColor('primary')
  const muted = brandColor('textMuted')

  const overdue =
    Boolean(project.deadline) &&
    new Date(project.deadline!) < new Date(new Date().toDateString()) &&
    status !== 'completed'

  async function updateStatus(next: (typeof STAFF_STATUSES)[number]) {
    setBusy(true)
    setError(null)
    try {
      await updateStaffProjectStatus(project.id, next)
      setStatus(next)
      onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed')
    } finally {
      setBusy(false)
    }
  }

  async function onSubmitDeliverable(markReady: boolean) {
    setBusy(true)
    setError(null)
    try {
      await submitDeliverable({
        project_id: project.id,
        link,
        notes,
        mark_ready: markReady,
      })
      setLink('')
      setNotes('')
      if (markReady) setStatus('ready_for_review')
      onChanged()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Submit failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article
      className="rounded-2xl border bg-white p-4 sm:p-5"
      style={{ borderColor: brandColor('border') }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="font-serif text-lg font-semibold">{project.title}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide" style={{ color: muted }}>
            {project.service_type.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold" style={{ color: brandColor('secondary') }}>
            {PROJECT_STATUS_LABELS[status] ?? status}
          </p>
          {project.deadline ? (
            <p style={{ color: overdue ? '#B91C1C' : muted }}>
              Due {project.deadline}
              {overdue ? ' · OVERDUE' : ''}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STAFF_STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            disabled={busy || status === s}
            onClick={() => updateStatus(s)}
            className="min-h-11 flex-1 rounded-lg px-3 py-2 text-xs font-semibold sm:flex-none"
            style={
              status === s
                ? { backgroundColor: primary, color: '#fff' }
                : { border: `1px solid ${brandColor('border')}`, color: brandColor('text') }
            }
          >
            {PROJECT_STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3 border-t pt-4" style={{ borderColor: brandColor('border') }}>
        <p className="text-sm" style={{ color: muted }}>
          Submit deliverable (new version)
        </p>
        <label className="block text-sm">
          <span className="mb-1 block" style={{ color: muted }}>
            Delivery link
          </span>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full rounded-lg border px-3 py-2.5 text-sm"
            style={{ borderColor: brandColor('border') }}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block" style={{ color: muted }}>
            Notes (optional)
          </span>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-lg border px-3 py-2.5 text-sm"
            style={{ borderColor: brandColor('border') }}
          />
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={busy || !link.trim()}
            onClick={() => onSubmitDeliverable(false)}
            className="min-h-11 flex-1 rounded-lg border px-3 py-2 text-sm font-semibold"
            style={{ borderColor: brandColor('border') }}
          >
            Upload version
          </button>
          <button
            type="button"
            disabled={busy || !link.trim()}
            onClick={() => onSubmitDeliverable(true)}
            className="min-h-11 flex-1 rounded-lg px-3 py-2 text-sm font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            Upload + mark Ready
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </article>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProjectAdminOverview, ProjectStatus } from '../../../types/ams'
import { PROJECT_STATUS_LABELS } from '../../../types/ams'
import { listAdminOverview } from '../../../lib/ams/service'
import { brandColor } from '../../../lib/useBrand'

export default function AmsDashboard() {
  const [projects, setProjects] = useState<ProjectAdminOverview[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setProjects(await listAdminOverview())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const overdue = projects.filter((p) => p.is_overdue)
  const qcEscalation = projects.filter((p) => p.needs_qc_escalation)
  const ready = projects.filter((p) => p.status === 'ready_for_review')
  const primary = brandColor('primary')
  const muted = brandColor('textMuted')

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold" style={{ color: primary }}>
            AMS dashboard
          </h1>
          <p className="mt-1 text-sm" style={{ color: muted }}>
            Projects, overdue flags, and QC escalations
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/ams/leads"
            className="rounded-xl border px-4 py-2.5 text-sm font-semibold"
            style={{ borderColor: brandColor('border') }}
          >
            Leads
          </Link>
          <Link
            to="/admin/ams/projects/new"
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white"
            style={{ backgroundColor: primary }}
          >
            New project
          </Link>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Overdue" value={overdue.length} tone="danger" />
        <StatCard label="Ready for QC" value={ready.length} tone="warn" />
        <StatCard label="QC escalated" value={qcEscalation.length} tone="warn" />
      </div>

      {error ? (
        <p className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <section className="mt-10">
        <h2 className="text-sm font-medium uppercase tracking-wide" style={{ color: muted }}>
          Projects
        </h2>
        <ul
          className="mt-4 divide-y rounded-2xl border bg-white"
          style={{ borderColor: brandColor('border') }}
        >
          {loading ? (
            <li className="px-4 py-8 text-center text-sm" style={{ color: muted }}>
              Loading…
            </li>
          ) : projects.length === 0 ? (
            <li className="px-4 py-8 text-center text-sm" style={{ color: muted }}>
              No projects yet. Create your first AMS project.
            </li>
          ) : (
            projects.map((p) => (
              <li key={p.id}>
                <Link
                  to={`/admin/ams/projects/${p.id}`}
                  className="flex flex-col gap-1 px-4 py-4 transition hover:bg-black/[0.02] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs" style={{ color: muted }}>
                      {p.client_contact_name}
                      {p.staff_name ? ` · ${p.staff_name}` : ' · Unassigned'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs sm:justify-end">
                    {p.is_overdue ? (
                      <span className="rounded bg-red-100 px-2 py-0.5 font-semibold text-red-700">
                        OVERDUE
                      </span>
                    ) : null}
                    {p.needs_qc_escalation ? (
                      <span
                        className="rounded px-2 py-0.5 font-semibold"
                        style={{ backgroundColor: 'rgba(200,168,75,0.25)', color: '#8B6914' }}
                      >
                        QC 48h+
                      </span>
                    ) : null}
                    <span style={{ color: muted }}>
                      {PROJECT_STATUS_LABELS[p.status as ProjectStatus] ?? p.status}
                    </span>
                    <span style={{ color: muted }}>{p.deadline ?? 'No deadline'}</span>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: 'danger' | 'warn'
}) {
  const color = tone === 'danger' ? '#B91C1C' : brandColor('secondary')
  return (
    <div className="rounded-2xl border bg-white p-4" style={{ borderColor: brandColor('border') }}>
      <p className="text-xs uppercase tracking-wide" style={{ color: brandColor('textMuted') }}>
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  )
}

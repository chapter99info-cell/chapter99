import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Copy, ExternalLink, Search } from 'lucide-react'
import { AGENCY_CONFIG } from '../../lib/agency-config'
import { brandColor } from '../../lib/useBrand'
import { fetchProjects, PROJECT_STATUS_OPTIONS } from '../../lib/agencyService'
import type { Project, ProjectStatus } from '../../types/agency'

export default function ProjectDashboard() {
  const [searchParams] = useSearchParams()
  const highlightProjectId = searchParams.get('project')
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'ALL'>('ALL')
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setError('')
    try {
      setProjects(await fetchProjects())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (!highlightProjectId || projects.length === 0) return
    const el = document.getElementById(`project-card-${highlightProjectId}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlightProjectId, projects])

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = projects.filter((p) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false
      if (!q) return true
      const clientName = p.client?.businessName?.toLowerCase() ?? ''
      return clientName.includes(q) || p.id.toLowerCase().includes(q) || p.status.toLowerCase().includes(q)
    })

    const byClient = new Map<string, Project[]>()
    for (const p of filtered) {
      const key = p.clientId
      if (!byClient.has(key)) byClient.set(key, [])
      byClient.get(key)!.push(p)
    }
    return [...byClient.entries()].map(([clientId, list]) => ({
      clientId,
      clientName: list[0]?.client?.businessName ?? 'Unknown client',
      projects: list,
    }))
  }, [projects, search, statusFilter])

  async function copySpec(project: Project) {
    const text = project.projectSpec?.trim() || '(No project_spec saved yet)'
    await navigator.clipboard.writeText(text)
    setCopiedId(project.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const primary = brandColor('primary')
  const muted = brandColor('textMuted')

  return (
    <div>
      <h2 className="text-2xl font-bold" style={{ color: brandColor('text') }}>
        Project Dashboard
      </h2>
      <p className="mt-2 text-base" style={{ color: muted }}>
        One card per project, grouped by client — {AGENCY_CONFIG.brandName} Agency Hub
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: muted }} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search client or project…"
            className="w-full rounded-lg border-2 py-3 pl-11 pr-4 text-base focus:outline-none"
            style={{ borderColor: brandColor('border') }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'ALL')}
          className="rounded-lg border-2 px-4 py-3 text-base font-semibold"
          style={{ borderColor: brandColor('border') }}
        >
          <option value="ALL">All statuses</option>
          {PROJECT_STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <div className="mt-8 space-y-10">
        {grouped.map((group) => (
          <section key={group.clientId}>
            <h3 className="mb-4 text-lg font-bold" style={{ color: primary }}>
              {group.clientName}
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {group.projects.map((project) => (
                <article
                  key={project.id}
                  id={`project-card-${project.id}`}
                  className={`flex flex-col rounded-xl border-2 bg-white p-5 shadow-sm transition-shadow ${
                    highlightProjectId === project.id ? 'ring-2 ring-[#2D5016] ring-offset-2' : ''
                  }`}
                  style={{ borderColor: brandColor('border') }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: muted }}>
                        {project.projectType.replace(/_/g, ' ')}
                      </p>
                      <p className="mt-1 text-base font-bold" style={{ color: brandColor('text') }}>
                        {project.status.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <Link
                      to={`/p/${project.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg border-2 px-2 py-1 text-xs font-semibold"
                      style={{ borderColor: primary, color: primary }}
                    >
                      Portal <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>

                  <p className="mt-3 line-clamp-3 text-sm" style={{ color: muted }}>
                    {project.projectSpec?.trim() || 'No spec yet — use Live Briefing to generate.'}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to={`/admin/briefing?project=${project.id}`}
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-white"
                      style={{ backgroundColor: primary }}
                    >
                      Live Briefing
                    </Link>
                    <button
                      type="button"
                      onClick={() => void copySpec(project)}
                      className="flex items-center gap-1 rounded-lg border-2 px-3 py-2 text-sm font-semibold"
                      style={{ borderColor: brandColor('border') }}
                    >
                      <Copy className="h-4 w-4" />
                      {copiedId === project.id ? 'Copied!' : 'Copy Spec for Cursor'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
        {grouped.length === 0 && !error && (
          <p className="text-base" style={{ color: muted }}>
            No projects match your filters.
          </p>
        )}
      </div>
    </div>
  )
}

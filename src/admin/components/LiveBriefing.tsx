import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { callClaudeApi } from '../../lib/claudeApi'
import { brandColor } from '../../lib/useBrand'
import { fetchProjects, updateProject } from '../../lib/agencyService'
import type { Project } from '../../types/agency'

const BRIEFING_PROMPT_PREFIX = `You are Claude, the Brain of Chapter99 Solutions. Convert the following client call notes into a structured project spec for Cursor. Include: overview, requirements, data model notes, risks, and Cursor-ready tasks. Use clear headings.\n\n---\n\n`

export default function LiveBriefing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [projectId, setProjectId] = useState(searchParams.get('project') ?? '')
  const [notes, setNotes] = useState('')
  const [spec, setSpec] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    const list = await fetchProjects()
    setProjects(list)
    if (!projectId && list[0]) setProjectId(list[0].id)
  }, [projectId])

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Load failed'))
  }, [load])

  useEffect(() => {
    const p = projects.find((x) => x.id === projectId)
    if (p?.projectSpec) setSpec(p.projectSpec)
  }, [projectId, projects])

  function handleProjectChange(id: string) {
    setProjectId(id)
    setSearchParams(id ? { project: id } : {})
    const p = projects.find((x) => x.id === id)
    setSpec(p?.projectSpec ?? '')
    setSaved(false)
  }

  async function handleGenerate() {
    if (!notes.trim()) {
      setError('Enter call notes before generating.')
      return
    }
    setLoading(true)
    setError('')
    setSaved(false)
    try {
      const result = await callClaudeApi(BRIEFING_PROMPT_PREFIX + notes.trim())
      setSpec(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Claude API failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!projectId) return
    setLoading(true)
    setError('')
    try {
      await updateProject(projectId, { projectSpec: spec })
      setSaved(true)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const primary = brandColor('primary')

  return (
    <div>
      <h2 className="text-2xl font-bold" style={{ color: brandColor('text') }}>
        Live AI Briefing
      </h2>
      <p className="mt-2 text-base" style={{ color: brandColor('textMuted') }}>
        Capture requirements during client calls — Claude generates a structured spec (admin only).
      </p>

      <div className="mt-6">
        <label className="mb-2 block text-base font-semibold" htmlFor="briefing-project">
          Project
        </label>
        <select
          id="briefing-project"
          value={projectId}
          onChange={(e) => handleProjectChange(e.target.value)}
          className="w-full max-w-md rounded-lg border-2 px-4 py-3 text-base"
          style={{ borderColor: brandColor('border') }}
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.client?.businessName ?? p.clientId} — {p.status}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label className="mb-2 block text-base font-semibold" htmlFor="call-notes">
            Call notes (typed or pasted)
          </label>
          <textarea
            id="call-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={14}
            placeholder="Client wants bilingual PWA, HICAPS booking, photo gallery link…"
            className="w-full rounded-lg border-2 p-4 text-base focus:outline-none"
            style={{ borderColor: brandColor('border') }}
          />
          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={loading}
            className="mt-4 flex items-center gap-2 rounded-lg px-5 py-3 text-base font-bold text-white disabled:opacity-50"
            style={{ backgroundColor: primary }}
          >
            <Sparkles className="h-5 w-5" />
            {loading ? 'Generating…' : 'Generate Spec by Claude'}
          </button>
        </div>

        <div>
          <label className="mb-2 block text-base font-semibold" htmlFor="project-spec">
            project_spec (saved to database)
          </label>
          <textarea
            id="project-spec"
            value={spec}
            onChange={(e) => {
              setSpec(e.target.value)
              setSaved(false)
            }}
            rows={14}
            className="w-full rounded-lg border-2 p-4 text-base font-mono text-sm focus:outline-none"
            style={{ borderColor: brandColor('border') }}
          />
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={loading || !projectId}
            className="mt-4 rounded-lg border-2 px-5 py-3 text-base font-bold"
            style={{ borderColor: primary, color: primary }}
          >
            Save to project_spec
          </button>
          {saved && <p className="mt-2 text-sm font-semibold" style={{ color: primary }}>Saved.</p>}
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
    </div>
  )
}

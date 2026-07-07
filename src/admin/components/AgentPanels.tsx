import { useCallback, useEffect, useState } from 'react'
import { BookOpen, Plus, Save, Trash2 } from 'lucide-react'
import { AGENTS, getDepartmentName } from '../../lib/departmentConfig'
import { deletePrompt, fetchPrompts, savePrompt } from '../../lib/agencyService'
import { callClaudeApi } from '../../lib/claudeApi'
import type { Prompt, PromptAgent } from '../../types/agency'
import type { DepartmentId } from '../../lib/departmentConfig'

interface AgentPanelProps {
  activeDepartment: DepartmentId
}

export default function AgentPanels({ activeDepartment }: AgentPanelProps) {
  return (
    <section className="mt-8">
      <h3 className="text-lg font-bold text-[#1A1A1A]">AI Agent Panels</h3>
      <p className="mt-1 text-base text-[#6B7280]">
        Prompt library per agent for {getDepartmentName(activeDepartment)}
      </p>
      <div className="mt-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {AGENTS.map((agent) => (
          <AgentCard key={agent.id} agent={agent.id} department={activeDepartment} meta={agent} />
        ))}
      </div>
    </section>
  )
}

function AgentCard({
  agent,
  department,
  meta,
}: {
  agent: PromptAgent
  department: DepartmentId
  meta: (typeof AGENTS)[number]
}) {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [claudeOutput, setClaudeOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const all = await fetchPrompts(agent)
    const filtered = all.filter((p) => p.department === department)
    setPrompts(filtered)
    if (filtered[0]) {
      setSelectedId(filtered[0].id)
      setEditText(filtered[0].promptText)
    } else {
      setSelectedId(null)
      setEditText('')
    }
  }, [agent, department])

  useEffect(() => {
    void load().catch((err) => setError(err instanceof Error ? err.message : 'Load failed'))
  }, [load])

  async function handleSave() {
    setLoading(true)
    setError('')
    try {
      const saved = await savePrompt({
        id: selectedId ?? undefined,
        agent,
        department,
        promptText: editText,
      })
      setSelectedId(saved.id)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleNew() {
    setSelectedId(null)
    setEditText('')
  }

  async function handleDelete() {
    if (!selectedId || !confirm('Delete this prompt?')) return
    await deletePrompt(selectedId)
    await load()
  }

  async function handleRunClaude() {
    if (agent !== 'CLAUDE') return
    setLoading(true)
    setError('')
    setClaudeOutput('')
    try {
      const result = await callClaudeApi(editText)
      setClaudeOutput(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Claude API failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex flex-col rounded-xl border-2 bg-white p-5"
      style={{ borderColor: meta.color }}
    >
      <div className="mb-4">
        <p className="text-base font-bold" style={{ color: meta.color }}>
          {meta.label}
        </p>
        <p className="text-sm text-[#6B7280]">{meta.role}</p>
      </div>

      {prompts.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {prompts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setSelectedId(p.id)
                setEditText(p.promptText)
              }}
              className={`rounded-lg border-2 px-3 py-1.5 text-sm font-medium ${
                selectedId === p.id
                  ? 'border-[#2D5016] bg-[#2D5016] text-white'
                  : 'border-[#1A1A1A]/20 bg-[#F8F5F0]'
              }`}
            >
              <BookOpen className="mr-1 inline h-4 w-4" />
              Prompt
            </button>
          ))}
        </div>
      )}

      <textarea
        value={editText}
        onChange={(e) => setEditText(e.target.value)}
        rows={6}
        placeholder={`${meta.label} prompt for this department…`}
        className="w-full flex-1 rounded-lg border-2 border-[#1A1A1A]/20 p-3 text-base focus:border-[#2D5016] focus:outline-none"
      />

      {error && <p className="mt-2 text-sm text-red-700">{error}</p>}

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleNew}
          className="flex items-center gap-1 rounded-lg border-2 border-[#1A1A1A]/30 px-3 py-2 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          New
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-1 rounded-lg bg-[#2D5016] px-3 py-2 text-sm font-semibold text-white"
        >
          <Save className="h-4 w-4" />
          Save
        </button>
        {selectedId && (
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1 rounded-lg border-2 border-red-400 px-3 py-2 text-sm text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
        {agent === 'CLAUDE' && (
          <button
            type="button"
            onClick={handleRunClaude}
            disabled={loading || !editText.trim()}
            className="ml-auto rounded-lg bg-[#1A1A1A] px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
          >
            {loading ? 'Calling…' : 'Run Claude API'}
          </button>
        )}
      </div>

      {claudeOutput && agent === 'CLAUDE' && (
        <div className="mt-4 rounded-lg border border-[#2D5016]/30 bg-[#F8F5F0] p-3">
          <p className="mb-2 text-sm font-bold text-[#2D5016]">Claude response</p>
          <pre className="whitespace-pre-wrap text-sm text-[#1A1A1A]">{claudeOutput}</pre>
        </div>
      )}
    </div>
  )
}
